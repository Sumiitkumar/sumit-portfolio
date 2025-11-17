import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-black fixed w-full z-50 shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SK
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            <a href="#home" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition">Home</a>
            <a href="#about" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition">About</a>
            <a href="#skills" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition">Skills</a>
            <a href="#projects" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition">Projects</a>
            <a href="#contact" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition">Contact</a>
          </div>

          {/* Resume Button */}
          <div className="hidden md:flex">
            <a href="#contact" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition">
              Let's Connect
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
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
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#home"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition rounded"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition rounded"
            >
              About
            </a>
            <a
              href="#skills"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition rounded"
            >
              Skills
            </a>
            <a
              href="#projects"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition rounded"
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition rounded"
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
