const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const User = require('../models/users');
const { checkAuthenticated } = require('../middleware/authMiddleware');

router.get('/create-order', checkAuthenticated, (req, res)=>{
    res.render('create-order')
})
// Route to create a new order
router.post('/create-order', checkAuthenticated, async (req, res) => {
  try {
    const { senderName, receiverName, destination, pickupStation, packageDetails, status} = req.body;
    const userId = req.user._id;

    const order = new Order({ user: userId, senderName, receiverName, destination, pickupStation, packageDetails, status });
    await order.save();

    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    res.redirect('/user/dashboard');
  } catch (error) {
    console.error(error);
    res.render('404');
  }
});

router.get('/orders', async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId });
        res.render('orderdash', { orders });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/orders/:orderId', checkAuthenticated, async (req, res) => {
  try {
      const orderId = req.params.orderId;
      const order = await Order.findById(orderId);

      res.render('update-order', { order });
  } catch (error) {
      console.error('Error rendering update-order view:', error);
      res.status(500).send('Internal Server Error');
  }
});

  // Update order route
  router.post('/edit-orders/:orderId', checkAuthenticated, async (req, res)=>{
    const orderId = req.params.orderId;
    try{
        //fetch order and update 
        const updateOrder = await Order.findByIdAndUpdate(orderId, {
            senderName: req.body.senderName, 
            receiverName: req.body.receiverName, 
            destination: req.body.destination,
            pickupStation: req.body.pickupStation,
            packageDetails: req.body.packageDetails,
        }, {new: true});

        if (updateOrder){
            res.redirect('/user/dashboard');
        } else {
            res.status(404).json({message: 'Order Not Found'});
        }
    }
    catch(error){
        console.error('Error updating Order: ', )
    }
})
  
  router.delete('/orders/:orderId', async (req, res) => {
      const orderId = req.params.orderId;

      try {
          // Implement logic to delete the order by ID from the database
          const deletedOrder = await Order.findByIdAndDelete(orderId);
  
          if (deletedOrder) {
              res.status(200).json({ message: 'Order successfully canceled.' });
          } else {
              res.status(404).json({ message: 'Order not found.'});
          }
      } catch (error) {
          console.error('Error canceling order:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      }
  }); 
 
module.exports = router; 