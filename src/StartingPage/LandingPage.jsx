import React, { useEffect } from "react";
//Link Navigation
import { Link } from "react-router-dom";
//Import Images
import CompanyLogo from "../assets/images/landingSignUP/logo.png";
import PokemonEvent from "../assets/images/landingSignUP/eventDetails.svg";
//Hard Coded CSS
import "./CSS/landingpage.css";


const LandingPage = () => {

  //Purpose to do a whole body fulfilled not with just a root container based from React Default
  useEffect(() => {
    document.body.classList.add("xure-landing-body");
    return () => {
      document.body.classList.remove("xure-landing-body");
    };
  }, []);
  

  return (
    <div className="xure-landing">
      <header className="xure-header">
        <div className="xure-logo">
          <img src={CompanyLogo} alt="Logo" />
            </div>
          <nav className="xure-nav">
            <ul>
              <li><Link to="/newsfeed">𝒩𝐸𝒲𝒮 𝐹𝐸𝐸𝒟</Link></li>
              <li><Link to="/marketplace">𝑀𝒜𝑅𝒦𝐸𝒯𝒫𝐿𝒜𝒞𝐸</Link></li>
            </ul>
         </nav>
      </header>
    <div className="xure-content">
      <div className="xure-text">
        <p>
        𝙔𝙤𝙪𝙧 𝙜𝙤-𝙩𝙤 𝙥𝙡𝙖𝙘𝙚 𝙛𝙤𝙧 𝙋𝙤𝙠é𝙢𝙤𝙣 𝙘𝙖𝙧𝙙𝙨 — 𝙬𝙞𝙩𝙝 𝙧𝙖𝙧𝙚 𝙛𝙞𝙣𝙙𝙨, 𝙖𝙘𝙘𝙚𝙨𝙨𝙤𝙧𝙞𝙚𝙨, 𝙖𝙣𝙙 𝙛𝙖𝙨𝙝𝙞𝙤𝙣 𝙙𝙧𝙤𝙥𝙨.
        </p>
        <Link to="/loginregister" className="xure-btn">𝗚𝗘𝗧 𝗦𝗧𝗔𝗥𝗧𝗘𝗗</Link>
      </div>
      <div className="xure-image w-1/2 flex justify-center">
    <img src={PokemonEvent} alt="Event Details" className="max-w-full h-auto" />
  </div>
    </div>
  </div>
  );
}

export default LandingPage;
