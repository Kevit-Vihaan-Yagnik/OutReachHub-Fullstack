import { FaqWithImage } from './FAQs';
import { FeatureBlog } from './FeatureBlog';
import { FeaturesCards } from './FeatureCard';
import { Footer } from './Footer';
import { HeaderMegaMenu } from './HeaderMegaMenu';
import HeroSection from './HeroSection';
import { PricingSection } from './PricingSection';
export default function LandingPage() {

  return (
    <>
      <HeaderMegaMenu />
      <HeroSection />
      <FeaturesCards />
      <FeatureBlog/>
      <PricingSection/>
      <FaqWithImage/>
      <Footer/>
    </>

  );
}