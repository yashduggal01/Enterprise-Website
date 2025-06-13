
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Media = () => {
  const productImages = [
    {
      id: 1,
      title: "Advanced Analytics Dashboard",
      description: "Real-time business intelligence and data visualization platform",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Digital Transformation Suite",
      description: "Complete digital transformation toolkit for modern enterprises",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Process Automation Platform",
      description: "Streamlined workflow automation and optimization solutions",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
    },
    {
      id: 4,
      title: "Security Operations Center",
      description: "Comprehensive cybersecurity monitoring and threat detection",
      image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&h=400&fit=crop"
    },
    {
      id: 5,
      title: "Innovation Laboratory",
      description: "Research and development facility for emerging technologies",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
    }
  ];

  return (
    <section id="media" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Product Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our innovative solutions and cutting-edge technology platforms
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {productImages.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="group hover:shadow-xl transition-all duration-300">
                      <CardContent className="flex flex-col p-0">
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="font-semibold text-lg text-foreground mb-2">
                            {product.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {product.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
