import path from 'path';
import { glob } from "glob";


const fs = require('fs')
let basePath = __dirname;
//lee los resolvers de los modulos dentro de modules/mymodulo/resolvers
//el formato de lectura debe ser: *.resolver.ts
export const loadResolvers:any = 

glob.sync(path.join(basePath, '/modules/*/resolvers/*.resolver.js'), {nodir: true})
    .map(controllerPath => require(controllerPath))
    .map(controller => controller.default);


