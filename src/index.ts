import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

const dbUrl = process.env.DB_URL || "file:./local.db";
export const db = drizzle(dbUrl);
