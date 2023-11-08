const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 4000;


//Middleware
 app.use(cors());
 app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfkuy6b.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)


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
    
    //await client.connect();
     
    const foodCollection = client.db('RestaurentDB').collection('foodItem');
    const myAddedItems = client.db('RestaurentDB').collection('myItems');
    const purchaseItems = client.db('RestaurentDB').collection('purchaseItems');

   
    

       app.post('/myItems',async(req,res) =>{
        const newItem = req.body;
        console.log(newItem);
        const result = await myAddedItems.insertOne(newItem);
        res.send(result);

    })


    app.get('/myItems',async(req,res)=>{
      const cursor = myAddedItems.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/myItems/update/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await  myAddedItems.findOne(query);
      res.send(result)
    })
    


    app.put('/myItems/update/:id',async(req,res) =>  {
      const id = req.params.id;
      const filter ={_id: new ObjectId(id)}
      const options = {upsert:true};
      const updatedProduct = req.body;
      const products = {
     
        $set: {
          name : updatedProduct.name,
          foodCategory : updatedProduct.foodCategor,
          quantity: updatedProduct.quantity,
          price: updatedProduct.price,
          details: updatedProduct.details,
          image: updatedProduct.image,
          origin:updatedProduct.origin,
          addby:updatedProduct.addby,
          email:updatedProduct.email


        }
      }
      const result = await myAddedItems.updateOne(filter,products,options);
      res.send(result);
})


    app.get('/FoodItems',async(req,res)=>{
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/food-detail/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await  foodCollection.findOne(query);
      res.send(result)
    })

    app.get('/food-detail/purchase/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await  foodCollection.findOne(query);
      res.send(result)
    })


    
    app.post('/food-detail/purchase/:id',async(req,res) =>{
      const newItem = req.body;
      console.log(newItem);
      const result = await purchaseItems.insertOne(newItem);
      res.send(result);

  })


  app.get('/Carts',async(req,res)=>{
    const cursor = purchaseItems.find();
    const result = await cursor.toArray();
    res.send(result);
  })




    





    

    
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get ('/',(req,res) => {
   res.send('Restaurant server is runing')
})

app.listen(port,() => {
   console.log(`RestuarantServer is runing on port: ${port}`)
})

