const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    text: {
      type: String,
    },
    attachment: [
      {
        type: String,
      },
    ],
    sender: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    receiver: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    conversation_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
