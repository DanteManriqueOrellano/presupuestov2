import {Query,Resolver} from "type-graphql";
import { Service } from "typedi";
@Service({ global: true })
@Resolver()
export class TicTacToe {
    @Query(() => String)
    async tic(): Promise<string> {
        return "toe"

    }
}
