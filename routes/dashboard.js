const express = require('express');
const passport = require('../passport/passConfig');
const { checkAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/dashboard', checkAuthenticated, (req, res) => {
  res.render('dashboard');
});

router.get('/order', (req, res)=>{
  res.render('orderdash');
})  

module.exports = router;
