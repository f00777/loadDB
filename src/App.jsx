import { useState } from 'react'
import './App.css'
import FormInit from './components/FormInit';
import FileUpload from './components/FileUpload';
import { readCSV } from './utils/csvUtils';
import { generateSQLScript, downloadSQLFile } from "./utils/sqlGenerator";
import SelectTable from './components/SelectTable';
import Data from './components/Data';

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

  const [insertResult, setInsertResult] = useState({});

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

  const handleSelectTableSubmit = (e) => {
    e.preventDefault();
    const select = document.getElementById("table")
    setFormData({
      ...formData,
      [select.name]: select.value, 
    });
    setStep(3);

  }

  const handleFileChange = (file) => {
    readCSV(file, ({ headers, rows }) => {
      if (!headers || headers.length === 0) {
        console.error("El archivo CSV no tiene headers válidos.");
        return;
      }
  
      // Generar el script SQL usando el nombre de la tabla desde el formulario
      const sqlScript = generateSQLScript([headers, ...rows], formData.table);

      fetch('http://localhost:3001/api/insert', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json', // Asegúrate de enviar el contenido como JSON
          },
          body: JSON.stringify({ text: sqlScript, user: formData.user, password: formData.password, database: formData.database }) // Convierte la cadena a JSON
      })
      .then(response => response.json())
      .then((data) => {
        console.log("la data es: ", data)
        setInsertResult(data)
        setStep(4)
      })
      .catch((error) => {
        console.log("el error es: ", error)
        setInsertResult(error)
      });
  
      // Descargar el archivo SQL
      downloadSQLFile(sqlScript);
    });

    setStep(4);
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {step === 1 ? (
        <FormInit formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
      ) : step == 2 ? (
        <div className="text-center hover:text-indigo-600">
          
          <SelectTable handleSelectTableSubmit={handleSelectTableSubmit} />

         
        </div>
      ) : step == 3 ? (
        <div className="text-center hover:text-indigo-600">
          
          <FileUpload onFileChange={handleFileChange} /> 

        </div>
      )   
      : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Resultados</h2>
            <div>
                {Object.entries(insertResult).map(([key, value]) => (
                    <p key={key} className='text-black'><strong className='text-black'>{key}:</strong> {value}</p>
                ))}
            </div>
          </div>
      ) }
    </div>
  );
}

export default App
