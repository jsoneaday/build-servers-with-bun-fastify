import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import path from "node:path";
import fs from "node:fs";
import * as MessageSchema from "../db/schema/Message";
import * as ProfileSchema from "../db/schema/Profile";

export function setupQueryClient(db_conn: string) {
  return postgres(db_conn);
}
export function setupDrizzle(queryClient: postgres.Sql<{}>) {
  const schema = { ...MessageSchema, ...ProfileSchema };
  return drizzle(queryClient, { schema });
}

export type DB = ReturnType<typeof setupDrizzle>;

export default class Repository {
  constructor(
    private readonly db_conn: string,
    private readonly queryClient: postgres.Sql<{}>,
    public readonly db: DB,
    runMigrations = false
  ) {
    if (runMigrations) {
      runMigration(db_conn);
    }
  }

  async close() {
    await this.queryClient.end();
  }
}

async function runMigration(db_conn: string) {
  const schemaPath = path.join(__dirname, "../db/schema");
  console.log(
    "schemaPath:",
    schemaPath,
    "schema path exists",
    fs.existsSync(schemaPath)
  );

  console.log("db_conn", db_conn);

  const migrationClient = postgres(db_conn, { max: 1 });
  const migrationsPath = path.join(__dirname, "../../drizzle");
  const folderExists = fs.existsSync(migrationsPath);
  console.log("migrationsPath:", migrationsPath, "folderExists:", folderExists);

  console.log("migrating...");
  await migrate(drizzle(migrationClient), { migrationsFolder: migrationsPath });
  console.log("migrating done");
}
