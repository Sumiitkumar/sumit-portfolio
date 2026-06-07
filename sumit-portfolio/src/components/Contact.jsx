import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const Contact = () => {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section
      id="contact"
      className="min-h-screen bg-white text-green-900 flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-green-700">
            Contact
          </h2>
          <p className="text-green-700 max-w-2xl mx-auto text-lg">
            Ready to discuss DevOps projects, infrastructure challenges, or collaboration opportunities? Let's connect!
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Phone */}
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl hover:border-green-400 transition-all hover:shadow-lg group">
            <div className="flex items-start gap-4">
              <FaPhoneAlt className="text-2xl text-green-500 mt-1 group-hover:scale-110 transition" />
              <div>
                <p className="text-sm text-green-700 uppercase tracking-wider font-semibold">Phone</p>
                <a
                  href="tel:+918709863830"
                  className="text-lg font-mono text-green-700 hover:text-green-600 transition mt-1"
                >
                  +91 8709863830
                </a>
                <button
                  onClick={() => copyToClipboard("+918709863830", "phone")}
                  className="text-xs text-green-600 hover:text-green-700 mt-2 transition"
                >
                  {copied === "phone" ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl hover:border-green-400 transition-all hover:shadow-lg group">
            <div className="flex items-start gap-4">
              <SiGmail className="text-2xl text-green-500 mt-1 group-hover:scale-110 transition" />
              <div>
                <p className="text-sm text-green-700 uppercase tracking-wider font-semibold">Email</p>
                <a
                  href="mailto:sumiitkumar.it@gmail.com"
                  className="text-lg font-mono text-green-700 hover:text-green-600 transition mt-1 break-all"
                >
                  sumiitkumar.it@gmail.com
                </a>
                <button
                  onClick={() => copyToClipboard("sumiitkumar.it@gmail.com", "email")}
                  className="text-xs text-green-600 hover:text-green-700 mt-2 transition"
                >
                  {copied === "email" ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-12">
          <p className="text-sm text-green-700 uppercase tracking-wider font-semibold mb-6 text-center">Connect on Social</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://github.com/sumiitkumar"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white border border-green-100 text-green-700 hover:text-green-900 hover:border-green-400 transition-all hover:shadow-lg hover:bg-green-50 rounded-lg flex items-center gap-2 font-medium group"
              aria-label="GitHub"
            >
              <FaGithub className="group-hover:scale-110 transition" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/sumiitkumar/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white border border-green-100 text-green-700 hover:text-green-900 hover:border-green-400 transition-all hover:shadow-lg hover:bg-green-50 rounded-lg flex items-center gap-2 font-medium group"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="group-hover:scale-110 transition" /> LinkedIn
            </a>
          </div>
        </div>

        {/* Quick Response Box */}
        <div className="bg-green-50 border border-green-200 p-8 rounded-xl">
          <div className="flex items-start gap-4">
            <span className="text-2xl">💬</span>
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-2">Quick Response</h3>
              <p className="text-green-700">
                I typically respond to emails and messages within 24 hours. Feel free to reach out with any inquiries about DevOps, Kubernetes, cloud infrastructure, or potential collaboration opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
