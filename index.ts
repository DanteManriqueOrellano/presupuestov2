import "reflect-metadata";
import { ApolloServer } from "apollo-server";

import { RedisPubSub } from "graphql-redis-subscriptions";


import { RecipeResolver } from "./src/recipe.resolver";
import IORedis from "ioredis";

import { buildSchema } from "type-graphql";
import dotenv from 'dotenv';
import express from "express";
dotenv.config();
const url = require('url');
const port = process.env.PORT || 3000

const redis_uri = url.parse(process.env.REDIS_URL);

async function bootstrap() {
  // configure Redis connection options
  const app = express()
  
  const options: IORedis.RedisOptions = {
    
    port: Number(redis_uri.port),
    host: redis_uri.hostname,
    password: redis_uri.auth.split(':')[1],
    db: 0,
    tls: {
      rejectUnauthorized: false,
      requestCert: false,
      
    }
  };


  // create Redis-based pub-sub
  const pubSub = new RedisPubSub({
    publisher: new IORedis(options),
    subscriber: new IORedis(options)
    
  });

  // Build the TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    validate: false,
    pubSub, // provide redis-based instance of PubSub
  });

  // Create GraphQL server
  const server = new ApolloServer(
      { 
          schema,
          

      }
      
    );

  // Start the server
 // const { url } = await server.listen(4000);
 // console.log(`Server is running, GraphQL Playground available at ${url}`);
 app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
}

bootstrap();
