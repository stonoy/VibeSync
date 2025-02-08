const Razorpay = require("razorpay");

const instance = new Razorpay({
    key_id: process.env.RP_KEY,
    key_secret: process.env.RP_SECRET,
  });


  module.exports = instance