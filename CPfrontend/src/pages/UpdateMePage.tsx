import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";

interface UserOut {
  id: number;
  email: string;
  display_name: string;
  bio?: string | null;
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

  // ------- FORM STATE -------
  const [form, setForm] = useState<{
    email: string;
    display_name: string;
    bio: string;
  } | null>(null);

  // Sync form when user loads
  useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        display_name: user.display_name,
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Password + delete state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  // Messages
  const [error, setError] = useState<
    string | { msg: string; loc: string[] }[] | null
  >(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ========= MUTATIONS =========
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!form) return;
      const payload = {
        email: form.email,
        display_name: form.display_name,
        bio: form.bio || null,
      };
      const res = await api.put("/me", payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      setSuccess("Profile updated successfully!");
      setError(null);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    },
    onError: (err: any) => {
      const detail = err.response?.data?.detail;
      setError(detail || "Error updating profile");
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

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    },
    onError: (err: any) => {
      const detail = err.response?.data?.detail;
      setError(detail || "Error changing password");
      setSuccess(null);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete("/me", {
        data: { password: deletePassword },
      });
      return res.data;
    },
    onSuccess: () => {
      alert("Account deleted successfully!");
      window.location.href = "/login";
    },
    onError: (err: any) => {
      const detail = err.response?.data?.detail;
      setError(detail || "Error deleting account");
      setSuccess(null);
    },
  });

  if (isLoading || !form) {
    return <div className="p-6">Loading user...</div>;
  }

  // ======================= UI ==========================
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Account Management
        </h1>

        {/* ===== Errors ===== */}
        {error && (
          <div className="text-red-600 mb-4">
            {Array.isArray(error)
              ? error.map((e, i) => (
                  <div key={i}>
                    {e.msg} (field: {e.loc.join(".")})
                  </div>
                ))
              : error}
          </div>
        )}

        {/* ===== Success ===== */}
        {success && <div className="text-green-600 mb-4">{success}</div>}

        {/* ===== Tabs ===== */}
        <div className="flex mb-4 border-b">
          {(["profile", "password", "delete"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 font-medium ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ========= PROFILE ========= */}
        {activeTab === "profile" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfileMutation.mutate();
            }}
          >
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f!, email: e.target.value }))
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Display Name</label>
              <input
                type="text"
                value={form.display_name}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f!,
                    display_name: e.target.value,
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) =>
                  setForm((f) => ({ ...f!, bio: e.target.value }))
                }
                rows={4}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className={`w-full py-2 rounded text-white ${
                updateProfileMutation.isPending
                  ? "bg-blue-300"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {updateProfileMutation.isPending
                ? "Updating..."
                : "Update Profile"}
            </button>
          </form>
        )}

        {/* ========= PASSWORD ========= */}
        {activeTab === "password" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changePasswordMutation.mutate();
            }}
          >
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className={`w-full py-2 rounded text-white ${
                changePasswordMutation.isPending
                  ? "bg-blue-300"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {changePasswordMutation.isPending
                ? "Changing..."
                : "Change Password"}
            </button>
          </form>
        )}

        {/* ========= DELETE ========= */}
        {activeTab === "delete" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                !window.confirm(
                  "Are you sure you want to delete your account?"
                )
              )
                return;
              deleteAccountMutation.mutate();
            }}
          >
            <div className="mb-4">
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={deleteAccountMutation.isPending}
              className={`w-full py-2 rounded text-white ${
                deleteAccountMutation.isPending
                  ? "bg-red-300"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {deleteAccountMutation.isPending
                ? "Deleting..."
                : "Delete Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
