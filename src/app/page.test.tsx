import { expect, test, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Create hoisted mocks to avoid hoisting issues
const mockDb = vi.hoisted(() => ({
  select: vi.fn(() => ({
    from: vi.fn(() => Promise.resolve([])),
  })),
}));

// Mock the database schema
vi.mock("@/db/schema", () => ({
  products: "products",
  orders: "orders",
}));

// Mock the database connection
vi.mock("..", () => ({
  db: mockDb,
}));

// Import after mocking
import Home from "./page";

// Mock the components
vi.mock("@/components/dashboard", () => ({
  Dashboard: ({
    totalProducts,
    lowStockCount,
    critStockCount,
    averageDSR,
    salesData,
  }: any) => (
    <div data-testid="dashboard">
      <div data-testid="total-products">{totalProducts}</div>
      <div data-testid="low-stock-count">{lowStockCount}</div>
      <div data-testid="crit-stock-count">{critStockCount}</div>
      <div data-testid="average-dsr">{averageDSR}</div>
      <div data-testid="sales-data">{JSON.stringify(salesData)}</div>
    </div>
  ),
}));

vi.mock("@/components/productOverview", () => ({
  ProductOverview: ({ products }: any) => (
    <div data-testid="product-overview">
      <div data-testid="products-count">{products.length}</div>
    </div>
  ),
}));

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(global as any).ResizeObserver = ResizeObserver;

beforeEach(() => {
  vi.clearAllMocks();
  // Reset the mock to return empty arrays by default
  mockDb.select.mockReturnValue({
    from: vi.fn(() => Promise.resolve([])),
  });
});

test("renders page with empty data", async () => {
  const HomeComponent = await Home();
  render(HomeComponent);

  expect(screen.getByTestId("dashboard")).toBeInTheDocument();
  // ProductOverview is in the "products" tab, not visible by default
  expect(screen.queryByTestId("product-overview")).not.toBeInTheDocument();
});

test("renders page with mock data", async () => {
  const mockProducts = [
    {
      id: "1",
      title: "Test Product",
      sku: "TEST-001",
      inventoryQuantity: 10,
      price: 29.99,
      dailySalesRate: 2,
      daysLeft: 5,
      updatedAt: "2024-01-01",
    },
  ];

  const mockOrders = [
    {
      id: "1",
      date: new Date().toISOString().split("T")[0],
      sales: 5,
    },
  ];

  mockDb.select.mockReturnValue({
    from: vi
      .fn()
      .mockResolvedValueOnce(mockProducts) // First call for products
      .mockResolvedValueOnce(mockOrders), // Second call for orders
  });

  const HomeComponent = await Home();
  render(HomeComponent);

  expect(screen.getByTestId("total-products")).toHaveTextContent("1");
  // ProductOverview is in the "products" tab, not visible by default
  expect(screen.queryByTestId("products-count")).not.toBeInTheDocument();
});

test("calculates sales data correctly", async () => {
  const mockOrders = [
    {
      id: "1",
      date: new Date().toISOString().split("T")[0],
      sales: 3,
    },
    {
      id: "2",
      date: new Date().toISOString().split("T")[0],
      sales: 2,
    },
  ];

  mockDb.select.mockReturnValue({
    from: vi
      .fn()
      .mockResolvedValueOnce([]) // Empty products
      .mockResolvedValueOnce(mockOrders), // Orders with sales
  });

  const HomeComponent = await Home();
  render(HomeComponent);

  const salesDataElement = screen.getByTestId("sales-data");
  const salesData = JSON.parse(salesDataElement.textContent || "[]");

  // Should have 7 days of data
  expect(salesData).toHaveLength(7);

  // Today should have 5 sales (3 + 2)
  const today = new Date().toISOString().split("T")[0];
  const todayData = salesData.find((item: any) => item.date === today);
  expect(todayData?.sales).toBe(5);
});

test("calculates stock counts correctly", async () => {
  const mockProducts = [
    { id: "1", inventoryQuantity: 5 }, // Critical stock
    { id: "2", inventoryQuantity: 10 }, // Low stock
    { id: "3", inventoryQuantity: 20 }, // Normal stock
    { id: "4", inventoryQuantity: 3 }, // Critical stock
  ];

  mockDb.select.mockReturnValue({
    from: vi.fn().mockResolvedValueOnce(mockProducts).mockResolvedValueOnce([]), // Empty orders
  });

  const HomeComponent = await Home();
  render(HomeComponent);

  expect(screen.getByTestId("low-stock-count")).toHaveTextContent("3"); // 5, 10, 3 < 14
  expect(screen.getByTestId("crit-stock-count")).toHaveTextContent("2"); // 5, 3 < 7
});
