import {Query,Resolver} from "type-graphql";
import { Service } from "typedi";
import { RedisPubSub } from 'graphql-redis-subscriptions';

const pubsub = new RedisPubSub();
const SOMETHING_CHANGED_TOPIC = 'something_changed';


@Service({ global: true })
@Resolver()
export class TicTacToe {


    @Query(() => String)
    async tic(): Promise<string> {
        
        return "toe"

    }
}
