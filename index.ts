import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import Redis = require("ioredis");
import { RedisPubSub } from "graphql-redis-subscriptions";
import { buildSchema } from "type-graphql";

import { RecipeResolver } from "./recipe.resolver";

const REDIS_HOST = "ec2-52-5-212-47.compute-1.amazonaws.com"; // replace with own IP
const REDIS_PORT = 23120;
const REDIS_PASSWORD = "p084e82949e443be46868bb05142b8b5443c90f2b55c954adbeec014ec7227672";

async function bootstrap() {
  // configure Redis connection options
  const options: Redis.RedisOptions = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    retryStrategy: times => Math.max(times * 100, 3000),
    tls: {
      rejectUnauthorized: false,
      requestCert: true,
      
      
    },
    //path:"https://presupuestov2.herokuapp.com/graphql"
  };

  // create Redis-based pub-sub
  const pubSub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  });

  // Build the TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver],
    validate: false,
    pubSub, // provide redis-based instance of PubSub

  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });
  console.log(server.graphqlPath) 
 

  // Start the server
  const { url } = await server.listen({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD});
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
