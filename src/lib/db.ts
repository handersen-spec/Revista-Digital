import 'server-only'
import { Pool } from 'pg'
import type { QueryResult, QueryResultRow } from 'pg'

// Fail fast if this module is ever executed on the client
if (typeof window !== 'undefined') {
  throw new Error('src/lib/db.ts é server-only e não deve ser importado no cliente')
}

function buildConnectionStringFromEnv(): string | undefined {
  const host = process.env.PGHOST || 'localhost'
  const user = process.env.PGUSER
  const password = process.env.PGPASSWORD
  const port = process.env.PGPORT || '5432'
  const database = process.env.PGDATABASE
  if (!user || !database) return undefined
  const auth = password ? `${user}:${password}` : user
  return `postgres://${auth}@${host}:${port}/${database}`
}

const connectionString = process.env.DATABASE_URL || buildConnectionStringFromEnv()
if (!connectionString) {
  console.warn('Banco de dados não configurado. Defina DATABASE_URL ou PGUSER/PGDATABASE/etc.')
}

export const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

export async function query<
  T extends QueryResultRow = QueryResultRow
>(text: string, params?: any[]): Promise<QueryResult<T>> {
  return pool.query<T>(text, params)
}

export default pool