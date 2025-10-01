import { orderFragment } from "../fragments/order";

const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

export const getOrdersQuery = /* GraphQL */ `
  query getOrders {
    orders(first: 250, query: "updated_at:>=${sevenDaysAgo}") {
      edges {
        node {
          ...order
        }
      }
    }
  }
  ${orderFragment}
`;
