/**
 * UpdateMePage.tsx
 *
 * Page for users to manage their account settings.
 * 
 * Features:
 * - Update profile info (email, display name, bio)
 * - Change password
 * - Delete account
 * 
 * Uses React Query for data fetching/mutations, TailwindCSS for styling,
 * and a tab interface for switching between actions.
 */
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";

import Card from "../components/Card";
import Button from "../components/button";

/**
 * Type definition for the current user.
 */
interface UserOut {
  id: number;
  email: string;
  display_name: string;
  bio?: string | null;
}

/** Tabs available on the settings page */
type Tab = "profile" | "password" | "delete";

/**
 * UpdateMePage Component
 *
 * Handles user account updates: profile info, password, and account deletion.
 * 
 * @returns JSX.Element
 */
export default function UpdateMePage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  /** Fetch current user data */
  const { data: user, isLoading } = useQuery<UserOut>({
    queryKey: ["me"],
    queryFn: async () => (await api.get("/me")).data,
    retry: false,
  });

  /** Form state for profile updates */
  const [form, setForm] = useState<{
    email: string;
    display_name: string;
    bio: string;
  } | null>(null);

  /** Sync fetched user data into form state */
  useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        display_name: user.display_name,
        bio: user.bio || "",
      });
    }
  }, [user]);

  /** Password state for password change and deletion */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  /** UI feedback */
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ================= MUTATIONS =================

  /** Update profile info mutation */
  const updateProfileMutation = useMutation({
    mutationFn: async () =>
      api.put("/me", {
        email: form!.email,
        display_name: form!.display_name,
        bio: form!.bio || null,
      }),
    onSuccess: (res) => {
      queryClient.setQueryData(["currentUser"], res.data);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setSuccess("Profile updated successfully");
      setError(null);
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Update failed");
      setSuccess(null);
    },
  });

  /** Change password mutation */
  const changePasswordMutation = useMutation({
    mutationFn: async () =>
      api.put("/me/password", {
        current_password: currentPassword,
        new_password: newPassword,
      }),
    onSuccess: () => {
      setSuccess("Password updated successfully");
      setError(null);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Password change failed");
      setSuccess(null);
    },
  });

  /** Delete account mutation */
  const deleteAccountMutation = useMutation({
    mutationFn: async () =>
      api.delete("/me", { data: { password: deletePassword } }),
    onSuccess: () => {
      window.location.href = "/login";
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || "Delete failed");
      setSuccess(null);
    },
  });

  if (isLoading || !form) {
    return <p className="p-6 text-white">Loading…</p>;
  }

  // ================= UI =================

  return (
    <div className="flex justify-center py-20">
      <Card className="w-full max-w-md p-6 bg-gray-900 border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Account settings
        </h1>

        {/* MESSAGES */}
        {error && (
          <p className="mb-4 text-sm text-red-500">
            {Array.isArray(error)
              ? error.map((e, i) => <div key={i}>{e.msg}</div>)
              : error}
          </p>
        )}

        {success && (
          <p className="mb-4 text-sm text-green-500">{success}</p>
        )}

        {/* TABS */}
        <div className="flex mb-6 border-b border-gray-800">
          {(["profile", "password", "delete"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "text-red-500 border-b-2 border-red-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* PROFILE */}
        {activeTab === "profile" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfileMutation.mutate();
            }}
            className="space-y-4"
          >
            <input
              className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f!, email: e.target.value }))
              }
              placeholder="Email"
            />

            <input
              className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              value={form.display_name}
              onChange={(e) =>
                setForm((f) => ({ ...f!, display_name: e.target.value }))
              }
              placeholder="Display name"
            />

            <textarea
              rows={4}
              className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              value={form.bio}
              onChange={(e) =>
                setForm((f) => ({ ...f!, bio: e.target.value }))
              }
              placeholder="Bio"
            />

            <Button type="submit" variant="secondary" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? "Updating…" : "Update profile"}
            </Button>
          </form>
        )}

        {/* PASSWORD */}
        {activeTab === "password" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              changePasswordMutation.mutate();
            }}
            className="space-y-4"
          >
            <input
              type="password"
              className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <input
              type="password"
              className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Button type="submit" variant="secondary" disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending
                ? "Changing…"
                : "Change password"}
            </Button>
          </form>
        )}

        {/* DELETE */}
        {activeTab === "delete" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!window.confirm("Delete your account permanently?")) return;
              deleteAccountMutation.mutate();
            }}
            className="space-y-4"
          >
            <input
              type="password"
              className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-white"
              placeholder="Confirm password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="secondary"
              className="text-red-600 hover:text-red-700"
              disabled={deleteAccountMutation.isPending}
            >
              {deleteAccountMutation.isPending
                ? "Deleting…"
                : "Delete account"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
