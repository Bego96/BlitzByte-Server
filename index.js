import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors';

import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors())

const uri = process.env.URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// ASYNC FUNCTION TO CONNECT TO MONGO FROM SETUP MAIN FUNCTION
async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

//CLOSE MONGODB CONNECTION OPTIONAL
async function closeMongoConnection() {
  await client.close();
  console.log("MongoDB connection closed.");
}

// FETCH ALL DATA FUNCTION FROM ALL PRODUCTS END-POINT
async function fetchData() {
  try {
    const db = client.db("products"); // Access data base name
    const collection = db.collection("product"); // access collection in database

    const result = await collection.find().toArray(); 

    return result;
  } catch (error) {
    console.log("Error fetching:", error);
    return [];
  }
}

//FETCH ALL DATA BY DESKTOP CATEGORY END-POINT
async function fetchDesktopData(category) {

  try {
    //First connect to client

    const db = client.db("products"); // Access data base name
    const collection = db.collection("product"); // access collection in database

    const query = { 'category': category }; // Query data by category provided
    const result = await collection.find(query).toArray(); // Return all necessary results 

    return result;
  } catch (error) {
    console.error("Error fetching:", error);
    return [];
  } 
}

//FETCH ALL DATA BY LAPTOP CATEGORY END-POINT
async function fetchLaptopData(category) {

  try {
    
    const db = client.db("products"); // Acess data base
    const collection = db.collection("product"); // Access collection in database

    const query = { 'category': category }; // Query data by provided category
    const result = await collection.find(query).toArray(); // Return all necessary results

    return result;
  } catch (error) {
    console.error("Error fetching:", error);
    return [];
  } 
}

//FETCH ALL DATA BY PHONE CATEGORY END-POINT
async function fetchPhoneData(category) {

  try {
    const db = client.db("products"); // Access data base
    const collection = db.collection("product"); // Access collection

    const query = { 'category': category }; // Query data by provided category
    const result = await collection.find(query).toArray(); // Return all necessary results

    return result;
  } catch (error) {
    console.error("Error fetching:", error);
    return [];
  } 
}

//FETCH ALL DATA BY TV CATEGORY END-POINT
async function fetchTVData(category) {

  try {
    const db = client.db("products"); // Access database
    const collection = db.collection("product"); // Access collection in database

    const query = { 'category': category }; // Query data by provided category
    const result = await collection.find(query).toArray(); // Return all necessary results

    return result;
  } catch (error) {
    console.error("Error fetching:", error);
    return [];
  } 
}

//FETCH ALL DATA BY CERTAIN MIN AND MAX PRICE's
async function fetchDataByPrice(minPrice, maxPrice, category) {
 
  try {

    const db = client.db("products"); // Access database
    const collection = db.collection("product"); // Access collection in database

    const query = { 
      'product.price': { $gte: minPrice, $lte: maxPrice },
      'category': {$eq: category}
    }; // Query data by provided criteria
    const result = await collection.find(query).toArray(); // Return all necessary results

    return result;
  } catch (error) {
    console.error("Error fetching:", error);
    return [];
  } 
}

// FETCH ALL DATA BY CERTAIN CATEGORY 
async function fetchAllDataByCategoryAndBrand(category, brand) {
  try {
    const db = client.db("products");
    const collection = db.collection("product");

    // Use $eq for exact match and $and to combine multiple conditions
    const query = {
      'category': { $eq: category },
      'product.brand': { $eq: brand }
    };

    const result = await collection.find(query).toArray();

    return result;
  } catch (error) {
    console.error("Error fetching:", error);
    return [];
  } 
}


//MAIN ASYNC FUNCTION WHICH AWAITS AND CALLS FUNCTION THAT CONNECTS TO MONGODB
async function main() {
  await connectToMongo();
 // await closeMongoConnection();
}


//CALLING MAIN ASYNC FUNCTION THAT AWAITS AND CONNECTS TO MONGODB 
main().catch(console.error);


// GET ALL PRODUCTS

app.get('/products', async (req, res) => {
  console.log("Trying to fetch");
  try {
    const products = await fetchData();
    console.log('Fetched products:', products);
    res.json(products); // Use res.json() to send JSON response
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error fetching products' });
  }
});

//GET ONLY DESKTOP PC's 
app.get('/desktopPc', async(req, res) => {
  const category = 'PC';
  try {
    const products = await fetchDesktopData(category);
    console.log('Fetches by category PC ' + products)
    res.json(products);
  } catch (err) {
    console.error("error fetching desktop");
  }
})

//GET ONLY LAPTOPS

app.get('/laptops', async(req, res) => {
  const category = 'Laptop';
  try {
    const products = await fetchLaptopData(category);
    console.log('Fetches by category PC ' + products)
    res.json(products);
  } catch (err) {
    console.error("error fetching desktop");
  }
})

//GET ONLY PHONES

app.get('/phones', async(req, res) => {
  const category = 'Phone';
  try {
    const products = await fetchPhoneData(category);
    console.log('Fetches by category PC ' + products)
    res.json(products);
  } catch (err) {
    console.error("error fetching desktop");
  }
})

//GET ONLY TV's

app.get('/tvs', async(req, res) => {
  const category = 'TV';
  try {
    const products = await fetchTVData(category);
    console.log('Fetches by category PC ' + products)
    res.json(products);
  } catch (err) {
    console.error("error fetching desktop");
  }
})

//GET ALL PRODUCTS FILTERED BY CERTAIN MIN AND MAX PRICE

app.get('/sortByPriceAndCategory', async(req, res) => {
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const category = req.query.category;
  try {
    const products = await fetchDataByPrice(minPrice, maxPrice, category);
    console.log('Fetches by category PC ' + products)
    res.json(products);
  } catch (err) {
    console.error("error fetching desktop");
  }
})

app.get('/bycategory', async (req, res) => {
  try {
    const category = req.query.category; // Brand value
    const brand = req.query.brand; // Type value
    const products = await fetchAllDataByCategoryAndBrand(category, brand);
    console.log('Fetches by category and type:', products);
    console.log(category + brand)
    res.json(products);
  } catch (err) {
    console.error("Error fetching by category and type", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




// NODE SERVER APP LISTENING ON CUSTOM PORT 
app.listen(process.env.PORT, () => {
  console.log('running on port 3001');
});


