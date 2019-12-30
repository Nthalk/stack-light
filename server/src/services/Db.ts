import {Pool, QueryResult, PoolClient} from 'pg';
import passport = require('passport');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'webstack',
  password: 'webstack',
  database: 'webstack',
});

export type DbInterpolation = {
  sql: string;
  params: any[];
};

class Db {
  constructor(private client?: PoolClient) {}
  private interpolate(
    sql: string,
    params?: Record<string, any> | Array<any>
  ): DbInterpolation {
    if (!params) return {sql: sql, params: []};
    if (Array.isArray(params)) return {sql: sql, params: params};
    let sqlModified = sql;
    let keys: string[] = Object.keys(params);
    let earliestReplacementIndex = sqlModified.length;
    let earliestKey = null;
    let deadKeys: string[] = [];
    const arrayParams: any[] = [];
    do {
      if (earliestKey !== null) {
        sqlModified = sqlModified.replace(`:${earliestKey}`, '?');
        arrayParams.push(params[earliestKey]);
        earliestReplacementIndex = sqlModified.length;
        earliestKey = null;
      }

      for (const key of keys) {
        const replacementIndex = sqlModified.indexOf(`:${key}`);
        if (replacementIndex === -1) {
          deadKeys.push(key);
        } else if (replacementIndex < earliestReplacementIndex) {
          earliestReplacementIndex = replacementIndex;
          earliestKey = key;
        }
      }
      keys = keys.filter(k => deadKeys.indexOf(k) === -1);
      deadKeys = [];
    } while (earliestKey != null);
    return {sql: sqlModified, params: arrayParams};
  }

  async tx<T>(callback: (db: Db) => Promise<T>) {
    return new Promise<T>(async (resolve, reject) => {
      if (this.client) {
        callback(this);
      } else {
        const client = await pool.connect();
        try {
          await client.query('begin');
          callback(new Db(client));
        } catch (e) {
          await client.query('rollback');
          throw e;
        } finally {
          client.release();
        }
      }
    });
  }

  async query<R>(
    query: string,
    params?: Record<string, any> | Array<any>
  ): Promise<QueryResult<R>> {
    const interp = this.interpolate(query, params);
    const client = this.client ? this.client : await pool.connect();
    return client.query(interp.sql, interp.params);
  }
}

const db = new Db();

export default db;

export function useDb() {
  return db;
}
