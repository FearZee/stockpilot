import { Dashboard } from "@/components/dashboard";
import { ProductOverview } from "@/components/productOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchInventoryItems, fetchOrders } from "@/server/shopify";
import { BarChart3, Package } from "lucide-react";
import { db } from "..";
import { orders, products } from "@/db/schema";

export default async function Home() {
  const inventoryItems = await db.select().from(products);
  const orderItems = await db.select().from(orders);

  // group orders by createdAt and return as { date: string; sales: number }

  // Generate last 7 days with 0 sales for missing dates

  const totalProducts = inventoryItems.length;
  const averageDSR =
    orderItems.reduce((acc, sales) => acc + sales.sales, 0) / orderItems.length;

  const lowStockCount = inventoryItems.filter((item) => {
    return item.inventoryQuantity < 14;
  }).length;

  const criticalStockCount = inventoryItems.filter(
    (item) => item.inventoryQuantity < 7
  ).length;

  const items = inventoryItems.map((item) => {
    return {
      id: item.id,
      name: item.title,
      sku: item.sku,
      stock: item.inventoryQuantity,
      price: 0,
      image: null,
      dailySalesRate: item.dailySalesRate,
      stockCoverage: Math.min(
        180,
        item.inventoryQuantity / item.dailySalesRate
      ),
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="dashboard" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            Produkte
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Dashboard
            totalProducts={totalProducts}
            lowStockCount={lowStockCount}
            critStockCount={criticalStockCount}
            averageDSR={averageDSR}
            salesData={orderItems}
          />
        </TabsContent>

        <TabsContent value="products">
          <ProductOverview products={items} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
