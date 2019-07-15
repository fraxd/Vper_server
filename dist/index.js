"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./classes/server"));
var mongoose_1 = __importDefault(require("mongoose"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var post_1 = __importDefault(require("./routes/post"));
var Usuario_1 = __importDefault(require("./routes/Usuario"));
var server = new server_1.default();
// Body Parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload
server.app.use(express_fileupload_1.default());
// COnfigurar Corse
server.app.use(cors_1.default({ origin: true, credentials: true }));
//Rutas de mi aplicacion 
server.app.use('/user', Usuario_1.default);
server.app.use('/Productos', post_1.default);
// Conectar DB
mongoose_1.default.connect('mongodb://localhost:27017/usuarios', { useNewUrlParser: true, useCreateIndex: true }, function (err) {
    if (err)
        throw err;
    console.log('Base de datos ONLINE');
});
// Levantar Express
server.start(function () {
    console.log("Servidor Corriendo en puerto " + server.port);
});
