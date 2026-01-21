// src/components/CsvDateUpload.jsx
import React, { useRef, useState } from 'react';
import { analyzeCsvDates } from '../utils/csvDateAnalyzer';

const CsvDateUpload = ({ onDatesExtracted, dateColumnName = "FechaCreacion" }) => {
    const fileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fileName, setFileName] = useState("");

    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsLoading(true);
            setError("");

            analyzeCsvDates(file, dateColumnName, (result) => {
                setIsLoading(false);

                if (result.error) {
                    setError(result.error);
                    setFileName("");
                    return;
                }

                setFileName(file.name);
                onDatesExtracted(result.fechaMin, result.fechaMax);
            });

            // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
            e.target.value = "";
        }
    };

    return (
        <div className="mb-3">
            <div
                className="flex items-center gap-2 p-2 border border-dashed border-indigo-300 rounded-md bg-white cursor-pointer hover:bg-indigo-50 transition-colors"
                onClick={handleIconClick}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                )}
                <span className="text-sm text-gray-600 truncate">
                    {isLoading ? "Analizando..." : fileName ? `📄 ${fileName}` : "Cargar CSV para fechas automáticas"}
                </span>
            </div>

            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}

            <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};

export default CsvDateUpload;
