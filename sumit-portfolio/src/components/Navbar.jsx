import React, { useState } from "react";
import { FaTerminal, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Instant scroll to section
  const handleInstantScroll = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "instant", block: "start" });
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-white text-green-700 fixed w-full z-50 shadow-2xl border-b border-green-200 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FaTerminal className="text-2xl text-green-500" />
            <h1 className="text-2xl font-bold font-mono text-green-700">
              sumit
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            <a href="#home" onClick={e => handleInstantScroll(e, "home")} className="px-4 py-2 text-green-700 hover:text-green-600 font-medium transition duration-300">Home</a>
            <a href="#about" onClick={e => handleInstantScroll(e, "about")} className="px-4 py-2 text-green-700 hover:text-green-600 font-medium transition duration-300">About</a>
            <a href="#skills" onClick={e => handleInstantScroll(e, "skills")} className="px-4 py-2 text-green-700 hover:text-green-600 font-medium transition duration-300">Skills</a>
            <a href="#projects" onClick={e => handleInstantScroll(e, "projects")} className="px-4 py-2 text-green-700 hover:text-green-600 font-medium transition duration-300">Projects</a>
            <Link to="/blog" className="px-4 py-2 text-green-700 hover:text-green-600 font-medium transition duration-300">Blog</Link>
            <a href="#contact" onClick={e => handleInstantScroll(e, "contact")} className="px-4 py-2 text-green-700 hover:text-green-600 font-medium transition duration-300">Contact</a>
          </div>

          {/* GitHub Button */}
          <div className="hidden md:flex items-center gap-4">
            <a href="https://github.com/sumiitkumar" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 transition duration-300">
              <FaGithub className="text-2xl" />
            </a>
            <a href="#contact" onClick={e => handleInstantScroll(e, "contact")} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-200 transition">
              Get In Touch
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <a href="https://github.com/sumiitkumar" target="_blank" rel="noopener noreferrer" className="text-green-600">
              <FaGithub className="text-2xl" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-green-700 hover:text-green-600 focus:outline-none"
            >
              {isOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-green-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#home"
              onClick={e => handleInstantScroll(e, "home")}
              className="block px-4 py-2 text-green-700 hover:text-green-600 font-medium transition rounded"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={e => handleInstantScroll(e, "about")}
              className="block px-4 py-2 text-green-700 hover:text-green-600 font-medium transition rounded"
            >
              About
            </a>
            <a
              href="#skills"
              onClick={e => handleInstantScroll(e, "skills")}
              className="block px-4 py-2 text-green-700 hover:text-green-600 font-medium transition rounded"
            >
              Skills
            </a>
            <a
              href="#projects"
              onClick={e => handleInstantScroll(e, "projects")}
              className="block px-4 py-2 text-green-700 hover:text-green-600 font-medium transition rounded"
            >
              Projects
            </a>
            <Link
              to="/blog"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-green-700 hover:text-green-600 font-medium transition rounded"
            >
              Blog
            </Link>
            <a
              href="#contact"
              onClick={e => handleInstantScroll(e, "contact")}
              className="block px-4 py-2 text-green-700 hover:text-green-600 font-medium transition rounded"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
