const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

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

    static connect(db) {
        const filePath = path.join(__dirname, db);
        this.verifyFile(filePath);
        this.db = new sqlite3.Database(filePath, (err) => {
            if (err)
                throw err.message;
        });
    }

    static verifyFile(filePath) {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                fs.writeFile(filePath, '', (err) => {
                    if (err)
                        throw err;
                    console.log("Le fichier "+db+" vient d'être crée");
                });
            }
        });
    }

    static checkConnection() {
        let nbErr = 0;
        this.bdd.tables.forEach(async table => {
            try {
                await this.db.all('SELECT * FROM ' + table, []);
            } catch (err) {
               nbErr++;
            }
        });
        return nbErr < this.bdd.tables.length ? 0 : -1;
    }

    static checkUp() {
        console.log(this.getDb().filename)
        console.log(this.checkConnection())
        if (this.checkConnection() === -1) {
            console.log("La base de données n'existe pas, elle va donc être construire");
            this.build();
        } else {
            console.log("Vérification de l'intégrité des classes ...");
            this.bdd.tables.forEach(table => {
                this.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='" + table + "'", (err, row) => {
                    if (err) {
                        console.log(err)
                        this.createTable(table);
                    }
                    if (row) {
                        console.log(row)
                        console.log(table + " checked");
                    }else {
                        this.createTable(table);
                    }
                });
            });
        }
    }

    static build() {
        const filename = "mydatabase.db";
        fs.writeFile(filename, "", (err) => {
            if (err)
                throw err;
        });
        console.log("src/"+filename)
        this.connect("src/"+filename);
        this.bdd.tables.forEach(table => {
            this.createTable(table);
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
        console.log("caca")
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
