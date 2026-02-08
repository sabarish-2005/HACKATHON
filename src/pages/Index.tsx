import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoSection from "@/components/VideoSection";
import AboutSection from "@/components/AboutSection";
import DepartmentsSection from "@/components/DepartmentsSection";
import ScheduleSection from "@/components/ScheduleSection";
import CoordinatorsSection from "@/components/CoordinatorsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      <AboutSection />
      <DepartmentsSection />
      
      {/* How It Works Video Section */}
      <VideoSection
        videoSrc="/IMG_8168.mp4"
      />
      
      <ScheduleSection />
      <CoordinatorsSection />
      <Footer />
    </div>
  );
};

export default Index;
