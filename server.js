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


app.get('/listArtists', async function (req, res)
{
    const client = new MongoClient(uri);
    
    await client.connect();
    const db = client.db("songlist");
    const collection = db.collection("scores");

    const queryRes = await collection.find({}, { "_id" : 0, "title" : 0, "lyrics" : 0, "chords" : 0 }).sort({ "artist" : 1 }).toArray();

    res.json(queryRes);
})

app.get('/listTitles', async function (req, res)
{
    const client = new MongoClient(uri);
    
    await client.connect();
    const db = client.db("songlist");
    const collection = db.collection("scores");

    const queryRes = await collection.find({}, { "_id" : 0, "artist" : 0, "lyrics" : 0, "chords" : 0  }).sort({ "title" : 1 }).toArray();

    res.json(queryRes);
})

app.get('/getLyrics', async function (req, res)
{
    const client = new MongoClient(uri);
    
    await client.connect();
    const db = client.db("songlist");
    const collection = db.collection("scores");

    const queryArtist = req.query.artist;
    const queryTitle = req.query.title;


    console.log("getLyrics?artist=" + queryArtist + "&title=" + queryTitle);

    const queryRes = await collection.find({ artist : queryArtist, title : queryTitle });

    console.log("queryRes=", queryRes);

    res.json(queryRes);
})

var server = app.listen(port, function () 
{
    const client = new MongoClient(uri);

    console.log("Listening...")
})

