import React, { useRef } from "react";

const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen bg-white text-green-900 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side - Static Profile Photo */}
        <div className="flex justify-center md:justify-start order-2 md:order-1">
          <div className="relative w-44 h-44 rounded-lg overflow-hidden border-4 border-green-200 shadow-lg bg-white">
            <img
              src={`${import.meta.env.BASE_URL}profile.jpg`}
              alt="Sumit Kumar"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        {/* Right Side - Content */}
        <div className="order-1 md:order-2">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-2 text-green-700">
              About <span className="text-green-500">Me</span>
            </h2>
            <div className="h-1 w-20 bg-green-500"></div>
          </div>
          <p className="text-green-800 leading-relaxed text-lg">
            I'm <span className="font-semibold text-green-600">Sumit Kumar</span>, a passionate <span className="font-semibold text-green-700">Cloud & DevOps Engineer</span> who thrives on orchestrating containerized ecosystems and automating infrastructure at scale.
          </p>
          <p className="text-green-700 leading-relaxed">
            With 2+ years of hands-on experience in Kubernetes, Terraform, AWS, and CI/CD automation, I design and deploy resilient, scalable cloud-native solutions. I specialize in infrastructure-as-code practices and building automated deployment pipelines that power modern applications.
          </p>
          <p className="text-green-700 leading-relaxed">
            Holding a BCA and MCA from Jain University, I combine theoretical knowledge with practical expertise. I'm constantly exploring the latest DevOps tools and best practices to stay ahead in this rapidly evolving landscape.
          </p>
          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2 pt-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">DevOps</span>
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium border border-green-100">Kubernetes</span>
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium border border-green-100">Cloud Architecture</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">CI/CD</span>
            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium border border-green-100">AWS</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">Infrastructure</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
