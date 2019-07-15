import { FileUpload } from "../interfaces/file-upload";

import path from 'path'
import fs from 'fs'
import uniqid from 'uniqid'
import { resolve } from "url";
import { rejects } from "assert";



export default class FileSystem{

    constructor() { };

    guardarImagenTemporal( file: FileUpload, userId: string) {

        return new Promise((resolve, reject) =>{
            // CREAR CARPETA    
            const path = this.crearCarpetaUsuario(userId);

            //Nombre Archivo
            const nombreArchivo = this.generarNombreUnico( file.name);
            
            // Mover Archivo del temp a carpeta final
            file.mv( `${path}/${nombreArchivo}`, (err: any) =>{
                if(err){
                    // no se puede mover
                    reject(err);
                }else{
                    resolve();
                    // todo salio bien
                }
            });

        });


     

    }

    private generarNombreUnico(nombreOriginal: string){

        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length -1]; 

        const idUnico = uniqid();

        return `${idUnico}.${extension}`

    }

    private crearCarpetaUsuario(userId: string) {

        const pathUser = path.resolve( __dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';

        const existe = fs.existsSync( pathUser);

        if(!existe){
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp

        
    }

    imagenesDetempHaciaPost( userId: string){

        const pathTemp = path.resolve( __dirname, '../uploads', userId, 'temp');
        const pathPost = path.resolve( __dirname, '../uploads', userId, 'post');

        if( !fs.existsSync(pathTemp)) {
            return [];
        }

        if( !fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        const imagenesTemp = this.obtenerImagenesEnTemp( userId);

        imagenesTemp.forEach( imagen => {
            fs.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`)
        });

        return imagenesTemp;

    }

    private obtenerImagenesEnTemp( userId: string){

        const pathTemp = path.resolve( __dirname, '../uploads', userId, 'temp');

        return fs.readdirSync(pathTemp) || [];

    }

    getFotoUrl(userId: string, img: string){
        
        // Path Posts
        const pathFoto = path.resolve( __dirname, '../uploads', userId, 'post',img);


        // Si la imagen Existe
        if(!fs.existsSync(pathFoto)){
            // cuek
            return path.resolve(__dirname, '../assets/default.png')
        }

        return pathFoto



    }


}