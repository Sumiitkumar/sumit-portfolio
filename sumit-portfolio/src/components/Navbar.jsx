import React, { useState } from "react";
import { FaTerminal, FaGithub } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white fixed w-full z-50 shadow-2xl border-b border-cyan-500/20 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FaTerminal className="text-2xl text-cyan-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
              sumit.dev
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            <a href="#home" className="px-4 py-2 text-slate-200 hover:text-cyan-400 font-medium transition duration-300">Home</a>
            <a href="#about" className="px-4 py-2 text-slate-200 hover:text-cyan-400 font-medium transition duration-300">About</a>
            <a href="#skills" className="px-4 py-2 text-slate-200 hover:text-cyan-400 font-medium transition duration-300">Skills</a>
            <a href="#projects" className="px-4 py-2 text-slate-200 hover:text-cyan-400 font-medium transition duration-300">Projects</a>
            <a href="#contact" className="px-4 py-2 text-slate-200 hover:text-cyan-400 font-medium transition duration-300">Contact</a>
          </div>

          {/* GitHub Button */}
          <div className="hidden md:flex items-center gap-4">
            <a href="https://github.com/sumiitkumar" target="_blank" rel="noopener noreferrer" className="text-slate-200 hover:text-cyan-400 transition duration-300">
              <FaGithub className="text-2xl" />
            </a>
            <a href="#contact" className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition">
              Get In Touch
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <a href="https://github.com/sumiitkumar" target="_blank" rel="noopener noreferrer" className="text-cyan-400">
              <FaGithub className="text-2xl" />
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-200 hover:text-cyan-400 focus:outline-none"
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
        <div className="md:hidden bg-slate-800 border-t border-cyan-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#home"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-slate-200 hover:text-cyan-400 font-medium transition rounded"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-slate-200 hover:text-cyan-400 font-medium transition rounded"
            >
              About
            </a>
            <a
              href="#skills"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-slate-200 hover:text-cyan-400 font-medium transition rounded"
            >
              Skills
            </a>
            <a
              href="#projects"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-slate-200 hover:text-cyan-400 font-medium transition rounded"
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-slate-200 hover:text-cyan-400 font-medium transition rounded"
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
