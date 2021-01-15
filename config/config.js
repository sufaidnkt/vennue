exports.getConfig = function () {
  return {
    user: 'postgres', //env var: PGUSER
    // database: 'spyce_mining', //env var: PGDATABASE
    database: 'test', //env var: PGDATABASE
    password: 'postgres', //env var: PGPASSWORD
    port: 5432, //env var: PGPORT
    max: 20, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed ,
    host: 'localhost',
    // host: 'localhost',
    // connectionTimeoutMillis: 2000,
  };
};