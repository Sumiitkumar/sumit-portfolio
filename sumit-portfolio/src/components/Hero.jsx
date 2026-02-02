import React, { useState, useEffect } from "react";
import { resumeConfig } from "../config/resumeConfig";
import { FaTerminal, FaServer, FaCloud, FaCode } from "react-icons/fa";

const Hero = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [terminalText, setTerminalText] = useState("");
  const fullText = "$ kubectl get sumit --output=yaml";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTerminalText(fullText.slice(0, index + 1));
        index++;
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-20 relative overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, transparent 24%, rgba(68,192,239,.05) 25%, rgba(68,192,239,.05) 26%, transparent 27%, transparent 74%, rgba(68,192,239,.05) 75%, rgba(68,192,239,.05) 76%, transparent 77%, transparent), linear-gradient(0deg, transparent 24%, rgba(68,192,239,.05) 25%, rgba(68,192,239,.05) 26%, transparent 27%, transparent 74%, rgba(68,192,239,.05) 75%, rgba(68,192,239,.05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Icon Badges */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <div className="px-4 py-2 bg-blue-500/20 border border-blue-400/50 rounded-full flex items-center gap-2">
            <FaServer className="text-blue-400" />
            <span className="text-sm text-blue-200">DevOps Orchestration</span>
          </div>
          <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded-full flex items-center gap-2">
            <FaCloud className="text-cyan-400" />
            <span className="text-sm text-cyan-200">Cloud Architecture</span>
          </div>
          <div className="px-4 py-2 bg-purple-500/20 border border-purple-400/50 rounded-full flex items-center gap-2">
            <FaCode className="text-purple-400" />
            <span className="text-sm text-purple-200">Infrastructure as Code</span>
          </div>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
              sumit-kumar
            </span>
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-cyan-200 mb-6 font-mono">
            DevOps Engineer | Kubernetes Architect | Cloud Specialist
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-8">
            🚀 Orchestrating containerized ecosystems with Kubernetes • Automating infrastructure at scale 
            • Building resilient CI/CD pipelines • Expertise in AWS, Terraform, and cloud-native technologies
          </p>
        </div>

        {/* Terminal Command Box */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="bg-slate-950 border border-cyan-500/30 rounded-lg overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 border-b border-cyan-500/20 flex items-center gap-2">
              <FaTerminal className="text-cyan-400 text-sm" />
              <span className="text-cyan-300 text-xs font-mono">sumit@devops:~$</span>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm">
              <div className="text-cyan-400 mb-4 min-h-6">
                <span>{terminalText}</span>
                <span className="animate-pulse">_</span>
              </div>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition duration-300 hover:shadow-lg hover:shadow-cyan-500/50 w-full"
              >
                Execute Query
              </button>
            </div>
          </div>
        </div>

        {/* Download Resume Button */}
        <div className="flex justify-center mb-12">
          <a
            href={resumeConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition duration-300 hover:shadow-lg hover:shadow-purple-500/50"
          >
            📄 Download Resume
          </a>
        </div>

        {/* kubectl Details Box */}
        {showDetails && (
          <div className="mt-8 bg-slate-950 border-2 border-cyan-500/50 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4 border-b border-cyan-500/20">
              <div className="text-white font-mono text-sm font-semibold">Pod Information</div>
            </div>

            {/* Content */}
            <div className="p-6 font-mono text-sm space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="text-cyan-400">
                    <span className="font-semibold">apiVersion:</span>
                    <span className="text-slate-400"> devops/v1</span>
                  </div>
                  <div className="text-cyan-400">
                    <span className="font-semibold">kind:</span>
                    <span className="text-slate-400"> DevOpsEngineer</span>
                  </div>
                  <div className="text-cyan-400">
                    <span className="font-semibold">metadata.name:</span>
                    <span className="text-blue-300"> sumit-kumar</span>
                  </div>
                  <div className="text-cyan-400">
                    <span className="font-semibold">metadata.namespace:</span>
                    <span className="text-blue-300"> production</span>
                  </div>
                  <div className="text-cyan-400">
                    <span className="font-semibold">status.phase:</span>
                    <span className="text-green-400"> Running</span>
                  </div>
                  <div className="text-cyan-400">
                    <span className="font-semibold">experience:</span>
                    <span className="text-blue-300"> 2+ Years</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="text-cyan-400">
                    <span className="font-semibold">specialization:</span>
                    <span className="text-blue-300"> [Kubernetes, AWS, Terraform]</span>
                  </div>
                  <div className="text-cyan-400">
                    <span className="font-semibold">containerRuntime:</span>
                    <span className="text-blue-300"> Docker</span>
                  </div>
                  <div className="text-cyan-400">
                    <span className="font-semibold">nodeStatus:</span>
                    <span className="text-green-400"> Ready</span>
                  </div>
                  <div className="text-cyan-400">
                    <span className="font-semibold">location:</span>
                    <span className="text-blue-300"> India</span>
                  </div>
                  <div className="text-cyan-400">
                    <span className="font-semibold">availability:</span>
                    <span className="text-blue-300"> Open to Opportunities</span>
                  </div>
                  <div className="text-cyan-400">
                    <span className="font-semibold">replicas:</span>
                    <span className="text-green-400"> 1/1 Ready</span>
                  </div>
                </div>
              </div>

              {/* Core Skills */}
              <div className="mt-6 pt-4 border-t border-cyan-500/20">
                <div className="text-green-400 font-semibold mb-3">Core Competencies:</div>
                <div className="text-slate-300 text-xs space-y-1">
                  <div>🔹 <span className="text-cyan-300">Kubernetes:</span> Cluster Design, Helm, Operators, Multi-cluster</div>
                  <div>🔹 <span className="text-cyan-300">AWS:</span> EC2, ECS, EKS, Lambda, RDS, S3, VPC</div>
                  <div>🔹 <span className="text-cyan-300">IaC:</span> Terraform, CloudFormation, Ansible</div>
                  <div>🔹 <span className="text-cyan-300">CI/CD:</span> Jenkins, GitHub Actions, GitLab CI, ArgoCD</div>
                  <div>🔹 <span className="text-cyan-300">Monitoring:</span> Prometheus, Grafana, ELK Stack</div>
                  <div>🔹 <span className="text-cyan-300">Tools:</span> Docker, Git, Linux, Python, Shell Scripting</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
