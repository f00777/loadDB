import { useState } from 'react'
import './App.css'
import FormInit from './components/FormInit';
import FileUpload from './components/FileUpload';
import { readCSV } from './utils/csvUtils';
import { generateSQLScript, downloadSQLFile } from "./utils/sqlGenerator";
import SelectTable from './components/SelectTable';
import {enviarJSONEnOrden, enviarTextoPlanoEnOrden} from './utils/connectAPI';
/* import LogoutButton from './components/LogoutButton';
import BackButton from './components/Backbutton';
 */
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

  const [loading, setLoading] = useState(false)
  
  const [procesados, setProcesados] = useState([]) 

  const [insertResult, setInsertResult] = useState({});

  const agregarElementoProcesado = (text) => {
    // Aquí usamos el estado actual correctamente para agregar el nuevo valor
    setProcesados((prevProcesados) => {
      // Verificamos el valor de prevProcesados antes de agregar el nuevo valor
      return [...prevProcesados, text];
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    
    setLoading(true);

    const response = await enviarJSONEnOrden(
      [
        {
          user: formData.user,
          password : formData.password,
          database: formData.database
        }
      ], "/api/login"
    )

    setLoading(false)

    if(response.exito){
      setStep(2);
    }

    else{
      setStep(6)
    }
    
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
    readCSV(file, async ({ headers, rows }) => {
      if (!headers || headers.length === 0) {
        console.error("El archivo CSV no tiene headers válidos.");
        return;
      } 

      setLoading(true)

      const sqlScript = generateSQLScript([headers, ...rows], formData.table)

      agregarElementoProcesado("Scripts Generado")
  
      try {

        const cleanTemp = await enviarTextoPlanoEnOrden([
          sqlScript.cleanTemp
        ],"/api/query")

        agregarElementoProcesado("Tabla temporal limpiadda")
    
        
        const cleanTransform = await enviarTextoPlanoEnOrden([
            sqlScript.cleanTransform
        ],"/api/query")

        agregarElementoProcesado("Tabla de transformacion limpiada")
    

        const crudaScripts = await enviarTextoPlanoEnOrden(
          sqlScript.crudaScripts, "/api/query"
        )

        agregarElementoProcesado("Datos insertados en Tabla Cruda")
    

        const transformScripts = await enviarTextoPlanoEnOrden(
          sqlScript.transformScripts,"/api/query"
        ) 

        agregarElementoProcesado("Datos insertados en Tabla de Transformacion")
    

        const pTemp = await enviarTextoPlanoEnOrden([
          sqlScript.pTemp
        ],"/api/query")

        agregarElementoProcesado("Datos insertados en Tabla Temporal")
    

        const pTable = await enviarTextoPlanoEnOrden([
          sqlScript.pTable
        ],"/api/query")

        agregarElementoProcesado("Datos insertados en Tabla oficial")

        setStep(5)
        
      } catch (error) {
        setStep(4)
      }
      
  
    
      setLoading(false)
      setProcesados([])

      console.log(sqlScript)
  
      // Descargar el archivo SQL
      //downloadSQLFile(sqlScript2.testScript);
    });
  };

  const lessStep = () => {
    const actualStep = step

    setStep(actualStep -1)
  }

  const step1 = () => {
    setStep(1)
  }

  const step2 = () => {
    setStep(2)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {step === 1 ? (
       loading ? (
        <div className="animate-spin h-5 w-5 border-t-2 border-blue-500 rounded-full"></div>
       ) : (
        <FormInit formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
       )
      ) : step == 2 ? (
        <div className="text-center hover:text-indigo-600">

          {/* <LogoutButton /> */}
          
          <SelectTable handleSelectTableSubmit={handleSelectTableSubmit} />

          {/* <BackButton onClick={lessStep} /> */}
         
        </div>
      ) : step == 3 ? (
        loading ? (
          <div className='text-center'>
            <div className="animate-spin h-10 w-10 border-t-2 border-blue-500 rounded-full mx-auto"></div>

            { <div>
              {procesados.map((item, index) => (
                <p className='text-black pt-4' key={index}><strong>{item}</strong></p>
              ))}
            </div> }

          </div>
         ) : (
          <div className="text-center hover:text-indigo-600">

          {/* <LogoutButton /> */}
          
          <FileUpload onFileChange={handleFileChange} /> 

          {/* <BackButton onClick={lessStep} /> */}

          </div>
         )
      )   
      : step === 4 ? (
        <div className="text-center">
          {/* <LogoutButton /> */}

          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Error insertando datos</h2>

          {/* <BackButton onClick={step1} /> */}
        </div>
      ) : step === 5 ? (
        <div className="text-center">
          {/* <LogoutButton /> */}
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">DATOS INSERTADOS CORRECTAMENTE</h2>
          {/* <BackButton onClick={step2} /> */}
        </div>
      ) : (

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Usuario, Contraseña o Nombre de Base de datos incorrecta</h2>
          {/* <BackButton onClick={step1} /> */}
        </div>

      )
      
      }
    </div>
  );
}

export default App
