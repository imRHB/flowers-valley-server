const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whfic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        // Flowers Valley database
        const database = client.db('flowers-valley');

        // DB collections
        const bouquetCollection = database.collection('bouquets');
        const occasionCollection = database.collection('occasion');
        const reviewCollection = database.collection('reviews');
        const ordersCollection = database.collection('orders');

        // GET API : Rose Bouquets
        app.get('/bouquets', async (req, res) => {
            const bouquets = await bouquetCollection.find({}).toArray();
            res.json(bouquets);
        });

        // GET API : Occasion
        app.get('/occasion', async (req, res) => {
            const occasion = await occasionCollection.find({}).toArray();
            res.json(occasion);
        });

        // GET API : Single Bouquet
        app.get('/bouquets/:bqId', async (req, res) => {
            const id = req.params.bqId;
            const query = { _id: ObjectId(id) };
            const result = await bouquetCollection.findOne(query);
            res.json(result);
        });

        // GET API : Reviews
        app.get('/reviews', async (req, res) => {
            const reviews = await reviewCollection.find({}).toArray();
            res.json(reviews);
        });

        // POST API : Add Bouquet
        app.post('/add-product', async (req, res) => {
            const newBouquet = req.body;
            bouquetCollection.insertOne(newBouquet)
                .then(result => {
                    res.json(result);
                })
        });

        // POST API : Add Review
        app.post('/add-review', async (req, res) => {
            const newReview = req.body;
            reviewCollection.insertOne(newReview)
                .then(result => {
                    res.json(result);
                })
        });

        // POST API : Bouquet Order
        app.post('/orders', async (req, res) => {
            const orderedBouquet = req.body;
            ordersCollection.insertOne(orderedBouquet)
                .then(result => {
                    res.json(result);
                })
        });

        // GET API : Orders
        app.get('/orders', async (req, res) => {
            const orders = await ordersCollection.find({}).toArray();
            res.json(orders);
        });
    }

    finally {
        // client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Flowers Valley server is running');
});

app.listen(port, (req, res) => {
    console.log('Flowers Valley server at port', port);
});