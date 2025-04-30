import { useKeenSlider } from "keen-slider/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from 'react-intersection-observer';
//Toast Notification for Error Handling
import { toast } from "react-hot-toast";
//Package UI Icons
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import "keen-slider/keen-slider.min.css";
//Imported Files
import CarouselCard from "./CarouselCard";
import NFTProducts from './ExtensionProducts';
import { limitedEdition, liveselling} from "./CarouselData";

//Main Carousel Component (NO API)
const Carousel = () => {
  const [filteredProducts, setFilteredProducts] = useState(limitedEdition);
  const [currentSlide, setCurrentSlide] = useState(filteredProducts[0]);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const navigate = useNavigate(); 

  //Handler of Buy Now button
  const handleBuyNow = (product) => {
    try {
      navigate("/checkout", {
        state: {
          cartItems: [product],
          total: product.price,
        },
      });
    } catch (error) {
      toast.error(" ⚠️ Failed to navigate to checkout. Please try again.");
    }
  };

  //Slide Show Carousel Function
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 3,
      spacing: -5,
      origin: "center",
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: {
          perView: 2,
        },
      },
      "(max-width: 768px)": {
        slides: {
          perView: 1,
        },
      },
    },
    slideChanged(slider) {
      const activeProduct = filteredProducts[slider.track.details.rel];
      setCurrentSlide(activeProduct);
    },
    renderMode: "performance",
    mode: "free-snap",
  });


  //Filtering products when they are time expired
  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedProducts = limitedEdition.filter(product => {
        return new Date(product.endTime) > new Date();
      });
      setFilteredProducts(updatedProducts);

      if (!updatedProducts.includes(currentSlide)) {
        setCurrentSlide(updatedProducts[0] || null);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [currentSlide]);


  return ( 
    <div className="w-full bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Limited Edition Cards
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          {filteredProducts.length} items
        </p>
      </div>
      <div
        ref={ref}
        className={`w-full bg-gray-900 py-12 px-4 transition-opacity duration-1000 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >
    <div className="relative w-full max-w-5xl mx-auto">
      <button
        onClick={() => instanceRef.current?.prev()}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 p-2 sm:p-3 bg-gray-800/50 rounded-full backdrop-blur hover:bg-purple-600 transition"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

       {/* SlideShow Functionalities */}
       <div ref={sliderRef} className="keen-slider">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isActive = product === currentSlide;
            return (
              <div
                key={product.name}
                className="keen-slider__slide flex justify-center items-center"
              >
                <CarouselCard
                  product={product}
                  isActive={isActive}
                  handleBuyNow={handleBuyNow}
                />
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">No products available.</p>
        )}
      </div>
      <button
        onClick={() => instanceRef.current?.next()}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 p-2 sm:p-3 bg-gray-800/50 rounded-full backdrop-blur hover:bg-purple-600 transition"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
    </div>

    <div className="flex justify-center mt-4">
      {filteredProducts.map((product) => (
        <button
          key={product.name}
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 mx-1 sm:mx-2 rounded-full ${
            currentSlide === product ? "bg-purple-600" : "bg-gray-400"
          }`}
          onClick={() =>
            instanceRef.current?.moveToSlide(filteredProducts.indexOf(product))
          }
        />
      ))}
    </div>

    <div className="mt-12 text-center mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">Live Selling</h2>
      <p className="text-sm sm:text-base text-gray-400">
        {liveselling.length} items available
      </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
      {liveselling.map((product) => (
        <NFTProducts key={product.name} product={product} />
      ))}
    </div>
  </div>
</div>
  );
};

export default Carousel;
