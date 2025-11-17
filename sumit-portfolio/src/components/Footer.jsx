import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Left Content */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Sumit Kumar
            </h3>
            <p className="text-gray-600 text-sm max-w-xs">
              DevOps Engineer | Cloud Architect | Infrastructure Enthusiast
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/sumiitkumar"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition transform hover:scale-110"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://linkedin.com/in/sumiitkumar"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="https://twitter.com/sumiitkumar"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition transform hover:scale-110"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Sumit Kumar. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Crafted with passion for DevOps & Cloud</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
