import { int, sqliteTable, text, real } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text().primaryKey(),
  title: text().notNull(),
  sku: text().notNull(),
  inventoryQuantity: int().notNull(),
  dailySalesRate: real().notNull(),
  daysLeft: real(),
  updatedAt: text().notNull(),
  price: real().notNull(),
});

export const orders = sqliteTable("orders", {
  id: text().primaryKey(),
  date: text().notNull().unique(),
  sales: int().notNull(),
});
