// Esta función hace el fetch a la API de Express
export const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/data'); // Asegúrate de que el puerto sea el correcto
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json(); // Parsear la respuesta como JSON
      return data; // Retorna los datos obtenidos
    } catch (error) {
      console.error('Error en el fetch:', error);
      throw error; // Puedes lanzar el error para manejarlo en otro lugar
    }
  };
  