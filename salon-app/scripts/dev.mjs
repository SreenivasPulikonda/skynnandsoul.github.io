// Development preview serves fictional demo data only. Managed preview starts this process.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
const portArg=process.argv.indexOf('--port');
const port=Number(portArg>=0?process.argv[portArg+1]:process.env.PORT||5173);
http.createServer(async(req,res)=>{try{if(req.url.startsWith('/api/')){res.writeHead(404,{'Content-Type':'application/json'});res.end('{"error":"Demo preview only"}');return;}const file=await readFile('preview/index.html');res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(file);}catch{res.writeHead(503);res.end('Run npm run build first.');}}).listen(port,'0.0.0.0',()=>console.log('Demo preview ready on port '+port));
