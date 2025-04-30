import React from "react";

const Footer = ({ companyName }) => {
const currentYear = new Date().getFullYear();

return (
  <footer className="bg-[#343434] text-white text-center p-4 mt-8">
    <div className="max-w-screen-xl mx-auto">
      <div>© {currentYear} {companyName} - All Rights Reserved.</div>
      <div className="flex justify-center gap-4 mt-4">
        <a 
          href="/aboutus" 
            className="text-white hover:underline mx-2">
              About Us
        </a>
        <a 
          href="/contact" 
            className="text-white hover:underline mx-2">
              Contact
        </a>
        <a 
          href="/privacypolicy" 
            className="text-white hover:underline mx-2">
              Privacy Policy
        </a>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <a 
          href="https://facebook.com" 
            target="_blank" rel="noopener noreferrer" 
              aria-label="Facebook">
          <i className="fab fa-facebook text-white"></i>
        </a>
        <a 
          href="https://twitter.com" 
            target="_blank" rel="noopener noreferrer" 
              aria-label="Twitter">
          <i className="fab fa-twitter text-white"></i>
        </a>
        <a 
          href="https://instagram.com" 
            target="_blank" rel="noopener noreferrer" 
              aria-label="Instagram">
          <i className="fab fa-instagram text-white"></i>
        </a>
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mt-4 text-white hover:underline"
      >
        Back to Top
      </button>
    </div>
  </footer>
);
};

export default Footer;