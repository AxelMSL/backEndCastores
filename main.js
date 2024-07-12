const express = require('express');
const app = express();
const sql = require('mssql');
const cors = require('cors');

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());
app.use(cors())

const corsOptions = {
  //origin: 'http://loca', // Reemplaza con el dominio que desees permitir
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Configuración de conexión a la base de datos
const config = {
    user: 'sa',
    password: '<Strong@Passw0rd>',
    server: 'localhost', // Puedes cambiar esto según la dirección de tu servidor SQL
    database: 'youtubeCastores',
    options: {
      encrypt: false // Puede ser true en caso de que estés usando una conexión segura (SSL/TLS)
    }
  };
  
  // Función para conectar y ejecutar una consulta
  async function executeQuery(query) {
    try {
      // Conectar a la base de datos
      await sql.connect(config);
  
      // Ejecutar una consulta
      const result = await sql.query(query);
  
      // Imprimir los resultados
      console.dir(result);

      return result.recordset
  
    } catch (err) {
      // Manejo de errores
      console.error('Error al ejecutar la consulta:', err);
    } finally {
      // Cerrar la conexión
      sql.close();
    }
  }
// Ruta POST para manejar la solicitud de creación de un nuevo usuario
app.get('/usuarios', async(req, res) => {
    var query = "Select * from users"
    try {
    var result = await executeQuery(query);
    res.status(201).send(result);
      
    } catch (error) {
      res.status(201).send('error al obtener datos');      
    }
});

app.post('/usuarioNuevo', async(req, res) => {

  const { nombre, email, usuario ,contrasenia } = req.body;

  var query = `insert into users (NombreCompleto,usuario,contrasenia,correoElectronico) values('${nombre}','${usuario}','${contrasenia}','${email}')`;
  try {
   var result= await executeQuery(query);
    res.status(201).send(result);
    
  } catch (error) {
    res.status(400).send('Usuario no creado');
  }
});

app.post('/login', async(req, res) => {

  const { usuario ,contrasenia } = req.body;

  var query = `select * from users where (usuario = '${usuario}' and contrasenia = '${contrasenia}') or (correoElectronico = '${usuario}' and contrasenia = '${contrasenia}')`;
  try {
    var result =await executeQuery(query);
    res.status(201).send(result);
    
  } catch (error) {
    res.status(400).send('Usuario no encontrado');
  }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
