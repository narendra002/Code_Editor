import React, { useState, useEffect } from "react";
import "./Room.css";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Room = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const navigate = useNavigate();
  const socket = io.connect('https://code-editor-server.vercel.app/');

  useEffect(() => {
    // Component did mount
    socket.on("connect", () => {
      console.log("Connected ",socket.id); // x8WIv7-mJelg7on_ALbx
    });
    

    socket.on("disconnect", () => {
      console.log("Disconnected from the server via WebSocket");
    });

    // Clean up the socket on component unmount
    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connectedUsersUpdated');
    };
  }, [socket]);

  useEffect(() => {
    // Listen for the 'connectedUsersUpdated' event and update the list of users
    socket.on('connectedUsersUpdated', (users) => {
      setConnectedUsers(users);
    });
  }, [socket]);

  const handleGenerator = () => {
    const uuid = uuidv4();
    setRoomId(uuid);
    toast.success(`Room id ${uuid}`);
  };

  const submitHandle = (e) => {
    e.preventDefault();
    if (!roomId || !username) {
      return;
    }

    socket.emit('joinRoom', roomId, username, (response) => {
      // Callback to handle join success or failure
      if (response.success) {
        console.log("Joined room successfully");
        // You can show a notification to the user here
        navigate(`/random-room-code?roomId=${roomId}&username=${username}`);
      } else {
        console.error("Failed to join room:", response.error);
        // You can show an error message to the user here
      }
    });
  };
  const handleBeforeUnload = () => {
    if (roomId && username) {
      const socket = io.connect('https://code-editor-server.vercel.app/');
      socket.emit('leaveRoom', roomId, username);
      socket.disconnect();
    }
  };

  // Add the event listener for beforeunload on component mount
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId, username]);

  return (
    <div >
      <form className="form" onSubmit={submitHandle}>
        <label htmlFor="roomId">Paste Your Invitation code down below</label>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          
          placeholder="Enter Room ID"
        />
        <input
          type="text"
          placeholder="Enter Guest Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Join</button>
        <br/>
        <br/>
        <label>Don't have an invite code? Create your </label>
      
        <a onClick={handleGenerator}>Own Room</a>
      </form>
      <ToastContainer
      position="bottom-right"
      autoClose={3000} // Automatically close after 3 seconds
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
    </div>
  );
}
export default Room;
