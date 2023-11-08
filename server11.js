const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8000;
const publicDirectory = 'C:\\TTD';


const fileName = 'data.json';
const landFileName = 'land.json';
const gObjFileName = 'gObj.json';
const fileName2 = 'rObj.json';
let file1 = 0;

const server = http.createServer((req, res) => {


  if (req.method === 'POST' && req.url === '/saveHQ') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const { index, value, file, dir, name } = JSON.parse(body);
      const filePath = dir ? path.join(publicDirectory, dir, file) : path.join(publicDirectory, file);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false }));
          return;
        }

        try {
          const json = JSON.parse(data);
          json[name][index] = value;

          fs.writeFile(filePath, JSON.stringify(json), 'utf8', err => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false }));
              return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          });
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false }));
        }
      });
    });
  }



  if (req.method === 'POST' && req.url === '/m0a') {
    let requestBody = '';

    req.on('data', chunk => {
      requestBody += chunk;
    });

    req.on('end', () => {
      const requestData = JSON.parse(requestBody);
      const { index, name, dir } = requestData;

      // Remove element at the specified index from the 2D array
      removeElementAtIndex(name, dir, index, (error) => {
        if (error) {
          console.error(error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Error removing element from array' }));
        } else {
          console.log('Element removed from array and JSON file updated successfully.');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        }
      });
    });
  }

function removeElementAtIndex(name, dir, index, callback) {
  const filePath = `${dir}/${name}.json`;

  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(err);
      return;
    }

    let array;
    try {
      array = JSON.parse(fileData);
    } catch (parseError) {
      callback(parseError);
      return;
    }

    if (!Array.isArray(array)) {
      callback(new Error('The file does not contain a valid array.'));
      return;
    }

    if (index >= 0 && index < array.length) {
      array.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(array), callback);
    } else {
      callback(new Error('Invalid index.'));
    }
  });
}

/*
  if (req.method === 'POST' && req.url === '/upload') {
     let body = '';
     req.on('data', (chunk) => {
       body += chunk;
     });
     req.on('end', () => {
       const binaryImage = Buffer.from(body, 'binary');
       const filePath = 'image.png';
       fs.writeFile(filePath, binaryImage, (err) => {
         if (err) {
           console.error(err);
           res.writeHead(500, { 'Content-Type': 'text/plain' });
           res.end('Error saving image file');
         } else {
           res.writeHead(200, { 'Content-Type': 'text/plain' });
           res.end('Image file saved');
         }
       });
     });
   }*/



     if (req.method === 'POST' && req.url === '/s2d') {
       let requestBody = '';

       req.on('data', chunk => {
         requestBody += chunk;
       });

       req.on('end', () => {
         const requestData = JSON.parse(requestBody);
         const { array, name, dir } = requestData;

         // Save the 2D array as a JSON file
         saveArrayAsJson(array, name, dir, (error) => {
           if (error) {
             console.error(error);
             res.writeHead(500, { 'Content-Type': 'application/json' });
             res.end(JSON.stringify({ success: false, error: 'Error saving the JSON file' }));
           } else {
             console.log('Array saved as JSON file successfully.');
             res.writeHead(200, { 'Content-Type': 'application/json' });
             res.end(JSON.stringify({ success: true }));
           }
         });
       });
     }


   function saveArrayAsJson(array, name, dir, callback) {
     const filePath = `${dir}/${name}.json`;

     // Check if the file already exists
     fs.access(filePath, fs.constants.F_OK, (err) => {
       if (err) {
         // File does not exist, create a new one
         fs.writeFile(filePath, JSON.stringify(array), callback);
       } else {
         // File exists, append to it
         fs.readFile(filePath, (err, fileData) => {
           if (err) {
             callback(err);
             return;
           }

           let existingArray = [];
           try {
             existingArray = JSON.parse(fileData);
           } catch (parseError) {
             callback(parseError);
             return;
           }

           existingArray.push(...array);

           fs.writeFile(filePath, JSON.stringify(existingArray), callback);
         });
       }
     });
   }



   if (req.method === 'POST' && req.url === '/saveValue') {
     let body = '';
     req.on('data', chunk => {
       body += chunk.toString();
     });
     req.on('end', () => {
       const data = JSON.parse(body);
       const index = data.index;
       const value = data.value;
       const file = data.file;
       const dir = data.dir;
       const pd = 'C:\\TTD\\TTD\\map\\'+dir;

       const file1 = data.file1;
       const file2 = data.file2;
       const file3 = data.file3;

       const gObjFilePath = path.join(pd, file);

       const updateFile = (filePath) => {
         if (!filePath) {
           // Skip if filePath is empty
           return;
         }
         fs.readFile(filePath, 'utf-8', (err, fileData) => {
           if (err) {
             console.error('Error:', err);
             res.writeHead(500);
             res.end('500 Internal Server Error');
           } else {
             const gObjData = JSON.parse(fileData);
             gObjData[index] = value;
             fs.writeFile(filePath, JSON.stringify(gObjData), (err) => {
               if (err) {
                 console.error('Error:', err);
                 res.writeHead(500);
                 res.end('500 Internal Server Error');
               } else {
                 console.log(`Value ${value} saved to ${filePath} at index ${index}`);
               }
             });
           }
         });
       };

       updateFile(gObjFilePath);
       updateFile(file1 && path.join(pd, file1));
       updateFile(file2 && path.join(pd, file2));
       updateFile(file3 && path.join(pd, file3));

       res.writeHead(200, { 'Content-Type': 'application/json' });
       res.end(JSON.stringify({ success: true }));
     });
   }




