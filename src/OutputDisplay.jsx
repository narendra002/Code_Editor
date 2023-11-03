import React from "react";

const OutputDisplay = ({ output }) => (
  <div className="output-container bg-gray-900  text-white p-4  rounded-lg border-2 border-light-blue-500 shadow-xl">
    <h2 className="text-xl font-bold mb-2 text-light-blue-500">Output:</h2>
    <div className="terminal-output max-h-40 overflow-y-auto text-gray-300 font-mono">
      <pre className="text-gray-300">{output}</pre>
    </div>
  </div>
);

export default OutputDisplay;
