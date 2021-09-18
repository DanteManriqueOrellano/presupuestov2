import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
//import RedisPubSubEngine from "graphql-ioredis-subscriptions";
import IORedis from "ioredis";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import express from "express";

import { RedisPubSub } from "graphql-redis-subscriptions";
//import * as Redis from "ioredis";

const port = process.env.PORT || 3000
const REDIS_HOST = "192.168.99.100"; // replace with own IP
const REDIS_PORT = 6379;
//const pubsub = new RedisPubSub();

import { TicTacToe } from "./src/graphql/resolvers/moduleTicToc/tictoc";

const main = async () => {
  
    const app = express();




    const options: IORedis.RedisOptions = {
        host: REDIS_HOST,
        port: REDIS_PORT,
        retryStrategy: times => Math.max(times * 100, 3000),
      };
    
      // create Redis-based pub-sub
      const pubSub = new RedisPubSub({
        publisher: new IORedis(options),
        subscriber: new IORedis(options),
      });



    const schema = buildSchema({
        resolvers: [TicTacToe],
        validate: false,
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId
        },
        container: Container,
        pubSub: pubSub
        
        /*pubSub: new RedisPubSubEngine({
            pub: new IORedis,
            sub: new IORedis,
            parser:{
                stringify:(val)=>JSON.stringify(val),
                parse: (str) => JSON.parse(str)
            },
            logger:{
                warn: (...args) => console.warn(...args),
                error: (...args) => console.error(...args)
            },

        })*/
    
    })
    
    const apolloServer = new ApolloServer({
        
        introspection: true,
        schema: await schema,
        context: ({req,res}) => ({req,res}),
        
    });
    await apolloServer.start()
    apolloServer.applyMiddleware({ app, path: '/joder', cors: true });

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
}

export default main;
main()