require("dotenv").config();

const express = require('express');
const app = express();

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

    songsList = await collection.find().sort({artist : 1, title : 1}).toArray();
    //console.log("Songs List: ", songsList);

    res.json(songsList);
})

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/index2", function (req, res) {
    res.sendFile(path.join(__dirname, "./index2.html"));
});

app.get('/listArtists', async function (req, res)
{
    const client = new MongoClient(uri);
    
    await client.connect();
    const db = client.db("songlist");
    const collection = db.collection("scores");

    songsList = await collection.find(
        {},
        { _id : 1, 
          artist : 1, 
          title : 1, 
          lyrics : 0, 
          chords : 0 
        }
    ).sort({artist : 1, title : 1}).toArray();

    res.json(songsList);
})


var server = app.listen(port, function () 
{
    const client = new MongoClient(uri);


    //console.log("Host: ", host);
    //console.log("Port: ", port);

    console.log("Listening...")
})

