const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb'); // For the MongoDB driver

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    //const uri = "mongodb://127.0.0.1:27017/songlist";
    //const uri = "mongodb+srv://UwsUser:UWSS0ngB00k!@uwssongbookcluster.mlrxi58.mongodb.net/?retryWrites=true&w=majority&appName=uwssongbookcluster";
    const uri = "mongodb://UwsUser:UWSS0ngB00k!@uwssongbookcluster.mlrxi58.mongodb.net/?retryWrites=true&w=majority&appName=uwssongbookcluster";
 
    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB clustera
        console.log("Connecting to Atlas...");
        await client.connect();
        console.log("Connected succesffully to server...");
 
        // Make the appropriate DB calls
        const db = client.db("songlist");
        const collection = db.collection("scores");

        //Query Artists
        const queryResult = await collection.distinct("artist");
        console.log("Results: ", queryResult);
        const queryResult2 = await collection.distinct("title");
        console.log("Results: ", queryResult2);

        const idString = "6815cd9212b51fe9bddcfd60";
        const objectId = new ObjectId(idString);
        const queryResult3 = await collection.findOne(objectId);
        console.log("Song: ", queryResult3);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
