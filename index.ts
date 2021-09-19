import "reflect-metadata";
import { ApolloServer } from "apollo-server";

import { RedisPubSub } from "graphql-redis-subscriptions";


import { RecipeResolver } from "./recipe.resolver";
import IORedis from "ioredis";
import { buildSchema } from "type-graphql";
import dotenv from 'dotenv';
dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST; //   "ec2-52-5-212-47.compute-1.amazonaws.com"; // replace with own IP
const REDIS_PORT = 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_USERNAME = process.env.REDIS_USERNAME;








async function bootstrap() {
  // configure Redis connection options
  const options: IORedis.RedisOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    db:0,
    password:REDIS_PASSWORD,
    
    retryStrategy: times => Math.max(times * 100, 3000),
  };

  // create Redis-based pub-sub
  const pubSub = new RedisPubSub({
    publisher: new IORedis(options),
    subscriber: new IORedis(options),
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
  const { url } = await server.listen(4000);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
