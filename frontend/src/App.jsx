import Navbar from './components/organisms/Navbar';
import HeroSection from './components/organisms/HeroSection';
import FeaturesSection from './components/organisms/FeaturesSection';
import HowItWorksSection from './components/organisms/HowItWorksSection';
import CTASection from './components/organisms/CTASection';
import Footer from './components/organisms/Footer';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default App;
