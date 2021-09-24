const fs = require('fs')
const decompress = require("decompress");

export function postUpload(req:any, res:any) {
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;
    
    uploadPath = __dirname + '/modules/' + sampleFile.name ;
    
  
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err:any) {
      if (err)
        return res.status(500).send(err);
  
      res.send('File uploaded!');
    });
    descomprime_zip(uploadPath)
    fs.unlinkSync(uploadPath)//elimina archivo zip


}
async function descomprime_zip(uploadPath:string){
    try {
        await decompress(uploadPath, __dirname + '/modules/',{
          map: (file:any) => {
              file.path = `${new Date().getMilliseconds()}-${file.path}`;
              return file;
          }
      }).then((_files:any) => {
          console.log('done!');
      }
        
        )
        console.log(uploadPath)
        
        
        fs.rename( uploadPath, "hola", ()=>{

          fs.readdirSync(__dirname+'/modules/').forEach((file:any) => {
            console.log(file);
          });
        } )
        
        console.log("done!")

      } catch (error){
        console.log(error)

      }

}
  