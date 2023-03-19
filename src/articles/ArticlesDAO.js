const DAO = require('../dao/DAO');

class ArticlesDAO extends DAO {
    
    static async select(){
        return await this.selectDAO("ArticlesDAO");
    }

    static async insert(name = null, size = null, price = null, origin = null){
        try {
            await this.db.run('INSERT INTO articles (name, size, price, origin) VALUES (?, ?, ?, ?)', [name, size, price, origin]);
        } catch (err) {
            throw err;
        }
    }

    /*
    const conditions = [
        {
            col: "nomColonne1",
            val: "testValue1"
        },
        {
            col: "nomColonne2",
            val: "testValue2"
        }
    ]
     */

   static async update(colonne, value, conditions){
        try {
            let str = "";
            if(conditions.length > 0){
                str = " WHERE ";
                conditions.forEach(el => {
                    str += el.col+" = "+el.val+" and ";
                });
                str = str.slice(0, str.length-5);
                console.log(str);
            }
            await this.db.run("UPDATE articles SET "+colonne+" = "+value+str);
        } catch (err) {
            throw err;
        }
    }

    static async delete(conditions){
        if(conditions.length > 0){
            try {
                let str = "";
                if(conditions.length > 0){
                    conditions.forEach(el => {
                        str += el.col+" = "+el.val+" and ";
                    });
                    str = str.slice(0, str.length-5);
                    console.log(str);
                }
                await this.db.run("DELETE FROM articles WHERE "+str);
            } catch (err) {
                throw err;
            }
        } else {
            throw "Au moins 1 condition pour la suppression de données";
        }

    }
}

module.exports = ArticlesDAO;
