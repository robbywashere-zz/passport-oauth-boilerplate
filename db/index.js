var Sequelize = require("sequelize");
var path      = require('path');
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config'))[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);

module.exports = sequelize
