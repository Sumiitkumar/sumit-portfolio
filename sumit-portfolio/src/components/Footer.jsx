import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Sumit Kumar
            </h3>
            <p className="text-gray-600 text-sm">
              DevOps Engineer & Cloud Architect
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-600 hover:text-blue-600 text-sm transition">Home</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-blue-600 text-sm transition">About</a></li>
              <li><a href="#projects" className="text-gray-600 hover:text-blue-600 text-sm transition">Projects</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-blue-600 text-sm transition">Contact</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Follow</h4>
            <div className="flex gap-4">
              <a href="https://github.com/sumiitkumar" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition" aria-label="GitHub">
                <FaGithub size={20} />
              </a>
              <a href="https://linkedin.com/in/sumiitkumar" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
              <a href="https://twitter.com/sumiitkumar" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-600">
            <p>© {currentYear} Sumit Kumar. All rights reserved.</p>
            <p className="mt-3 md:mt-0">Crafted with care</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
