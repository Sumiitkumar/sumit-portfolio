import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaTerminal, FaHeart } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-cyan-500/20 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaTerminal className="text-cyan-400 text-lg" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                sumit.dev
              </h3>
            </div>
            <p className="text-slate-400 text-sm">
              DevOps Engineer crafting scalable infrastructure solutions with Kubernetes, AWS, and modern cloud technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-cyan-300 mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-slate-400 hover:text-cyan-300 text-sm transition">Home</a></li>
              <li><a href="#about" className="text-slate-400 hover:text-cyan-300 text-sm transition">About</a></li>
              <li><a href="#skills" className="text-slate-400 hover:text-cyan-300 text-sm transition">Skills</a></li>
              <li><a href="#projects" className="text-slate-400 hover:text-cyan-300 text-sm transition">Projects</a></li>
              <li><a href="#contact" className="text-slate-400 hover:text-cyan-300 text-sm transition">Contact</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold text-cyan-300 mb-4 uppercase tracking-wider">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://github.com/sumiitkumar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-cyan-400 transition hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/sumiitkumar/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-blue-400 transition hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a 
                href="https://twitter.com/sumiitkumar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-400 hover:text-cyan-400 transition hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/50 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700/50 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-slate-400 gap-4">
            <p>© {currentYear} Sumit Kumar. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Crafted with <FaHeart className="text-red-500 text-xs" /> using React, Tailwind & modern DevOps tools
            </p>
          </div>

          {/* Tech Stack Badge */}
          <div className="mt-6 pt-6 border-t border-slate-700/50 text-center text-xs text-slate-500">
            <p>Powered by React • Styled with Tailwind CSS • Deployed on Cloud Infrastructure</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
