import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const Contact = () => {
  return (
    <section
      id="contact"
      className="min-h-screen bg-[#0a192f] text-gray-300 flex flex-col justify-center items-center px-6 py-16"
    >
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12">
          Get In <span className="text-[#64ffda]">Touch</span>
        </h2>

        <p className="text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Whether you want to discuss a project, collaborate on DevOps automation, 
          or just say hi 👋 — feel free to reach out!
        </p>

        {/* Contact Info */}
        <div className="grid-cols-2 gap-8 justify-items-center mb-12">
          <div className="flex items-center gap-4 hover:text-[#64ffda] transition">
            <FaPhoneAlt className="text-2xl text-[#64ffda]" />
            <p className="text-lg">+91 8709863830</p>
          </div>
          <div className="flex items-center gap-4 hover:text-[#64ffda] transition">
            <HiMail className="text-2xl text-[#64ffda]" />
            <a
              href="mailto:sumiitkumar.it@gmail.com"
              className="text-lg hover:underline"
            >
              sumiitkumar.it@gmail.com
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-12 text-3xl">
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
            href="https://www.linkedin.com/in/sumiitkumar/"
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
          {/* <a
            href="https://instagram.com/sumiitkumar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#64ffda] transition"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a> */}
        </div>

       
      </div>
    </section>
  );
};

export default Contact;
