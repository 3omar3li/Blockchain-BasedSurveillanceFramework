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


const blockchainIP = '54.226.12.251';



app.get('/getStream',async (req,res)=>{
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
        let camID=''
        if(streetName == zn.Street1Name){
            camID = zn.Street1CamIP;
        }
        else {
            camID = zn.Street2CamIP;
        }
        const query = new URLSearchParams({
            "date": date,
            "time": time,
            "timeEnd":timeEnd,
            "camID": camID,
            "area":area
        });
        res.redirect('https://'+ip+':3000/getVideo'+'?'+ query);
    }
    catch(e){
        console.log('cant get event');
        console.log(e.message);
    }

});


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
        let camID = '';
        if(streetName == zn.Street1Name){
            camID = zn.Street1CamIP;
        }
        else {
            camID = zn.Street2CamIP;
        }

        const eventAdd = await event.create({
            eventName : eventName ,
            eventCamID : camID , 
            eventZoneID : area,
            eventDate : date,
        });
        res.status(201).json({ eventAdd });
        console.log(ip);
        let hashVal = await getJSON (ip,camID,date,start,end);
        console.log("hash val is "+hashVal);
        updateClient(String(hashVal+'$$'+eventName+'$$'+ip+'$$'+camID+'$$'+date));
    }
    catch(e){
        console.log(e.message);
    }
    res.end();

});

async function getJSON(ip,camID,date,start,end)   // async
{ 
    const s = await reqToAddvideoToIPFSandGetHash(ip,camID,date,start,end)   // await
    return String(s);                      // auto wrapped in Promise
}


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
//     console.log(postData);
//     fetch('http://'+blockchainIP+':8888/api/addvideo', {
//     method: 'POST',
//     body: JSON.stringify({postData}),
//     headers: {
//         'Content-Type': 'application/json'
//     }
// })
//     .then(res => res.json())
//     .then(json => console.log(json))
//     .catch (err => console.log(err))
};


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

async function makeGetRequest(postData) {
    // let res = await fetch('http://'+blockchainIP+':8888/api/readprice/'+postData, {
    // method: 'GET'
    // })

    let res = await axios.get('http://'+blockchainIP+':8888/api/readprice/'+postData);
  
    let data = res.data;
    console.log(data);
    return data;
};



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