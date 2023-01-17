const DAO = require('../dao/DAO');

class ArticlesDAO extends DAO {

    constructor(db){
        super(db);
    }
    
    static select(){
        return this.selectDAO("ArticlesDAO");
    }

    static insert(name = null, size = null, price = null, origin = null){
        this.db.run('INSERT INTO articles (name, size, price, origin) VALUES (?, ?, ?, ?)', [name, size, price, origin]);
    }

    update(){

    }

    delete(){

    }
}

module.exports = ArticlesDAO;
