import { useOutletContext } from "react-router-dom";

interface InfoContextType {
  workspaceInfo: { name: string; description: string; role: string };
}

const MiddleWelcome = () => {
  const { workspaceInfo } = useOutletContext<InfoContextType>();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center animate-drop bg-gray-900 px-4 relative">
      {workspaceInfo && (
        <div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Welcome To {workspaceInfo.name}!
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl">
            {workspaceInfo.description}
          </p>
          <span className="bg-indigo-600 text-white font-bold rounded-full px-6 py-2 shadow-lg">
            {workspaceInfo.role}
          </span>
        </div>
      )}
    </div>
  );
};

export default MiddleWelcome;
