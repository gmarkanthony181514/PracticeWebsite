import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import CountdownTimer from './CountdownTimer';
import NFTProducts from './ExtensionProducts';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
//Biggest Live Selling
import Charizard from "../assets/images/Charizard.jpg";
import Pikachu from "../assets/images/Pikachu.jpg";
import Mewtwo from "../assets/images/Mewtwo.jpg";
import Gyarados from "../assets/images/Gyarados.jpg";
import Snorlax from "../assets/images/Snorlax.jpg";
import Bulbasaur from "../assets/images/Bulbasaur.jpg";
//Live Selling
import TeamRocket from "../assets/images/TeamRocket.jpg";
import Arceus from "../assets/images/Arceus.jpg";
import Umbreon from "../assets/images/Umbreon.jpg";
import Alola from "../assets/images/Alola.jpg";
import Espeon from "../assets/images/Espeon.jpg";
import Latios from "../assets/images/Latios.jpg";
import Rayquaza from "../assets/images/Rayquaza.jpg";
import Raichu from "../assets/images/Raichu.jpg";

const limitedEdition = [
    {
      image: Charizard, // Replace with actual image URL
      condition: "Ungraded",
      name: "Charizard Holo – 1st Edition (4/102)",
      price: 5000.00,
      rating: 5.0,
      reviews: 12876,
      isLive: true,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    },
    {
      image: Pikachu, // Replace with actual image URL
      condition: "Graded - PSA 9",
      name: "Pikachu Illustrator – Ultra Rare",
      price: 4000000.00,
      rating: 5.0,
      reviews: 24500,
      isLive: true,
      endTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours from now
    },
    {
      image: Mewtwo, // Replace with actual image URL
      condition: "Graded - PSA 10",
      name: "Mewtwo Holo – Base Set 2 (10/130)",
      price: 785.21,
      rating: 4.8,
      reviews: 5400,
      isLive: true,
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
    },
    {
      image: Gyarados, // Replace with actual image URL
      condition: "Graded - PSA 10",
      name: "Gyarados Holo – Base Set (6/102)",
      price: 600.00,
      rating: 4.7,
      reviews: 4300,
      isLive: true,
      endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
    },
    {
      image: Snorlax, // Replace with actual image URL
      condition: "Graded - PSA 10",
      name: "Snorlax Holo – Jungle (11/64)",
      price: 2615.51,
      rating: 4.6,
      reviews: 3900,
      isLive: true,
      endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    },
    {
      image: Bulbasaur, // Replace with actual image URL
      condition: "Graded - PSA 10",
      name: "Bulbasaur – Base Set (44/102)",
      price: 146.46,
      rating: 4.5,
      reviews: 2100,
      isLive: true,
      endTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
    },
];


const liveselling = [
  {
    image: TeamRocket,
    condition: "Graded - PSA 10",
    name: "Here Comes Team Rocket! #278, XY Promo (Japanese) (2017)",
    price: 10000, // Recent PSA 10 sales range from $9,033 to $11,000
    rating: 5.0,
    reviews: 12000,
    isLive: true,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    image: Umbreon,
    condition: "Graded - PSA 10",
    name: "Umbreon ex #161/131, Prismatic Evolutions (2025)",
    price: 3150, // Last sale at $3,150, with recent sales ranging from $2,850 to $5,000
    rating: 4.8,
    reviews: 950,
    isLive: true,
    endTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    image: Alola,
    condition: "Graded - PSA 10",
    name: "Alola Friends #401, Sun & Moon Promo (Japanese) (2019)",
    price: 700, // Estimated based on market trends for similar cards
    rating: 4.7,
    reviews: 430,
    isLive: true,
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    image: Arceus,
    condition: "Graded - PSA 10",
    name: "Arceus, CoroCoro Ichiban! Winner (Japanese) (2009)",
    price: 900, // Estimated based on market trends for similar cards
    rating: 4.9,
    reviews: 850,
    isLive: true,
    endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
  },
  {
    image: Espeon,
    condition: "Graded - PSA 10",
    name: "Gold Star Espeon #16/17, POP Series 5 (2007)",
    price: 13800, // Last sale at $13,800, with listings up to $15,000
    rating: 4.6,
    reviews: 300,
    isLive: true,
    endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  },
  {
    image: Latios,
    condition: "Graded - PSA 8",
    name: "Gold Star Latios #106/107, EX Deoxys (2005)",
    price: 1500, // PSA 8 sales range from $1,125 to $1,598
    rating: 4.5,
    reviews: 150,
    isLive: true,
    endTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  },
  {
    image: Rayquaza,
    condition: "Graded - PSA 10",
    name: "1st Edition Gold Star Rayquaza #67/82, Clash of the Blue Sky (Japanese) (2004)",
    price: 14000, // Last sale at $14,000, with previous sales ranging from $9,900 to $15,000
    rating: 4.5,
    reviews: 150,
    isLive: true,
    endTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  },
  {
    image: Raichu,
    condition: "Graded - PSA 10",
    name: "Celebi ex (EX Unseen Forces, 2005)",
    price: 1200, // Estimated based on market trends for similar cards
    rating: 4.5,
    reviews: 150,
    isLive: true,
    endTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  },
];


