import {createPool, Pool} from "mysql2";

import {
  MYSQL_DB_HOST,
  MYSQL_DB_USER,
  MYSQL_DB_PASSWORD,
  MYSQL_DB_PORT,
  MYSQL_DB_DATABASE,
  MYSQL_DB_CONNECTION_LIMIT,
} from "../config/settings";

let pool: Pool;

export const init = () => {
  try {
    pool = createPool({
      connectionLimit: MYSQL_DB_CONNECTION_LIMIT,
      host: MYSQL_DB_HOST,
      user: MYSQL_DB_USER,
      port: MYSQL_DB_PORT,
      password: MYSQL_DB_PASSWORD,
      database: MYSQL_DB_DATABASE,
    });

    console.debug("MySql Adapter Pool generated successfully");
  } catch (error) {
    console.error("[mysql.connector][init][Error]: ", error);
    throw new Error("failed to initialized pool");
  }
};


export const execute = <T>(
  query: string,
  params: string[] | Object
): Promise<T> => {
  try {
    if (!pool) {
      throw new Error(
          "Pool was not created. Ensure pool is created when running the app."
      );
    }

    return new Promise<T>((resolve: any, reject) => {
      pool.query(query, params, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  } catch (error) {
    console.error("[mysql.connector][execute][Error]: ", error);
    throw new Error("failed to execute MySQL query");
  }
};
