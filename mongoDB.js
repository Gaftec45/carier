const mongoose = require('mongoose');
const users = require('./models/users');

mongoose.connect(process.env.MONGO_URI)
.then( ()=>{console.log(`Connected successfully 123`);})
.catch( ()=>{console.log(`error connecting to the mongoDB`);})

module.exports = mongoose;