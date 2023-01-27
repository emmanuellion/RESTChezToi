const DAO = require("./dao/DAO");
const fs = require('fs').promises;
const { faker } = require('@faker-js/faker');

const pathToDb = "src/mydatabase.db";

const bdd = {
    tables: ["articles", "clients"],
    'articles': {
        id: {
            sql: "INTEGER PRIMARY KEY",
            faker: faker.datatype.number()
        },
        name: {
            sql: "TEXT",
            faker: faker.commerce.productName()
        },
        size: {
            sql: "INTEGER",
            faker: faker.random.numeric(4)
        },
        price: {
            sql: "INTEGER",
            faker: faker.random.numeric(4)
        },
        origin: {
            sql: "TEXT",
            faker: faker.address.country()
        }
    },
    'clients': {
        id: {
            sql: "INTEGER PRIMARY KEY",
            faker: faker.datatype.number()
        },
        name: {
            sql: "TEXT",
            faker: faker.name.firstName()
        },
        email: {
            sql: "TEXT",
            faker: faker.internet.email()
        },
        phone: {
            sql: "TEXT",
            faker: faker.phone.number()
        },
        address: {
            sql: "TEXT",
            faker: faker.address.streetAddress()
        }
    }
}

DAO.bdd = bdd;

(async () => {
    await DAO.clean(pathToDb);
    await DAO.connect(pathToDb);
    // await sleep(3000);
    // await DAO.close();
    // await sleep(3000);
    // await DAO.connect(pathToDb);

    console.log("====================");

    DAO.getDb().serialize(async () => {
        // await fake(DAO.getDb(), "articles")
    });
})();

async function fake(db, who){
    const keys = Object.keys(bdd[who]).join(',');
    const placeholders = Object.values(bdd[who]).map((_, i) => `$${i + 1}`).join(',');
    for(let i = 0; i < 5; i++){
        try {
            const values = Object.values(bdd[who]).map(prop => prop.faker);
            console.log(values)
            const sql = `INSERT INTO ${who} (${keys}) VALUES (${placeholders})`;
            const statement = await db.prepare(sql);
            await statement.run(values);
            console.log("Insertion ligne "+(i+1));
        } catch (err) {
            throw err;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
