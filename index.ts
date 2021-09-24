import "reflect-metadata";
import express from "express";
import appServerApollo from "./src/graphqlconfig";
const path = require('path');
const router = express.Router();
const  PORT = 8080

const fileUpload = require('express-fileupload');
var cors = require('cors')

async function bootstrap() {

  const app = express()
    app.use('/form', express.static(__dirname + '/index.html'));
    
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
    
    app.post('/upload', function(req:any, res:any) {
      let sampleFile;
      let uploadPath;
    
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      sampleFile = req.files.sampleFile;
      
      uploadPath = __dirname + '/src/modules/' + sampleFile.name;
    
      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv(uploadPath, function(err:any) {
        if (err)
          return res.status(500).send(err);
    
        res.send('File uploaded!');
      });
    });

    app.use('/', router);

    app.listen(PORT, function() {
      console.log('Express server listening on port ', PORT); // eslint-disable-line
    });
  // Start the server
  appServerApollo(app)
}
bootstrap();
