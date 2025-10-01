"use server";

import { db } from "@/index";
import { fetchInventoryItems, fetchOrders } from ".";
import { calcDailySales } from "..";
import { products, orders } from "@/db/schema";
import { randomUUID } from "crypto";

export async function runSync() {
  try {
    // Fetch data in parallel
    const [shopifyProducts, shopifyOrders] = await Promise.all([
      fetchInventoryItems(),
      fetchOrders(),
    ]);

    // Process products in batch
    const productInserts = shopifyProducts.map((p) => {
      const dsr = calcDailySales(p.item.variant.sku, shopifyOrders);
      const inventoryQuantity = p.item.variant.inventoryQuantity;
      const daysLeft = dsr > 0 ? inventoryQuantity / dsr : 0;

      return {
        id: p.item.id,
        title: p.title,
        sku: p.item.variant.sku,
        inventoryQuantity: inventoryQuantity,
        price: Number(p.item.variant.price),
        dailySalesRate: dsr,
        daysLeft: daysLeft,
        updatedAt: new Date().toISOString(),
      };
    });

    // Batch upsert products
    for (const product of productInserts) {
      await db
        .insert(products)
        .values(product)
        .onConflictDoUpdate({
          target: products.id,
          set: {
            title: product.title,
            sku: product.sku,
            inventoryQuantity: product.inventoryQuantity,
            price: product.price,
            dailySalesRate: product.dailySalesRate,
            daysLeft: product.daysLeft,
            updatedAt: product.updatedAt,
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

    // Batch upsert orders
    const orderInserts = last7Days.map((date) => ({
      id: randomUUID(),
      date,
      sales: ordersByDate[date] || 0,
    }));

    for (const order of orderInserts) {
      await db
        .insert(orders)
        .values(order)
        .onConflictDoUpdate({
          target: orders.date,
          set: { sales: order.sales },
        });
    }

    console.log("Sync done ✅");
  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  }
}
