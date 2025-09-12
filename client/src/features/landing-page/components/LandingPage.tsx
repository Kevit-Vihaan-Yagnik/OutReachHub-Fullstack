import FAQSection from "./Faq";
import FeatureSection from "./Features";
import Footer from "./Footer";
import HeroSection from "./Hero";
import Navbar from "./Navbar";
import PricingSection from "./Pricing";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection id="home" />
      <FeatureSection id="features" />
      <PricingSection id="pricing" />
      <FAQSection id="faqs" />
      <Footer />
    </>
  );
}
