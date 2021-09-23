import { buildSchema } from "type-graphql";
import { loadResolvers } from "./helper.graphql";
import { pubSub } from "./redisUtils";
import { ApolloServer } from "apollo-server-express";

const { 
    ApolloServerPluginLandingPageProductionDefault,
    ApolloServerPluginLandingPageLocalDefault,
  } = require('apollo-server-core');

  
const PORT = process.env.PORT || 3000
  
const appServerApollo = async (app:any)=>{
    
    const schemas: Promise<any> = buildSchema({
        resolvers: loadResolvers,
        validate: false,
        authChecker: ({ context: { req } }) => {
            return !!req.session.userId
        },
        //container: Container,
        pubSub
    })  

    const server = new ApolloServer(
        { 
            schema: await schemas,
            introspection:true,
            plugins:[
              process.env.NODE_ENV === 'production' ?
              ApolloServerPluginLandingPageProductionDefault({ footer: false }) :
              ApolloServerPluginLandingPageLocalDefault({ footer: false })
            ],
            debug:true,       
        }
        
      );
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
  export default appServerApollo;
