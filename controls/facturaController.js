'use strict';
var models = require('../models/');
var persona = models.persona;
var auto = models.auto;
var factura = models.factura;
var detalleFactura = models.detalleFactura;

const { validationResult } = require('express-validator');

class facturaController {

    async listar(req, res) {
        var lista = await factura.findAll({
            attributes: [
                'numeroFactura',
                'fecha',
                'total',
                'externalId'
            ],
            include: [{
                model: detalleFactura,
                as: "detalleFactura",
                attributes: [
                    'numeroDetalle',
                    'cantidad',
                    'precioUnitario',
                    'total'
                ],
                include: [{
                    model: auto,
                    as: "auto",
                    attributes: [
                        'modelo',
                        'descripcion',
                        'year'
                    ]
                }]
            },{
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
                fecha: req.body.fecha,
                total: 0,
                id_persona: personaAux.id
            };

            const uuid = require('uuid');
            data.externalId = uuid.v4();

            const transaction = await models.sequelize.transaction();
            var result = await factura.create(data, {transaction});
            await transaction.commit();

            return res.status(200).json({
                msg: "FACTURA CREADA",
                code: 200,
                info: result
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

        var lista = await factura.findOne({
            where:{
                externalId: req.params.external
            },
            attributes: [
                'numeroFactura',
                'fecha',
                'total',
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

module.exports = facturaController;
