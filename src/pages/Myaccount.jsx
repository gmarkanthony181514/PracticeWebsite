import React, { useEffect, useState } from "react";
import { Card, CardContent, Button, CardMedia } from "@mui/material"; // Import Material-UI components
import Logo from "../assets/images/email-icon.png"; // Import your logo or any other image

const Myaccount = () => {
  // Sample product data (this could come from an API)
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch data or use static data
    const fetchedProducts = [
      {
        id: 1,
        image: Logo,
        title: "Colorful Abstract Painting",
        stock: 4,
        price: "2.5 ETH",
        likes: "3.2k",
      },
      {
        id: 2,
        image: "/assets/images/image2.jpg",
        title: "The girl with the firefly",
        stock: 12,
        price: "2.06 ETH",
        likes: "1.3k",
      },
      {
        id: 3,
        image: "/assets/images/image3.jpg",
        title: "Dodo hide the seek",
        stock: 6,
        price: "2.48 ETH",
        likes: "1.2k",
      },
      {
        id: 4,
        image: "/assets/images/image4.jpg",
        title: "Liquid Forest Princess",
        stock: 34,
        price: "3.05 ETH",
        likes: "4.1k",
      },
      {
        id: 5,
        image: "/assets/images/image5.jpg",
        title: "Mountain Adventure",
        stock: 10,
        price: "1.5 ETH",
        likes: "2k",
      },
      {
        id: 6,
        image: "/assets/images/image6.jpg",
        title: "The Ocean's Beauty",
        stock: 8,
        price: "2.1 ETH",
        likes: "3.5k",
      },
      {
        id: 7,
        image: "/assets/images/image7.jpg",
        title: "Golden Sunset",
        stock: 15,
        price: "3.2 ETH",
        likes: "4.7k",
      },
      {
        id: 8,
        image: "/assets/images/image8.jpg",
        title: "Mystic Forest",
        stock: 5,
        price: "2.8 ETH",
        likes: "3.1k",
      },
    ];

    setProducts(fetchedProducts);
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-100 min-h-screen">
      {products.map((product) => (
        <Card key={product.id} sx={{ maxWidth: 345 }} className="m-2">
          <CardMedia
            component="img"
            image={product.image}
            alt={product.title}
            style={{ objectFit: 'cover', height: '200px' }} // Adjust height
          />
          <CardContent>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{product.title}</h3>
            <p className="text-sm text-gray-600 mb-1">{product.stock} in stock</p>
            <p className="text-md font-semibold text-gray-800">Price: {product.price}</p>
            <p className="text-sm text-gray-500 mb-3">Likes: {product.likes}</p>
            <Button variant="contained" color="primary" fullWidth>
              Place Bid
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Myaccount;
