const express = require('express');
const app = express();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
var fs = require('fs');
const axios = require('axios').default;
const ipfsClient = require('ipfs-http-client');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');
const https = require('https');
helmet = require("helmet");

const ipfs = ipfsClient.create({host : 'ipfs.infura.io',port: '5001',protocol:'https'});

app.use(fileUpload());
app.use(express.json());
app.use(helmet({crossOriginResourcePolicy: false}));
app.use(bodyparser.urlencoded({extended: true}));

app.get('/getVideo', (req,res) =>{
    console.log('Request recieved');
    vidName=req.query.date+'_2065759.mp4';
    ffmpeg('../../../../iVMS-4200/video/RecordFile/'+req.query.date+'/'+req.query.camID+'/'+vidName)
    .setStartTime(req.query.time)
    .setDuration(req.query.timeEnd)
    .output('../../../../iVMS-4200/video/RecordFile/'+req.query.date+'/'+req.query.camID+'/outputVideo/'+req.query.camID+'_cut.mp4')
    .on('end', function(err) {
        if(!err) { console.log('conversion Done') }
        const path = '../../../../iVMS-4200/video/RecordFile/'+req.query.date+'/'+req.query.camID+'/outputVideo/'+req.query.camID+'_cut.mp4';
        const stat = fs.statSync(path);
        const fileSize = stat.size;
        const range = req.headers.range;
        // const file = fs.createReadStream(path);
        // file.pipe(res);
        if(range){
        const parts = range.replace(/bytes=/,"").split("=");
        const start = parseInt(parts[0],10);
        const end = parts[1] ? parseInt(parts[1],10) : fileSize-1;
        const chunkSize = (end-start) + 1;
        const file = fs.createReadStream(path,{start,end});
        const head = {
        'Content-range' : `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges' : `bytes`,
        'Content-Length' :chunkSize,
        'Content-Type' :'video/mp4'
        }
        res.writeHead(206,head);
        file.pipe(res);
    }
    else{
        const head = {
            'Content-Length':fileSize,
            'Content-Type':'video/mp4'
        }
        res.writeHead(206,head);
        fs.createReadStream(path).pipe(res);
    }
    })
    .on('error', function(err){
    console.log('error: ', err)
    }).run()    
});


app.get('/putVideo', async (req,res) => {
    try {
    // let videoDate =  req.params.videoDate;
    // let startTime = req.params.startTime;
    // let endTime = req.params.endTime
    // let camID = req.params.camID
    console.log('req to put video Received');
    ffmpeg('../../../../iVMS-4200/video/RecordFile/'+req.query.videoDate+'/'+req.query.camID+'/outputVideo/'+req.query.camID+'_cut.mp4')
    .setStartTime(req.query.startTime)
    .setDuration(req.query.endTime)
    .output('../../../../iVMS-4200/video/RecordFile/'+req.query.videoDate+'/'+req.query.camID+'/outputVideo/'+req.query.camID+'_bc.mp4')
    .on('end', async function(err) {
        if(!err) { console.log('conversion Done') }
        const filePath = '../../../../iVMS-4200/video/RecordFile/'+req.query.videoDate+'/'+req.query.camID+'/outputVideo/'+req.query.camID+'_bc.mp4' ;
        let fileName = req.query.camID+'bc.mp4';
        const fileHash = await addIpfsFile (fileName,filePath);
        fs.unlink(filePath,(err)=>{
            if(err) console.log(err);
        });
        res.send(String(fileHash));
    })
    .on('error', function(err){
    console.log('error: ', err)
    }).run()
    }
    catch(e){
        console.log(e.message);
    }
});

const addIpfsFile = async (fileName,filePath)=>{
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({path: fileName,content:file});
    const {cid} = fileAdded;
    return cid;
}

const options = {
    passphrase : "1234",
    key: fs.readFileSync(`domain.key`),
    cert: fs.readFileSync(`domain.crt`),
    rejectUnauthorized: false
//    dhparams: fs.readFileSync("dh-strong.pem") 
};
https
  .createServer(
    options,
    app
  )
  .listen(3000, ()=>{
    console.log('listening on 3000 stg server');
  });

// app.listen(3001);
// console.log('Running at 3001');