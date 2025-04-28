//Limited Edition Images
import Charizard from "../assets/images/carousel/Charizard.jpg";
import Pikachu from "../assets/images/carousel/Pikachu.jpg";
import Mewtwo from "../assets/images/carousel/Mewtwo.jpg";
import Gyarados from "../assets/images/carousel/Gyarados.jpg";
import Snorlax from "../assets/images/carousel/Snorlax.jpg";
import Bulbasaur from "../assets/images/carousel/Bulbasaur.jpg";
//Live Selling Pictures
import TeamRocket from "../assets/images/carousel/TeamRocket.jpg";
import Arceus from "../assets/images/carousel/Arceus.jpg";
import Umbreon from "../assets/images/carousel/Umbreon.jpg";
import Alola from "../assets/images/carousel/Alola.jpg";
import Espeon from "../assets/images/carousel/Espeon.jpg";
import Latios from "../assets/images/carousel/Latios.jpg";
import Rayquaza from "../assets/images/carousel/Rayquaza.jpg";
import Raichu from "../assets/images/carousel/Raichu.jpg";


// Limited Edition Cards Component Slideshow Design (NO API)
export const limitedEdition = [
    {
      image: Charizard,
      condition: "Ungraded",
      name: "Charizard Holo – 1st Edition (4/102)",
      price: 5000.00,
      rating: 5.0,
      reviews: 12876,
      isLive: true,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    },

    {
      image: Pikachu,
      condition: "Graded - PSA 9",
      name: "Pikachu Illustrator – Ultra Rare",
      price: 4000000.00,
      rating: 5.0,
      reviews: 24500,
      isLive: true,
      endTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
    },

    {
      image: Mewtwo,
      condition: "Graded - PSA 10",
      name: "Mewtwo Holo – Base Set 2 (10/130)",
      price: 785.21,
      rating: 4.8,
      reviews: 5400,
      isLive: true,
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    },

    {
      image: Gyarados,
      condition: "Graded - PSA 10",
      name: "Gyarados Holo – Base Set (6/102)",
      price: 600.00,
      rating: 4.7,
      reviews: 4300,
      isLive: true,
      endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    },

    {
      image: Snorlax,
      condition: "Graded - PSA 10",
      name: "Snorlax Holo – Jungle (11/64)",
      price: 2615.51,
      rating: 4.6,
      reviews: 3900,
      isLive: true,
      endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
    
    {
      image: Bulbasaur,
      condition: "Graded - PSA 10",
      name: "Bulbasaur – Base Set (44/102)",
      price: 146.46,
      rating: 4.5,
      reviews: 2100,
      isLive: true,
      endTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    },
];

// Live Selling Cards Component Slideshow Design (NO API)
export const liveselling = [
    {
      image: TeamRocket,
      condition: "Graded - PSA 10",
      name: "Here Comes Team Rocket! #278, XY Promo (Japanese) (2017)",
      price: 10000,
      rating: 5.0,
      reviews: 12000,
      isLive: true,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      image: Umbreon,
      condition: "Graded - PSA 10",
      name: "Umbreon ex #161/131, Prismatic Evolutions (2025)",
      price: 3150,
      rating: 4.8,
      reviews: 950,
      isLive: true,
      endTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
    },
    {
      image: Alola,
      condition: "Graded - PSA 10",
      name: "Alola Friends #401, Sun & Moon Promo (Japanese) (2019)",
      price: 700,
      rating: 4.7,
      reviews: 430,
      isLive: true,
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      image: Arceus,
      condition: "Graded - PSA 10",
      name: "Arceus, CoroCoro Ichiban! Winner (Japanese) (2009)",
      price: 900,
      rating: 4.9,
      reviews: 850,
      isLive: true,
      endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    },
    {
      image: Espeon,
      condition: "Graded - PSA 10",
      name: "Gold Star Espeon #16/17, POP Series 5 (2007)",
      price: 13800,
      rating: 4.6,
      reviews: 300,
      isLive: true,
      endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
    {
      image: Latios,
      condition: "Graded - PSA 8",
      name: "Gold Star Latios #106/107, EX Deoxys (2005)",
      price: 1500,
      rating: 4.5,
      reviews: 150,
      isLive: true,
      endTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
    {
      image: Rayquaza,
      condition: "Graded - PSA 10",
      name: "1st Edition Gold Star Rayquaza #67/82, Clash of the Blue Sky (Japanese) (2004)",
      price: 14000,
      rating: 4.5,
      reviews: 150,
      isLive: true,
      endTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
    {
      image: Raichu,
      condition: "Graded - PSA 10",
      name: "Celebi ex (EX Unseen Forces, 2005)",
      price: 1200,
      rating: 4.5,
      reviews: 150,
      isLive: true,
      endTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
  ];