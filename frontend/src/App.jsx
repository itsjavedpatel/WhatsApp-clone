import { useEffect, useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import InitializationScreen from "./components/InitializationScreen";
import useChat from "./hooks/useChat";
import EmptyChatState from "./components/EmptyChatState";

function App() {
  const {
    conversations,
    selectedChat,
    messages,
    loading,
    error,
    initialized,
    initializeData,
    selectChat,
    sendMessage,
  } = useChat();

  const [showChatWindow, setShowChatWindow] = useState(false); // mobile view

  useEffect(() => {
    if (!initialized) {
      initializeData();
    }
  }, [initialized, initializeData]);

  if (!initialized) {
    return <InitializationScreen loading={loading} error={error} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`w-full md:w-1/3 border-r border-gray-300 bg-white flex flex-col ${
          showChatWindow ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="bg-green-600 text-white p-4">
          <h2 className="text-xl font-semibold">Chats</h2>
        </div>
        <ChatList
          conversations={conversations}
          onSelectChat={(chat) => {
            selectChat(chat);
            setShowChatWindow(true); // switch to chat window on mobile
          }}
          loading={loading}
          error={error}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 flex-col ${
          showChatWindow ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedChat ? (
          <ChatWindow
            messages={messages}
            onSendMessage={sendMessage}
            contact={selectedChat}
            error={error}
            onBack={() => setShowChatWindow(false)} // back button for mobile
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}

export default App;
