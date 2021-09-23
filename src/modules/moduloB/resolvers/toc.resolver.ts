import { Query, Resolver } from "type-graphql";

@Resolver()
export default class TocResolver {
    
    @Query(()=>String)
    toc():string{
        return "toc"
    }
}
