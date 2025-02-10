import { useState } from 'react'
import './App.css'
import FormInit from './components/formInit';
import FileUpload from './components/FileUpload';
import { readCSV } from './utils/csvUtils';
import { generateSQLScript, downloadSQLFile } from "./utils/sqlGenerator";

function App() {
  const [formData, setFormData] = useState({
    server: "",
    database: "",
    user: "",
    password: "",
    table: ""
  });

  const [step, setStep] = useState(1);  // Nuevo estado para controlar el paso
  const [headers, setHeaders] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    setStep(2);  // Cambiar el paso a 2 para mostrar el logo y texto
  };

  const handleBack = () => {
    setStep(1);  // Volver al formulario en step 1
  };

  const handleFileChange = (file) => {
    readCSV(file, ({ headers, rows }) => {
      if (!headers || headers.length === 0) {
        console.error("El archivo CSV no tiene headers válidos.");
        return;
      }
  
      // Generar el script SQL usando el nombre de la tabla desde el formulario
      const sqlScript = generateSQLScript([headers, ...rows], formData.table);
  
      // Descargar el archivo SQL
      downloadSQLFile(sqlScript);
    });
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {step === 1 ? (
        <FormInit formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
      ) : step == 2 ? (
        <div className="text-center hover:text-indigo-600">
          {/* Icono de retroceso */}
          {/* <svg xmlns="http://www.w3.org/2000/svg"  width="48" height="48" fill="currentColor" className="bi bi-skip-backward-fill text-indigo-600 mb-20 mx-auto cursor-pointer text-center" viewBox="0 0 16 16" onClick={handleBack}>
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M11.729 5.055a.5.5 0 0 0-.52.038L8.5 7.028V5.5a.5.5 0 0 0-.79-.407L5 7.028V5.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0V8.972l2.71 1.935a.5.5 0 0 0 .79-.407V8.972l2.71 1.935A.5.5 0 0 0 12 10.5v-5a.5.5 0 0 0-.271-.445"/>
          </svg>
 */}
          <FileUpload onFileChange={handleFileChange} />
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Headers del archivo CSV</h2>
          <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
            <ul>
              {headers.map((header, index) => (
                <li key={index} className="text-lg text-indigo-600">{header}</li>
              ))}
            </ul>
          </div>
        </div>
      ) }
    </div>
  );
}

export default App
