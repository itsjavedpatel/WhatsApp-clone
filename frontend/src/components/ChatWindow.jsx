import { useRef, useEffect } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import UserInfo from "./UserInfo";
import ErrorMessage from "./ErrorMessage";


export default function ChatWindow({
  messages,
  onSendMessage,
  contact,
  error,

  onBack = () => setShowChatWindow(false), // Added onBack prop for back navigation
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <UserInfo contact={contact} onBack={onBack} />
      {error && <ErrorMessage message={error} />}
      <div
        className="flex-1 p-4 overflow-y-auto bg-[#e5ddd5] bg-opacity-30"
        style={{
          backgroundImage:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB/SURBVDhP7dAxDkAhDETRZP9lZgXU7AeXKJbwJZbYwK+0OjPj7hARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER+QN3lQZkyqJQ5AAAAABJRU5ErkJggg==")',
          backgroundAttachment: "fixed",
        }}
      >
        <div className="space-y-2">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <MessageInput onSend={onSendMessage} />
    </div>
  );
}
