const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const bdd = require("../db");

class DAO {

    static bdd = null;

    static db = null;

    static fileName = "";

    //verified
    static async connect() {
        this.db = new sqlite3.Database(this.fileName, (err) => {
            if (err)
                throw err.message;
            console.log("Connexion établie !")
        });
    }

    //verified
    static async verifyFile(_filename) {
        this.fileName = _filename;
        let error = false;
        try {
            await fs.promises.access(this.fileName, fs.constants.F_OK);
        } catch (err) {
            error = true;
            await fs.promises.writeFile(this.fileName, '');
        }
        await this.connect();
        if(error){
            console.log(`Le fichier ${this.fileName} vient d'être crée`);
            await this.build();
        } else
            await this.checkUp();
    }

    //verified
    static checkConnection() {
        let nbErr = 0;
        this.bdd.tables.forEach(async table => {
            try {
                await this.db.all(`SELECT * FROM ${table}`);
            } catch (err) {
                nbErr++;
            }
        });
        return nbErr === 0 ? 0 : -1;
    }

    //verified
    static async checkUp() {
        try {
            if (this.checkConnection() === -1) {
                console.log("La base de données n'existe pas, elle va donc être construire");
                await this.build();
            } else {
                console.log("Vérification de l'intégrité des classes ...");
                for (const table of this.bdd.tables) {
                    if (!(await this.checkTable(table))) {
                        await this.createTable(table);
                    } else {
                        console.log(`${table} checked`);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    // verified
    static async build() {
        await this.connect(this.fileName);
        this.bdd.tables.forEach(table => {
            this.createTable(table);
        });
    }

    //verified
    static async createTable(name) {
        console.log("Création de la table " + name);
        let str = 'CREATE TABLE ' + name + ' (';
        Object.keys(this.bdd[name]).forEach(prop => {
            str += prop + ' ' + this.bdd[name][prop].sql + ', ';
        });
        str = str.slice(0, str.length - 2);
        str += ')';
        try {
            await this.db.run(str);
            console.log(`La table ${name} a bien été crée`);
        } catch (err) {
            throw err;
        }
    }

    static async dropTable(name) {
        try {
            await this.db.run(`DROP TABLE IF EXISTS ${name}`);
            console.log(`La table ${name} a été supprimée avec succès`);
        } catch (err) {
            throw err;
        }
    }

    //verified
    static async checkTable(name) {
        return await this.db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='" + name + "'");
    }

    //verified
    static async close() {
        try {
            await this.db.close();
            this.db = null;
            console.log("Closed the database connection");
        } catch (err) {
            throw err.message;
        }

    }

    //verified
    static async selectDAO(name, query) {
        return new Promise((resolve, reject) => {
            let rows = [];
            let sql = `SELECT * FROM ${name}`;
            if(Object.keys(query).length >= 1) {
                sql += " WHERE ";
                Object.keys(query).forEach(el => {
                    if(this.bdd[name][el].sql.includes("TEXT"))
                        sql += `${el} = '${query[el]}' and`;
                    else
                        sql += `${el} = ${query[el]} and`;
                })
                sql = sql.substring(0, sql.length-4);
            }
            this.db.each(sql, (err, row) => {
                if (err) reject(err);
                else rows.push(row);
            }, (err) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async insertDAO(name, query){
        return new Promise((resolve, reject) => {
            const keys = Object.keys(query).join(',');
            const placeholders = Object.values(query).map((_) => `?`).join(',');
            let values = [];
            Object.keys(query).forEach(el => {
                if (bdd[name][el].sql.includes("TEXT")) values.push(query[el]);
                else values.push(parseFloat(query[el]));
            })
            const sql = `INSERT INTO ${name} (${keys}) VALUES (${placeholders})`;
            this.db.run(sql, values, (err) => {
                if (err) reject(err);
                else resolve("1");
            }, (err) => {
                if (err) reject(err);
                else resolve("1");
            });
        });
    }

    //verified
    static getDb(){
        return this.db;
    }

    static async clean(path = "./"){
        await fs.unlink(path, (err) => {
            if (!err)
                console.log("Fichier supprimé");
        })
    }
}

module.exports = DAO;
