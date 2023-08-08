'use strict';
const models = require('../models');

const repuesto = models.repuesto;
const orden = models.orden;
const detalleOrden = models.detalleOrden;

const { validationResult } = require('express-validator');

let numeroDetalle = 1;
let sumaTotales = 0; let totalGeneral = 0; let iva = 0.12;
let numeroOrdenActual = null;

class detalleOrdenController {
    async guardar(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    msg: 'FALTAN DATOS',
                    code: 400,
                    errors: errors.array()
                });
            }
            const id_orden = req.body.external_Orden;
            const id_repuesto = req.body.external_Repuesto;

            if (id_repuesto === undefined || id_orden === undefined) {
                return res.status(400).json({
                    msg: 'FALTAN DATOS',
                    code: 400
                });
            }

            const ordenAux = await orden.findOne({
                where: {
                    externalId: id_orden
                }
            });

            const repuestoAux = await repuesto.findOne({
                where: {
                    externalId: id_repuesto
                }
            });

            if (!repuestoAux) {
                return res.status(400).json({
                    msg: 'NO EXISTE EL REPUESTO',
                    code: 400
                });
            }
            
            if (numeroOrdenActual !== ordenAux.numeroOrden) {
                numeroDetalle = 1; // Reiniciar el número de detalle a 1
                sumaTotales = 0;
                numeroOrdenActual = ordenAux.numeroOrden; // Actualizar el número de orden actual
            }

            const cantidad = req.body.cantidad;
            const precioUnitario = repuestoAux.precio;
            const total = precioUnitario * cantidad;

            if (cantidad === 0 || cantidad > repuestoAux.stock || repuestoAux.stock == 0) {
                return res.status(200).json({
                    msg: "CANTIDAD INVALIDA O REPUESTO NO DISPONIBLE",
                    code: 200
                })
            }

            const data = {
                numeroDetalle: numeroDetalle,
                cantidad: cantidad,
                precioUnitario: precioUnitario,
                total: total,
                id_orden: ordenAux.id,
                id_repuesto: repuestoAux.id
            };

            numeroDetalle++;

            sumaTotales += total;
            totalGeneral = iva * sumaTotales;

            const uuid = require('uuid');
            data.externalId = uuid.v4();

            const transaction = await models.sequelize.transaction();
            
            await orden.update({ total: totalGeneral },
                {
                    where: {
                        id: ordenAux.id
                    },
                    transaction
                }
                );

            console.log(sumaTotales)

            await detalleOrden.create(data, { transaction });
            await transaction.commit();

            repuestoAux.stock = repuestoAux.stock - cantidad;

            await repuestoAux.save();
            
            return res.status(200).json({
                msg: 'DETALLE ORDEN CREADO CORRECTAMENTE',
                code: 200
            });

        } catch (error) {
            console.log(error);
            if (error.errors && error.errors[0].message) {
                return res.status(200).json({
                    msg: error.errors[0].message,
                    code: 400
                });
            } else {
                return res.status(200).json({
                    msg: 'Ha ocurrido un error en el servidor',
                    code: 400
                });
            }
        }
    }
}

module.exports = detalleOrdenController
