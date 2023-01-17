const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bonjour !');
});

app.post('/personnes/:id', (req, res) => {
    const personId = req.params.id;
    const personData = req.body;
    // Do something with personId and personData
});

app.listen(port, () => {
    console.log('Le serveur écoute sur le port 3000.');
});