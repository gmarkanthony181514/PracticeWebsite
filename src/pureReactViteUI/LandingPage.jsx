import React, { useEffect } from "react";
import { Link } from "react-router-dom";
//Imported Pictures
import Logo from "../assets/images/landingSignUP/logo.png";
import Details from "../assets/images/landingSignUP/eventDetails.svg";
//Imported Files
import "../pureCSSfiles/landingpage.css";

function LandingPage() {
  //Javascript handler
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
          <img src={Logo} alt="Logo" />
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
    <img src={Details} alt="Event Details" className="max-w-full h-auto" />
  </div>
    </div>
  </div>
  );
}

export default LandingPage;
