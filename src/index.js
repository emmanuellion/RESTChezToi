const DAO = require("./dao/DAO");
const bdd = require("./db");
const pathToDb = "src/mydatabase.db";

DAO.bdd = bdd;

(async () => {
    // await DAO.clean(pathToDb);
    // await DAO.connect(pathToDb);
    // await sleep(3000);
    // await DAO.close();
    // await sleep(3000);
    await DAO.verifyFile(pathToDb);

    console.log("====================");

    DAO.getDb().serialize(async () => {
        await fake(DAO.getDb(), "articles");
    });
})();

async function fake(db, who){
    const keys = Object.keys(bdd[who]).join(',');
    const placeholders = Object.values(bdd[who]).map((_) => `?`).join(',');
    for(let i = 0; i < 5; i++){
        try {
            let values = Object.values(bdd[who]).map(prop => prop.faker());
            console.log(values)
            const sql = `INSERT INTO ${who} (${keys}) VALUES (${placeholders})`;
            await db.run(sql, values, function(err) {
                if (err)
                    console.error(err.message);
                console.log("Insertion ligne "+(i+1));
            });
        } catch (err) {
            throw err;
        }
    }
}
