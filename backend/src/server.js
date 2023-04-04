import {createServer} from 'node:http';
import {createWriteStream} from 'node:fs';
import {Transform} from 'node:stream';
import csvtojson from 'csvtojson'

createServer((request, response) => {
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Content-Type': 'application/json'
  };

  if (request.method === "OPTIONS") {
    response.writeHead(200, headers)
    response.end();
    return;
  } 

  if (request.method === "GET") {
    response.writeHead(200, headers)
    response.end(JSON.stringify({
      message: 'running'
    }))
    return
  }

  if (request.method === "POST") {
    const fileName = `file-${Date.now()}.json`
    const writableStream = createWriteStream(`./${fileName}`);

    const transformRemoveHeaders = new Transform({
      writableObjectMode: true,
      async transform(chunk, encoding, callback) {
        if (this.skippedHeaders) {
          this.push(chunk)
        } else {
          const headerEnd = chunk.indexOf('\r\n\r\n') + 4;
          this.skippedHeaders = true
          this.push(chunk.slice(headerEnd))
        }
        callback()
      }
    })

    request.pipe(transformRemoveHeaders).pipe(csvtojson()).pipe(writableStream)

    request.on('close', () =>{
      writableStream.close()
      response.writeHead(200, headers)
      response.end(JSON.stringify({message: 'success', fileName}))
    })
    request.on('error', () => {
      console.log('error running the file')
      writableStream.close()
      response.writeHead(400, headers)
      response.end(JSON.stringify({message: 'ERROR WHEN UPLOADING FILE'}))
    })
  }

}).listen(3000, () => console.log('server running at 3000'))