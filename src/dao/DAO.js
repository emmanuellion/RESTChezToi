const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

class DAO {

    static bdd = {
        tables: ["articles", "clients"],
        'articles': {
            id: "INTEGER PRIMARY KEY",
            name: "TEXT",
            size: "INTEGER",
            price: "INTEGER",
            origin: "TEXT"
        },
        'clients': {
            id: "INTEGER PRIMARY KEY",
            name: "TEXT",
            email: "TEXT",
            phone: "TEXT",
            address: "TEXT"
        }
    }

    static db = null;

    // static constructor(db) {
    //     this.connect(db);
    // }

    static connect(db) {
        this.db = new sqlite3.Database(db, (err) => {
            if (err)
                throw err.message;
            else
                console.log("Connexion établie");
        });
    }

    static checkConnection() {
        let pass = false;
        this.bdd.tables.forEach(table => {
            this.db.all('SELECT * FROM ' + table, [], (err) => {
                if (err === null)
                    pass = true;
            });
        });
        return pass ? 0 : -1;
    }

    static checkUp() {
        if (this.checkConnection() === -1) {
            console.log("La base de données n'existe pas, elle va donc être construire");
            this.build();
        } else {
            console.log("Vérification de l'intégrité des classes ...");
            this.bdd.tables.forEach(table => {
                this.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='" + table + "'", (err, row) => {
                    if (err)
                        throw err;
                    if (row)
                        console.log(`La table "${table}" existe`);
                    else {
                        this.createTable(table);
                    }
                });
            });
        }
    }

    static build() {
        fs.writeFile("tempDatabase.db", '', (err) => {
            if (err)
                throw err;
            else {
                this.db = this.connect("tempDatabase.db");
                this.bdd.tables.forEach(table => {
                    this.createTable(table);
                });
            }
        });

    }

    static createTable(name) {
        console.log("Création de la table " + name);
        let str = 'CREATE TABLE ' + name + ' (';
        Object.keys(this.bdd[name]).forEach(prop => {
            str += prop + ' ' + this.bdd[name][prop] + ', ';
        });
        str = str.slice(0, str.length - 2);
        str += ')';
        this.db.run(str, (err) => {
            if (err)
                throw err;
            else
                console.log("La table " + name + " a bien été crée");
        });
    }

    static dropTable(name) {
        this.db.run('DROP TABLE IF EXISTS ' + name, (err) => {
            if (err)
                throw err;
            else
                console.log('La table a été supprimée avec succès');
        });
    }

    static close() {
        this.db.close((err) => {
            if (err)
                throw err.message;
            throw "Closed the database connection";
        });
    }

    static async selectDAO(name) {
        return await new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM " + (name.includes("Articles") ? "articles" : "clients"), [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static getDb(){
        return this.db;
    }
}

module.exports = DAO;
