import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import "./RandomRoom.css";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RandomRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [code, setCode] = useState("//Write Code");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript"); // Default language
  const [output, setOutput] = useState(""); // Output of executed code
  const roomId = new URLSearchParams(location.search).get("roomId");
  const username = new URLSearchParams(location.search).get("username");

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // const newSocket = io("https://editor-server-seven.vercel.app/");
    
     const  newSocket= io.connect('https://editor-server-seven.vercel.app/');
    setSocket(newSocket);

    newSocket.emit("joinRoom", roomId, username, (response) => {
      if (!response.success) {
        console.error("Failed to join room:", response.error);
        navigate("/");
      }
    });

    newSocket.on("codeUpdated", (newCode) => {
      setCode(newCode);
    });

    newSocket.on("connectedUsersUpdated", (users) => {
      setConnectedUsers(users);
    });

    return () => {
      newSocket.emit("leaveRoom", roomId, username);
      newSocket.disconnect();
    };
  }, [navigate, roomId, username]);

  const copyRoomIdToClipboard = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      // console.log("Room ID copied to clipboard:", roomId);
      toast.success('Room ID copied to clipboard');
    });
  };
  
  const onCodeChange = (value, viewUpdate) => {
    setCode(value);
    socket.emit("updateCode", roomId, value);
  };
  
  const leaveRoom = () => {
    socket.emit("leaveRoom", roomId, username);
    navigate("/");
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const getLanguageExtensions = () => {
    switch (selectedLanguage) {
      case "javascript":
        return [javascript({ jsx: true })];
      case "python":
        return [python()];
      case "java":
        return [java()];
      default:
        return [];
    }
  };

  const runCode = () => {
    try {
      const result = eval(code);
      if (result !== undefined) {
        setOutput(result.toString());
      } else {
        setOutput("Code executed successfully.");
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };
  

  return (
    <div className="container">
      <div className="left-container">
        <h1 className="heading">Connected Users</h1>
        <div className="user-list">
          {connectedUsers.map((user) => (
            <div key={user.id} className="username">
              {user.username}
            </div>
          ))}
        </div>
        <div className="buttons-container">
          <button className="button" onClick={copyRoomIdToClipboard}>
            Copy Room Id
          </button>
          <button className="button" onClick={leaveRoom}>
            Leave Room
          </button>
        </div>
       
      </div>

      <div className="right-container">
        <div className="language-select-container">
          <select
            onChange={handleLanguageChange}
            value={selectedLanguage}
            className="language-select"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button className="button" onClick={runCode}>
            Run
          </button>
        </div>
        <CodeMirror
          value={code}
          defaultValue={code}
          height="500px"
          width="100%"
          extensions={[...getLanguageExtensions()]}
          onChange={onCodeChange}
        />
        <div className="output-container">
          <h2>Output:</h2>
          <pre>{output}</pre>
        </div>
      </div>
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
};

export default RandomRoom;
