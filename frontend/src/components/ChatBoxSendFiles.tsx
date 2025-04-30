/********************************************************************
 * ChatBoxSendFiles.tsx
 *
 * Bir dosya (PDF, DOCX, vb.) yüklemek için açılır pencere.
 * Kullanıcı açıklama ekleyip Gönder'e basabilir.
 ********************************************************************/

import React, { useState, DragEvent, ChangeEvent, useRef } from "react";
import { FiX, FiFileText } from "react-icons/fi";
import { sendMessage } from "../services/api";

interface FriendType {
  _id: string;
  name: string;
  username: string;
  profileImage: string;
}

interface GroupType {
  _id: string;
  name: string;
  image?: string;
  members: { _id: string; profileImage?: string }[];
  createdAt: string;
}

interface ChatBoxSendFilesProps {
  friend?: FriendType | null;
  group?: GroupType | null;
  onClose: () => void;
  onFileSent: (newMessage: any) => void;
}

const ChatBoxSendFiles: React.FC<ChatBoxSendFilesProps> = ({
  friend,
  group,
  onClose,
  onFileSent,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const formatFileSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileTypeLabel = (filename: string): string => {
    const parts = filename.split(".");
    const ext = parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "";
    if (ext === "PDF") return "PDF Belgesi";
    if (ext === "XLS" || ext === "XLSX") return "Excel Tablosu";
    if (ext === "DOC" || ext === "DOCX") return "Word Belgesi";
    if (ext === "PPT" || ext === "PPTX") return "PowerPoint Sunumu";
    return ext || "Dosya";
  };

  const handleSendFile = async () => {
    if (!selectedFile) {
      alert("Lütfen önce bir dosya seçin!");
      return;
    }
    try {
      const formData = new FormData();
      if (friend) {
        formData.append("receiverId", friend._id);
      } else if (group) {
        formData.append("groupId", group._id);
      }
      formData.append("file", selectedFile);
      formData.append("message", selectedFile.name);
      formData.append("description", description);
      formData.append("fileSize", selectedFile.size.toString());

      const newMessage = await sendMessage(formData);
      onFileSent(newMessage);
      onClose();
    } catch (error) {
      console.error("Dosya yüklenirken hata:", error);
      alert("Dosya yüklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{ cursor: "default" }}
      ></div>

      <div className="relative bg-white w-full max-w-lg rounded-lg shadow-xl z-10">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Dosya Yükle</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
          >
            <FiX size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <label
            htmlFor="fileInput"
            className={`block w-full border-2 border-dashed rounded-md px-6 py-10 text-center cursor-pointer transition ${
              dragActive ? "bg-blue-50 border-blue-400" : "border-gray-300"
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <FiFileText
                size={36}
                className={`${
                  dragActive ? "text-blue-400" : "text-gray-400"
                } mb-3`}
              />
              <p className="text-gray-600 text-sm mb-1">
                Dosyayı sürükleyip bırakın ya da{" "}
                <span className="text-blue-600 underline">dosya seçin</span>
              </p>
              {selectedFile ? (
                <p className="text-sm text-gray-700 mt-2">
                  Seçilen: <strong>{selectedFile.name}</strong>
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-2">
                  Henüz dosya seçilmedi
                </p>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept=".pdf, .xls, .xlsx, .doc, .docx, .ppt, .pptx, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>

          <div className="flex justify-between text-xs text-gray-500 mt-4">
            <span>Desteklenen: PDF, XLS, XLSX, DOC, DOCX, PPT, PPTX</span>
            <span>Maksimum boyut: 25MB</span>
          </div>

          {selectedFile && (
            <div className="mt-6 border rounded-md p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-200 rounded-md">
                  <FiFileText size={32} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 break-words whitespace-normal">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileTypeLabel(selectedFile.name)} •{" "}
                    {formatFileSize(selectedFile.size)}
                  </p>
                  {friend && (
                    <p className="mt-1 text-xs text-gray-500">
                      Alıcı: {friend.name}
                    </p>
                  )}
                  {group && (
                    <p className="mt-1 text-xs text-gray-500">
                      Grup: {group.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Açıklama ekleyin..."
                  className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <button
                onClick={handleSendFile}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Gönder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBoxSendFiles;
