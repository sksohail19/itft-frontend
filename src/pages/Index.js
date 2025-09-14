import { useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import HeroSection from "../components/home/HeroSection";
import AnnouncementsBanner from "../components/home/AnnouncementBanner";
import FeaturedEvents from "../components/home/FeaturedEvents";
import AboutSection from "../components/home/AboutSection";
import TestimonialsSection from "../components/home/TestimonialsSection";

const Index = () => {
  // Set page title
  useEffect(() => {
    document.title = "ITFT Student Association - Home";
  }, []);

  return (
    <MainLayout>
      <HeroSection />
      <AnnouncementsBanner />
      <AboutSection />
      <FeaturedEvents />
      <TestimonialsSection />
    </MainLayout>
  );
};

export default Index;
