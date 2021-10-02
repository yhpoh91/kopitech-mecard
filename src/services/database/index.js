const { ConnectionStringParser } = require('connection-string-parser');
const Sequelize = require('sequelize');
const ModelGenerator = require('./models');

const useSsl = (process.env.DATABASE_USE_SSL || 'true') === 'true';
const connectionString = process.env.DATABASE_URL;

const poolMin = parseInt((process.env.DATABASE_CONNECTION_POOL_MIN || '0'), 10);
const poolMax = parseInt((process.env.DATABASE_CONNECTION_POOL_MAX || '10'), 10);
const poolAcquire = parseInt((process.env.DATABASE_CONNECTION_POOL_ACQUIRE || '60000'), 10);
const poolIdle = parseInt((process.env.DATABASE_CONNECTION_POOL_IDLE || '10000'), 10);
const shouldLogQuery = (process.env.DATABASE_LOGGING || 'false').toLowerCase() === 'true';

const connectionStringParser = new ConnectionStringParser({ scheme: 'postgres' });
const connectionObject = connectionStringParser.parse(connectionString);

// Template
const name = connectionObject.endpoint;
const username = connectionObject.username;
const password = connectionObject.password;
const config = {
  host: connectionObject.hosts[0].host,
  port: connectionObject.hosts[0].port,
  dialect: connectionObject.scheme,
  dialectOptions: {
    ssl: useSsl ? {
      rejectUnauthorized: false,
    } : false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    dialectOptions: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  },
  pool: {
    max: poolMax,
    min: poolMin,
    acquire: poolAcquire,
    idle: poolIdle,
  },
  logging: shouldLogQuery,
}


const sequelizeClient = new Sequelize(name, username, password, config);
const models = ModelGenerator.getModels(sequelizeClient);
Object.keys(sequelizeClient.models)
  .forEach((m) => {
    const model = sequelizeClient.models[m];
    if (model.associate) {
      model.associate(models);
    }
  });

module.exports = models;