const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whfic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('flowers-valley');
        const roseCollection = database.collection('roses');
        const occasionCollection = database.collection('occasion');

        // GET API : Roses
        app.get('/roses', async (req, res) => {
            const roses = await roseCollection.find({}).toArray();
            res.json(roses);
        });

        // GET API : Collection
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