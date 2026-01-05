import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

type FeatureBoxProps = {
  title: string;
  bgImg?: string; // optional background image
};

function FeatureBox({ title, bgImg }: FeatureBoxProps) {
  return (
    <div
      className="p-6 h-64 rounded-xl border border-red-500 shadow-sm
           hover:shadow-[0_0_20px_6px_rgba(255,0,0,0.5)]
           hover:-translate-y-1 transition-all duration-300
           text-center bg-cover bg-center text-white
           flex items-center justify-center"

      style={{ backgroundImage: `url('${bgImg || '/default-avatar.png'}')` }}
    >
      <h3 className="text-xl font-semibold bg-black/50 px-3 py-1 rounded-md">
        {title}
      </h3>
    </div>
  );
}




export default function LandingPage() {
  const { isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="w-full">
      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative h-screen w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/CuePointLandingPageImg.png')" }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* hero content */}
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Welcome to CuePoint
            </h1>

            <h2 className="text-gray-200 mb-8 font-bold text-white tracking-wide">
              Discover Artists, manage bookings, and share your music with the world.
            </h2>

            <div className="flex flex-col items-center mt-6 animate-bounce">
            <svg
              className="w-9 h-9 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-7 7-7-7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12l-7 7-7-7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 17l-7 7-7-7" />
            </svg>
          </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-32 px-6 bg-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureBox title="Discover Artists" bgImg="/Artist.png" />
          <FeatureBox title="Manage Bookings" bgImg="/Booking.png" />
          <FeatureBox title="Share Your Music" bgImg="/ShareMusic.png" />
          <FeatureBox title="Grow Your Network" bgImg="/Networking.png" />
        </div>
      </section>
      <div>
        {/* ================= FOOTER ================= */}
        <Footer />
      </div>
    </div>
  );
}
