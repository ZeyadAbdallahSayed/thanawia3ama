import React, { useEffect, useState } from "react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  // Load users on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("admin-users") || "[]");
    setUsers(stored);
  }, []);

  // Save updated users to localStorage
  const saveUsers = (newUsers) => {
    localStorage.setItem("admin-users", JSON.stringify(newUsers));
    setUsers(newUsers);
  };

  // Clear all users
  const clearUsers = () => {
    localStorage.removeItem("admin-users");
    setUsers([]);
    alert("✅ All users cleared!");
  };

  // Remove one user
  const removeUser = (id) => {
    const newUsers = users.filter((u) => u.id !== id);
    saveUsers(newUsers);
    alert(`🗑️ User with ID ${id} removed!`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">👑 Admin Users List</h1>

      <button
        onClick={clearUsers}
        className="mb-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
      >
        Clear All Users
      </button>

      {users.length === 0 ? (
        <p>No users yet.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="bg-gray-800 p-2 rounded flex justify-between items-center"
            >
              <div>
                <span className="mr-4">ID: {u.id}</span>
                <span>Name: {u.userName}</span>
              </div>
              <button
                onClick={() => removeUser(u.id)}
                className="px-2 py-1 bg-red-500 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUsers;
