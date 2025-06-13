
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Cog, 
  Shield, 
  Zap, 
  Globe, 
  TrendingUp,
  ArrowRight 
} from "lucide-react";

export const Products = () => {
  const products = [
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Advanced data analytics and business intelligence solutions to drive informed decision-making.",
      features: ["Real-time dashboards", "Predictive analytics", "Custom reports"]
    },
    {
      icon: Cog,
      title: "Process Automation",
      description: "Streamline your operations with our cutting-edge automation technologies.",
      features: ["Workflow optimization", "AI-powered automation", "Integration services"]
    },
    {
      icon: Shield,
      title: "Security Solutions",
      description: "Comprehensive cybersecurity services to protect your business assets.",
      features: ["Threat detection", "Data encryption", "Compliance management"]
    },
    {
      icon: Globe,
      title: "Digital Transformation",
      description: "Transform your business for the digital age with our expert consulting.",
      features: ["Cloud migration", "Digital strategy", "Technology roadmap"]
    },
    {
      icon: TrendingUp,
      title: "Growth Strategy",
      description: "Strategic consulting to accelerate your business growth and market expansion.",
      features: ["Market analysis", "Growth planning", "Performance optimization"]
    },
    {
      icon: Zap,
      title: "Innovation Lab",
      description: "Research and development services to keep you ahead of the competition.",
      features: ["Emerging technologies", "Prototype development", "Innovation consulting"]
    }
  ];

  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Product Portfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive business solutions designed to elevate your enterprise to new heights of success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <CardDescription className="text-base">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};
