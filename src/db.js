const { faker } = require('@faker-js/faker');

module.exports = {
  tables: ["articles", "clients"],
  articles: {
    id: {
      sql: "INTEGER PRIMARY KEY",
      faker: () => faker.datatype.number()
    },
    name: {
      sql: "TEXT",
      faker: () => faker.commerce.productName()
    },
    size: {
      sql: "INTEGER",
      faker: () => faker.random.numeric(4)
    },
    price: {
      sql: "INTEGER",
      faker: () => faker.random.numeric(4)
    },
    origin: {
      sql: "TEXT",
      faker: () => faker.address.country()
    }
  },
  clients: {
    id: {
      sql: "INTEGER PRIMARY KEY",
      faker: () => faker.datatype.number()
    },
    name: {
      sql: "TEXT",
      faker: () => faker.name.firstName()
    },
    email: {
      sql: "TEXT",
      faker: () => faker.internet.email()
    },
    phone: {
      sql: "TEXT",
      faker: () => faker.phone.number()
    },
    address: {
      sql: "TEXT",
      faker: () => faker.address.streetAddress()
    }
  }
};