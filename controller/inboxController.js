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
  
}

module.exports = {
  getInbox,
};
