export default function BackButton({ onClick }) {
    return (
      <button
        onClick={onClick}
        className="cursor-pointer fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
      >
        Volver Atrás
      </button>
    );
  }
  