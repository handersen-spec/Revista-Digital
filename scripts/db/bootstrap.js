// Cria usuário e base de dados locais para desenvolvimento
// Conecta como usuário do sistema (sem senha) à base 'postgres'

const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  // user: omitido para usar o usuário do sistema
})

async function ensureRole(client, role, password) {
  const res = await client.query('SELECT 1 FROM pg_roles WHERE rolname = $1', [role])
  if (res.rowCount === 0) {
    await client.query(`CREATE ROLE ${role} LOGIN PASSWORD '${password}'`)
    await client.query(`ALTER ROLE ${role} CREATEDB`)
    console.log(`Role '${role}' criada.`)
  } else {
    console.log(`Role '${role}' já existe.`)
  }
}

async function ensureDatabase(client, dbName, owner) {
  const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName])
  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE ${dbName} OWNER ${owner}`)
    console.log(`Database '${dbName}' criada com owner '${owner}'.`)
  } else {
    console.log(`Database '${dbName}' já existe.`)
  }
}

async function run() {
  const client = await pool.connect()
  try {
    await ensureRole(client, 'autoprestige', 'autoprestige')
    await ensureDatabase(client, 'autoprestige', 'autoprestige')
  } catch (err) {
    console.error('Erro no bootstrap do Postgres local:', err)
    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

run()
