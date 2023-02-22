const express = require('express');
const bodyparser = require('body-parser');
const fs = require('fs');
const https = require('https');
var helmet = require("helmet");
var request = require('request');
//const fetch= require ("node-fetch");
const axios = require('axios').default;
const app = express();
const cors = require('cors');
const { event , zone } = require('./db.js');
const morgan = require('morgan');
app.use(helmet({crossOriginResourcePolicy: false}));
app.use(cors());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('tiny'));
const requestIp = require('request-ip');

const blockchainIP = '54.226.12.251';


app.get('/getStream' , async (req,res)=>{
    const coOrdinates = req.query.camCoordinates;
    const area = req.query.area;
    try{
        const zn = await zone.findOne({ zoneName : area});
        const ip = zn.zoneIP;
        let camIP='';
        let n = parseInt(zn.numberOfCameras);
        for (i = 1;i <=n ;i++){
            let camLoc = `zn.Camera${i}Location`;
            console.log(eval(camLoc));
            if(coOrdinates == eval(camLoc)){
                let cIP = `zn.Camera${i}IP`;
                camIP = eval(cIP);
            }
        }

        // if(streetName == zn.Street1Name){
        //     camID = zn.Street1CamIP;
        // }
        // else {
        //     camID = zn.Street2CamIP;
        // }
        const query = new URLSearchParams({"camID": camIP});
        res.redirect('https://'+ip+':3000/getStream/'+'?'+ query);
    }
    catch(err){
        console.log(err);
    }
});

// Get Live stream //
//=========================================================================//


app.get('/getVideo',async (req,res)=>{
    const streetName = req.query.streetName;
    const area = req.query.area;
    const date = req.query.date;
    const time = req.query.time;
    const timeEnd = req.query.timeEnd;
    // mongodb queries to get relative zone for ip and which cam
    try {
        console.log(area);
        console.log(streetName);
        console.log(date);
        console.log(time);
        const zn = await zone.findOne({ zoneName : area});
        const ip = zn.zoneIP;
        let camIP='';
        let n = parseInt(zn.numberOfCameras);
        for (i = 1;i <=n ;i++){
            let camLoc = `zn.Camera${i}Location`;
            
            if(streetName == eval(camLoc)){
                let cIP = `zn.Camera${i}IP`;
                camIP = eval(cIP);
                console.log(eval(camLoc));
            }
        }
        const query = new URLSearchParams({
            "date": date,
            "time": time,
            "timeEnd":timeEnd,
            "camID": camIP,
            "area":area
        });
        res.redirect('https://'+ip+':3000/getVideo'+'?'+ query);
    }
    catch(e){
        console.log('cant get event');
        console.log(e.message);
    }
});

// Get previous recorded stream //
//=========================================================================//



app.post('/archiveStream', async (req,res)=>{
    console.log('request to archive sent');
    const streetName = req.body.streetName;
    const area = req.body.area;
    const eventName = req.body.eventName;
    const start = req.body.start;
    const end = req.body.end;
    const date = req.body.eventDate;
    console.log (eventName);
    try {
        const zn = await zone.findOne({ zoneName : area});
        const ip = zn.zoneIP;
        let camIP='';
        let n = parseInt(zn.numberOfCameras);
        for (i = 1;i <=n ;i++){
            let camLoc = `zn.Camera${i}Location`;
            if(streetName == eval(camLoc)){
                let cIP = `zn.Camera${i}IP`;
                camIP = eval(cIP);
                console.log(eval(camLoc)+'------'+camIP);
            }
        }
        const eventAdd = await event.create({
            eventName : eventName ,
            eventCamID : camIP , 
            eventZoneID : area,
            eventDate : date,
        });
        res.status(201).json({ eventAdd });
        console.log(ip);
        let hashVal = await getJSON (ip,camIP,date,start,end);
        console.log("hash val is "+hashVal);
        updateClient(String(hashVal+'$$'+eventName+'$$'+ip+'$$'+camIP+'$$'+date));
    }
    catch(e){
        console.log(e.message);
    }
    res.end();

});


// Post Archive previous recorded stream //
//=========================================================================//



async function getJSON(ip,camID,date,start,end)   // async
{ 
    const s = await reqToAddvideoToIPFSandGetHash(ip,camID,date,start,end)   // await
    return String(s);                      // auto wrapped in Promise
}


// Function to get hash return from zone //
//=========================================================================//

const reqToAddvideoToIPFSandGetHash = (ipVal,camidVal,date,start,end) => {
    let url = 'https://'+ipVal+':3000/putVideo?videoDate='+date+'&startTime='+start+'&endTime='+end+'&camID='+camidVal;
    let options = {rejectUnauthorized : false }
    return new Promise((resolve, reject) =>  // return Promise
  { https
      .get(url, options, res => {
        let s = "";
        res.on("data", d => s += d)
        res.on("end", _ => resolve(s))     // success, resolve
      })
      .on("error", e => reject(e))         // failure, reject
});
};


