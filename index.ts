import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
//import RedisPubSubEngine from "graphql-ioredis-subscriptions";
import IORedis from "ioredis";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import express from "express";

import { RedisPubSub } from "graphql-redis-subscriptions";

const port = process.env.PORT || 3000
const REDIS_HOST = "redis://:p084e82949e443be46868bb05142b8b5443c90f2b55c954adbeec014ec7227672@ec2-52-5-212-47.compute-1.amazonaws.com"; // replace with own IP
const REDIS_PORT = 23120;


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