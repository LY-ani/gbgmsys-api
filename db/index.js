const mysql = require('mysql');
const { DB } = require('../config');

const db = mysql.createPool(DB);
module.exports = db;
