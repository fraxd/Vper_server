"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var postSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    nombreProducto: {
        type: String
    },
    ingProducto: {
        type: String
    },
    marca: {
        type: String
    },
    imgs: [{
            type: String
        }],
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir una referencia a Usuario ']
    }
});
postSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
