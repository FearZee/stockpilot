import { Order } from "./shopify/types";

export const calcDailySales = (sku: string, orders: Order[]) => {
  return orders.filter((order) =>
    order.lineItems.edges.some((edge) => edge.node.variant?.sku === sku)
  ).length;
};
