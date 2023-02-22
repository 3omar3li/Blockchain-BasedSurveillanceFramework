const express = require('express');
const bodyparser = require('body-parser');
//const fs = require('fs');
var request = require('request');
const axios = require('axios').default;
const res = require('express/lib/response');
const app = express();
var cors = require('cors')
//const querystring = require('querystring');
//const mongoose = require("mongoose");
const { event , zone } = require('./db.js')

const blockchainIP = '34.229.20.15';

app.use(bodyparser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
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
        res.redirect('http://'+ip+':3001/getVideo'+'?'+ query);
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
        let hashVal = await reqToAddvideoToIPFSandGetHash (ip,camID,date,start,end);

        updateClient(String(hashVal+'$$'+eventName+'$$'+ip+'$$'+camID+'$$'+date));
    }
    catch(e){
        console.log(e.message);
    }
    res.end();

});


const reqToAddvideoToIPFSandGetHash = async (ipVal,camidVal,date,start,end) => {
    const res = await axios.get('http://'+ipVal+':3001/putVideo',{
        params: {
          videoDate: date,
          startTime : start,
          endTime : end,
          camID : camidVal
        }
    });
    let data = res.data;
    console.log(data);
    return String(data);
}


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
}


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

})

async function makeGetRequest(postData) {

    let res = await axios.get('http://'+blockchainIP+':8888/api/readprice/'+postData);
  
    let data = res.data;
    console.log(data);
    return data;
}

app.listen(3000,()=>{
    console.log('Server listening on port 3000');
});