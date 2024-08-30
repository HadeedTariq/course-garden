import { Pool } from "pg";
export function connectToDb() {
  const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: "hadeed#12896",
    port: Number(process.env.DB_PORT),
  });
  (async () => {
    const client = await pool.connect();
    try {
      console.log("Connected to db");
    } catch (err) {
      console.log(err);
    } finally {
      client.release();
    }
  })();
  return pool;
}
