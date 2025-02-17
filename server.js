import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de conexión a SQL Server
const dbConfig = {
    user: "",
    password: '',
    server: '104.245.34.33\\sqlexpress',
    database: '',
    options: {
        encrypt: false, // Necesario si el servidor requiere conexión segura
        trustServerCertificate: true, // Cambiar según tu configuración de seguridad
    },
};

// Ruta para obtener datos de SQL Server
app.get('/api/data', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT TOP 10 * FROM qVentaNegocio'); // Cambia la consulta según tu base de datos
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/insert', async(req, res) => {
    const {text, user, password, database} = req.body;

    dbConfig.user = user
    dbConfig.password = password
    dbConfig.database = database

    console.log(dbConfig)
    console.log('El texto es: ', text)

    try {
        await sql.connect(dbConfig);
        
        //Cruda
        const resultCruda = await sql.query(text.crudaScript); // Cambia la consulta según tu base de datos
        console.log("cruda: ", resultCruda)

        //cTransform
        const resultTransform = await sql.query(text.transformScript);
        console.log("resultTransform: ", resultTransform)

        //cTemp
        const resultTemp = await sql.query(text.pTemp);
        console.log("resultTemp: ", resultTemp)

        //cTemp
        const resultTable = await sql.query(text.pTable);
        console.log("resultTable: ", resultTable)

        
        console.log("Iniciando los 10 s")
        await new Promise(resolve => setTimeout(resolve, 10000));
        console.log("terminado los 10 s")


        //cleanTransform
        const cleanTransform = await sql.query(text.cleanTransform);
        console.log("cleanTransform: ", cleanTransform)

        //cleanTemp
        const cleanTemp = await sql.query(text.cleanTemp);
        console.log("cleanTemp: ", cleanTemp)


        res.json(resultTable);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
})

// Iniciar el servidor en el puerto 3001
app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
