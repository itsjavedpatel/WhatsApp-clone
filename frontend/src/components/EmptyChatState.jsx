export default function EmptyChatState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 max-w-md">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19.11,17.205C17.17,19.065 14.61,20.13 11.817,20.13C9.564,20.13 7.505,19.432 5.818,18.251L2,20L3.518,16.543C2.539,14.853 2,12.95 2,10.915C2,5.415 6.369,1 11.817,1C17.264,1 21.633,5.415 21.633,10.915C21.633,13.5 20.562,15.84 19.11,17.205ZM17.061,15.045L17.5,14.715C18.699,13.81 19.633,12.5 19.633,10.915C19.633,6.565 16.1,3.065 11.817,3.065C7.533,3.065 4,6.565 4,10.915C4,12.5 4.933,13.81 6.133,14.715L6.572,15.045L5.818,18.251C7.505,19.432 9.564,20.13 11.817,20.13L15.264,18.251L14.51,15.045H17.061ZM8.572,8.795H7.633V13.795H8.572V8.795ZM15.386,8.795H14.447V13.795H15.386V8.795Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          WhatsApp Web
        </h2>
        <p className="text-gray-600">Select a chat to start messaging</p>
      </div>
    </div>
  );
}
