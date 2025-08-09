import { format } from "date-fns";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

export default function ChatList({
  conversations,
  onSelectChat,
  loading,
  error,
}) {
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations found
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectChat(conv._id)}
            >
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3">
                {conv.contact_name?.charAt(0) || conv._id.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {conv.contact_name || conv._id}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {format(new Date(conv.lastMessage), "MMM d, h:mm a")}
                </p>
              </div>

              {conv.unreadCount > 0 && (
                <div className="ml-2 w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                  {conv.unreadCount}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
