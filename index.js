const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())


// console.log(process.env.DB_USER, process.env.DB_PASSWORD);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1zpunru.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true,}});

async function run() {
  try {
   
    const reviewServicesCollection = client.db("reviewServices").collection("services")
    const reviewCollection = client.db("reviewServices").collection("review")

      app.post("/addServices", async(req, res) => {
          const data = req.body;
          const result = await reviewServicesCollection.insertOne(data);
          res.send(result);
          
      })

    app.post("/comment", async (req, res) => {
      const data = req.body;
      const result = await reviewCollection.insertOne(data);
      res.send(result);
    })
    
    app.get("/allCommentById", async (req, res) => {
      const id = req.query.id;
      const query = { serviceId: id };
      // const sort = { length: -1 };
      const cursor =  reviewCollection.find(query).sort({ _id: -1 });
      const results = await cursor.toArray();
      res.send(results);
    })
    
    app.get("/commentById", async (req, res) => {
      const id = req.query.id;
      const query = { _id: new ObjectId(id) };
      const results = await reviewCollection.findOne(query);
      res.send(results);
    })
    
    app.get("/allCommentByEmail", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      // const sort = { length: -1 };
      const cursor =  reviewCollection.find(query).sort({ _id: -1 });
      const results = await cursor.toArray();
      res.send(results);
    })
    
      app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await reviewServicesCollection.findOne(query);
        res.send(result);
      })
    
      app.get("/getServices", async (req, res) => {
        const limit = req.query.limit;
        const cursor = reviewServicesCollection.find().sort({ _id: -1 })
        let result;
        if (limit === "all") {
          results = await cursor.toArray();
          res.send(results);
        }
        else {
          results = await cursor.limit(+limit).toArray();
          res.send(results)
        }
      })
    
      app.put("/editCommentById/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        console.log(id, data);
        const filter = { _id: new ObjectId(id) };
        // const options = { upsert: true };
        const updateDoc = {
          $set: {
            comment: data.comment
          },
        };
        // console.log({comment:data.comment});
        const result = await reviewCollection.updateOne(filter, updateDoc);
        console.log(result);
        res.send(result);
      })

    app.delete("/deleteReview/:id", async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    })
    
    
    
    
    app.get('/', (req, res) => {
    res.send('Trainer Review is on fire...............')
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Trainer Review is on fire...............')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// username:trainer-review11
// password:wdXMNwoGjKsxykOf