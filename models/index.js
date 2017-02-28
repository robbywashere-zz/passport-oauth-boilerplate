const _ = require('lodash')
const DB = require('../db')
let MODELS = {}
let ASSOCS = {}
require('fs')
  .readdirSync(__dirname)
  .filter(file=>!/^\.|^_|index.js/.test(file))
  .forEach((file)=>{
    let model = require(`./${file}`) 

    if (model.Associate) ASSOCS[model.Name] = model.Associate  

    MODELS[model.Name] = DB
      .define(model.Name,model.Properties, { hooks: model.Hooks })
  })
Object.keys(MODELS).forEach( name => { 
  ASSOCS[name].bind(MODELS[name])(MODELS) 
})



module.exports = MODELS;

