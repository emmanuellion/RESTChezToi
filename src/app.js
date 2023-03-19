const express = require("express");
const bdd = require("./db");
const DaoRouter = require("./dao/DaoRouter");
const DAO = require("./dao/DAO");

const app = express();
const port = 3000;
const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
const pathToDb = "src/mydatabase.db";

(async() => {
    DAO.bdd = bdd;
    await DAO.verifyFile(pathToDb);
})();

app.use((req, res, next) => {
    if(!allowedMethods.includes(req.method)) res.status(405).send({message: "Method of request is not allowed, method allowed are: "+allowedMethods.join(", ")});
    else if (!bdd.tables.includes(req.url.split('/')[1])) res.status(400).send({message: "The given table does not exist, actual table are: "+bdd.tables.join(", ")});
    else next();
    // else DaoRouter(null, req);
});

app.get('/', (req, res) => {
    res.send("test")
})

app.post('/:table/', async (req, res) => {
    const tableName = req.url.split('/')[1];
    const arrayOfElement = Object.keys(bdd[tableName]).filter(el => el !== "id");
    const missingData = arrayOfElement.filter(el => !Object.keys(req.query).includes(el));
    if(missingData.length === 0){
        const response = await DAO.insertDAO(tableName, req.query);
        console.log(response)
        if(response === "1")
            res.status(200).send({message: "The data has been stored in the database successfully"})
        else
            res.status(409).send({message: "An error occured, please check your request and try again"})
    } else res.status(400).send({message: "You must set a value for the following fields: "+missingData.join(", ")})
})

app.get('/:table/', async (req, res) => {
    const lstColonne = Object.keys(req.query);
    const tableName = req.url.split('/')[1];
    const errName = lstColonne.filter(el => !Object.keys(bdd[tableName]).includes(el));
    if (errName.length >= 1)
        res.status(400).send({message: `The following column does not exist in the table ${tableName}: ${errName.join(', ')}`})
    else
        res.status(200).send({message: await DAO.selectDAO(tableName, req.query)})
})

app.put('/:table/', (req, res) => {
    console.log(req.query);
})

app.delete('/:table/', (req, res) => {
    console.log(req.query);
})

app.listen(port, () => {
    console.log('Le serveur écoute sur le port '+port);
});

/*
CREATE - POST - INSERT
READ - GET - SELECT
UPDATE - PUT - UPDATE
DELETE - DELETE - DELETE
*/