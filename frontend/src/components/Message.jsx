import { format } from "date-fns";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

export default function Message({ message }) {
  const isOutbound = message.direction === "outbound";
  const statusIcons = {
    sent: <FaCheck className="text-gray-400" />,
    delivered: <FaCheckDouble className="text-gray-400" />,
    read: <FaCheckDouble className="text-blue-500" />,
  };

  return (
    <div className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
          isOutbound ? "bg-green-100" : "bg-white"
        }`}
      >
        <p className={isOutbound ? "text-gray-800" : "text-gray-800"}>
          {message.text}
        </p>
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-xs text-gray-500">
            {format(new Date(message.timestamp), "h:mm a")}
          </span>
          {isOutbound && (
            <span className="text-xs">
              {statusIcons[message.status] || statusIcons.sent}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
