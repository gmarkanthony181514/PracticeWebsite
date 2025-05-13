const Footer = ({ companyName }) => {
const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-black text-white text-center p-4 mt-8">
      <div className="max-w-screen-xl mx-auto">
        <div>© {currentYear} {companyName} - All Rights Reserved.</div>

        <div className="flex justify-center gap-4 mt-4">
          <a href="/aboutus" className="text-white hover:underline mx-2">About Us</a>
          <a href="/contact" className="text-white hover:underline mx-2">Contact</a>
          <a href="/privacypolicy" className="text-white hover:underline mx-2">Privacy Policy</a>
          <a href="/terms" className="text-white hover:underline mx-2">Terms of Service</a>
          <a href="/faq" className="text-white hover:underline mx-2">FAQ</a>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook text-white"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter text-white"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram text-white"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin text-white"></i>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <i className="fab fa-youtube text-white"></i>
          </a>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Subscribe to our Newsletter</h3>
            <form className="flex justify-center mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-4 text-white hover:underline"
          aria-label="Back to Top"
        >
          Back to Top
        </button>
      </div>
    </footer>
  );
};

export default Footer;