// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  mysqlTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `reminder_${name}`);

export const reminders = mysqlTable(
  "remind",
  {
    id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
    name: varchar("name", { length: 256 }).notNull(),

    remindAt: timestamp("remind_at").notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    userId: varchar("user_id", { length: 256 }).notNull(),
    repeatPeriodicity: varchar("repeat_periodicity", { length: 256 }).notNull(),
    repeatIntervalSeconds: bigint("repeat_interval_seconds", {
      mode: "number",
    }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);
