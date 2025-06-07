const express = require('express');
const app = express();

const cors = require('cors');
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://uws-songbook.onrender.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Pass to next layer of middleware
    next();
});

const port = process.env.PORT || 3001;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://UwsUser:UWSS0ngB00k!@uwssongbookcluster.mlrxi58.mongodb.net/?retryWrites=true&w=majority&appName=uwssongbookcluster";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/listSongs', async function (req, res)
{
    const client = new MongoClient(uri);
    
    await client.connect();
    const db = client.db("songlist");
    const collection = db.collection("scores");

    const songsList = await collection.find().sort({artist : 1, title : 1}).toArray();

    res.json(songsList);
})

app.get('/listArtists', async function (req, res)
{
    const client = new MongoClient(uri);
    
    await client.connect();
    const db = client.db("songlist");
    const collection = db.collection("scores");

    const queryRes = await collection.find({}, { _id : 1, artist : 1, title : 1 }).sort({ artist : 1, title : 1 }).toArray();

    res.json(queryRes);
})


var server = app.listen(port, function () 
{
    const client = new MongoClient(uri);

    console.log("Listening...")
})

