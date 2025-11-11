import React from "react";

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center bg-[#0a192f] text-gray-300 px-6 text-center"
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Hi, I’m <span className="text-[#64ffda]">Sumit Kumar</span>
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-400 mb-6">
          DevOps Engineer | Cloud Enthusiast | Automation Advocate
        </h2>
        <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8">
          I’m passionate about building scalable, secure, and automated systems in the cloud.
          I love working with CI/CD, Kubernetes, and AWS to streamline software delivery.
        </p>

        <div className="flex justify-center gap-6">
          <a
            href="#contact"
            className="px-6 py-3 bg-[#64ffda] text-[#0a192f] font-semibold rounded-md hover:bg-[#52e0c3] transition duration-300"
          >
            Contact Me
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-[#64ffda] text-[#64ffda] font-semibold rounded-md hover:bg-[#64ffda] hover:text-[#0a192f] transition duration-300"
          >
            Download Resume
          </a>
        </div>
      </div>

      {/* Subtle glow background effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f] opacity-90"></div>
    </section>
  );
};

export default Hero;
