
import Server from './classes/server';
import mongoose from 'mongoose';

import cors from 'cors';


import bodyParse from 'body-parser';
import fileUpload from 'express-fileupload'


import postRoutes from './routes/post';
import userRoutes from './routes/Usuario';



const server = new Server();

// Body Parser
server.app.use( bodyParse.urlencoded({ extended: true}));
server.app.use( bodyParse.json()); 

// FileUpload
server.app.use(fileUpload () );


// COnfigurar Corse
server.app.use( cors({origin: true, credentials: true}));

//Rutas de mi aplicacion 
server.app.use( '/user', userRoutes )
server.app.use( '/Productos', postRoutes )



// Conectar DB

mongoose.connect ( 'mongodb://localhost:27017/usuarios',
                    { useNewUrlParser: true, useCreateIndex: true}, (err) =>{
                        if(err) throw err;

                        console.log('Base de datos ONLINE')
                    })


// Levantar Express

server.start( () => {
    console.log(`Servidor Corriendo en puerto ${ server.port}`);
}); 