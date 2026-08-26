import { getNeo4j } from "@/lib/wyzmind";
import { logger } from "@/lib/logger";

/**
 * Schema statements applied at startup, kept in sync with
 * sql/neo4j-constraints.cypher (the canonical reference for manual runs).
 */
const CONSTRAINT_STATEMENTS: string[] = [
  "CREATE CONSTRAINT user_email_unique IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE;",
];

let constraintsApplied = false;

/**
 * Applies Neo4j uniqueness constraints once per process. Best effort:
 * failures (constraint already exists, credentials lack schema perms,
 * database briefly unavailable) are logged and swallowed so request
 * paths are never affected.
 */
export async function ensureNeo4jConstraints(): Promise<void> {
  if (constraintsApplied) return;
  constraintsApplied = true;
  try {
    const session = getNeo4j().session();
    try {
      for (const statement of CONSTRAINT_STATEMENTS) {
        await session.run(statement);
      }
    } finally {
      await session.close();
    }
  } catch (e) {
    logger.warn("neo4j-setup", `Constraint setup skipped: ${(e as Error).message}`);
  }
}
