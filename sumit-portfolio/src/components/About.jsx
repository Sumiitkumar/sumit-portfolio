import React from "react";
import { FaAws, FaDocker } from "react-icons/fa";
import { SiKubernetes } from "react-icons/si";

const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side - Image */}
        <div className="flex justify-center md:justify-start order-2 md:order-1">
          <div className="relative w-72 h-72 rounded-2xl overflow-hidden border-2 border-cyan-500/50 shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 group">
            <img
              src="https://res.cloudinary.com/dlcj09ujl/image/upload/v1762855596/WhatsApp_Image_2025-11-11_at_15.23.35_2cdd1928_n2qddq.jpg"
              alt="Sumit Kumar"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/20 to-blue-600/20 group-hover:from-cyan-600/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="order-1 md:order-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
                About <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Me</span>
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-400"></div>
            </div>
            
            <p className="text-slate-300 leading-relaxed text-lg">
              I'm <span className="font-semibold text-cyan-300">Sumit Kumar</span>, a passionate <span className="font-semibold text-cyan-400">DevOps Engineer</span> who thrives on orchestrating containerized ecosystems and automating infrastructure at scale.
            </p>

            <p className="text-slate-400 leading-relaxed">
              With 2+ years of hands-on experience in Kubernetes, Terraform, AWS, and CI/CD automation, I design and deploy resilient, scalable cloud-native solutions. I specialize in infrastructure-as-code practices and building automated deployment pipelines that power modern applications.
            </p>

            <p className="text-slate-400 leading-relaxed">
              Holding a BCA and MCA from Jain University, I combine theoretical knowledge with practical expertise. I'm constantly exploring the latest DevOps tools and best practices to stay ahead in this rapidly evolving landscape.
            </p>

            {/* Skills Highlights */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-slate-800/50 border border-cyan-500/30 p-4 rounded-lg hover:border-cyan-500/60 transition">
                <SiKubernetes className="text-3xl text-cyan-400 mb-2" />
                <h4 className="text-cyan-300 font-semibold">Kubernetes Master</h4>
                <p className="text-slate-400 text-sm">Cluster design & orchestration</p>
              </div>
              <div className="bg-slate-800/50 border border-blue-500/30 p-4 rounded-lg hover:border-blue-500/60 transition">
                <FaAws className="text-3xl text-orange-400 mb-2" />
                <h4 className="text-blue-300 font-semibold">AWS Architect</h4>
                <p className="text-slate-400 text-sm">Multi-cloud solutions</p>
              </div>
              <div className="bg-slate-800/50 border border-cyan-500/30 p-4 rounded-lg hover:border-cyan-500/60 transition">
                <FaDocker className="text-3xl text-blue-400 mb-2" />
                <h4 className="text-cyan-300 font-semibold">Containerization</h4>
                <p className="text-slate-400 text-sm">Docker & image optimization</p>
              </div>
              <div className="bg-slate-800/50 border border-purple-500/30 p-4 rounded-lg hover:border-purple-500/60 transition">
                <svg className="text-3xl text-purple-400 mb-2" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M6.94 5a2 2 0 1 1 2.82 2.82L4.41 13.18a2 2 0 0 1-2.82-2.82l5.35-5.36zm10.12 0a2 2 0 0 0-2.82 2.82l5.36 5.35a2 2 0 0 0 2.82-2.82L17.06 5z"/>
                </svg>
                <h4 className="text-purple-300 font-semibold">IaC Expert</h4>
                <p className="text-slate-400 text-sm">Terraform & automation</p>
              </div>
            </div>

            {/* Expertise Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/40">DevOps</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/40">Kubernetes</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/40">Cloud Architecture</span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium border border-cyan-500/40">CI/CD</span>
              <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium border border-orange-500/40">AWS</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-500/40">Infrastructure</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
