// src/components/FileUpload.jsx
import React, {useRef} from 'react';

const FileUpload = ({ onFileChange }) => {
    
    const fileInputRef = useRef(null);  // Usamos una referencia para disparar el input file al hacer clic en el icono

    const handleIconClick = () => {
        fileInputRef.current.click();  // Disparamos el click del input file
    };

    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        onFileChange(file);
    }
    };

    return (
    <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" className="text-indigo-500/70 hover:text-indigo-600 bi bi-cloud-arrow-up-fill mx-auto mb-4 cursor-pointer" viewBox="0 0 16 16" onClick={handleIconClick}>
            <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z"/>
        </svg>

        <input
        type="file"
        ref={fileInputRef}  // Vinculamos la referencia al input
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"  // Ocultamos el input
        />
    </div>
    );
};

export default FileUpload;
