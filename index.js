const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
//middleware
app.use(express.json())
app.use(cors())

//mongodb database code
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.inzz8jh.mongodb.net/?retryWrites=true&w=majority`;

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

    const userCollection = client.db("UserMenegmentDB").collection("user");
    app.get('/getUser', async(req,res)=>{
        const result = await userCollection.find().toArray();
        res.send(result);
    })
    app.post('/addUser',async(req,res)=>{
        const userInfo = req.body;
        const result = await userCollection.insertOne(userInfo)
        res.send(result)
    })
    app.patch('/updateUser/:email', async(req,res)=>{
        const email = req.params.email;
        const userInfo = req.body;
        const query = { email: email}
        const options = {upsert: true};
        const updateDoc = {
            $set: userInfo
        }
        const result = await userCollection.updateOne(query,updateDoc,options)
        res.send(result)
    })
    app.delete('/deleteUser/:id', async(req,res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/',(req,res)=>{
    res.send(`Welcome to our application`)
})
app.listen(port,()=>{
    console.log(port);
});