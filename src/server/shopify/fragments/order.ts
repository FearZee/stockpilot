import { lineItemFragment } from "./lineitem";

export const orderFragment = /* GraphQL */ `
  fragment order on Order {
    id
    name
    createdAt
    displayFinancialStatus
    displayFulfillmentStatus
    totalPriceSet {
      shopMoney {
        amount
        currencyCode
      }
    }
    subtotalPriceSet {
      shopMoney {
        amount
        currencyCode
      }
    }
    email
    lineItems(first: 250) {
      edges {
        node {
          ...lineItem
        }
      }
    }
  }
  ${lineItemFragment}
`;
