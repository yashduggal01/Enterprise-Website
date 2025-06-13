
import { Banner } from "@/components/sections/Banner";
import { Products } from "@/components/sections/Products";
import { Media } from "@/components/sections/Media";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Banner />
      <Products />
      <Media />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
