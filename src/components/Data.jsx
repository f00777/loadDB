import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/connectAPI';

const Data = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Llamar a la función fetchData para obtener los datos
    const obtenerDatos = async () => {
      try {
        const result = await fetchData();
        setData(result); // Establece los datos obtenidos en el estado
      } catch (error) {
        setError('Hubo un problema al obtener los datos');
      }
    };

    obtenerDatos(); // Ejecutar la función cuando el componente se monte
  }, []); // El array vacío asegura que solo se ejecute una vez al montar el componente

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Datos obtenidos:</h1>
      <ul>
        {console.log(data)}
        {data.map((item, index) => (
          <li key={index}>{item.nombre}</li> // Asegúrate de cambiar "nombre" por la propiedad real
        ))}
      </ul>
    </div>
  );
};

export default Data;
