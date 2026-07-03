import Hero from "../components/Hero";
import WhyUs from "../components/WhyUs";
import Services from "../components/Services";
import CarGrid from "../components/CarGrid";
import Blog from "../components/Blog";
import Reviews from "../components/Reviews";
import InspectionBanner from "../components/InspectionBanner";
import FAQ from "../components/FAQ";
import DownloadApp from "../components/DownloadApp";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      {/* Absolute Navbar Overlay */}

      {/* Main content sections */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <Hero />

        {/* Why El Garage */}
        <WhyUs />

        {/* Services workflow */}
        <Services />

        {/* Popular Cars */}
        <CarGrid id="grid-popular" title="الأكثر مبيعاً" />

        {/* Featured Cars */}
        <CarGrid id="grid-featured" title="السيارات المميزة" isFeaturedMode />

        {/* Blog Articles */}
        <Blog />

        {/* Testimonials */}
        <Reviews />

        {/* Inspection CTA Banner */}
        <InspectionBanner />

        {/* FAQs */}
        <FAQ />

        {/* Mobile App Downloads */}
        <DownloadApp />
      </main>
    </div>
  );
}
