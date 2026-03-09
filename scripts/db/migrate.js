// Executa migrations carregando e rodando o arquivo schema.sql
// Tenta carregar variáveis de ambiente de .env.local/.env automaticamente

const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

function loadEnvFile(envPath) {
  try {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) return
        const eq = trimmed.indexOf('=')
        if (eq === -1) return
        const key = trimmed.slice(0, eq).trim()
        let val = trimmed.slice(eq + 1).trim()
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1)
        }
        if (!(key in process.env)) {
          process.env[key] = val
        }
      })
    }
  } catch {}
}

// Carrega .env.local e .env (se existirem)
loadEnvFile(path.join(process.cwd(), '.env.local'))
loadEnvFile(path.join(process.cwd(), '.env'))

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL não definido. Configure em .env.local')
  process.exit(1)
}

const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
})

async function run() {
  const schemaPath = path.join(__dirname, 'schema.sql')
  const sql = fs.readFileSync(schemaPath, 'utf8')
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log('Migrations aplicadas com sucesso.')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Erro ao aplicar migrations:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

run()