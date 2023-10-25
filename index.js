const express = require('express')
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5001;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wttgumh.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);


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
    const brandCollection = client.db("productDB").collection("brands");
    const cardCollection = client.db("productDB").collection("cart");

    //POST :create product
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log('Product',product);
      const result = await productCollection.insertOne(product);
      console.log(result);
      res.send(result);
    });


    //POST :create cart
    app.post("/cart", async (req, res) => {
      const cart = req.body;
      console.log('cart',cart);
      const result = await cardCollection.insertOne(cart);
      console.log(result);
      res.send(result);
    });

    //GET :Display all products

    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });


    // individual products brand:
    app.get("/products/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brandName: (brandName)};
      const cursor = productCollection.find(query)
      const result = await cursor.toArray();
      res.send(result);
    });



 
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id", id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

 

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUSer = {
        $set: {
             name: data.name,
            image:data.image,
            brand:data.brand,
            type:data.type,
            price:data.price,
            rating:data.rating
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedUSer,
        options
      );
      res.send(result);
    });




    //GET :Display all brands
    app.get("/brands", async (req, res) => {
      const result = await brandCollection.find().toArray();
      res.send(result);
    });

    


    app.get("/brands/:brand", async (req, res) => {
      const brand = req.params.brand;
      console.log(brand);
      const query = {
        brand: (brand),
      };
      const cursor = brandCollection.find(query)
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    app.get("/brands/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await brandCollection.findOne().toArray();
      console.log(result);
      res.send(result);
    });

//GET for Cart 
app.get("/cart", async (req, res) => {
  const cursor = cardCollection.find()
  const carts = await cursor.toArray();
  res.send(carts);
});

// DELETE cart Operation
app.delete("/cart/:id", async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id),};
  const result = await cardCollection.deleteOne(query);
  res.send(result);
});



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
 
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("Crud is running...");
  });

app.listen(port, () => {
console.log(`Simple Crud is Running on port ${port}`);
});
  