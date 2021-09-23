import { Query, Resolver } from "type-graphql";

@Resolver()
export default class TicResolver {
    
    @Query(()=>String)
    tic():string{
        return "tic"
    }
}
