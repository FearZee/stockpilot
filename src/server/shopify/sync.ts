"use server";

import { db } from "@/index";
import { fetchInventoryItems, fetchOrders } from ".";
import { calcDailySales } from "..";
import { products, orders } from "@/db/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

export async function runSync() {
  const shopifyProducts = await fetchInventoryItems();
  const shopifyOrders = await fetchOrders();

  for (const p of shopifyProducts) {
    const dsr = calcDailySales(p.id, shopifyOrders);
    const inventoryQuantity = p.item.variant.inventoryQuantity;
    const daysLeft = dsr > 0 ? inventoryQuantity / dsr : 0;

    await db
      .insert(products)
      .values({
        id: p.item.id,
        title: p.title,
        sku: p.item.variant.sku,
        inventoryQuantity: inventoryQuantity,
        price: Number(p.item.variant.price),
        dailySalesRate: dsr,
        daysLeft: daysLeft,
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: products.id,
        set: {
          title: p.title,
          sku: p.item.variant.sku,
          inventoryQuantity: inventoryQuantity,
          price: Number(p.item.variant.price),
          dailySalesRate: dsr,
          daysLeft: daysLeft,
          updatedAt: new Date().toISOString(),
        },
      });
  }

  // Group orders by date
  const ordersByDate = shopifyOrders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  // Upsert orders for each day
  for (const date of last7Days) {
    const sales = ordersByDate[date] || 0;

    // Try to update existing record
    const existingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.date, date))
      .limit(1);

    if (existingOrder.length > 0) {
      // Update existing record
      await db.update(orders).set({ sales }).where(eq(orders.date, date));
    } else {
      // Insert new record
      await db
        .insert(orders)
        .values({
          id: randomUUID(),
          date,
          sales,
        })
        .onConflictDoUpdate({
          target: orders.date,
          set: { sales },
        });
    }
  }

  console.log("Sync done ✅");
}

runSync().catch(console.error);
