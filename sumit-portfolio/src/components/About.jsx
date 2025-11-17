import React from "react";

const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white text-black flex flex-col justify-center items-center px-6 py-12"
    >
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side - Image */}
        <div className="flex justify-center md:justify-start order-2 md:order-1">
          <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <img
              src="https://res.cloudinary.com/dlcj09ujl/image/upload/v1762855596/WhatsApp_Image_2025-11-11_at_15.23.35_2cdd1928_n2qddq.jpg"
              alt="Sumit Kumar"
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-purple-600/5"></div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="order-1 md:order-2">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Me</span>
            </h2>
            
            <p className="text-gray-700 leading-relaxed text-lg">
              I'm <span className="font-semibold text-blue-600">Sumit Kumar</span>, a passionate <span className="font-semibold">DevOps Engineer</span> building scalable cloud infrastructure and automating workflows.
            </p>

            <p className="text-gray-600 leading-relaxed">
              With expertise in Kubernetes, Terraform, AWS, and CI/CD pipelines, I create reliable systems that drive innovation. Holding a BCA and MCA from Jain University, I combine theoretical knowledge with practical expertise.
            </p>

            <p className="text-gray-600 leading-relaxed">
              I'm always learning and exploring new tools to stay ahead in the DevOps landscape.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200">DevOps</span>
              <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium border border-purple-200">Cloud Architecture</span>
              <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200">Kubernetes</span>
              <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium border border-purple-200">AWS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
