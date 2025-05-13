const SectionTitle = ({ title, mb = "mb-8" }) => {

  return (
    <div className={`text-center ${mb} relative`}>
  {/* Subtle Background Accent */}
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 blur-lg opacity-10 rounded-lg">
    </div>
  {/* Title Design */}
      <h2
        className="relative text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 
                   tracking-wide transition-transform duration-300 hover:scale-105"
      >
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;