import { useState } from 'react'
import './App.css'
import FormInit from './components/FormInit';
import FileUpload from './components/FileUpload';
import { readCSV } from './utils/csvUtils';
import { generateSQLScript, downloadSQLFile } from "./utils/sqlGenerator";
import SelectTable from './components/SelectTable';
import {enviarJSONEnOrden, enviarTextoPlanoEnOrden, enviarTexto} from './utils/connectAPI';
import LogoutButton from './components/LogoutButton';
import RegretButton from './components/RegretButton';
import Tabla from './components/Tabla';

function App() {
  const [formData, setFormData] = useState({
    server: "",
    database: "",
    user: "",
    password: "",
    table: ""
  });

  const [step, setStep] = useState(1);  // Nuevo estado para controlar el paso

  const [loading, setLoading] = useState(false)
  
  const [procesados, setProcesados] = useState([]) 

  const [insertados, setInsertados] = useState(0)

  const [insertadosT, setInsertadosT] = useState(0)

  const [cantValues, setCantValues] = useState(0)

  const [datosTabla, setDatosTabla] = useState({
    tabla: "",
    registros: 0,
    fecha: "",
    periodo: ""
  })

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

      setCantValues( prev => {
        return prev + sqlScript.values.length
      })

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
          sqlScript.crudaScripts, "/api/query", setInsertados, sqlScript.values.length
        )

        console.log(insertados)

        agregarElementoProcesado("Datos insertados en Tabla Cruda")
    

        const transformScripts = await enviarTextoPlanoEnOrden(
          sqlScript.transformScripts,"/api/query", setInsertadosT, sqlScript.values.length
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


        const responseLastFecha = await enviarTexto([
          sqlScript.lastFecha
        ],"/api/query")

        const responseLastPeriodo = await enviarTexto([
          sqlScript.periodo
        ],"/api/query")

        if(formData.table == "SabanaCompleta"){
          console.log("Se entró a ejecutar spFixSabanaCompleta")
          await enviarTextoPlanoEnOrden(["EXEC spFixSabanaCompleta"], "/api/query")
        }  

        const lastFecha = Object.values(responseLastFecha.exito.exito.recordset[0])[0]
        const lastPeriodo = Object.values(responseLastPeriodo.exito.exito.recordset[0])[0]

        setInsertados(0)
        setInsertadosT(0)
        setCantValues(0)

        setDatosTabla(prev => ({
          ...prev, // Mantiene los valores anteriores
          tabla: formData.table,
          registros: sqlScript.values.length,
          fecha: lastFecha,
          periodo: lastPeriodo
      }));

        setStep(5)
        
      } catch (error) {

        setInsertados(0)
        setInsertadosT(0)
        setCantValues(0)
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

    setInsertados(0)
    setInsertadosT(0)
    setCantValues(0)

    setStep(actualStep -1)
  }

  const step1 = () => {
    setInsertados(0)
    setInsertadosT(0)
    setCantValues(0)

    setStep(1)
  }

  const step2 = () => {
    setInsertados(0)
    setInsertadosT(0)
    setCantValues(0)
    
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

          <LogoutButton />
          
          <SelectTable handleSelectTableSubmit={handleSelectTableSubmit} />

          <RegretButton onClick={lessStep} />
         
        </div>
      ) : step == 3 ? (
        loading ? (
          <div className='text-center'>

            <div className='text-center m-5'>
              <p className='text-black pt-4'><strong>Filas insertadas en Cruda: {insertados} / {cantValues}</strong></p>
              <p className='text-black pt-4'><strong>Filas insertadas en Transform: {insertadosT} / {cantValues}</strong></p>
            </div>

            <div className="animate-spin h-10 w-10 border-t-2 border-blue-500 rounded-full mx-auto"></div>

            { <div>
              {procesados.map((item, index) => (
                <p className='text-black pt-4' key={index}><strong>{item}</strong></p>
              ))}
            </div> }

          </div>
         ) : (
          <div className="text-center hover:text-indigo-600">

          <LogoutButton /> 
          
          <FileUpload onFileChange={handleFileChange} /> 

          <RegretButton onClick={lessStep} />

          </div>
         )
      )   
      : step === 4 ? (
        <div className="text-center">
          <LogoutButton />

          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Error insertando datos</h2>

          <RegretButton onClick={step1} />
        </div>
      ) : step === 5 ? (
        <div className="text-center">
          <LogoutButton />
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">DATOS INSERTADOS CORRECTAMENTE</h2>

          <Tabla 
            tabla={datosTabla.tabla}
            registros={datosTabla.registros}
            ultimaFecha={datosTabla.fecha}
            ultimoPeriodo={datosTabla.periodo}
          />

          <RegretButton onClick={step2} />
        </div>
      ) : (

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Usuario, Contraseña o Nombre de Base de datos incorrecta</h2>
          <RegretButton onClick={step1} />
        </div>

      )
      
      }
    </div>
  );
}

export default App
