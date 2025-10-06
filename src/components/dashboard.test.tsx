import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Dashboard } from "./dashboard";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(global as any).ResizeObserver = ResizeObserver;

test("dashboard", async () => {
  const mockProps = {
    totalProducts: 10,
    lowStockCount: 5,
    critStockCount: 3,
    averageDSR: 2,
    salesData: [{ date: "2021-01-01", sales: 100 }],
  };
  render(<Dashboard {...mockProps} />);
  expect((await screen.findByTestId("total-products")).textContent).toEqual(
    "10"
  );
  expect((await screen.findByTestId("average-dsr")).textContent).toEqual("2.0");
  expect((await screen.findByTestId("low-stock-count")).textContent).toEqual(
    "5"
  );
  expect((await screen.findByTestId("crit-stock-count")).textContent).toEqual(
    "3"
  );
  expect(await screen.findByTestId("sales-data"));
});
