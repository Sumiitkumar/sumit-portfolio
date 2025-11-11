import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0a192f] text-gray-300 fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#64ffda] tracking-wide">
              Sumit Kumar
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-[#64ffda] transition">Home</a>
            <a href="#about" className="hover:text-[#64ffda] transition">About</a>
            <a href="#skills" className="hover:text-[#64ffda] transition">Skills</a>
            <a href="#projects" className="hover:text-[#64ffda] transition">Projects</a>
            <a href="#contact" className="hover:text-[#64ffda] transition">Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-[#64ffda] focus:outline-none"
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
        <div className="md:hidden bg-[#112240]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            <a
              href="#home"
              onClick={() => setIsOpen(false)}
              className="block py-2 hover:text-[#64ffda] transition"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="block py-2 hover:text-[#64ffda] transition"
            >
              About
            </a>
            <a
              href="#skills"
              onClick={() => setIsOpen(false)}
              className="block py-2 hover:text-[#64ffda] transition"
            >
              Skills
            </a>
            <a
              href="#projects"
              onClick={() => setIsOpen(false)}
              className="block py-2 hover:text-[#64ffda] transition"
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block py-2 hover:text-[#64ffda] transition"
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
