const sqlite3 = require('sqlite3');

const DAO = require('../dao/DAO');

module.export = class articlesDAO extends DAO {
    
    constructors(db){
        try{
            this.db = new sqlite3.Database(db);
        } catch(e) {
            console.log(e)
        }
    }
}