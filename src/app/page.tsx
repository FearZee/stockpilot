import { Dashboard } from "@/components/dashboard";
import { ProductOverview } from "@/components/productOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchInventoryItems, fetchOrders } from "@/server/shopify";
import { BarChart3, Package } from "lucide-react";

export default async function Home() {
  const orders = await fetchOrders();
  const inventoryItems = await fetchInventoryItems();

  // group orders by createdAt and return as { date: string; sales: number }
  const ordersByDate = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Generate last 7 days with 0 sales for missing dates
  const salesData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    return {
      date: dateString,
      sales: ordersByDate[dateString] || 0,
    };
  }).reverse();

  const totalProducts = inventoryItems.length;
  const averageDSR =
    salesData.reduce((acc, sales) => acc + sales.sales, 0) / salesData.length;

  const lowStockCount = inventoryItems.filter((item) => {
    return item.item.variant.inventoryQuantity < 14;
  }).length;

  const criticalStockCount = inventoryItems.filter(
    (item) => item.item.variant.inventoryQuantity < 7
  ).length;

  console.log(inventoryItems[0]);
  console.log(JSON.stringify(orders, null, 2));

  const products = inventoryItems.map((item) => {
    const dailySalesRate = orders.filter((order) =>
      order.lineItems.edges.some(
        (edge) => edge.node.variant?.sku === item.item.variant.sku
      )
    ).length;
    return {
      id: item.id,
      name: item.item.variant.title,
      sku: item.item.variant.sku,
      stock: item.item.variant.inventoryQuantity,
      price: item.item.variant.price,
      image: item.item.variant.image?.url ?? null,
      dailySalesRate: dailySalesRate,
      stockCoverage: Math.min(
        180,
        item.item.variant.inventoryQuantity / dailySalesRate
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
            salesData={salesData}
          />
        </TabsContent>

        <TabsContent value="products">
          <ProductOverview products={products} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
