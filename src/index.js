const articlesDAO = require('./articles/articlesDAO');

new articlesDAO("");

// Exécutez une requête SQL
// db.run('drop table clients')
// db.run('CREATE TABLE clients (id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT, address TEXT)');

// var data =  [
// 	{
//       "id": 1,
//       "name": "Oliver Delacruz",
//       "email": "sit.amet.massa@google.edu",
//       "phone": "(499) 301-5874",
//       "address": "817-831 Consequat Ave"
//     },
//     {
//       "id": 2,
//       "name": "Elijah Bentley",
//       "email": "ac.ipsum@icloud.org",
//       "phone": "1-267-313-8180",
//       "address": "P.O. Box 960, 1114 Elit Rd."
//     },
//     {
//       "id": 3,
//       "name": "Zoe Ferrell",
//       "email": "maecenas.libero@aol.com",
//       "phone": "(877) 783-7219",
//       "address": "150-7122 Ultricies Rd."
//     },
//     {
//       "id": 4,
//       "name": "Wynter Carney",
//       "email": "nonummy.ut.molestie@yahoo.edu",
//       "phone": "1-625-179-0611",
//       "address": "163-2861 In St."
//     },
//     {
//       "id": 5,
//       "name": "Ishmael Woodward",
//       "email": "suspendisse.non@yahoo.com",
//       "phone": "1-736-483-3971",
//       "address": "453-9280 Magna Rd."
//     },
//     {
//       "id": 6,
//       "name": "Elijah Bentley",
//       "email": "ac.ipsum@icloud.org",
//       "phone": "1-267-313-8180",
//       "address": "P.O. Box 960, 1114 Elit Rd."
//     },
//     {
//       "id": 7,
//       "name": "Wynter Carney",
//       "email": "nonummy.ut.molestie@yahoo.edu",
//       "phone": "1-625-179-0611",
//       "address": "163-2861 In St."
//     },
//     {
//       "id": 8,
//       "name": "Oliver Delacruz",
//       "email": "sit.amet.massa@google.edu",
//       "phone": "(499) 301-5874",
//       "address": "817-831 Consequat Ave"
//     },
//     {
//       "id": 9,
//       "name": "Ishmael Woodward",
//       "email": "suspendisse.non@yahoo.com",
//       "phone": "1-736-483-3971",
//       "address": "453-9280 Magna Rd."
//     },
//     {
//       "id": 10,
//       "name": "Zoe Ferrell",
//       "email": "maecenas.libero@aol.com",
//       "phone": "(877) 783-7219",
//       "address": "150-7122 Ultricies Rd."
//     }
// ];

// data.forEach(el => {
//   db.run('INSERT INTO clients (name, email, phone, address) VALUES (?, ?, ?, ?)', [el.name, el.email, el.phone, el.address]);
// })


// Sélectionnez les données
// db.all('SELECT * FROM users', function(err, rows) {
//   console.log(rows);
// });

// Fermez la base de données
// db.close();

