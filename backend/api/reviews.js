const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const createError = require("../utils/createError");
const Gig = require("../models/GigModel");
const Review = require("../models/ReviewModel");

const createReview = async (req, res, next) => {
  console.log(req.userId);
  if (req.isSeller)
    return next(createError(403, "Sellers can't create a review!"));

  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });

    if (review)
      return next(
        createError(403, "You have already created a review for this gig!")
      );

    //TODO: check if the user purchased the gig.

    const savedReview = await newReview.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

router.post("/", authMiddleware, createReview )
router.get("/:gigId", getReviews )
router.delete("/:id", deleteReview)

module.exports = router;