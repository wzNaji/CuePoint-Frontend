// src/components/DashboardHeader.tsx
interface DashboardHeaderProps {
  displayName: string;
}

export default function DashboardHeader({ displayName }: DashboardHeaderProps) {
  return (
    <div className="bg-white rounded shadow p-6 mb-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-lg">Welcome back, {displayName} 👋</p>
    </div>
  );
}
