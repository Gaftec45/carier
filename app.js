const express = require('express');
const app = express();
const PORT = 3000;

//  view engine
app.set('view engine', 'ejs');



const accRouter = require('./routes/account');
const userRouter = require('./routes/dashboard');

app.use(express.static('public'))
app.use('/account', accRouter)
app.use('/user', userRouter)

// Routes
app.get('/', (req, res)=>{
    res.render('index');
})

app.listen(PORT, ()=>{console.log(`server is runing on ${PORT}`);})