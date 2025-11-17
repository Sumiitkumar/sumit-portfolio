import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const Contact = () => {
  return (
    <section
      id="contact"
      className="min-h-screen bg-white text-black flex flex-col justify-center items-center px-6 py-16"
    >
      <div className="max-w-4xl w-full">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
          Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Touch</span>
        </h2>

        <p className="text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed text-center">
          Whether you want to discuss a project, collaborate on DevOps automation, 
          or just say hi 👋 — feel free to reach out!
        </p>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4 hover:shadow-lg transition">
            <FaPhoneAlt className="text-2xl text-blue-600" />
            <div className="text-left">
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-lg font-semibold text-black">+91 8709863830</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4 hover:shadow-lg transition">
            <HiMail className="text-2xl text-blue-600" />
            <div className="text-left">
              <p className="text-sm text-gray-600">Email</p>
              <a
                href="mailto:sumiitkumar.it@gmail.com"
                className="text-lg font-semibold text-blue-600 hover:text-purple-600"
              >
                sumiitkumar.it@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 text-3xl">
          <a
            href="https://github.com/sumiitkumar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600 transition bg-gray-100 p-3 rounded-full hover:bg-blue-50"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/sumiitkumar/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600 transition bg-gray-100 p-3 rounded-full hover:bg-blue-50"
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
