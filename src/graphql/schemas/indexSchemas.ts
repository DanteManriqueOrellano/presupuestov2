  
import RedisPubSubEngine from "graphql-ioredis-subscriptions";
import IORedis from "ioredis";
import { buildSchema } from "type-graphql";
import Container from "typedi";
import { clasesResolver } from "../resolvers/indexResolvers";

export const schemas: Promise<any> = buildSchema({
    resolvers: clasesResolver,
    validate: false,
    authChecker: ({ context: { req } }) => {
        return !!req.session.userId
    },
    container: Container,
    pubSub: new RedisPubSubEngine({
        pub: new IORedis,
        sub: new IORedis,
        parser:{
            stringify:(val)=>JSON.stringify(val),
            parse: (str) => JSON.parse(str)
        },
        logger:{
            warn: (...args) => console.warn(...args),
            error: (...args) => console.error(...args)
        }
    })

})