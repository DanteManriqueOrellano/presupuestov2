import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import  RedisPubSubEngine   from "graphql-ioredis-subscriptions";
import { RecipeResolver } from "./src/recipe.resolver";
import IORedis from "ioredis";
import { buildSchema } from "type-graphql";
import dotenv from 'dotenv';
import express from "express";
import { SampleResolver } from "./src/simple.resolver";
const { 
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
} = require('apollo-server-core');

var cors = require('cors')
dotenv.config();
const url = require('url');
const PORT = process.env.PORT || 3000

const redis_uri = url.parse(process.env.REDIS_URL);

async function bootstrap() {
  // configure Redis connection options
  const app = express()
  
  const options: IORedis.RedisOptions = {
    
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
  const pubSub = new RedisPubSubEngine({
    pub: new IORedis(process.env.REDIS_URL, options),
    sub: new IORedis(process.env.REDIS_URL,options),
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

  // Build the TypeGraphQL schema
  const schema = await buildSchema({
    resolvers: [RecipeResolver,SampleResolver],
    validate: false,
    pubSub, // provide redis-based instance of PubSub
    
  });

  // Create GraphQL server
  const server = new ApolloServer(
      { 
          schema,
          introspection:true,
          plugins:[
            process.env.NODE_ENV === 'production' ?
            ApolloServerPluginLandingPageProductionDefault({ footer: false }) :
            ApolloServerPluginLandingPageLocalDefault({ footer: false })
          ],
          debug:true,
          
         
      }
      
    );
    app.use(cors({
      
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }));

  // Start the server
  await server.start()
  server.applyMiddleware({ app, path: '/apipresupuestov1', cors: true });
  

  app.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

bootstrap();