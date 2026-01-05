import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* GLOBAL HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* GLOBAL FOOTER */}
      <Footer />
    </div>
  );
}
