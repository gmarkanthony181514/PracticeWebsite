import React from 'react';

const PrivacyPolicy = () => (
  <main className="bg-gradient-to-b from-gray-50 to-white text-gray-800 py-16 px-6 md:px-20">
    <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>

    <nav className="bg-gray-100 p-4 rounded-lg mb-6">
      <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
      <ul className="list-disc list-inside text-gray-700">
        <li><a href="#information-we-collect" className="text-blue-600 hover:underline">Information We Collect</a></li>
        <li><a href="#how-we-use-it" className="text-blue-600 hover:underline">How We Use It</a></li>
        <li><a href="#data-protection" className="text-blue-600 hover:underline">Data Protection</a></li>
        <li><a href="#third-party-services" className="text-blue-600 hover:underline">Third-Party Services</a></li>
      </ul>
    </nav>

    <div className="max-w-3xl mx-auto space-y-6 text-gray-700 text-md leading-relaxed">
      <p>
        This Privacy Policy outlines how Xure Deal Pte. Ltd. collects, uses, and protects your personal data through our digital products like the Xure Store and Xpert Suite.
      </p>

      <h2 id="information-we-collect" className="text-2xl font-semibold mt-6 flex items-center">
        <span className="text-purple-600 mr-2">📋</span> Information We Collect
      </h2>
      <p>
        We collect data you provide directly (such as name and email), as well as usage data from app interactions for analytics and improvement.
      </p>

      <h2 id="how-we-use-it" className="text-2xl font-semibold mt-6 flex items-center">
        <span className="text-purple-600 mr-2">🔧</span> How We Use It
      </h2>
      <p>
        Your data helps us verify accounts, improve services, prevent fraud, and communicate with users. We do not sell your data.
      </p>

      <h2 id="data-protection" className="text-2xl font-semibold mt-6 flex items-center">
        <span className="text-purple-600 mr-2">🔒</span> Data Protection
      </h2>
      <p>
        We apply industry-standard security to protect your data. You control your data preferences via app settings.
      </p>

      <h2 id="third-party-services" className="text-2xl font-semibold mt-6 flex items-center">
        <span className="text-purple-600 mr-2">🤝</span> Third-Party Services
      </h2>
      <p>
        We may use third-party tools (like analytics) but ensure your privacy remains protected through strict data agreements.
      </p>

      <p className="mt-6">
        By using our apps, you consent to this Privacy Policy. For full legal details, please refer to our complete policy at 
        <a 
          href="https://doc-hosting.flycricket.io/xuredeal-privacy-policy-terms-of-use-and-eula/" 
          className="text-blue-600 underline hover:text-blue-800 transition ml-1" 
          target="_blank" 
          rel="noreferrer"
        >
          this link
        </a>.
      </p>
    </div>

    <div className="mt-8 text-center">
      <button
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
        onClick={() => window.location.href = '/contact'}
      >
        Contact Support
      </button>
    </div>
  </main>
);

export default PrivacyPolicy;