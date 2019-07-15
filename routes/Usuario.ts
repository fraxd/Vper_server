import {Router, Request, Response, response} from 'express';
import { Usuario } from '../models/usuario.model';9
import bcrypt from 'bcryptjs';
import Token from '../classes/token';
import { request } from 'http';
import { verificaToken } from '../middlewares/autentificacion';



const userRoutes = Router();

// Login

userRoutes.post('/login', (req: Request, res: Response) => {

    const body = req.body;

    Usuario.findOne( {email: body.email}, (err, userDB) => {

        if( err) throw err;

        if( !userDB ){
            return res.json({
                ok: false,
                mensaje: 'Usuario / Contraseña no son correctos'
            });
        }

        if( userDB.comparaPassword(body.password)) {

            const tokenUser = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: tokenUser

            });
        } else{
            return res.json({
                ok: false,
                mensaje: 'Usuario / Contraseña no son correctos **'
            });
        }
        

        


    })


});



// CREAR UN USUARIO
userRoutes.post('/create', (req: Request, res: Response ) =>{

    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync( req.body.password, 10), 
        avatar: req.body.avatar
    }; 

    Usuario.create( user ).then( userDB =>{
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser

        });

    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });


});

// actualizar usuario

userRoutes.post('/update', verificaToken ,(req: any, res: Response) => {

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email   || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    Usuario.findByIdAndUpdate( req.usuario._id, user, {new: true}, (err, userDB) =>{
        if(err) throw err ;

        if( !userDB){
            return res.json({
                ok: false,
                mensaje: 'no existe un usuario con ese Id'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: tokenUser

        });


    } );


    });


    userRoutes.get('/',[verificaToken], (req: any, res: Response) =>{

        const usuario = req.usuario;

        res.json({
            ok:true,
            usuario
        });
    });




export default userRoutes;