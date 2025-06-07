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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Make the appropriate DB calls
    const db = client.db("songlist");
    const collection = db.collection("scores");

    //Query Artist
    //const query = {title: "2002"};
    //const queryResult = await collection.findOne(query);
    const queryResult = await collection.find().toArray();
    console.log("Results: ", queryResult);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

