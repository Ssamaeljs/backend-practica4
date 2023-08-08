'use strict';
var models = require('../models/');
var orden = models.orden;
var persona = models.persona;

const { validationResult } = require('express-validator');

class ordenController {

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
            const id_persona = req.body.identificacion;

            if (id_persona === undefined) {
                return res.status(400).json({
                    msg: 'FALTAN DATOS',
                    code: 400
                });
            }
            const personaAux = await persona.findOne({
                where: {
                    identificacion: id_persona
                }
            });

            if (!personaAux) {
                return res.status(400).json({
                    msg: 'LA PERSONA NO EXISTE O NO ESTA REGISTRADA',
                    code: 400
                });
            }

            const data = {
                fechaRegistro: req.body.fechaRegistro,
                fechaReserva: req.body.fechaReserva,
                total: 0,
                id_persona: personaAux.id
            };

            const uuid = require('uuid');
            data.externalId = uuid.v4();

            const transaction = await models.sequelize.transaction();
            await orden.create(data, { transaction });
            await transaction.commit();

            return res.status(200).json({
                msg: "ORDEN CREADA",
                code: 200,
                info: data
            });

        } catch (error) {
            console.log(error);
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

    async obtener(req, res) {
        const external = req.body.external_Orden;

        var lista = await orden.findOne({
            where: {
                externalId: external
            },
            attributes: [
                'numeroOrden',
                'fechaRegistro',
                'fechaReserva',
                'total',
                'externalId'
            ], include: [{
                model: models.detalleOrden,
                as: "detalleOrden",
                attributes: [
                    'numeroDetalle',
                    'cantidad',
                    'precioUnitario',
                    'total'
                ],
                include: [{
                    model: models.repuesto,
                    as: "repuesto",
                    attributes: [
                        'modelo',
                        'descripcion'
                    ]
                }]
            }, {
                model: persona,
                as: "persona",
                attributes: [
                    'nombres',
                    'apellidos',
                    'tipo_Identificacion',
                    'identificacion',
                    'direccion'
                ]
            }]
        })
        if (lista === null) {
            lista = {};
        }
        res.json({
            msg: "OK!",
            code: 200,
            info: lista
        })
    }
}
module.exports = ordenController;