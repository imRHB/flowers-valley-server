const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Flowers Valley server is running');
});

app.listen(port, (req, res) => {
    console.log('Flowers Valley server at port', port);
});