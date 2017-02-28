const DB = require('./db')
require('./models')
DB.sync().then(function(){
  require('./server.js')
})
