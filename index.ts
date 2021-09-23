import "reflect-metadata";
import express from "express";
import appServerApollo from "./src/graphqlconfig";

var cors = require('cors')

async function bootstrap() {

  const app = express()
  
    app.use(cors({
      
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }));
  
  // Start the server
  appServerApollo(app)
}
bootstrap();
