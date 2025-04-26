import { useState } from "react";
import errorIcon from "../../../../assets/error.svg";
import Loader from "../../../SignUp/Loader";
import axios from "axios";
import { useParams } from "react-router-dom";

interface ModalProps {
  isCreateOpen: boolean;
  onClose: () => void;
}

const TaskCreateModal = ({ isCreateOpen, onClose }: ModalProps) => {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [assignedUsername, setAssignedUsername] = useState("");
  const [description, setDescription] = useState("");
  const [stepInput, setStepInput] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  if (!isCreateOpen) return null;

  const delay = (d: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, d * 1000);
    });
  };

  const removeModal = () => {
    setSubmitting(false);
    setTaskName("");
    setDescription("");
    setAssignedUsername("");
    setStepInput("");
    setSteps([]);
    setHours(0);
    setMinutes(30);
    setDays(0);
    setError("");
    onClose();
  };

  const addStep = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === "ArrowRight") && stepInput.trim()) {
      if (steps.length >= 5) {
        setError(`Max 5 steps allowed.`);
        return;
      }
      setSteps((prev) => [...prev, stepInput.trim()]);
      setStepInput("");
      setError("");
    }
  };

  const removeStep = (indexToRemove: number) => {
    setSteps((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60;

    if (totalSeconds < 1800)
      return setError("Deadline must be at least 30 minutes.");
    if (totalSeconds > 30 * 24 * 3600)
      return setError("Deadline cannot exceed 30 days.");

    setSubmitting(true);
    const taskPayload = {
      name: taskName,
      assignedToUsername: assignedUsername,
      description,
      steps,
      deadline: { days, hours, minutes },
    };
    try {
      setSubmitting(true);
      await delay(5);
      const response = await axios.post(
        `http://localhost:3000/workspace/${id}/task/create`,
        taskPayload,
        {
          withCredentials: true, // Equivalent to `credentials: "include"`
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.valid) {
        setSubmitting(false);
        setTaskName("");
        setDescription("");
        setAssignedUsername("");
        setStepInput("");
        setSteps([]);
        setHours(0);
        setMinutes(30);
        setDays(0);
        setError("");
        onClose();
        window.location.reload();
      }
    } catch (error) {
      setSubmitting(false);
      if (axios.isAxiosError(error) && error.response) {
        const backendErrors = error.response.data;
        if (backendErrors) {
          setError(`${backendErrors.error}`);
        }

        console.log("Backend Error:", backendErrors);
      } else {
        console.log("Network Error:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative max-h-screen overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-semibold text-white mb-4 ">Create Task</h2>
        <button
          onClick={removeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          aria-label="Close Modal"
        >
          &#x2715;
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="text-white block mb-1">Task Name</label>
            <input
              type="text"
              required
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter task name"
            />
          </div>
          {/* Assigned Username */}
          <div>
            <label className="text-white block mb-1">Assigned Username</label>
            <input
              type="text"
              value={assignedUsername}
              onChange={(e) => setAssignedUsername(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter assignee's username"
            />
          </div>
          {/* Description */}
          <div>
            <label className="text-white block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={120}
              style={{ resize: "none" }}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Optional description (max 50 characters)"
            ></textarea>
          </div>
          {/* Steps input with inline numbered tags */}
          <div>
            <label className="text-white block mb-1">Steps</label>
            <div className="flex items-center flex-wrap gap-2 bg-gray-700 p-2 rounded max-h-24 overflow-y-auto custom-scrollbar">
              {steps.map((step, index) => (
                <span
                  key={index}
                  className="flex items-center bg-gray-600 text-white px-2 py-1 rounded whitespace-nowrap"
                >
                  {index + 1}.{" "}
                  {step.length > 20 ? `${step.slice(0, 20)}...` : step}
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="ml-1 text-red-400 hover:text-red-600"
                    aria-label={`Remove step ${index + 1}`}
                  >
                    &#x2715;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={stepInput}
                onChange={(e) => setStepInput(e.target.value)}
                onKeyDown={addStep}
                className="bg-transparent text-white outline-none flex-1 min-w-[100px]"
                placeholder="Add step... (Optional,Max 5)"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Press Right Arrow key to add step.
            </p>
          </div>
          {/* Deadline */}
          <div>
            <label className="text-white block mb-1">
              Deadline (Days:Hours:Minutes)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(+e.target.value)}
                min={0}
                className="w-1/3 p-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Days"
              />
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(+e.target.value)}
                min={0}
                max={23}
                className="w-1/3 p-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Hours"
              />
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(+e.target.value)}
                min={0}
                max={59}
                className="w-1/3 p-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Minutes"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Min 30 minutes; Max 30 days.
            </p>
          </div>
          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2">
              <img src={errorIcon} alt="Error" className="w-4 h-4" />
              <span className="text-red-600">{error}</span>
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 rounded-md transition shadow-lg"
          >
            {isSubmitting ? <Loader /> : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateModal;
