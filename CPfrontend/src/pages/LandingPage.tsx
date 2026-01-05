import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/auth";
import Header from "../components/Header";

type FeatureBoxProps = {
  title: string;
  text: string;
  bgImg?: string; // optional background image
};

function FeatureBox({ title, text, bgImg }: FeatureBoxProps) {
  return (
    <div
      className="p-6 rounded-xl border border-red-500 shadow-sm 
                 hover:shadow-[0_0_20px_6px_rgba(255,0,0,0.5)] 
                 hover:-translate-y-1 transition-all duration-300 text-center 
                 bg-cover bg-center text-white"
      style={{ backgroundImage: `url('${bgImg || '/default-avatar.png'}')` }}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-200">{text}</p>
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
        style={{ backgroundImage: "url('/default-avatar.png')" }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* hero content */}
        <div className="relative z-10 flex h-full items-center justify-center px-6">
          <div className="text-center max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Welcome to CuePoint
            </h1>

            <p className="text-gray-200 mb-8">
              Discover DJs, manage bookings, and share your music with the world.
            </p>

            <button className="px-8 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-32 px-6 bg-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureBox
            title="Discover DJs"
            text="Find DJs by genre, city, and availability."
            bgImg="/images/dj-background.jpg"
          />
          <FeatureBox
            title="Manage Bookings"
            text="Handle bookings and schedules in one place."
            bgImg="/images/bookings-background.jpg"
          />
          <FeatureBox
            title="Share Your Music"
            text="Upload mixes and grow your audience."
            bgImg="/images/music-background.jpg"
          />
          <FeatureBox
            title="Grow Your Network"
            text="Connect with venues and event organizers."
            bgImg="url('/default-avatar.png')"
          />

        </div>
      </section>
    </div>
  );
}
