import { io } from "socket.io-client";

const connectToSocket = (url) => {
  return io.connect(url);
};

const joinRoom = (socket, roomId, username, errorCallback) => {
  socket.emit("joinRoom", roomId, username, (response) => {
    if (!response.success) {
      errorCallback(response.error);
    }
  });
};


  

const updateCode = (socket, roomId, code) => {
  socket.emit("updateCode", roomId, code);
};

const onCodeUpdated = (socket, callback) => {
  socket.on("codeUpdated", (newCode) => {
    callback(newCode);
  });
};

const onConnectedUsersUpdated = (socket, callback) => {
  socket.on("connectedUsersUpdated", (users) => {
    callback(users);
  });
};

export {
  connectToSocket,
  joinRoom,
  
  updateCode,
  onCodeUpdated,
  onConnectedUsersUpdated,
};
