import React from "react";

const UserList = ({ connectedUsers }) => (
  <div className="flex flex-col p-4">
    <h2 className="text-lg font-semibold mb-2">Connected Users</h2>
    <ul className="divide-y divide-gray-200">
      {connectedUsers.map((user) => (
        <li key={user.id} className="py-2">
          <div className="flex items-center">
            <span className="bg-blue-500 text-white font-semibold rounded-full h-6 w-6 flex items-center justify-center mr-2">
              {user.username[0]}
            </span>
            <span>{user.username}</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default UserList;
