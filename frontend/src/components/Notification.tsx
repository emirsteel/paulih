// Notification.tsx
import React from "react";

interface NotificationProps {
  message: string;
  type: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  let bgColor = "bg-blue-500";
  if (type === "success") bgColor = "bg-green-500";
  else if (type === "error") bgColor = "bg-red-500";
  else if (type === "warning") bgColor = "bg-yellow-500";

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 text-white ${bgColor} rounded shadow-md`}
    >
      <div className="flex items-center">
        <span className="mr-2">{message}</span>
        <button onClick={onClose} className="ml-auto focus:outline-none">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
