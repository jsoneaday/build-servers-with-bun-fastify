import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const db_conn = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
console.log("db_conn", db_conn);
const migrationClient = postgres(db_conn, { max: 1 });
await migrate(drizzle(migrationClient), __dirname + "/migrations");

const queryClient = postgres(db_conn);
const db: PostgresJsDatabase = drizzle(queryClient);
export default db;
