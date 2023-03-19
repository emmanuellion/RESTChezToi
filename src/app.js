const express = require("express");
const bdd = require("./db");
const DAO = require("./dao/DAO");

const app = express();
const port = 3000;
const allowedMethods = ["GET", "POST", "PATCH", "DELETE", "PUT"];
const pathToDb = "src/mydatabase.db";
DAO.bdd = bdd;

(async() => {
    await DAO.verifyFile(pathToDb);
})();

app.use((req, res, next) => {
    if(!allowedMethods.includes(req.method)) res.status(405).send({message: "Method of request is not allowed, method allowed are: "+allowedMethods.join(", ")});
    else if (!bdd.tables.includes(req.url.split('/')[1]) && req.method !== "PUT") res.status(400).send({message: "The given table does not exist, actual table are: "+bdd.tables.join(", ")});
    else next();
});

app.post('/:table/', async (req, res) => {
    const tableName = req.url.split('/')[1];
    const arrayOfElement = Object.keys(bdd[tableName]).filter(el => el !== "id");
    const missingData = arrayOfElement.filter(el => !Object.keys(req.query).includes(el));
    if(missingData.length === 0){
        const response = await DAO.insertDAO(tableName, req.query);
        if(response === "1") res.status(200).send({message: "The data has been stored in the database successfully"})
        else res.status(409).send({message: "An error occured, please check your request and try again"})
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

app.patch('/:table/:colonne/:id/', async (req, res) => {
    const lstModify = Object.keys(req.query);
    const tab = req.url.split('/');
    const tableName = tab[1];
    const colonne = tab[2];
    const value = tab[3];
    const table = bdd[tableName];
    if (Object.keys(table).includes(colonne)){
        let colNotExist = [];
        lstModify.forEach(el => {
            if (!Object.keys(table).includes(el))
                colNotExist.push(el);
        })
        if (colNotExist.length === 0){
            const response = await DAO.updateDAO(tableName, colonne, value, req.query);
            console.log(response)
            if(response === "1") res.status(200).send({message: "Row(s) updated successfully"});
            else res.status(409).send({message: "An error occured, please check your request and try again"});
        } else res.status(400).send({message: `The following column does not exist in the table ${tableName}: ${colNotExist.join(', ')}`});
    } else res.status(400).send({message: `It seems that your column for the WHERE condition does not exist, here are the existing columns: ${Object.keys(table).join(', ')}`});
})

app.delete('/:table/:colonne/:id/', async (req, res) => {
    const tab = req.url.split('/');
    const tableName = tab[1];
    const colonne = tab[2];
    const value = tab[3];
    const table = bdd[tableName];
    if (Object.keys(table).includes(colonne)){
        const response = await DAO.deleteDAO(tableName, colonne, value);
        if(response === "1") res.status(200).send({message: "Row(s) deleted successfully"});
        else res.status(409).send({message: "An error occured, please check your request and try again"});
    } else res.status(400).send({message: `It seems that your column for the WHERE condition does not exist, here are the existing columns: ${Object.keys(table).join(', ')}`});
})

app.listen(port, () => {
    console.log('Le serveur écoute sur le port '+port);
});

app.put('/destroy', async (req, res) => {
    await DAO.close();
    await DAO.clean(pathToDb);
    res.send("done")
})

app.put('/build', async (req, res) => {
    await DAO.verifyFile(pathToDb);
    res.send("done")
})

/*
CREATE - POST - INSERT
READ - GET - SELECT
UPDATE - PUT - UPDATE
DELETE - DELETE - DELETE
*/