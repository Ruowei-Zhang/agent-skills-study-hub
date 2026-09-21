import "dotenv/config";
import type { Config } from "drizzle-kit";

/**
 * 单一配置来源：数据库连接串统一从 DATABASE_URL 读取，
 * 避免连接串散落在多个文件里造成漂移。
 */
export default {
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres@127.0.0.1:5432/app_db",
  },
} satisfies Config;
