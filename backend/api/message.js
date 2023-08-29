// Messaging for freelancer and client
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Conversation = require("../models/ConversationModel");
const Message = require("../models/MessageModel");
const createError = require("../utils/createError");

const createMessage = async (req, res, next) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });
  try {
    const savedMessage = await newMessage.save();
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};

router.post("/", authMiddleware, createMessage);
router.get("/:id", authMiddleware, getMessages);

module.exports = router;