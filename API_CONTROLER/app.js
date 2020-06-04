const express = require('express');
const app = express();
const port = 3000;
const Store = require('./api/model/dunkinServer');
const googleServer = require('./api/googleServer/mapsServer');
const Dunkin = new googleServer()
require('dotenv').config()

var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://dunkin_locator:QnbRSqeM6D3sBCUh@cluster0-fujkr.mongodb.net/Dunkin_test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    next();
})
app.use(express.json())

app.post('/api/dunkin',(req,res)=>{
    let dbStore = [];
    let stores = req.body;
    stores.forEach((store)=>{
        dbStore.push({
            name: store.name,
            phone: store.phonenumber,
            addressLine1: store.address,
            addressLine2:store.city+', '+store.postal,
            open: "5:00 - 21:00",
            location:{
                type:'Point',
                coordinates:[
                    store.lng,
                    store.lat
                ]
            }
        })
    })
    Store.create(dbStore,(err,store)=>{
        if (err) {
            res.status(500).send(err)
        } else{
            res.status(200).send(store)
        }
    })
})

app.delete('/api/dunkin',(req,res)=>{
    Store.deleteMany({},(err)=>{
        res.status(500).send(err)
    })
})

app.get('/api/dunkin',(req,res)=>{
    const zipCode = req.query.zip_code;

    Dunkin.getCoordinates(zipCode)
    .then((coordinates)=>{
        Store.find({
            location:{
                $near:{
                    $maxDistance: 6436,
                    $geometry:{
                        type:'Point',
                        coordinates: coordinates
                    }
                }
            }
        },(err,store)=>{
            if (err) {
                res.status(500).send(err)
            } else{
                res.status(200).send(store)
            }
        })
    }).catch((err)=>{
        console.log(err)
    })
})

app.listen(port,()=>console.log(`Google Maps listening on http://localhost:${port}`))