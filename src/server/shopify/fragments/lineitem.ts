export const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

export const lineItemFragment = /* GraphQL */ `
  fragment lineItem on LineItem {
    id
    name
    sku
    variant {
      id
      title
      sku
      inventoryQuantity
      inventoryItem {
        id
        sku
      }
    }
  }
`;

export const inventoryItemFragment = /* GraphQL */ `
  fragment inventoryItem on InventoryItem {
    inventoryLevels(first: 250) {
      edges {
        node {
          id
          location {
            id
            name
            isActive
          }
          item {
            id
            variant {
              availableForSale
              inventoryQuantity
              price
              title
              sku
              image {
                ...image
              }
            }
          }
          quantities(names: "available") {
            id
            quantity
          }
        }
      }
    }
  }
  ${imageFragment}
`;
