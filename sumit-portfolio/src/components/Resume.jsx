import React, { useState } from "react";
import { FaDownload, FaEye, FaFileAlt } from "react-icons/fa";
import { resumeConfig } from "../config/resumeConfig";

const Resume = () => {
  const [showEmbed, setShowEmbed] = useState(false);

  return (
    <section
      id="resume"
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            My <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Resume</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">Download or view my professional resume highlighting my DevOps expertise</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Download Option */}
          <div className="bg-slate-800/50 border border-cyan-500/30 p-8 rounded-xl hover:border-cyan-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 text-center group">
            <FaDownload className="text-cyan-400 text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-cyan-300 mb-3">Download PDF</h3>
            <p className="text-slate-300 mb-6">
              Get my complete resume as a PDF file optimized for ATS systems
            </p>
            <a
              href={resumeConfig.resumeUrl}
              download={resumeConfig.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
            >
              Download Resume
            </a>
          </div>

          {/* View Online Option */}
          <div className="bg-slate-800/50 border border-blue-500/30 p-8 rounded-xl hover:border-blue-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 text-center group">
            <FaEye className="text-blue-400 text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-blue-300 mb-3">View Online</h3>
            <p className="text-slate-300 mb-6">
              Preview my resume directly in your browser
            </p>
            <button
              onClick={() => setShowEmbed(!showEmbed)}
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition duration-300 hover:shadow-lg hover:shadow-blue-500/50"
            >
              {showEmbed ? "Hide Resume" : "View Resume"}
            </button>
          </div>
        </div>

        {/* Embedded Resume Viewer */}
        {showEmbed && (
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-xl p-6 mb-12 animate-fadeIn">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <FaFileAlt /> Resume Preview
            </h3>
            <div className="bg-slate-900 rounded-lg overflow-hidden" style={{ height: "600px" }}>
              <iframe
                src={resumeConfig.resumeUrl}
                width="100%"
                height="600"
                type="application/pdf"
                className="w-full h-full"
              >
                <p className="text-slate-300">
                  Your browser does not support PDF preview. Please{" "}
                  <a
                    href={resumeConfig.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 hover:text-cyan-200 underline transition"
                  >
                    open the resume
                  </a>{" "}
                  instead.
                </p>
              </iframe>
            </div>
          </div>
        )}

        {/* Resume Summary */}
        <div className="mt-12 bg-slate-800/50 border border-purple-500/30 p-8 rounded-xl">
          <h3 className="text-2xl font-semibold text-purple-300 mb-8 flex items-center gap-2">
            <span>📋</span> Professional Overview
          </h3>
          <div className="space-y-6">
            <div className="border-l-4 border-cyan-400 pl-6 py-2">
              <h4 className="text-cyan-300 font-semibold mb-2 uppercase text-sm tracking-wider">👨‍💼 Professional Title</h4>
              <p className="text-slate-300">DevOps Engineer | Cloud Architect | Infrastructure Specialist</p>
            </div>
            <div className="border-l-4 border-blue-400 pl-6 py-2">
              <h4 className="text-blue-300 font-semibold mb-2 uppercase text-sm tracking-wider">📚 Experience</h4>
              <p className="text-slate-300">2+ years of production-level DevOps experience with a focus on Kubernetes orchestration and AWS cloud architecture</p>
            </div>
            <div className="border-l-4 border-green-400 pl-6 py-2">
              <h4 className="text-green-300 font-semibold mb-2 uppercase text-sm tracking-wider">🛠️ Key Technologies</h4>
              <p className="text-slate-300">Kubernetes, Docker, Jenkins, GitHub Actions, Terraform, AWS, Prometheus, Grafana, Ansible, Python, Linux</p>
            </div>
            <div className="border-l-4 border-purple-400 pl-6 py-2">
              <h4 className="text-purple-300 font-semibold mb-2 uppercase text-sm tracking-wider">🎓 Core Competencies</h4>
              <p className="text-slate-300">Container Orchestration, CI/CD Pipelines, Infrastructure as Code, Cloud Security, Monitoring & Observability, Microservices Architecture</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
