import { inventoryItemFragment } from "../fragments/lineitem";

export const getInventoryItemsQuery = /* GraphQL */ `
  query getInventoryItems {
    inventoryItems(first: 250) {
      edges {
        node {
          ...inventoryItem
        }
      }
    }
  }
  ${inventoryItemFragment}
`;
