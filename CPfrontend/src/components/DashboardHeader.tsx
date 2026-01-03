import Card from "./Card";


export default function DashboardHeader() {
  return (
    <Card className="relative overflow-hidden mb-6 space-y-4 bg-gray-900 border-gray-800 text-white">
      {/* Accent red bar */}
      <div className="absolute inset-x-0 top-0 h-1 bg-red-600" />

      <h1 className="text-3xl font-extrabold tracking-tight text-white">
        Dashboard
      </h1>

      <p className="mt-2 text-lg text-gray-300">
        <span>Customize Your Dashboard And Go To Public View Mode To See What You Share With The World!</span> 👋
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-3 text-sm text-gray-300">
        <span className="text-red-600">👤</span>
        <span>
          Click your profile picture (top-right) to access{" "}
          <span className="font-medium text-white">Public View Mode</span>
        </span>
      </div>
    </Card>
  );
}
