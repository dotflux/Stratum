import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useOutletContext } from "react-router-dom";

interface Log {
  log: string;
  date: Date;
}

interface OutletContextType {
  isExpanded: boolean;
}

const WorkspaceLog = () => {
  const { id } = useParams<{ id: string }>();
  const { isExpanded } = useOutletContext<OutletContextType>();
  const [logs, setLogs] = useState<Log[]>([]);

  const fetchLogs = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/log`,
        {},
        { withCredentials: true }
      );
      if (res.data.valid) {
        setLogs(res.data.logs);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [id]);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isExpanded ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
      } px-4 md:px-0 mt-8 mb-12`}
    >
      <div className="max-w-5xl mx-auto">
        {logs.length > 0 ? (
          <div className="space-y-4">
            {logs.map((entry, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 p-4 bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-lg shadow-md"
              >
                <p className="flex-1 pr-4">{entry.log}</p>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(entry.date).toLocaleDateString("en-GB")}{" "}
                  {new Date(entry.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No logs available.</p>
        )}
      </div>
    </div>
  );
};

export default WorkspaceLog;
