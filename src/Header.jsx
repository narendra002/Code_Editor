import React from "react";

const Header = ({ roomId, copyRoomIdToClipboard, leaveRoom }) => (
  <div className="flex flex-col md:flex-row justify-between items-center px-4 py-2 md:px-6 md:py-4">
    <h1 className="text-2xl font-semibold mb-2 md:mb-0">CodeConnect</h1>
    <div className="flex space-x-2">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        onClick={copyRoomIdToClipboard}
      >
        Copy Room Id
      </button>
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        onClick={leaveRoom}
      >
        Leave Room
      </button>
    </div>
  </div>
);

export default Header;
