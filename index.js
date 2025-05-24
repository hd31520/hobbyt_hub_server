
// hobbyhub
// LsAOfHViKq6pdi7E
// const uri = "mongodb+srv://hobbyhub:LsAOfHViKq6pdi7E@cluster0.v2f3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Load environment variables
// require('dotenv').config();.groups


const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());





app.get('/', (req, res) => {
  res.send('Hello World!');
});





const uri = "mongodb+srv://hobbyhub:LsAOfHViKq6pdi7E@cluster0.v2f3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

 const database = client.db("HobbyHub");
    const groups = database.collection("groups");

    app.get('/groups', async(req,res) => {
      const result = await groups.find().toArray();
      res.send(result);
    })

  app.get('/group/:id', async(req, res) => {
    const id = req.params.id;
      const query = { _id: new ObjectId(id) };
    const result = await groups.findOne(query);
    console.log(id)
    res.send(result)
  })

  

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   
  }
}
run().catch(console.dir);



app.listen(port, function () {
  console.log(` web server listening on port ${port}`)
})
