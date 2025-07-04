import { Link } from "react-router-dom";
import dashboardIcon from "../assets/book.svg";
import workspaceIcon from "../assets/briefcase.svg";
import userIcon from "../assets/userCircle.svg";
import fileIcon from "../assets/folderOpen.svg";
import taskIcon from "../assets/check.svg";
import billingIcon from "../assets/cash.svg";
import techIcon from "../assets/code.svg";
import reactLogo from "../assets/react.svg";

const features = [
  {
    icon: userIcon,
    label: "Secure user authentication and account management",
  },
  {
    icon: workspaceIcon,
    label: "Workspace creation, editing, and member management",
  },
  {
    icon: fileIcon,
    label: "File upload, download, and sharing within workspaces",
  },
  {
    icon: taskIcon,
    label: "Task creation, assignment, and progress tracking",
  },
  {
    icon: billingIcon,
    label: "Dashboard and billing management",
  },
  {
    icon: techIcon,
    label: "Modern tech stack: NestJS, React, TypeScript, Vite, MongoDB",
  },
];

const Index = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#121212] to-[#1a1a1a] overflow-hidden">
      {/* Animated Glow Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-700 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500 opacity-20 rounded-full blur-2xl animate-pulse-slow" />
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-fuchsia-600 opacity-20 rounded-full blur-2xl animate-pulse-slow2" />
      </div>
      {/* Main Content */}
      <div className="relative z-10 max-w-3xl w-full text-center py-16 animate-fade-in">
        <div className="flex justify-center mb-6 animate-float">
          <img
            src={reactLogo}
            alt="Stratum Logo"
            className="w-16 h-16 drop-shadow-xl animate-spin-slow"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent mb-4 drop-shadow-lg animate-slide-down">
          Stratum
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 animate-fade-in delay-200">
          The collaborative workspace and task management platform for modern
          teams. Organize, share, and get things done—beautifully.
        </p>
        <div className="bg-[#18181b]/80 rounded-2xl shadow-2xl p-8 mb-10 border border-[#23232b] backdrop-blur-md animate-fade-in delay-300">
          <h2 className="text-2xl font-bold text-violet-300 mb-6 animate-slide-up">
            Key Features
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {features.map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#23232b] transition group animate-fade-in"
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <img src={feature.icon} alt="" className="w-5 h-5" />
                </span>
                <span className="text-gray-200 group-hover:text-fuchsia-300 transition-colors">
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-500">
          <Link to="/login">
            <button className="px-10 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:from-fuchsia-600 hover:to-violet-700 transition-all duration-200 text-lg animate-bounce">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-10 py-4 bg-[#23232b] border border-violet-600 text-violet-200 font-bold rounded-xl shadow-lg hover:bg-violet-900 hover:text-white hover:scale-105 transition-all duration-200 text-lg animate-bounce delay-100">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
      <footer className="relative z-10 mt-auto py-6 text-gray-500 text-sm animate-fade-in delay-700">
        &copy; {new Date().getFullYear()} Stratum. All rights reserved.
      </footer>
      {/* Animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 1s both; }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in.delay-300 { animation-delay: 0.3s; }
        .animate-fade-in.delay-500 { animation-delay: 0.5s; }
        .animate-fade-in.delay-700 { animation-delay: 0.7s; }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
        .animate-slide-down { animation: slide-down 0.8s cubic-bezier(.4,2,.6,1) both; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(.4,2,.6,1) both; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-bounce { animation: bounce 1.2s infinite; }
        @keyframes spin-slow { 100% { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.4; } }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        @keyframes pulse-slow2 { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.3; } }
        .animate-pulse-slow2 { animation: pulse-slow2 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Index;
