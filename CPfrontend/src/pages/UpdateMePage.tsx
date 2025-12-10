import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/auth";

interface UserOut {
  id: number;
  email: string;
  display_name: string;
}

type Tab = "profile" | "password" | "delete";

export default function UpdateMePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Fetch user
  const { data: user, isLoading } = useQuery<UserOut>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/me");
      return res.data;
    },
    retry: false,
  });

  // Profile state (initialized from user)
  const [email, setEmail] = useState(user?.email || "");
  const [displayName, setDisplayName] = useState(user?.display_name || "");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("");

  // Messages
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ===== Mutations =====
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { email?: string; display_name?: string }) => {
      const res = await api.put("/me", updates);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data);
      setSuccess("Profile updated successfully!");
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Error updating profile");
      setSuccess(null);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put("/me/password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      setSuccess("Password updated successfully!");
      setError(null);
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Error changing password");
      setSuccess(null);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete("/me", { data: { password: deletePassword } });
      return res.data;
    },
    onSuccess: () => {
      alert("Account deleted successfully!");
      window.location.href = "/login";
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Error deleting account");
      setSuccess(null);
    },
  });

  if (isLoading) return <div>Loading user...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Account Management</h1>

      {/* Messages */}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        {["profile", "password", "delete"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ===== Profile Tab ===== */}
      {activeTab === "profile" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateProfileMutation.mutate({ email, display_name: displayName });
          }}
        >
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.status === "pending"}
            className={`w-full py-2 rounded text-white ${
              updateProfileMutation.status === "pending"
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {updateProfileMutation.status === "pending" ? "Updating..." : "Update Profile"}
          </button>
        </form>
      )}

      {/* ===== Password Tab ===== */}
      {activeTab === "password" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            changePasswordMutation.mutate();
          }}
        >
          <div className="mb-4">
            <label className="block mb-1 font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={changePasswordMutation.status === "pending"}
            className={`w-full py-2 rounded text-white ${
              changePasswordMutation.status === "pending"
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {changePasswordMutation.status === "pending" ? "Changing..." : "Change Password"}
          </button>
        </form>
      )}

      {/* ===== Delete Tab ===== */}
      {activeTab === "delete" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!window.confirm("Are you sure you want to delete your account?")) return;
            deleteAccountMutation.mutate();
          }}
        >
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-red-400"
            />
          </div>

          <button
            type="submit"
            disabled={deleteAccountMutation.status === "pending"}
            className={`w-full py-2 rounded text-white ${
              deleteAccountMutation.status === "pending"
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {deleteAccountMutation.status === "pending" ? "Deleting..." : "Delete Account"}
          </button>
        </form>
      )}
    </div>
  );
}
