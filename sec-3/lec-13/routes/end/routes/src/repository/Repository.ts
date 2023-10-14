import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import path from "node:path";
import fs from "node:fs";
import MessageRepo from "./MessageRepo";
import ProfileRepo from "./ProfileRepo";
import * as MessageSchema from "../db/schema/Message";
import * as ProfileSchema from "../db/schema/Profile";

const db_conn = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;
const queryClient = postgres(db_conn);
const schema = { ...MessageSchema, ...ProfileSchema };
const db = drizzle(queryClient, { schema });
export type DB = typeof db;

export default class Repository {
  private readonly _db: DB;
  private readonly _messageRepo: MessageRepo;
  get messageRepo(): MessageRepo {
    return this._messageRepo;
  }
  private readonly _profileRepo: ProfileRepo;
  get profileRepo(): ProfileRepo {
    return this._profileRepo;
  }

  constructor(runMigrations = false) {
    if (runMigrations) {
      runMigration(db_conn);
    }

    this._db = db;
    this._messageRepo = new MessageRepo(this._db);
    this._profileRepo = new ProfileRepo(this._db);
  }

  async close() {
    await queryClient.end();
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