app.get('/archiveLiveStream', async (req,res)=> {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy+mm+ dd;

    console.log(today);


    let updateClientData = req.query.videoData;
    let cameraID = req.query.cameraID;

    console.log(updateClientData , cameraID);
    var origin = requestIp.getClientIp(req);
    origin = origin.slice(7,origin.length);
    if (origin== '127.0.0.1'){
        origin='localhost';
    }
    let msgArray = updateClientData.split('$$');
    console.log(origin);
    try{
    const zn = await zone.findOne({ zoneIP : origin});
        const area = zn.zoneName;
    const eventAdd = await event.create({
        eventName : msgArray[1] ,
        eventCamID : cameraID , 
        eventZoneID : area,
        eventDate : today,
    });
    let stringToAdd = updateClientData+'$$'+area+'$$'+cameraID+'$$'+String(today);
    updateClient(String(stringToAdd));

    }
    catch(err){
        console.log(err);
    }
})


// add event to blockchain after getting hash from zone  for archiving LiveStream //
//=========================================================================//



function updateClient(postData){
    console.log(postData);
    var clientServerOptions = {
        url: 'http://'+blockchainIP+':8888/api/addvideo',
        body: JSON.stringify({postData}),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(clientServerOptions, function (error, response) {
        console.log(error,response.body);
        return;
    });
};


// Function to add to blockchain connecting to its api //
//=========================================================================//

app.get('/api/getAllEvents',async(req,res) =>{
    try{
        let allEvents = await event.find({ date : req.params.date});
        let arrOfEvents=[];
        for(i =0 ; i< allEvents.length;i++)
        {
            arrOfEvents.push(allEvents[i].eventName);
        }
        console.log(arrOfEvents);
        res.send(arrOfEvents);
    }
    catch(err){
        console.log(err);
    }
})


app.get('/getSavedIpfs/:eventName' , async (req,res) => {
    // search for event name with video id in mongodb
    try {
        console.log('Request for '+ req.params.eventName );
        let data = await makeGetRequest(req.params.eventName);
        data=String(Object.values(data));
        let hashV1=data.split('videoLink":"');
        let hashV2=hashV1[1].split('","');
        hashV2=hashV2[0];
        console.log('video Hash is : '+hashV2);
    
        res.send(String('https://ipfs.io/ipfs/'+hashV2));
        console.log(String('https://ipfs.io/ipfs/'+hashV2));
        }
        catch(e){
            console.log(e.message);
    }
});

// get request to get hash from blockchain and display its content from ipfs to user //
//=========================================================================//

async function makeGetRequest(postData) {
    let res = await axios.get('http://'+blockchainIP+':8888/api/readprice/'+postData);
    let data = res.data;
    console.log(data);
    return data;
};







app.post('/api/addZone' , async (req,res) => {
    try {
        let z = '0';
    const zoneAdd = await zone.create({
        zoneName : req.body.zoneName ,
        zoneIP : req.body.zoneIP,
        numberOfCameras : z, 
    });
    console.log('ZoneAdded');
    } 
    catch(e){
        console.log(e.message);
    }
    res.end();
});


app.post('/api/addCamera' , async (req,res)=>{
    try{
        cameraLocation = req.body.camLocation;
        cameraIP = req.body.cameraIP;
        area = req.body.zoneName;
        let zn = await zone.findOne({ zoneName : area});
        let n = parseInt(zn.numberOfCameras);
        let camLoc = `Camera${n+1}Location`;
        let camIP =  `Camera${n+1}IP`;
        await zone.findOneAndUpdate(
        { zoneName : area},
        { [camLoc] : cameraLocation, [camIP] : cameraIP},
        {
          returnNewDocument: true,
          new: true,
          strict: false
        });
        n=n+1;
        await zone.findOneAndUpdate(
            { zoneName : area},
            { numberOfCameras : n},
            {
              returnNewDocument: true,
              new: true,
              strict: false
            });
        res.send('Succefully added Cam! IP : '+cameraIP + 'camera Location : '+cameraLocation);
    }
    catch(err){
        res.send('Could not Add Cam');
        console.log(err);
    }
});


app.get('/getAllCameras', async (req,res) =>{
    try{
        area = req.body.ZoneName;
        let zn = await zone.findOne({ zoneName : area});
        res.json(zn);
    }
    catch(err){
        console.log(err.message);
    }
})

app.get('/getAllZones', async (req,res) =>{
    try{
        let zn = await zone.find();
        res.json(zn);
    }
    catch(err){
        console.log(err.message);
    }
})



// async function postHTTPS(url, data) {
//     const dataString = JSON.stringify(data)
  
//     const options = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Content-Length': dataString.length,
//       },
//       timeout: 1000, // in ms
//     }
  
//     return new Promise((resolve, reject) => {
//       const req = https.request(url, options, (res) => {
//         if (res.statusCode < 200 || res.statusCode > 299) {
//           return reject(new Error(`HTTP status code ${res.statusCode}`))
//         }
//         const body = "";
//         res.on('data', (s) => body+=s)
//         res.on('end', () => {
//           const resString = Buffer.concat(body).toString()
//           resolve(resString)
//         })
//       })
  
//       req.on('error', (err) => {
//         reject(err)
//       })
  
//       req.on('timeout', () => {
//         req.destroy()
//         reject(new Error('Request time out'))
//       })
  
//       req.write(dataString)
//       req.end()
//     })
//   }
  
//   const res = await post('https://...', data)









const options = {
    passphrase : "1234",
    key: fs.readFileSync(`privateKey.key`),
    cert: fs.readFileSync(`publicKey.crt`),
    ca: [ fs.readFileSync('rootCA.crt') ],
    dhparams: fs.readFileSync("dh-strong.pem") 
};
https
  .createServer(
    options,
    app
  )
  .listen(9443, ()=>{
    console.log('listening on 9443');
  });