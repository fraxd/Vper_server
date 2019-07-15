"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_model_1 = require("../models/usuario.model");
9;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var token_1 = __importDefault(require("../classes/token"));
var autentificacion_1 = require("../middlewares/autentificacion");
var userRoutes = express_1.Router();
// Login
userRoutes.post('/login', function (req, res) {
    var body = req.body;
    usuario_model_1.Usuario.findOne({ email: body.email }, function (err, userDB) {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario / Contraseña no son correctos'
            });
        }
        if (userDB.comparaPassword(body.password)) {
            var tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario / Contraseña no son correctos **'
            });
        }
    });
});
// CREAR UN USUARIO
userRoutes.post('/create', function (req, res) {
    var user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcryptjs_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    usuario_model_1.Usuario.create(user).then(function (userDB) {
        var tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(function (err) {
        res.json({
            ok: false,
            err: err
        });
    });
});
// actualizar usuario
userRoutes.post('/update', autentificacion_1.verificaToken, function (req, res) {
    var user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, function (err, userDB) {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'no existe un usuario con ese Id'
            });
        }
        var tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    });
});
userRoutes.get('/', [autentificacion_1.verificaToken], function (req, res) {
    var usuario = req.usuario;
    res.json({
        ok: true,
        usuario: usuario
    });
});
exports.default = userRoutes;
