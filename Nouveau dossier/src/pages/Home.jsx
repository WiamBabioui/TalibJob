import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import HowItWorks from "../components/HowItWorks";
import WhyTalibJob from "../components/WhyTalibJob";
import ForCompanies from "../components/ForCompanies";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      {/* <SearchBar /> */}
      <HowItWorks />
      <WhyTalibJob />
      <ForCompanies />
      <Testimonials />
      <Footer />
    </>
  );
};

export default Home;
