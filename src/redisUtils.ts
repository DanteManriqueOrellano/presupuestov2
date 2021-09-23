import  RedisPubSubEngine   from "graphql-ioredis-subscriptions";
import IORedis from "ioredis";
import dotenv from 'dotenv';
dotenv.config();
const url = require('url');
const redis_uri = url.parse(process.env.REDIS_URL);

//las opciones de configuracion de redis
// configure Redis connection options
export const options: IORedis.RedisOptions = {
    
  port: Number(redis_uri.port),
  host: redis_uri.hostname,
  password: redis_uri.auth.split(':')[1],
  db: 0,
  tls: {//del sitio web de heroku
    rejectUnauthorized: false,
    requestCert: true, 
  }
};

// create Redis-based pub-sub
export const pubSub = new RedisPubSubEngine({
  pub: new IORedis(redis_uri.hostname, options),
  sub: new IORedis(redis_uri.hostname,options),
  /* optional */
  // defaults to JSON
  parser: {
    stringify: (val) => JSON.stringify(val),
    parse: (str) => JSON.parse(str)
  },
  // defaults to console
  logger: {
    warn: (...args) => console.warn(...args),
    error: (...args) => console.error(...args)
  }
});