const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(limitedEdition);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const checkExpiry = () => {
      setFilteredProducts(limitedEdition.filter(p => new Date(p.endTime) > new Date()));
    };
  
    checkExpiry(); // Initial check
    const intervalId = setInterval(checkExpiry, 60000);
  
    return () => clearInterval(intervalId);
  }, []);
  
  
  

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
      setCurrentSlide(slider.track.details.rel);
    },
    renderMode: "performance",
    mode: "free-snap",
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedProducts = limitedEdition.filter(product => {
        return new Date(product.endTime) > new Date(); // Check if the item is still live
      });

      setFilteredProducts(updatedProducts); // Update the state with the filtered list
    }, 60000); // Check every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);


  return ( 
    <div className="w-full bg-gray-900 py-12 px-6">
      {/* Title Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Limited Edition Cards</h2>
        <p className="text-sm text-gray-400">{filteredProducts.length} items</p>
      </div>

      <div 
        ref={ref}
        className={`w-full bg-gray-900 py-12 px-6 transition-opacity duration-1000 ${
          inView ? "opacity-100" : "opacity-0"
        }`}
      >

      {/* Carousel Container */}
      <div className="relative w-full max-w-5xl mx-auto">
        {/* Left Arrow */}
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-gray-800/50 rounded-full backdrop-blur hover:bg-purple-600 transition"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Carousel Slides */}
        <div ref={sliderRef} className="keen-slider">
        {filteredProducts.map((product, index) => {
            const isActive = index === currentSlide;
            const isSide =
              index === (currentSlide - 1 + limitedEdition.length) % limitedEdition.length ||
              index === (currentSlide + 1) % limitedEdition.length;
        
            return (
              <div
                key={index}
                className="keen-slider__slide flex justify-center items-center"
              >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                type: "spring",
                stiffness: 120,
              }}
              className={`group relative w-[500px] h-[450px] p-4 rounded-2xl 
                bg-gradient-to-br from-gray-800/60 to-black/40 backdrop-blur-lg
                border-2 border-purple-500/30 shadow-xl transform transition-all duration-500
                ${isActive ? "scale-100 z-30 opacity-100" : "scale-90 z-10 opacity-60"}`}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >

                {product.isLive && (
                  <div className="absolute top-6 right-7 flex items-center gap-2 z-40 animate-pulse-slow">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </span>
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">LIVE</span>
                  </div>
                )}

                  {/* Product Image */}
                  <div className="relative h-60 mb-4 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Product Details */}
                  <p className="text-sm text-purple-300 mb-1">{product.condition}</p>
                  <h2 className="text-white text-lg font-bold mb-2 line-clamp-2">
                    {product.name}
                  </h2>

                  {product.isLive && (
                    <div className="mt-2 text-sm text-white">
                      <p>Time Left: <CountdownTimer endTime={product.endTime} /></p>
                    </div>
                  )}

                  {/* Rating & Reviews */}
                  <div className="flex items-center text-yellow-400 mb-4">
                    <Star className="w-4 h-4" />
                    <span className="ml-1 text-sm">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price & Buy Now Button */}
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-lg text-green-400 font-semibold">
                      ${product.price}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100
                     bg-gradient-to-r from-purple-600 to-pink-600
                     text-white px-3 py-1 rounded-full text-sm
                     transition-transform duration-200 hover:scale-105
                     hover:shadow-lg transition-opacity">
                      Buy Now
                    </button>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-3 bg-gray-800/50 rounded-full backdrop-blur hover:bg-purple-600 transition"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Pagination Dots */}
      {/* Pagination Dots */}
      <div className="flex justify-center mt-4">
        {filteredProducts.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 mx-2 rounded-full ${currentSlide === index ? 'bg-purple-600' : 'bg-gray-400'}`}
            onClick={() => instanceRef.current?.moveToSlide(index)}
          />
        ))}
      </div>

      <div className="mt-12 text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Live Selling </h2>
        <p className="text-sm text-gray-400">{liveselling.length} items available</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {liveselling.map((product, index) => (
          <NFTProducts key={index} product={product} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default Carousel;
