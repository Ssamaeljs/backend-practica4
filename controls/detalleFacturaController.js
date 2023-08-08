'use strict';
const models = require('../models/');
const auto = models.auto;
const persona = models.persona;
const factura = models.factura;
const detalleFactura = models.detalleFactura;
var auto_persona = models.auto_persona;

const { validationResult } = require('express-validator');

let numeroDetalle = 1;
let sumaTotales = 0; let totalGeneral = 0; let iva = 0.12;
let numeroFacturaActual = null;

class detalleFacturaController {

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
            const id_factura = req.body.external_Factura;
            const id_auto = req.body.external_Auto;

            if (id_auto === undefined || id_factura === undefined) {
                return res.status(400).json({
                    msg: 'FALTAN DATOS',
                    code: 400
                });
            }

            const facturaAux = await factura.findOne({
                where: {
                    externalId: id_factura
                }
            });

            const autoAux = await auto.findOne({
                where: {
                    externalId: id_auto
                }
            });

            if (!autoAux) {
                return res.status(400).json({
                    msg: 'NO EXISTE EL AUTO',
                    code: 400
                });
            }

            if (numeroFacturaActual !== facturaAux.numeroFactura) {
                numeroDetalle = 1; // Reiniciar el número de detalle a 1
                sumaTotales = 0;
                numeroFacturaActual = facturaAux.numeroFactura; // Actualizar el número de factura actual
            }

            const precioUnitario = autoAux.precio;
            const total = precioUnitario;

            if (autoAux.estado == false) {
                return res.status(200).json({
                    msg: "AUTO NO DISPONIBLE",
                    code: 200
                })
            }

            const data = {
                numeroDetalle: numeroDetalle,
                precioUnitario: precioUnitario,
                total: total,
                id_factura: facturaAux.id,
                id_auto: autoAux.id
            };
            
            const dataTable ={
                id_persona: facturaAux.id_persona,
                id_auto: autoAux.id
            }
            numeroDetalle++;

            sumaTotales += total;
            totalGeneral = iva * sumaTotales;

            const uuid = require('uuid');
            data.externalId = uuid.v4();

            const transaction = await models.sequelize.transaction();

            await factura.update({ total: totalGeneral },
                {
                    where: {
                        id: facturaAux.id
                    },
                    transaction
                }
            );

            console.log(sumaTotales)

            await detalleFactura.create(data, { transaction });
            await auto_persona.create(dataTable, {transaction});
            await transaction.commit();

            autoAux.estado = false;
            console.log(autoAux.estado);

            await autoAux.save();
            return res.status(200).json({
                msg: 'DETALLE FACTURA CREADO CORRECTAMENTE',
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

module.exports = detalleFacturaController;
