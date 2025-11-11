import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a192f] text-gray-400 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        
        {/* Left - Name and Copyright */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} <span className="text-[#64ffda]">Sumit Kumar</span>. All rights reserved.
          </p>
        </div>

        {/* Right - Social Links */}
        <div className="flex gap-6 text-2xl">
          <a
            href="https://github.com/sumiitkumar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#64ffda] transition"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/sumiitkumar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#64ffda] transition"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://twitter.com/sumiitkumar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#64ffda] transition"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://instagram.com/sumiitkumar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#64ffda] transition"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