/*
   if (req.method === 'POST' && req.url === '/saveValue') {
     let body = '';
     req.on('data', chunk => {
       body += chunk.toString();
     });
     req.on('end', () => {
       const data = JSON.parse(body);
       const index = data.index;
       const value = data.value;
       const file = data.file;
       const dir = data.dir;
       const pd = 'C:\\TTD\\TTD\\map\\'+dir;


  //   if (dir === '0') { publicDirectory = 'C:\\TTD\\TTD\\map\\0' };
  //    if (file === fileName) { file1 = fileName };

       const gObjFilePath = path.join(pd, file);
       fs.readFile(gObjFilePath, 'utf-8', (err, fileData) => {
         if (err) {
           console.error('Error:', err);
           res.writeHead(500);
           res.end('500 Internal Server Error');
         } else {
           const gObjData = JSON.parse(fileData);
           gObjData[index] = value;
           fs.writeFile(gObjFilePath, JSON.stringify(gObjData), (err) => {
             if (err) {
               console.error('Error:', err);
               res.writeHead(500);
               res.end('500 Internal Server Error');
             } else {
               console.log(`Value ${value} saved to ${file} at index ${index}`);
               res.writeHead(200, { 'Content-Type': 'application/json' });
               res.end(JSON.stringify({ success: true }));
             }
           });
         }
       });
     });
   }
*/




   if (req.method === 'POST' && req.url === '/sV') {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const dataArray = JSON.parse(body);
    const file = dataArray[0].file;
    const dir = dataArray[0].dir;
    const pd = 'C:\\TTD\\TTD\\map\\' + dir;
    const gObjFilePath = path.join(pd, file);

    fs.readFile(gObjFilePath, 'utf-8', (err, fileData) => {
      if (err) {
        console.error('Error:', err);
        res.writeHead(500);
        res.end('500 Internal Server Error');
      } else {
        const gObjData = JSON.parse(fileData);
        for (let i = 0; i < dataArray.length; i++) {
          const index = dataArray[i].index;
          const value = dataArray[i].value;
          gObjData[index] = value;
        }
        fs.writeFile(gObjFilePath, JSON.stringify(gObjData), (err) => {
          if (err) {
            console.error('Error:', err);
            res.writeHead(500);
            res.end('500 Internal Server Error');
          } else {
            console.log(`${dataArray.length} values saved to ${file}`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          }
        });
      }
    });
  });
}



    if (req.method === 'POST' && req.url === '/Data') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data.gObj && data.gObj.length === 3 && data.gObj[2] === 0) {
            console.log('DATA IS HERE');
            const index = data.gObj[0];
            fs.readFile('gObj.json', 'utf8', (err, jsonString) => {
              if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Error reading file');
                return;
              }
              try {
                const gObj = JSON.parse(jsonString);
                const value = gObj[index];
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ value }));
              } catch (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Error parsing JSON string');
              }
            });
          } else {
            res.statusCode = 400;
            res.end('Invalid data');
          }
        } catch (err) {
          console.error(err);
          res.statusCode = 400;
          res.end('Invalid data');
        }
      });
    }




  if (req.method === 'POST' && req.url === '/saveData') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const data = JSON.parse(body);

      const fileName = data.fileName;
      const array = data.array;
      const dir = data.dir;

      const filePath = path.join(dir, fileName + '.json');

      fs.writeFile(filePath, JSON.stringify(array), (err) => {
        if (err) {
          res.statusCode = 500;
          res.end('Failed to save data');
        } else {
          res.statusCode = 200;
          res.end('Data saved successfully');
        }
      });
    });
  }
  else {
   const filePath = path.join(publicDirectory, req.url);
   const extname = path.extname(filePath);
   let contentType = 'text/html';

   switch (extname) {
     case '.js':
       contentType = 'text/javascript';
       break;
     case '.css':
       contentType = 'text/css';
       break;
     case '.json':
       contentType = 'application/json';
       break;
     case '.png':
       contentType = 'image/png';
       break;
     case '.jpg':
       contentType = 'image/jpg';
       break;
     case '.gif':
       contentType = 'image/gif';
       break;
   }

   fs.readFile(filePath, (err, data) => {
     if (err) {
       if (err.code === 'ENOENT') {
         // file not found
         res.writeHead(404);
         res.end('404 Not Found');
       } else {
         // server error
         console.error('Error:', err);
         res.writeHead(500);
         res.end('500 Internal Server Error');
       }
     } else if (req.method === 'GET' && req.url === '/getData') {
       const index = req.query.index;
       const jsonDataPath = path.join(publicDirectory, fileName);
       fs.readFile(jsonDataPath, (err, data) => {
         if (err) {
           console.error('Error:', err);
           res.writeHead(500);
           res.end('500 Internal Server Error');
         } else {
           const jsonData = JSON.parse(data);
           const result = jsonData[index];
           res.writeHead(200, { 'Content-Type': 'application/json' });
           res.end(JSON.stringify(result));
         }
       });
     } else {
       // success
       res.writeHead(200, { 'Content-Type': contentType });
       res.end(data);
     }
   });
 }
});

server.listen(port, () => {
 console.log(`Server listening on port ${port}`);
});
