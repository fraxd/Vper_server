"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var uniqid_1 = __importDefault(require("uniqid"));
var FileSystem = /** @class */ (function () {
    function FileSystem() {
    }
    ;
    FileSystem.prototype.guardarImagenTemporal = function (file, userId) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // CREAR CARPETA    
            var path = _this.crearCarpetaUsuario(userId);
            //Nombre Archivo
            var nombreArchivo = _this.generarNombreUnico(file.name);
            // Mover Archivo del temp a carpeta final
            file.mv(path + "/" + nombreArchivo, function (err) {
                if (err) {
                    // no se puede mover
                    reject(err);
                }
                else {
                    resolve();
                    // todo salio bien
                }
            });
        });
    };
    FileSystem.prototype.generarNombreUnico = function (nombreOriginal) {
        var nombreArr = nombreOriginal.split('.');
        var extension = nombreArr[nombreArr.length - 1];
        var idUnico = uniqid_1.default();
        return idUnico + "." + extension;
    };
    FileSystem.prototype.crearCarpetaUsuario = function (userId) {
        var pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        var pathUserTemp = pathUser + '/temp';
        var existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    };
    FileSystem.prototype.imagenesDetempHaciaPost = function (userId) {
        var pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        var pathPost = path_1.default.resolve(__dirname, '../uploads', userId, 'post');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        var imagenesTemp = this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(function (imagen) {
            fs_1.default.renameSync(pathTemp + "/" + imagen, pathPost + "/" + imagen);
        });
        return imagenesTemp;
    };
    FileSystem.prototype.obtenerImagenesEnTemp = function (userId) {
        var pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    };
    FileSystem.prototype.getFotoUrl = function (userId, img) {
        // Path Posts
        var pathFoto = path_1.default.resolve(__dirname, '../uploads', userId, 'post', img);
        // Si la imagen Existe
        if (!fs_1.default.existsSync(pathFoto)) {
            // cuek
            return path_1.default.resolve(__dirname, '../assets/default.png');
        }
        return pathFoto;
    };
    return FileSystem;
}());
exports.default = FileSystem;
