const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = process.env.URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const database = client.db("HobbyHub");
    const groups = database.collection("groups");

    app.get("/groups", async (req, res) => {
      const result = await groups.find().toArray();
      res.send(result);
    });

    app.get("/group/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await groups.findOne(query);
      console.log(id);
      res.send(result);
    });

    app.post("/groups/add", async (req, res) => {
      const data = req.body;
      const result = await groups.insertOne(data);
      console.log(result);
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = {
        "member_name.User_Email": email,
      };

      const result = await groups.find(query).toArray();

      res.send(result);
    });

    app.delete("/groups/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid group ID" });
      }

      try {
        const result = await groups.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Group not found" });
        }

        res.json({ success: true, message: "Group deleted" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete group" });
      }
    });




    app.patch("/groups/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;

      const result = await groups.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { upsert: true } 
      );

      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port, function () {
  console.log(` web server listening on port ${port}`);
});
