const express = require('express');
const { MongoClient } = require('mongodb');
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

        const database = client.db('flowers-valley');
        const bouquetsCollection = database.collection('bouquets');
        const occasionCollection = database.collection('occasion');

        // GET API : Rose Bouquets
        app.get('/bouquets', async (req, res) => {
            const bouquets = await bouquetsCollection.find({}).toArray();
            res.json(bouquets);
        });

        // GET API : Occasion
        app.get('/occasion', async (req, res) => {
            const occasion = await occasionCollection.find({}).toArray();
            res.json(occasion);
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