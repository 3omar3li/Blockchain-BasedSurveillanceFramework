const mongoose = require('mongoose')

const url = 'mongodb+srv://omar_db:0100name@cluster0.470tv.mongodb.net/Mapping?retryWrites=true&w=majority';



// const zoneSchema = new mongoose.Schema({
//     zoneName: {
//     type : String,
//     required: true,
//     trim: true,
//     lowercase: true,
//     sparse:true
//     },
//     zoneIP : {type : String,unique : false},
//     Street1Name : {type : String,unique : false},
//     Street1CamIP : {type : String,unique : false},
//     Street2Name : {type : String,unique : false},
//     Street2CamIP : {type : String,unique : false},
//     Street3Name : {type : String,unique : false},
//     Street3CamIP : {type : String,unique : false},
//     Street4Name : {type : String,unique : false},
//     Street4CamIP : {type : String,unique : false},
// });
const zoneSchema = new mongoose.Schema({
    zoneName: {
    type : String,
    required: true,
    trim: true,
    lowercase: true,
    sparse:true
    },
    zoneIP : {type : String,unique : false},
    numberOfCameras : {type : String ,unique : false},
}, { strict: false });
    
const eventSchema = new mongoose.Schema({
    eventName: {
    type : String,
    lowercase: true,
    unique : true,
    sparse:true,
    required: true
    },
    eventCamID: {type : String,unique : false},
    eventZoneID: {type : String , unique : false},
    eventDate : {type : String , unique : false}
});
     
// Creating model objects
const event = mongoose.model('events', eventSchema);
const zone = mongoose.model('zones', zoneSchema);
    



const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


// Exporting our model objects
module.exports = {
    event , zone
}