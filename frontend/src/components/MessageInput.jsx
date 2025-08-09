import { useState } from 'react';
import { IoSend } from 'react-icons/io5';

export default function MessageInput({ onSend }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form 
      className="p-3 bg-gray-100 flex items-center"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="flex-1 py-2 px-4 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button 
        type="submit"
        className="ml-2 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 focus:outline-none"
        disabled={!message.trim()}
      >
        <IoSend className="w-5 h-5" />
      </button>
    </form>
  );
}