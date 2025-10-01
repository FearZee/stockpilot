import { env } from "../../env";
import { getInventoryItemsQuery } from "./queries/inventoryItems";
import { getOrdersQuery } from "./queries/order";
import {
  Connection,
  InventoryItem,
  InventoryItemQuery,
  OrderQuery,
} from "./types";

const endpoint = `${env.SHOPIFY_STORE_DOMAIN}${env.SHOPIFY_GRAPHQL_API_ENDPOINT}`;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

async function shopifyFetch<T>({
  query,
  variables,
  tags,
  cache = "force-cache",
}: {
  query: string;
  variables?: ExtractVariables<T>;
  tags?: string[];
  cache?: RequestCache;
}): Promise<{ status: number; body: T }> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "X-Shopify-Storefront-Access-Token":
        //   env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        "X-Shopify-Access-Token": env.SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    return { status: response.status, body: await response.json() };
  } catch (error) {
    console.error(error);
    throw {
      status: 500,
      error: "Error receiving data",
    };
  }
}

function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
  return array.edges.map((edge) => edge?.node);
}

// fetch orders
export const fetchOrders = async () => {
  const { status, body } = await shopifyFetch<OrderQuery>({
    query: getOrdersQuery,
    cache: "no-store",
  });

  const orders = body.data.orders.edges.map((edge) => edge.node);

  return orders;
};

const reshapeInventoryItems = (inventoryItems: any[]) => {
  return inventoryItems.map((inventoryItem) => {
    const item = removeEdgesAndNodes(inventoryItem.inventoryLevels)?.[0] as any;
    return {
      ...item,
      title: inventoryItem.variant.product.title,
    };
  });
};

export const fetchInventoryItems = async () => {
  const { status, body } = await shopifyFetch<InventoryItemQuery>({
    query: getInventoryItemsQuery,
    cache: "no-store",
  });

  const inventoryItems = removeEdgesAndNodes(body.data.inventoryItems);
  const reshapedInventoryItems = reshapeInventoryItems(inventoryItems);

  return reshapedInventoryItems as InventoryItem[];
};
