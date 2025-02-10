// src/utils/csvUtils.js
import Papa from 'papaparse';

export const readCSV = (file, callback) => {
  Papa.parse(file, {
    complete: (result) => {
      const [headers, ...rows] = result.data;  // Extraemos headers y filas
      callback({ headers, rows });  // Retornamos ambos en un objeto
    },
    header: false, // No interpretar como objeto, solo como array
    skipEmptyLines: true, // Omitir líneas vacías
  });
};
