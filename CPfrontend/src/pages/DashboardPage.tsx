import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser, api } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useQuery({ 
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  const [message, setMessage] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    // If not logged in, redirect to login
    navigate("/login");
    return null;
  }

  // Optional logout function
  const handleLogout = async () => {
    try {
      await api.post("/logout"); // create this endpoint in backend to delete cookie
      setMessage("Logged out successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch {
      setMessage("Logout failed, try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg mb-6">Welcome back, {user.display_name} 👋</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded bg-blue-50">
            <h2 className="font-semibold mb-2">Profile</h2>
            <p>Email: {user.email}</p>
            <p>Display Name: {user.display_name}</p>
            <p>Verified: {user.is_verified ? "✅" : "❌"}</p>
          </div>

          <div className="p-4 border rounded bg-green-50 flex flex-col justify-between">
            <h2 className="font-semibold mb-2">Actions</h2>
            <button
              onClick={() => navigate("/me/update")}
              className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
}
