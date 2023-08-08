'use strict';
var models = require('../models/');
var marca = models.marca;
const { validationResult } = require('express-validator');

class marcaController{
    async listar(req,res){
        var lista = await marca.findAll({
            attributes: [
                'nombre_Marca',
                'pais_Origen',
                'externalId'
            ]
        });
        res.json({
            msg: "OK!",
            code: 200,
            info: lista
        })
    }

    async guardar(req, res){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    msg: "FALTAN DATOS",
                    code: 400,
                    errors: errors.array()
                });
            }
            //DERECHA BD = IZQUIERDA APODO PARA GUARDAR
            const data = {
                nombre_Marca: req.body.nombre_Marca,
                pais_Origen: req.body.pais_Origen
            };

            const uuid = require('uuid');
            data.externalId = uuid.v4();

            const transaction = await models.sequelize.transaction();
            await marca.create(data, {transaction});
            await transaction.commit();

            return res.status(200).json({
                msg: "SE HA REGISTRADO LA MARCA CORRECTAMENTE",
                code: 200
            });

        } catch (error) {
            if (error.errors && error.errors[0].message) {
                return res.status(400).json({
                    msg: error.errors[0].message,
                    code: 400
                });
            } else {
                return res.status(400).json({
                    msg: "Ha ocurrido un error en el servidor",
                    code: 400
                });
            }
        }
    }
}
module.exports = marcaController;