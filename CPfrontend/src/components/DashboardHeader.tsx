// src/components/DashboardHeader.tsx
interface DashboardHeaderProps {
  displayName: string;
}

export default function DashboardHeader({ displayName }: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-6 mb-6 shadow-md">
      {/* Accent gradient bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
        Dashboard
      </h1>

      <p className="mt-2 text-lg text-gray-700">
        Welcome back, <span className="font-semibold">{displayName}</span> 👋
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <span className="text-indigo-500">👤</span>
        <span>
          Click your profile picture (top-right) to access{" "}
          <span className="font-medium text-gray-800">Public View Mode</span>
        </span>
      </div>
    </div>
  );
}

