'use strict';
var models = require('../models/');
var repuesto = models.repuesto;

const { validationResult } = require('express-validator');

class repuestoController {
    async guardar(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    msg: "FALTAN DATOS",
                    code: 400,
                    errors: errors.array()
                });
            }

            const data = {
                modelo: req.body.modelo,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
                year: req.body.year,
                stock: req.body.stock
            };

            const uuid = require('uuid');
            data.externalId = uuid.v4();

            const transaction = await models.sequelize.transaction();

            await repuesto.create(data, {
                transaction
            });

            await transaction.commit();

            return res.status(200).json({
                msg: "SE HA REGISTRADO EL REPUESTO",
                code: 200
            });
        } catch (error) {
            console.log(error)
            if (error.errors && error.errors[0].message) {
                return res.status(200).json({
                    msg: error.errors[0].message,
                    code: 200
                });
            } else {
                return res.status(500).json({
                    msg: "Ha ocurrido un error en el servidor",
                    code: 500
                });
            }
        }
    }
    async listar(req, res){
        var lista = await repuesto.findAll({
            attributes: [
                'modelo',
                'precio',
                'descripcion',
                'stock',
                'estado',
                'externalId'
            ]
        });
        res.json({
            msg: "OK!",
            code: 200,
            info: lista
        })
    }
}
module.exports = repuestoController;