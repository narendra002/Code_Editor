import React, { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import CodeEditor from "./CodeEditor";
import OutputDisplay from "./OutputDisplay";
import UserList from "./UserList";
import {
  connectToSocket,
  joinRoom,
  updateCode,
  onCodeUpdated,
  onConnectedUsersUpdated,
} from "./SocketManager.js";

const RandomRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [code, setCode] = useState("//Write Code");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const roomId = new URLSearchParams(location.search).get("roomId");
  const username = new URLSearchParams(location.search).get("username");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = connectToSocket("localhost:5000"); // Connect to the socket
    console.log("Socket initialized:", socket);
    setSocket(socket);

    joinRoom(socket, roomId, username, (error) => {
      console.error("Failed to join room:", error);
      navigate("/");
    });

    onCodeUpdated(socket, (newCode) => {
      setCode(newCode);
    });

    onConnectedUsersUpdated(socket, (users) => {
      setConnectedUsers(users);
    });

    return () => {
      leaveRoom(socket, roomId, username);
      socket.disconnect();
    };
  }, [navigate, roomId, username]);



  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      toast.success("Room ID copied to clipboard");
    });
  };

  const onCodeChange = (value, viewUpdate) => {
    setCode(value);
    socket.emit("updateCode", roomId, value);
  };

  const leaveRoom = () => {
    if (socket) {
      console.log("Socket exists. Emitting 'leaveRoom'");
      socket.emit("leaveRoom", roomId, username);
      navigate("/");
    } else {
      console.error("Socket is null. Connection may not be established.");
    }
  }
  

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };



  const runCode = () => {
    // Create a custom console to capture log messages
    const customConsole = {
      log: (message) => {
        // Append the message to the existing output
        setOutput((prevOutput) => prevOutput + message + '\n');
      },
    };

    try {
      // Create a function to run the code within the custom console context
      const execute = new Function('console', code);
      execute(customConsole);

      // Indicate that the code executed successfully
      setOutput((prevOutput) => prevOutput);
    } catch (error) {
      // Handle errors and display a user-friendly error message
      setOutput(`Error: ${error.message}`);
    }
  };




  return (
    <div className="bg-gray-200 min-h-screen p-4">
      <Header
        roomId={roomId}
        copyRoomIdToClipboard={copyRoomIdToClipboard}
        leaveRoom={leaveRoom}
      />
      <div className="flex flex-col md:flex-row items-start justify-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="bg-slate-100 shadow p-4 w-full md:w-1/4 mt-10">
          <UserList connectedUsers={connectedUsers} />
        </div>
        <div className="bg-slate-50 shadow p-4 w-full md:w-3/4">
          <CodeEditor
            code={code}
            selectedLanguage={selectedLanguage}
            onCodeChange={onCodeChange}
            runCode={runCode}
            onLanguageChange={handleLanguageChange}
          />
          <OutputDisplay output={output} />
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
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
};

export default RandomRoom;
