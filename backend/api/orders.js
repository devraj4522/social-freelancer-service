const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const createError = require("../utils/createError");
const Order = require("../models/OrderModel");
const Gig = require("../models/GigModel");
const Stripe = require("stripe")

const intent = async (req, res, next) => {
  try{
  await console.log("intent");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const gig = await Gig.findById(req.params.id);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: gig.price * process.env.CURRENCY_MULTIPLIER,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const newOrder = new Order({
    gigId: gig._id,
    img: gig.cover,
    title: gig.title,
    buyerId: req.userId,
    sellerId: gig.userId,
    price: gig.price,
    payment_intent: paymentIntent.id,
  });

  await newOrder.save();

  res.status(200).send({
    clientSecret: paymentIntent.client_secret,
  });
  }catch(err){
    console.log("err", err);
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });
    res.status(200).send(orders);
  } catch (err) {
    console.log("err", err);
    next(err);
  }
};

const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};


// router.post("/:gigId", verifyToken, createOrder);
router.get("/", authMiddleware, getOrders);
router.post("/create-payment-intent/:id", authMiddleware, intent);
router.put("/", authMiddleware, confirm);

module.exports = router;
