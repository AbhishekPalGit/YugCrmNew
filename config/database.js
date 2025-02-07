// module.exports = database;

//LOCAL DB Nilesh
const Sequelize = require('sequelize');
let dbhost, dbname, dbuser, dbpass = '';
dbhost = 'localhost';
dbname = 'YugCRM';
dbuser = 'root';
dbpass = '';
const sequelize = new Sequelize(dbname, dbuser, dbpass, {
  host: dbhost,
  port: 3306,
  dialect: 'mysql'
});
module.exports = sequelize;

//LOCAL DB ABhishek
// const Sequelize = require('sequelize');
// let dbhost, dbname, dbuser, dbpass = '';
// dbhost = 'localhost';
// dbname = 'YugCRM';
// dbuser = 'root';
// dbpass = 'Abhi@0930';
// const sequelize = new Sequelize(dbname, dbuser, dbpass, {
//   host: dbhost,
//   port: 3306,
//   dialect: 'mysql'
// });
// module.exports = sequelize;

//PROD DB
// const Sequelize = require('sequelize');
// let dbhost, dbname, dbuser, dbpass = '';
// dbhost = 'localhost';
// dbname = 'chacoxsv_YugCRM';
// dbuser = 'chacoxsv_YugParas';
// dbpass = 'p@r@s@yug';
// const sequelize = new Sequelize(dbname, dbuser, dbpass, {
//   host: dbhost,
//   port: 3306,
//   dialect: 'mysql'
// });
// module.exports = sequelize;