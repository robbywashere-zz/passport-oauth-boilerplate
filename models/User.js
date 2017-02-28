const { STRING, INTEGER } = require('sequelize');

module.exports = {
  Name: 'User',
  Properties:{
    login: STRING,
    email: STRING,
    accessToken: STRING,
    refreshToken: STRING,
    oauthID: INTEGER
  },
  Associate(Models){
  },
  Hooks: {
    afterCreate(user){
      console.log(`>>> Creating new user: ${JSON.stringify(user)}`)
    }
  }
}
