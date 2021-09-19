
import RedisPubSubEngine from "graphql-ioredis-subscriptions";
import { Redis } from "ioredis";
import {Ctx, Mutation, Query,Resolver} from "type-graphql";
import { Service } from "typedi";
import { redisTest } from "../../../../redisUtils";
//import { RedisPubSub } from 'graphql-redis-subscriptions';


@Service({ global: true })
@Resolver()
export class TicTacToe {


    @Query(() => String)
    async tic(): Promise<string> {
        
        return "toe"

    }
   
}
