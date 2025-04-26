import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import TaskModal from "./TaskModal";

interface Steps {
  task: string;
  done: boolean;
}

interface TaskInfo {
  taskId: string;
  name: string;
  description: string;
  deadline: Date;
  steps: Steps[];
  assignedTo: string;
  createdAt: Date;
}

interface Props {
  search: string;
  username: string;
  showOnlyAssigned: boolean;
}

const TaskBoxes = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskInfo | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/workspace/${id}/task/list`,
          {},
          { withCredentials: true }
        );
        if (response.data.valid) setTasks(response.data.tasks);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          console.log(err.response.data.message);
        }
      }
    };
    fetchTasks();
  }, [id]);

  const filtered = tasks.filter((t) => {
    const q = props.search.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);
    const matchesAssigned =
      !props.showOnlyAssigned || t.assignedTo === props.username;
    return matchesSearch && matchesAssigned;
  });

  const handleTaskDone = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.taskId !== taskId));
    setSelectedTask(null);
  };

  return (
    <div className="px-4 md:px-0 mt-8 mb-12">
      {filtered.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {filtered.map((task) => {
              // compute deadlines, glow, truncation as before...
              const createdAt = new Date(task.createdAt).getTime();
              const deadlineTime = new Date(task.deadline).getTime();
              const now = Date.now();
              const totalDuration = deadlineTime - createdAt;
              const timeLeft = deadlineTime - now;
              const percentRemaining = Math.max(
                0,
                Math.min(100, (timeLeft / totalDuration) * 100)
              );
              const isExpired = timeLeft <= 0;
              const glowClass = isExpired
                ? "hover:shadow-[0_0_16px_4px_rgba(239,68,68,0.6)]"
                : "hover:shadow-[0_0_16px_4px_rgba(34,197,94,0.6)]";

              const totalSecondsLeft = Math.max(Math.floor(timeLeft / 1000), 0);
              const days = Math.floor(totalSecondsLeft / 86400);
              const hours = Math.floor((totalSecondsLeft % 86400) / 3600);
              const minutes = Math.floor((totalSecondsLeft % 3600) / 60);

              const shortDesc =
                task.description.length > 0
                  ? task.description.length > 30
                    ? task.description.slice(0, 30) + "..."
                    : task.description
                  : "No description";

              return (
                <div
                  key={task.taskId}
                  className={`border border-gray-700 rounded p-6
                    bg-gradient-to-br from-gray-800 to-gray-900 text-white
                    shadow-lg transform transition duration-300
                    hover:scale-105 ${glowClass}`}
                  onClick={() => setSelectedTask(task)}
                >
                  <h2 className="font-extrabold text-xl mb-2">{task.name}</h2>
                  <p className="text-sm text-gray-300 mb-3">{shortDesc}</p>
                  <p className="text-sm mb-3">
                    <span className="font-semibold text-gray-200">
                      Assigned:
                    </span>{" "}
                    {task.assignedTo}
                  </p>
                  <div>
                    <div className="w-full bg-gray-700 h-4 rounded overflow-hidden">
                      <div
                        className="h-4 origin-left transform transition-all duration-300 bg-gradient-to-r from-green-500 to-blue-500"
                        style={{
                          transform: `scaleX(${percentRemaining / 100})`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 text-gray-400">
                      {days}d {hours}h {minutes}m left
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {selectedTask && (
            <TaskModal
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
              isExpired={
                new Date(selectedTask.deadline).getTime() - Date.now() <= 0
              }
              handleTaskDone={handleTaskDone}
            />
          )}
        </div>
      ) : (
        <p className="text-white text-center">No tasks found.</p>
      )}
    </div>
  );
};

export default TaskBoxes;
