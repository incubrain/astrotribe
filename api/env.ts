import { config } from "dotenv";
import { cleanEnv, str } from "envalid";

config();

export const env = cleanEnv(process.env, {
  DATABASE_URL: str({
    default: "postgresql://postgres:postgres@localhost:54322/postgres",
  }),
  SUPABASE_URL: str({
    default: "https://localhost:54322/postgres",
  }),
  SUPABASE_SERVICE_KEY: str({
    default: "postgres",
  }),
  SUPABASE_ANON_KEY: str({
    default: "postgres",
  }),
  NODE_ENV: str({ default: "development" }),
  PORT: str({ default: "3000" }),
});
