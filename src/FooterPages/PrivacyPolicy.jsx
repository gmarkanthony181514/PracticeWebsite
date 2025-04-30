import React from 'react';

const PrivacyPolicy = () => (
  <main className="bg-white text-gray-800 py-16 px-6 md:px-20">
    <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>

    <div className="max-w-3xl mx-auto space-y-6 text-gray-700 text-md leading-relaxed">
      <p>
        This Privacy Policy outlines how Xure Deal Pte. Ltd. collects, uses, and protects your personal data through our digital products like the Xure Store and Xpert Suite.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Information We Collect</h2>
      <p>
        We collect data you provide directly (such as name and email), as well as usage data from app interactions for analytics and improvement.
      </p>

      <h2 className="text-2xl font-semibold mt-6">How We Use It</h2>
      <p>
        Your data helps us verify accounts, improve services, prevent fraud, and communicate with users. We do not sell your data.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Data Protection</h2>
      <p>
        We apply industry-standard security to protect your data. You control your data preferences via app settings.
      </p>

      <h2 className="text-2xl font-semibold mt-6">Third-Party Services</h2>
      <p>
        We may use third-party tools (like analytics) but ensure your privacy remains protected through strict data agreements.
      </p>

      <p className="mt-6">
        By using our apps, you consent to this Privacy Policy. For full legal details, please refer to our complete policy at 
        <a href="https://doc-hosting.flycricket.io/xuredeal-privacy-policy-terms-of-use-and-eula/" className="text-blue-600 underline ml-1" target="_blank" rel="noreferrer">this link</a>.
      </p>
    </div>
  </main>
);

export default PrivacyPolicy;
