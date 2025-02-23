export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include', // Para enviar cookies
      });

      if (response.ok) {
        window.location.reload(); // Recargar la página tras cerrar sesión
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
    >
      Cerrar Sesión
    </button>
  );
}
