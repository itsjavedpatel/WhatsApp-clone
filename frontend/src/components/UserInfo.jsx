export default function UserInfo({ contact, onBack }) {
  return (
    <div className="bg-green-600 text-white p-4 flex items-center">
      <button
        className="md:hidden mr-3 text-white hover:text-gray-200"
        onClick={onBack}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3">
        {contact?.contact_name?.charAt(0) || contact?._id?.charAt(0)}
      </div>
      <div>
        <h3 className="font-semibold">
          {contact?.contact_name || contact?._id}
        </h3>
        <p className="text-xs opacity-80">Online</p>
      </div>
    </div>
  );
}
