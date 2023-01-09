const DAO = require('../dao/DAO');

class ArticlesDAO extends DAO {
    
    tableName = "articles";

    constructor(db){
        super(db);
    }
    
    select(){
        return this.selectDAO(this.constructor.name);
    }

    insert(name = null, size = null, price = null, origin = null){
        this.db.run('INSERT INTO articles (name, size, price, origin) VALUES (?, ?, ?, ?)', [name, size, price, origin]);
    }

    update(){

    }

    delete(){

    }

}

module.exports = ArticlesDAO;
