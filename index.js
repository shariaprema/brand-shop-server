const express = require('express')
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5001;

//middleware
app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://shariaprema123:wQlP9pQCTMdhKId4@cluster0.wttgumh.mongodb.net/?retryWrites=true&w=majority";

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
    await client.connect();

    const productCollection = client.db("productDB").collection("products");

    //POST
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log('Product',product);
      const result = await productCollection.insertOne(product);
      console.log(result);
      res.send(result);
    });
    





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("Crud is running...");
  });

app.listen(port, () => {
console.log(`Simple Crud is Running on port ${port}`);
});
  