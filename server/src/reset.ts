import path from 'path';
import pgp, {QueryFile} from 'pg-promise';

(async () => {
  let db = pgp()('postgres://postgres:postgres@localhost:5432/postgres');
  try {
    const resetResult = await db.none(
      new QueryFile(path.resolve(__dirname, './db/reset.sql'))
    );
    db.$pool.end();
    db = pgp()('postgres://webstack:webstack@localhost:5432/webstack');
    await db.none(new QueryFile(path.resolve(__dirname, '../db/init.sql')));
  } catch (e) {
    console.log(e);
  }
  db.$pool.end();
})();
