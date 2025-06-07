const express = require('express');
const app = express();
const cors = require('cors');

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

const corsOptions = {
    origin: 'https://uws-songbook-svr.onrender.com/listSongs', // Replace with your app's domain
    methods: ['GET'], // Specify supported methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions));

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



var server = app.listen(port, function () 
{
    const client = new MongoClient(uri);


    //console.log("Host: ", host);
    //console.log("Port: ", port);

    console.log("Listening...")
})

