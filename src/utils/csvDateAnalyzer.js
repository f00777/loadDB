// src/utils/csvDateAnalyzer.js
import Papa from 'papaparse';

/**
 * Convierte fecha de varios formatos a YYYY-MM-DD
 * Maneja: DD-MM-YYYY, DD/MM/YYYY, DD-MM-YYYY H:MM:SS, etc.
 * @param {string} fecha - Fecha en varios formatos posibles
 * @returns {string} - Fecha en formato YYYY-MM-DD
 */
const convertirFecha = (fecha) => {
    if (!fecha || typeof fecha !== 'string') return null;

    let fechaTrimmed = fecha.trim();

    // Remover cualquier parte de hora (todo después del espacio)
    // Ejemplo: "02-09-2025 0:00:00" -> "02-09-2025"
    if (fechaTrimmed.includes(' ')) {
        fechaTrimmed = fechaTrimmed.split(' ')[0];
    }

    // Detectar formato YYYY-MM-DD (ya en formato correcto)
    const formatoISO = fechaTrimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (formatoISO) {
        const [, anio, mes, dia] = formatoISO;
        return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }

    // Detectar formato DD-MM-YYYY o DD/MM/YYYY
    const partes = fechaTrimmed.split(/[-/]/);
    if (partes.length === 3) {
        const [parte1, parte2, parte3] = partes;

        // Si la primera parte tiene 4 dígitos, es YYYY-MM-DD
        if (parte1.length === 4) {
            return `${parte1}-${parte2.padStart(2, '0')}-${parte3.padStart(2, '0')}`;
        }

        // Si la última parte tiene 4 dígitos, es DD-MM-YYYY
        if (parte3.length === 4) {
            return `${parte3}-${parte2.padStart(2, '0')}-${parte1.padStart(2, '0')}`;
        }
    }

    // No se pudo parsear
    console.warn('Formato de fecha no reconocido:', fecha);
    return null;
};

/**
 * Analiza un archivo CSV y extrae la fecha mínima y máxima de una columna específica.
 * @param {File} file - Archivo CSV a analizar
 * @param {string} dateColumnName - Nombre de la columna de fecha (default: "FechaCreacion")
 * @param {Function} callback - Función callback que recibe { fechaMin, fechaMax }
 */
export const analyzeCsvDates = (file, dateColumnName = "FechaCreacion", callback) => {
    Papa.parse(file, {
        complete: (result) => {
            const [headers, ...rows] = result.data;

            // Encontrar el índice de la columna de fecha
            const dateColumnIndex = headers.findIndex(
                header => header.trim() === dateColumnName
            );

            if (dateColumnIndex === -1) {
                callback({ error: `Columna "${dateColumnName}" no encontrada en el CSV` });
                return;
            }

            // Extraer todas las fechas y convertirlas a formato YYYY-MM-DD
            const fechas = rows
                .map(row => row[dateColumnIndex])
                .filter(fecha => fecha && fecha.trim() !== '')
                .map(fecha => convertirFecha(fecha))
                .filter(fecha => fecha !== null); // Filtrar conversiones fallidas

            if (fechas.length === 0) {
                callback({ error: 'No se encontraron fechas válidas en la columna' });
                return;
            }

            // Ordenar fechas (formato YYYY-MM-DD permite orden lexicográfico)
            const fechasOrdenadas = [...fechas].sort();

            const fechaMin = fechasOrdenadas[0];
            const fechaMax = fechasOrdenadas[fechasOrdenadas.length - 1];

            callback({ fechaMin, fechaMax });
        },
        header: false,
        skipEmptyLines: true,
    });
};
