import { Router, Response } from "express";
import { verificaToken } from "../middlewares/autentificacion";
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/file-upload";
import { FILE } from "dns";
import FileSystem from "../classes/file-System";



const postRoutes = Router();
const fileSystem = new FileSystem();


// Obtener POST paginados
postRoutes.get('/', async (req: any, res: Response) =>{

    let pagina = Number (req.query.pagina) || 1
    let skip = pagina -1;
    skip = skip * 10

    const posts = await Post.find()
                            .sort({ _id: -1})
                            .skip(skip)
                            .limit(10)
                            .populate('usuario','-password')
                            .exec();


    res.json({
        ok: true,
        pagina,
        posts
    }); 

});


// Crear Post
postRoutes.post('/', [ verificaToken], (req: any, res: Response) =>{

    const body = req.body;

    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesDetempHaciaPost(req.usuario._id);
    body.imgs = imagenes;

    Post.create( body).then(async postDB =>{
        await postDB.populate('usuario','-password').execPopulate();

        res.json({
            ok: true,
            post: postDB
        });


    }).catch( err =>{
        res.json(err)
    });


  
});

// Servicio Subida Archivos

postRoutes.post('/upload', [verificaToken], async (req: any, res: Response)=>{

    if(!req.files){
        return res.status(400).json({
            ok:false,
            mensaje: 'no se subio ningun archivo'
        });
    }

    const file: FileUpload = req.files.image

    if(!file){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo - image'
        });
    }
    if( !file.mimetype.includes('image')){
        return res.status(400).json({
            ok:false,
            mensaje: 'no es una imagen lo subido'
        });
    }

    await fileSystem.guardarImagenTemporal(file, req.usuario._id);

    res.json({
        ok: true,
        file: file.mimetype
    });

});

postRoutes.get('/imagen/:userId/:img',(req:any, res: Response) =>{

    const userId    = req.params.userId;
    const img       = req.params.img;
    
    const pathFoto = fileSystem.getFotoUrl( userId, img);

    res.sendFile( pathFoto);




})



export default postRoutes;
