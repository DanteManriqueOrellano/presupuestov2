import path from 'path';
import { glob } from "glob";

//lee los resolvers de los modulos dentro de modules/mymodulo/resolvers
//el formato de lectura debe ser: *.resolver.ts
export const loadResolvers:any =
  glob.sync(path.join(__dirname, './modules/*/resolvers/*.resolver.ts'))
      .map(controllerPath => require(controllerPath))
      .map(controller => controller.default);



