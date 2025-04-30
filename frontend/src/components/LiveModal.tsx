import React, { useRef, useEffect, useState, useContext } from "react";
import {
  FiArrowLeft,
  FiCamera,
  FiRotateCw,
  FiFilter,
  FiPlay,
  FiX,
  FiSettings,
  FiMic,
  FiMonitor,
  FiGlobe,
  FiLock,
  FiUsers,
  FiTrash2,
} from "react-icons/fi";
import { AuthUserContext } from "../context/AuthUserContext";
import { useLiveStream } from "../context/LiveStreamContext";
import { FaGlobeAmericas } from "react-icons/fa";

interface LiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveModal: React.FC<LiveModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const livePreviewRef = useRef<HTMLVideoElement>(null);

  // Access user information from AuthUserContext
  const authUserContext = useContext(AuthUserContext);
  if (!authUserContext) {
    throw new Error("AuthUserContext must be used within an AuthUserProvider");
  }

  const getProfileImageUrl = (imagePath: string) => {
    return imagePath
      ? `http://localhost:5001/${imagePath}`
      : "/default-profile.png";
  };

  const { user, loading } = authUserContext;
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isBackCamera, setIsBackCamera] = useState(false);
  const [filterPopupOpen, setFilterPopupOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<string>("");
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string | null>(
    null
  );
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [pollQuestion, setPollQuestion] = useState(""); // Poll question
  const [pollChoices, setPollChoices] = useState(["", ""]); // Default 2 choices
  const [selectedChoice, setSelectedChoice] = useState(null); // Track selected choice

  const { isLive, startLive, stopLive } = useLiveStream();
  const [error, setError] = useState<string | null>(null);

  const filters = [
    { name: "None", style: "", imageUrl: "https://i.imgur.com/zdWDQun.jpeg" },
    {
      name: "Grayscale",
      style: "grayscale(100%)",
      imageUrl: "https://i.imgur.com/TN4Q7TK.png",
    },
    {
      name: "Sepia",
      style: "sepia(100%)",
      imageUrl: "https://i.imgur.com/3BMS5oR.jpeg",
    },
    {
      name: "Contrast",
      style: "contrast(200%)",
      imageUrl: "https://i.imgur.com/wl1fqHU.png",
    },
    {
      name: "Brightness",
      style: "brightness(150%)",
      imageUrl: "https://i.imgur.com/PY6MW1G.png",
    },
  ];

  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request permissions to access devices
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        setCameras(devices.filter((device) => device.kind === "videoinput"));
        setMicrophones(
          devices.filter((device) => device.kind === "audioinput")
        );
      } catch (err) {
        console.error("Error accessing devices:", err);
      }
    };

    const startCamera = async (facingMode: "user" | "environment") => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error starting camera:", err);
      }
    };

    if (isOpen) {
      getDevices();
      startCamera(isBackCamera ? "environment" : "user");
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, isBackCamera]);

  const handleCameraChange = async (deviceId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId },
      });
      setStream(stream);
      setSelectedCamera(deviceId);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error changing camera:", err);
    }
  };

  const handleMicrophoneChange = async (deviceId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId },
      });
      setStream((prevStream) => {
        const audioTrack = stream.getAudioTracks()[0];
        prevStream?.getAudioTracks().forEach((track) => track.stop());
        if (prevStream) {
          prevStream.addTrack(audioTrack);
        }
        return prevStream;
      });
      setSelectedMicrophone(deviceId);
    } catch (err) {
      console.error("Error changing microphone:", err);
    }
  };

  const handleReverseCamera = () => {
    setIsBackCamera((prev) => !prev);
  };

  const applyFilter = (filterStyle: string) => {
    setCurrentFilter(filterStyle);
    if (videoRef.current) {
      videoRef.current.style.filter = filterStyle;
    }
    setFilterPopupOpen(false);
  };

  const handleRotateVideo = () => {
    if (videoRef.current) {
      const currentTransform =
        videoRef.current.style.transform || "rotate(0deg)";
      const rotateMatch = currentTransform.match(/rotate\((\d+)deg\)/);
      const currentAngle = rotateMatch ? parseInt(rotateMatch[1], 10) : 0;
      videoRef.current.style.transform = `rotate(${currentAngle + 90}deg)`;
    }
  };

  const [selectedOption, setSelectedOption] = useState("everyone");

  // Mapping of icons based on selected option
  const sharingIcons = {
    everyone: <FaGlobeAmericas className="text-gray-500" size={12} />,
    friends: <FiUsers className="text-gray-500" size={12} />,
    private: <FiLock className="text-gray-500" size={12} />,
  };

  const handleShareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setStream(screenStream);
      setIsScreenSharing(true);
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const handleStopScreenSharing = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsScreenSharing(false);
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(cameraStream);
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
    } catch (error) {
      console.error("Error stopping screen sharing:", error);
    }
  };

  // Handle choice text changes
  const handleChoiceChange = (index: number, value: string) => {
    setPollChoices((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Add a new choice (max 4)
  const addChoice = () => {
    if (pollChoices.length < 4) {
      setPollChoices((prev) => [...prev, ""]);
    }
  };

  // Remove a choice
  const removeChoice = (index: number) => {
    setPollChoices((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle choice selection in the preview
  const handleChoiceSelect = (index) => {
    setSelectedChoice(index);
  };

  const handleStartLive = async () => {
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("User media acquired:", userMedia); // Debug log
      startLive(userMedia); // Start live streaming with the media stream
    } catch (err) {
      console.error("Error starting live stream:", err);
      setError("Failed to access your camera or microphone.");
    }
  };

  const handleStopLive = () => {
    stopLive(); // Stop live streaming
  };

  useEffect(() => {
    console.log("Is live:", isLive);
  }, [isLive]);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
              onClick={() => {
                if (stream) {
                  stream.getTracks().forEach((track) => track.stop());
                }
                onClose();
              }}
            >
              <FiArrowLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-lg font-bold text-gray-800 text-center flex-grow">
              Live Stream
            </h2>
          </div>

          {/* Live Video */}
          <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ filter: currentFilter }}
            />

            {/* Controls */}
            <div className="absolute bottom-4 left-4 flex space-x-4">
              {/* Reverse Camera */}
              <button
                className="relative p-2 bg-gray-800 rounded-full hover:bg-opacity-90 transition"
                onClick={handleReverseCamera}
              >
                <FiCamera className="text-white" size={20} />
              </button>

              {/* Filter */}
              <button
                className="relative p-2 bg-gray-800 rounded-full hover:bg-opacity-90 transition"
                onClick={() => setFilterPopupOpen((prev) => !prev)}
              >
                <FiFilter className="text-white" size={20} />
              </button>

              {/* Rotate */}
              <button
                className="relative p-2 bg-gray-800 rounded-full hover:bg-opacity-90 transition"
                onClick={handleRotateVideo}
              >
                <FiRotateCw className="text-white" size={20} />
              </button>

              {/* Settings */}
              <button
                className="relative p-2 bg-gray-800 rounded-full hover:bg-opacity-90 transition"
                onClick={() => setSettingsOpen(true)}
              >
                <FiSettings className="text-white" size={20} />
              </button>
            </div>

            {/* Go Live */}
            <button
              className="absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-md shadow-md hover:bg-red-600 transition"
              onClick={handleStartLive}
            >
              <FiPlay className="text-white" size={14} />
              {isLive ? "Streaming..." : "Go Live"}
            </button>
          </div>

          {/* Filter Popup */}
          {filterPopupOpen && (
            <div className="absolute bottom-16 left-4 w-60 bg-white rounded-lg p-4 shadow-lg">
              <h3 className="text-sm font-bold mb-2">Select Filter</h3>
              {filters.map((filter) => (
                <button
                  key={filter.name}
                  className="flex items-center p-2 hover:bg-gray-100 rounded-lg w-full"
                  onClick={() => applyFilter(filter.style)}
                >
                  <img
                    src={filter.imageUrl}
                    alt={filter.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="ml-3 text-sm">{filter.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Settings Modal */}
          {settingsOpen && (
            <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-[40rem] shadow-lg flex flex-col max-h-[80vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 relative">
                  <h2 className="text-lg font-bold text-gray-800">Settings</h2>
                  <button
                    className="absolute right-0 top-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                    onClick={() => setSettingsOpen(false)}
                  >
                    <FiX size={20} className="text-gray-600" />
                  </button>
                </div>

                {/* Horizontal Rule */}
                <hr className="border-gray-300 mb-6" />

                {/* Modal Content */}
                <div className="flex overflow-y-auto">
                  {/* Left Section */}
                  <div className="flex-1 pr-8 border-r border-gray-300">
                    {/* Sharing Options */}
                    <div className="mb-4">
                      <h3 className="text-md font-semibold text-gray-700 text-left mb-1">
                        Sharing Options
                      </h3>
                      <p className="text-sm text-gray-500 text-left mb-2">
                        Select who can view your live stream.
                      </p>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="live-sharing"
                            value="everyone"
                            className="form-radio h-4 w-4 text-blue-500"
                            defaultChecked
                            onChange={() => setSelectedOption("everyone")} // Update state
                          />
                          <span className="flex items-center text-gray-700 text-sm">
                            <FiGlobe className="text-blue-500 text-lg mr-2" />
                            For Everyone
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="live-sharing"
                            value="friends"
                            className="form-radio h-4 w-4 text-blue-500"
                            onChange={() => setSelectedOption("friends")} // Update state
                          />
                          <span className="flex items-center text-gray-700 text-sm">
                            <FiUsers className="text-blue-500 text-lg mr-2" />
                            For Friends
                          </span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="live-sharing"
                            value="private"
                            className="form-radio h-4 w-4 text-blue-500"
                            onChange={() => setSelectedOption("private")} // Update state
                          />
                          <span className="flex items-center text-gray-700 text-sm">
                            <FiLock className="text-blue-500 text-lg mr-2" />
                            Private
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Camera Controls */}
                    <h3 className="text-md font-semibold text-gray-700 mb-1 text-left">
                      Camera Controls
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 text-left">
                      Ensure proper configuration of your camera and microphone.
                    </p>

                    {/* Camera Selection */}
                    <div className="flex items-center gap-2 mb-4">
                      <FiCamera className="text-gray-600 text-sm" />
                      <select
                        className="flex-1 p-2 bg-gray-100 text-gray-800 rounded border border-gray-300 focus:ring focus:ring-blue-300"
                        onChange={(e) => handleCameraChange(e.target.value)}
                      >
                        <option value="" disabled>
                          Select a camera
                        </option>
                        {cameras.map((camera) => (
                          <option key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || "Unknown Camera"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Microphone Selection */}
                    <div className="flex items-center gap-2 mb-4">
                      <FiMic className="text-gray-600 text-sm" />
                      <select
                        className="flex-1 p-2 bg-gray-100 text-gray-800 rounded border border-gray-300 focus:ring focus:ring-blue-300"
                        onChange={(e) => handleMicrophoneChange(e.target.value)}
                      >
                        <option value="" disabled>
                          Select a microphone
                        </option>
                        {microphones.map((mic) => (
                          <option key={mic.deviceId} value={mic.deviceId}>
                            {mic.label || "Unknown Microphone"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Screen Sharing */}
                    <div className="flex items-center gap-2">
                      <FiMonitor className="text-gray-600 text-sm" />
                      <button
                        className={`flex-1 px-4 py-2 rounded transition ${
                          isScreenSharing
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                        onClick={
                          isScreenSharing
                            ? handleStopScreenSharing
                            : handleShareScreen
                        }
                      >
                        {isScreenSharing
                          ? "Stop Sharing Screen"
                          : "Share Screen"}
                      </button>
                    </div>

                    {/* Create Poll Section */}
                    <div className="mt-6">
                      {/* Title and Description */}
                      <div className="mb-4">
                        <h3 className="text-md font-semibold text-gray-700 mb-1 text-left">
                          Create Poll
                        </h3>
                        <p className="text-sm text-gray-500 text-left">
                          Easily create a poll by asking a question and
                          providing multiple choices for participants to select
                          from.
                        </p>
                      </div>

                      {/* Poll Question */}
                      <div className="relative w-full mb-6">
                        <input
                          type="text"
                          id="poll-question"
                          className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-0 transition peer"
                          placeholder=" " // Empty placeholder for spacing
                          value={pollQuestion}
                          onChange={(e) => setPollQuestion(e.target.value)}
                        />
                        <label
                          htmlFor="poll-question"
                          className={`absolute left-4 px-1 bg-white text-sm transition-all duration-200 
        ${
          pollQuestion
            ? "-top-2 text-red-500" // Label stays above when input has value
            : "top-3 text-gray-400" // Label behaves like placeholder
        }
        peer-focus:-top-2 peer-focus:text-red-500 peer-focus:bg-white`}
                        >
                          Ask a Question
                        </label>
                      </div>

                      {/* Poll Choices */}
                      <div className="mb-4">
                        {pollChoices.map((choice, index) => (
                          <div
                            key={index}
                            className="relative flex items-center gap-3 mb-4"
                          >
                            <div className="relative w-full">
                              <input
                                type="text"
                                id={`choice-${index}`}
                                className="flex-1 px-4 pt-3 pb-1 w-full border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-0 transition peer"
                                placeholder=" " // Empty placeholder for spacing
                                value={choice}
                                onChange={(e) =>
                                  handleChoiceChange(index, e.target.value)
                                }
                              />
                              <label
                                htmlFor={`choice-${index}`}
                                className={`absolute left-4 px-1 bg-white text-sm transition-all duration-200 
              ${
                choice
                  ? "-top-2 text-blue-500" // Label stays above when input has value
                  : "top-3 text-gray-400" // Label behaves like placeholder
              }
              peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white`}
                              >
                                Choice {index + 1}
                              </label>
                            </div>
                            {pollChoices.length > 2 && (
                              <button
                                onClick={() => removeChoice(index)}
                                className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-100 transition"
                                style={{ flexShrink: 0 }} // Prevents resizing in flex containers
                              >
                                <FiTrash2 className="text-red-600 text-md" />
                              </button>
                            )}
                          </div>
                        ))}
                        {pollChoices.length < 4 && (
                          <button
                            className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 mt-2 transition hover:bg-gray-100 px-2 py-1 rounded-lg"
                            onClick={addChoice}
                          >
                            <span className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                              +
                            </span>
                            Add Choice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-center ml-8 mr-8 w-1/3">
                    {/* User Info */}
                    <div className="flex items-center mb-6 w-full">
                      {/* Left Section: Profile Image, Name, and Sharing Icon */}
                      <div className="flex items-center">
                        <img
                          src={getProfileImageUrl(user?.profileImage)}
                          alt="User Profile"
                          className="w-10 h-10 rounded-full shadow-md mr-3"
                        />
                        <div className="flex items-center">
                          <h3 className="text-sm font-normal text-gray-800 mr-2">
                            {loading ? "Loading..." : user?.name || "User Name"}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mr-1">•</span>{" "}
                            {/* Middle dot with equal spacing */}
                            {sharingIcons[selectedOption]}{" "}
                            {/* Dynamically updated icon */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Live Preview */}
                    <div className="w-full h-40 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center shadow-lg">
                      {stream ? (
                        <video
                          ref={livePreviewRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Live preview not available
                        </p>
                      )}
                    </div>

                    {/* Poll Preview Section */}
                    {(pollQuestion ||
                      pollChoices.some((choice) => choice.trim() !== "")) && (
                      <div className="w-full mt-6 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <p className="text-lg font-bold text-gray-700 mb-4 text-left">
                          {pollQuestion || "Your question will appear here..."}
                        </p>
                        <ul className="space-y-4">
                          {pollChoices.map(
                            (choice, index) =>
                              choice.trim() && ( // Only render non-empty choices
                                <li
                                  key={index}
                                  className="p-2 border rounded-lg hover:shadow transition"
                                >
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name="poll"
                                      className="form-radio text-blue-500 focus:ring-0"
                                      checked={selectedChoice === index}
                                      onChange={() => handleChoiceSelect(index)} // Handle choice selection
                                    />
                                    <span className="text-gray-700 text-sm">
                                      {choice.trim()}
                                    </span>
                                  </label>
                                  <div className="relative mt-2 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`absolute top-0 left-0 h-full rounded-full ${
                                        selectedChoice === index
                                          ? "bg-green-500"
                                          : "bg-gray-200"
                                      }`}
                                      style={{
                                        width:
                                          selectedChoice === index
                                            ? "100%"
                                            : "0%",
                                      }}
                                    ></div>
                                  </div>
                                  {selectedChoice === index && (
                                    <span className="text-sm text-green-600 mt-1 ml-2">
                                      100%
                                    </span>
                                  )}
                                </li>
                              )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default LiveModal;
