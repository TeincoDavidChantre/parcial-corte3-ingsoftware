import { pool } from '../src/shared/database.js';
import { hashPassword } from '../src/shared/password.js';

const username = (process.env.SEED_USERNAME ?? 'admin').trim();
const password = process.env.SEED_PASSWORD ?? 'Reservet2026!';

if (!username || password.length < 8) {
  console.error(
    'SEED_USERNAME no puede estar vacío y SEED_PASSWORD debe tener al menos 8 caracteres.',
  );
  process.exit(1);
}

try {
  const passwordHash = await hashPassword(password);
  await pool.query(
    `INSERT INTO users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [username, passwordHash],
  );
  console.log(`Usuario de prueba listo: ${username}`);
} catch (error) {
  console.error('Error ejecutando seed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
