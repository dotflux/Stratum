import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useParams, useOutletContext } from "react-router-dom";
import plusIcon from "../../../assets/plus.svg";
import refreshIcon from "../../../assets/refresh.svg";
import deleteIcon from "../../../assets/trash.svg";
import UploadingModal from "./UploadingModal";

interface OutletContextType {
  isExpanded: boolean;
}

interface WorkspaceFile {
  _id: string;
  originalName: string;
  fileName: string;
  path: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  workspace: string;
  createdAt: string;
}

const WorkspaceFiles = () => {
  const { id } = useParams();
  const { isExpanded } = useOutletContext<OutletContextType>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (uploading) return;
    const file = e.target.files?.[0];
    if (!file || !id) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.valid) {
        setUploading(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
      setUploading(false);
    }
  };

  const handleFileFetch = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/listFiles`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.valid) {
        setFiles(res.data.files);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/workspace/${id}/deleteFile`,
        { fileId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.valid) {
        window.location.reload();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  const formatFileSize = (sizeInBytes: number): string => {
    const sizeInKB = sizeInBytes / 1024;
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    }
    const sizeInMB = sizeInKB / 1024;
    return `${sizeInMB.toFixed(1)} MB`;
  };

  useEffect(() => {
    handleFileFetch();
  }, [id]);

  return (
    <div
      className={`relative transition-all duration-300 ${
        isExpanded ? "ml-64 w-[calc(100%-16rem)]" : "ml-0 w-full"
      } px-4 md:px-0 mt-8 mb-12`}
    >
      <div className="max-w-5xl mx-auto relative">
        <h1 className="text-white text-2xl mb-4">Files</h1>

        <div className="absolute top-0 right-0 flex gap-4">
          <button
            onClick={handleUploadClick}
            className="text-white text-3xl bg-blue-600 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          >
            <img src={plusIcon} className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="text-white text-3xl bg-gray-700 hover:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
          >
            <img src={refreshIcon} className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Files grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {files && files.length > 0 ? (
            files.map((file) => (
              <div
                key={file._id}
                className="relative bg-[#1f2937] p-4 rounded-md shadow-md border border-gray-700 hover:border-blue-500 transition duration-200"
              >
                <div className="relative">
                  <button
                    className="absolute top-2 right-2 p-1 rounded hover:bg-gray-700"
                    onClick={() => {
                      handleFileDelete(file._id);
                    }}
                  >
                    <img src={deleteIcon} className="w-4 h-4" />
                  </button>
                </div>
                <div className="mb-2">
                  <p className="text-white font-medium truncate">
                    {file.originalName.length > 10
                      ? file.originalName.slice(0, 30) + "..."
                      : file.originalName}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {file.mimeType} • {formatFileSize(file.size)}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-2">
                  <a
                    href={`http://localhost:3000/uploads/${id}/${file.fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-500"
                  >
                    Download
                  </a>
                  <span className="text-xs text-gray-500">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 mt-4 col-span-full">
              No files uploaded yet.
            </p>
          )}
        </div>
      </div>
      {uploading && <UploadingModal />}
    </div>
  );
};

export default WorkspaceFiles;
