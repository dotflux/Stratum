import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import checkIcon from "../../../../assets/check.svg";
import crossIcon from "../../../../assets/uncheck.svg";

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

interface TaskModalProps {
  task: TaskInfo;
  onClose: () => void;
  isExpired: boolean;
  handleTaskDone: (taskId: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  onClose,
  isExpired,
  handleTaskDone,
}) => {
  const { id } = useParams();
  const [steps, setSteps] = useState<Steps[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (task) {
      setSteps(task.steps);
      setIsSaved(false);
    }
  }, [task]);

  const toggleStep = (index: number) => {
    setSteps((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        // Only allow toggling if not saved or not already done
        if (isSaved && s.done) return s;
        return { ...s, done: !s.done };
      })
    );
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/task/updateSteps`,
        {
          taskId: task.taskId,
          steps,
        },
        { withCredentials: true }
      );
      if (res.data.valid) {
        setIsSaved(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  const handleDone = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/task/markDone`,
        {
          taskId: task.taskId,
          isExpired,
        },
        { withCredentials: true }
      );
      if (res.data.valid) {
        onClose();
        handleTaskDone(task.taskId);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  const deadlineDate = new Date(task.deadline);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl max-w-xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          aria-label="Close Modal"
        >
          &#x2715;
        </button>

        <h2 className="text-2xl font-extrabold text-white mb-4">{task.name}</h2>
        <p className="text-base text-gray-300 mb-4 overflow-y-auto break-words">
          {task.description}
        </p>
        <p className="text-sm text-gray-200 mb-2">
          <span className="font-semibold">Assigned:</span> {task.assignedTo}
        </p>
        <p className="text-sm text-gray-200 mb-4">
          <span className="font-semibold">Deadline:</span>{" "}
          {deadlineDate.toLocaleDateString("en-GB")}{" "}
          {deadlineDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <div>
          <h3 className="text-lg font-bold text-white mb-2">List</h3>
          <ul className="space-y-2">
            {steps.map((step, index) => (
              <li
                key={index}
                onClick={() => toggleStep(index)}
                className="cursor-pointer flex items-center gap-2 text-gray-300 hover:text-white transition"
              >
                {step.done ? <img src={checkIcon} /> : <img src={crossIcon} />}{" "}
                {step.task}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`mt-6 w-full py-2 rounded font-semibold text-white transition ${
            isSaved
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isSaved ? "Progress Saved" : "Save Progress"}
        </button>
        <button
          onClick={handleDone}
          className={`mt-6 w-full py-2 rounded font-semibold text-white transition ${
            isExpired
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isExpired ? "Delete" : "Mark as done"}
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
