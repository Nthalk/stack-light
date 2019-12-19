import {migrate} from 'postgres-migrations';
import path from 'path';

(async () => {
  migrate(
    {
      host: 'localhost',
      database: 'webstack',
      password: 'webstack',
      user: 'webstack',
      port: 5432,
    },
    path.resolve(__dirname, './db/migrations'),
    {logger: (msg: string) => console.log(msg)}
  );
})();
