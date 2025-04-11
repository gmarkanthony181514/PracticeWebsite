import React, { useEffect } from "react";
import { Link } from "react-router-dom";
//Imported Pictures
import Logo from "../assets/images/logo.png";
import Wave from "../assets/images/wave.svg";
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
        𝑭𝒂𝒌𝒆 𝑺𝒕𝒐𝒓𝒆 𝒐𝒇𝒇𝒆𝒓𝒔 𝒆𝒗𝒆𝒓𝒚𝒕𝒉𝒊𝒏𝒈 𝒚𝒐𝒖 𝒏𝒆𝒆𝒅 𝒇𝒓𝒐𝒎 𝒆𝒍𝒆𝒄𝒕𝒓𝒐𝒏𝒊𝒄𝒔, 𝒋𝒆𝒘𝒆𝒍𝒓𝒚, 𝒎𝒆𝒏'𝒔 𝒂𝒏𝒅 𝒘𝒐𝒎𝒆𝒏'𝒔 𝒄𝒍𝒐𝒕𝒉𝒊𝒏𝒈.
        </p>
        <Link to="/loginregister" className="xure-btn">𝗚𝗘𝗧 𝗦𝗧𝗔𝗥𝗧𝗘𝗗</Link>
      </div>
    </div>
      <div className="xure-wave">
        <img src={Wave} alt="Wave Animation" />
    </div>
  </div>
  );
}

export default LandingPage;
