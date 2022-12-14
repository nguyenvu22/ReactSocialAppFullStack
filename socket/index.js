const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

//filter if 1 user is added twice
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId); //All socket Id is in be
};

const getUser = (userIdd) => {
  return users.find((user) => user.userId === userIdd);
};

io.on("connection", (socket) => {
  //-------------------------- Connect --------------------------
  console.log("1 User Connected.");
  socket.on("currentUserId", (userId) => {
    addUser(userId, socket.id);      //take userId (from fe) and socketId (socket ID from be)
    io.emit("onlineUsers", users);
  });
  //--------------------------------------------------------------

  //-----------------------Send And Get Msg-----------------------
  socket.on("sendMessage", ({ receiverId, text }) => {
    const {userId, socketId} = getUser(receiverId);
    io.to(socketId).emit("sentMessage", text)
    // io.emit("sentMessage", text)
  });
  //--------------------------------------------------------------

  //------------------------- Disconnect -------------------------
  socket.on("disconnect", () => {
    console.log("1 User Has Disconnected !!");
    removeUser(socket.id);
    io.emit("onlineUsers", users);
  });
  //--------------------------------------------------------------
  console.log(users)
});
