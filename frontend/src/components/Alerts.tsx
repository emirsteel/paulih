import React from "react";
import { X as XIcon, Check, AlertTriangle, Info, XCircle } from "lucide-react";

export type AlertVariant =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "notification";

export interface AlertBoxProps {
  variant: AlertVariant;
  title?: string;
  description?: string;
  actions?: {
    label: string;
    link?: string;
    onClick?: () => void;
  }[];
  onClose?: () => void;
}

const variantStyles: Record<
  AlertVariant,
  {
    border: string;
    text: string;
    icon: JSX.Element;
  }
> = {
  success: {
    border: "border-l-4 border-green-500 bg-white",
    text: "text-gray-800",
    icon: <Check size={18} className="text-green-500 mr-2 mt-0.5" />,
  },
  error: {
    border: "border-l-4 border-red-500 bg-white",
    text: "text-gray-800",
    icon: <XIcon size={18} className="text-red-500 mr-2 mt-0.5" />,
  },
  warning: {
    border: "border-l-4 border-yellow-500 bg-white",
    text: "text-gray-800",
    icon: <AlertTriangle size={18} className="text-yellow-500 mr-2 mt-0.5" />,
  },
  info: {
    border: "border-l-4 border-blue-500 bg-white",
    text: "text-gray-800",
    icon: <Info size={18} className="text-blue-500 mr-2 mt-0.5" />,
  },
  notification: {
    border: "border-l-4 border-purple-500 bg-white",
    text: "text-gray-800",
    icon: <Info size={18} className="text-purple-500 mr-2 mt-0.5" />,
  },
};

export const AlertBox: React.FC<AlertBoxProps> = ({
  variant,
  title,
  description,
  actions,
  onClose,
}) => {
  const { border, text, icon } = variantStyles[variant];

  return (
    <div
      className={`
    ${border} ${text}
    w-full px-4 py-3 my-4 rounded-md flex items-start gap-3 relative transition
  `}
    >
      {/* Icon */}
      <div className="flex-shrink-0">{icon}</div>

      {/* Text content */}
      <div className="flex-1 text-sm">
        {title && <p className="font-medium mb-0.5">{title}</p>}
        {description && <p className="text-sm text-gray-600">{description}</p>}

        {actions?.length > 0 && (
          <div className="flex flex-wrap items-center mt-2 gap-4">
            {actions.map((action, i) =>
              action.link ? (
                <a
                  key={i}
                  href={action.link}
                  className="text-sm font-medium underline hover:opacity-80"
                >
                  {action.label}
                </a>
              ) : (
                <button
                  key={i}
                  onClick={action.onClick}
                  className="text-sm font-medium underline hover:opacity-80"
                >
                  {action.label}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
          aria-label="Kapat"
        >
          <XCircle size={18} />
        </button>
      )}
    </div>
  );
};
