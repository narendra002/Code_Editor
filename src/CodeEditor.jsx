// CodeEditor.js
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

const CodeEditor = ({ code, selectedLanguage, onCodeChange, runCode, onLanguageChange }) => {
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

  return (
    <div>
      <div className="flex justify-between items-center">
        <select
          className="p-2 rounded-md shadow-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedLanguage}
          onChange={(event) => onLanguageChange(event)} // Pass the event object
        >
          <option
            className="text-gray-700 py-4 hover:bg-blue-100 hover-text-blue-500"
            value="javascript"
          >
            JavaScript
          </option>
          <option
            className="text-gray-700 py-4 hover:bg-blue-100 hover-text-blue-500"
            value="python"
          >
            Python
          </option>
          <option
            className="text-gray-700 hover:bg-blue-100 hover-text-blue-500"
            value="java"
          >
            Java
          </option>
        </select>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-2 px-4 rounded"
          onClick={runCode}
        >
          Run
        </button>
      </div>
      <CodeMirror
  value={code}
  defaultValue={code}
  height="500px"
  width="100%"
  theme="dark" // Set your desired theme
  
  

     extensions={getLanguageExtensions()}
  onChange={onCodeChange}
/>


    </div>
  );
};

export default CodeEditor;
