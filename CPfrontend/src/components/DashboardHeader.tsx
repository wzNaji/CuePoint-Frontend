/**
 * DashboardHeader component
 *
 * Displays the top header section for the user's dashboard, including:
 * - A title
 * - A short description of what the dashboard is for
 * - A hint box explaining how to enter "Public View Mode"
 *
 * Styling notes:
 * - Uses the shared `Card` component for consistent surface styling.
 * - Includes a thin accent bar at the top to visually separate the header section.
 */
import Card from "./Card";


export default function DashboardHeader() {
  return (
    <Card className="relative overflow-hidden mb-6 space-y-4 bg-gray-900 border-gray-800 text-white">
      {/* Accent bar at the top of the card for visual emphasis */}
      <div className="absolute inset-x-0 top-0 h-1 bg-red-600" />

      {/* Main page header */}
      <h1 className="text-3xl font-extrabold tracking-tight text-white">
        Dashboard
      </h1>

      {/* Supporting description text */}
      <p className="mt-2 text-lg text-gray-300">
        <span>Customize Your Dashboard And Go To Public View Mode To See What You Share With The World!</span> 👋
      </p>

      {/* Callout / hint box for navigation guidance */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-3 text-sm text-gray-300">
        {/* Simple indicator icon replacement */}
        <span className="text-red-600">👤</span>
        <span>
          Click your profile picture (top-right) to access{" "}
          <span className="font-medium text-white">Public View Mode</span>
        </span>
      </div>
    </Card>
  );
}
