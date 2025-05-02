import React from 'react';

const Contact = () => (
  <main className="bg-white text-gray-800 py-16 px-6 md:px-20">
    <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
    <p className="text-lg text-gray-600 text-center mb-10">
      Have questions or need support? Reach out to the Xure Deal team — we’re here to help.
    </p>

    <div className="max-w-xl mx-auto space-y-6 text-center text-gray-700">
      <p className="flex items-center justify-center space-x-2">
        <span className="text-purple-600 text-xl">📧</span>
        <span><strong>Email:</strong> support@xuredeal.com</span>
      </p>
      <p className="flex items-center justify-center space-x-2">
        <span className="text-purple-600 text-xl">📱</span>
        <span><strong>App Support:</strong> Available via Xure Store and Xpert Suite apps</span>
      </p>
      <p className="flex items-center justify-center space-x-2">
        <span className="text-purple-600 text-xl">📍</span>
        <span><strong>Business Address:</strong> Singapore</span>
      </p>
    </div>

    <section className="mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Send Us a Message</h2>
      <form className="max-w-xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <textarea
          placeholder="Your Message"
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
        ></textarea>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
        >
          Send Message
        </button>
      </form>
    </section>

    <section className="mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Our Location</h2>
      <div className="max-w-xl mx-auto">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d144.9537353153169!3d-37.81627974202171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d8c3e3f3b1b!2sSingapore!5e0!3m2!1sen!2s!4v1618888888888!5m2!1sen!2s"
          width="100%"
          height="300"
          className="border-0 rounded-lg shadow-lg"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </section>

    <div className="text-center mt-10">
      <button
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition"
        onClick={() => window.location.href = '/faq'}
      >
        Visit Our FAQ
      </button>
    </div>
  </main>
);

export default Contact;