# StockPilot 📦

A modern inventory management dashboard for Shopify stores with intelligent stock forecasting and analytics.

## Features

- **📊 Analytics Dashboard** - Real-time overview of inventory metrics and sales trends
- **🔍 Product Overview** - Detailed view of all products with stock levels and sales rates
- **📈 Daily Sales Rate (DSR)** - Automatic calculation of product velocity
- **⚠️ Stock Alerts** - Visual indicators for low and critical stock levels
- **🔄 Shopify Sync** - Automated synchronization with your Shopify store
- **📅 Stock Coverage** - Days-of-stock forecasting based on sales velocity

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (with Turbopack)
- **UI Library**: React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **UI Components**: [Radix UI](https://www.radix-ui.com)
- **Database**: [libSQL](https://turso.tech) with [Drizzle ORM](https://orm.drizzle.team)
- **Charts**: [Recharts](https://recharts.org)
- **Testing**: [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)
- **Type Safety**: TypeScript with [Zod](https://zod.dev) validation

## Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Shopify store with API access

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd stockpilot
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
SHOPIFY_GRAPHQL_API_ENDPOINT=https://your-store.myshopify.com/api/2024-01/graphql.json
SHOPIFY_ACCESS_TOKEN=your-admin-api-token
```

### 4. Database Setup

Initialize the database:

```bash
pnpm drizzle-kit push
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests with Vitest

## Docker Support

### Development

```bash
docker-compose up
```

### Production

```bash
docker-compose -f docker-compose.stock.yml up
```

## Project Structure

```
stockpilot/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── dashboard.tsx
│   │   ├── productOverview.tsx
│   │   └── ...
│   ├── db/              # Database schema
│   ├── server/          # Server-side logic
│   │   └── shopify/     # Shopify integration
│   └── lib/             # Utility functions
├── public/              # Static assets
└── drizzle.config.ts    # Database configuration
```

## Key Components

### Dashboard

Displays key metrics including:

- Total products count
- Low stock alerts (< 14 days coverage)
- Critical stock alerts (< 7 days coverage)
- Average daily sales rate
- 7-day sales trend chart

### Product Overview

Table view of all products with:

- Product image and name
- SKU
- Current stock level
- Daily sales rate
- Stock coverage indicator (color-coded)

### Stock Coverage Indicators

- 🟢 **Green (Safe)**: > 30 days of stock
- 🟡 **Yellow (Low)**: 14-30 days of stock
- 🟠 **Orange (Warning)**: 7-14 days of stock
- 🔴 **Red (Critical)**: < 7 days of stock

## Shopify Integration

The app syncs data from Shopify using the GraphQL Admin API:

1. **Inventory Items**: Fetches product variants with inventory levels
2. **Orders**: Retrieves order history to calculate sales velocity
3. **Daily Sales Rate**: Automatically calculated based on recent order data
4. **Stock Coverage**: Computed as `inventory_quantity / daily_sales_rate`

### Manual Sync

The sync runs automatically, but you can trigger it manually via the `runSync()` function in `src/server/shopify/sync.ts`.

## Testing

Run the test suite:

```bash
pnpm test
```

Test coverage includes:

- Component rendering tests
- Stock calculation logic
- Dashboard metrics
- Product overview functionality

## Environment Variables

| Variable                          | Description                 |
| --------------------------------- | --------------------------- |
| `SHOPIFY_STORE_DOMAIN`            | Your Shopify store domain   |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token |
| `SHOPIFY_GRAPHQL_API_ENDPOINT`    | GraphQL API endpoint URL    |
| `SHOPIFY_ACCESS_TOKEN`            | Admin API access token      |

## Database Schema

### Products Table

- `id` - Unique product identifier
- `title` - Product name
- `sku` - Stock keeping unit
- `inventoryQuantity` - Current stock level
- `dailySalesRate` - Calculated sales velocity
- `daysLeft` - Forecasted days until stockout
- `price` - Product price
- `updatedAt` - Last sync timestamp

### Orders Table

- `id` - Unique order identifier
- `date` - Order date (unique)
- `sales` - Number of sales on that date

## License

Private

## Support

For issues or questions, please contact the development team.
