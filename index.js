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
        const usersCollection = database.collection('users');

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

        // GET API : Orders Filter by User
        app.get('/orders/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        });

        // DELETE API : Order
        app.delete('/orders/:bqId', async (req, res) => {
            const bqId = req.params.bqId;
            const query = { _id: bqId };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });

        // POST API : Users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

        // PUT API : Admin Role
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateUser = {
                $set: { role: 'admin' }
            };
            const result = await usersCollection.updateOne(filter, updateUser);
            res.json(result);
        });

        // PUT API : Order Status
        app.put('/orders/:bqId', async (req, res) => {
            const filter = { _id: ObjectId(req.params.bqId) };
            const result = await ordersCollection.updateOne(filter, {
                $set: {
                    status: req.body,
                },
            });
            res.send(result);
        });

        // GET API : Check admin role
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // DELETE API : Product
        app.delete('/bouquets/:bqId', async (req, res) => {
            const bqId = req.params.bqId;
            const quary = { _id: ObjectId(bqId) };
            const result = await bouquetCollection.deleteOne(quary);
            res.json(result);
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