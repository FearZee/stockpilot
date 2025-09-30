export type Edge<T> = {
  node: T;
};

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type InventoryItemQuery = {
  data: {
    inventoryItems: Connection<InventoryItem>;
  };
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type InventoryItem = {
  id: string;
  title: string;
  item: {
    variant: {
      availableForSale: boolean;
      inventoryQuantity: number;
      price: number;
      title: string;
      sku: string;
      image?: Image;
    };
  };
};

export type OrderQuery = {
  data: {
    orders: Connection<Order>;
  };
};

export type Order = {
  id: string;
  name: string;
  createdAt: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  subtotalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  email: string;
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        name: string;
        sku: string;
        variant: {
          id: string;
          title: string;
          sku: string;
          inventoryQuantity: number;
          inventoryItem: {
            id: string;
            sku: string;
          };
        };
      };
    }>;
  };
};
