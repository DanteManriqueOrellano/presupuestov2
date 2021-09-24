import "reflect-metadata";
import express from "express";
import appServerApollo from "./src/graphqlconfig";
import { postUpload } from "./src/helper.files";

const router = express.Router();
const fileUpload = require('express-fileupload');
var cors = require('cors')

async function bootstrap() {

  const app = express()
    app.use('/formUpload', express.static(__dirname + '/index.html'));
    
    app.use(fileUpload());
    app.use(cors({
      
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 5,
      credentials: true,
      allowMethods: ['GET', 'POST', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }));
    app.get('/ping', function(_req:any, res) {
      
      res.send('pong');
    });
    
    app.post('/upload', postUpload);

    app.use('/', router);

  appServerApollo(app)
}
bootstrap();
