
import { Schema, Document, model} from 'mongoose';

const postSchema = new Schema({

    created: {
        type: Date
    },
    nombreProducto: {
        type: String
    },
    ingProducto: {              /// ingredientes producto
        type: String
    },
    marca: {            // Marca del producto
        type: String
    },
    imgs: [{
        type: String
    }],
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true , 'Debe existir una referencia a Usuario ']
    }

});

postSchema.pre<IPost>('save', function( next){
    this.created = new Date();
    next();
});

interface IPost extends Document {
    created: Date;
    nombreProducto: string;
    ingProducto: string;
    marca: string;
    img: string[];

}

export const Post = model<IPost>('Post', postSchema); 
