
//internal imports
const User = require("../models/People");
const Conversation = require("../models/Conversation");
const escape = require("../utilities/escape");

//get login page
function getInbox(req, res, next) {
    try{
      const conversations = await Conversation.find({
        $or:[
          {"creator.id": req.user.userid},
          {"participant.id": req.user.userid},
        ],
      });
      res.locals.data = conversations;
      res.render("inbox");
  } catch (err) {
    next(err);
  }
  // search user 
  async function searchUser(req, res, next){
    const user =  req.body.user;
    const searchQuery = user.replace("+88", "");

    const nameSearchRegex = new RegExp(escape(searchQuery), "i");
    const mobileSearchRegex = new RegExp("^"+ escape("+88" + searchQuery));
    const emailSearchRegex = new RegExp("^"+ escape(searchQuery + "$", "i"));

    try {
      if(searchQuery !== ""){
        const users = await User.find(
          {
            $or:[
              {
                name:nameSearchRegex,
              },
              {
                mobile:mobileSearchRegex,
              },
              {
                email:emailSearchRegex,
              },
            ],
          },
          "name avatar"
        );
        res.json(users)
      }else{
        throw createHttpError("You must provide some text to search!");
      }
    } catch (err) {
      res.status(500).json({
        errors:{
          common:{
            msg:err.message,
          },
        },
      });
    }
  }
  
  //add conversation
  async function addConversation(req, res, next){
    try {
      const newConversation = new Conversation({
        creator:{
          id:req.user.userid,
          name: req.user.username,
          avatar:req.user.avatar || null,
        },
        participant:{
          name: req.body.participant,
          id:req.body.id,
          avatar: req.body.avatar || null,
        },
      });
      const result = await newConversation.save();
      res.status(200).json({
        message: "Conversation was  added successfully!",
      });
    } catch (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  }

  // get messages of a conversation
async function getMessages(req, res, next) {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
    });
  }
}

}

module.exports = {
  getInbox,
};
