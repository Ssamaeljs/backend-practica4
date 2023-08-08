'use strict';
var models = require('../models/');
var auto = models.auto;
var marca = models.marca;
var path = require('path');
const uuid = require('uuid');
const { validationResult } = require('express-validator');

class autoController {
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

            const id_marca = req.body.external_Marca;
            if (id_marca == undefined) {
                return res.status(400).json({
                    msg: "FALTAN DATOS",
                    code: 400
                });
            }

            const marcaAux = await marca.findOne({
                where: {
                    externalId: id_marca
                }
            });

            if (!marcaAux) {
                return res.status(400).json({
                    msg: "MARCA NO ENCONTRADA",
                    code: 400
                });
            }
            // Verificar si se ha cargado una imagen
            if (!req.file) {
                return res.status(400).json({
                    msg: "FALTA CARGAR LA IMAGEN",
                    code: 400
                });
            }

            const data = {
                modelo: req.body.modelo,
                precio: req.body.precio,
                descripcion: req.body.descripcion,
                year: req.body.year,
                image: req.file.filename,
                id_marca: marcaAux.id
            };

            data.externalId = uuid.v4();

            const transaction = await models.sequelize.transaction();

            await auto.create(data, {
                transaction
            });

            await transaction.commit();

            return res.status(200).json({
                msg: "SE HA REGISTRADO EL AUTO",
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

    async actualizar(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    msg: "FALTAN DATOS",
                    code: 400,
                    errors: errors.array()
                });
            }
            const autoPuto = await auto.findOne({
                where: {
                    externalId: req.body.externalId
                }
            });
    
            if (!autoPuto) {
                return res.status(400).json({
                    msg: "NO EXISTE EL AUTO",
                    code: 400
                });
            }
            const id_marca = req.body.external_Marca;
            if(id_marca == undefined){
                return res.status(400).json({
                    msg: "NO EXISTE LA MARCA",
                    code: 400
                })
            }
    
            const marcaAux = await marca.findOne({
                where: {
                    externalId: id_marca
                }
            });
    
            if (!marcaAux) {
                return res.status(400).json({
                    msg: "MARCA NO ENCONTRADA",
                    code: 400
                });
            }
            
            autoPuto.modelo = req.body.modelo;
            autoPuto.precio = req.body.precio;
            autoPuto.descripcion = req.body.descripcion;
            autoPuto.year = req.body.year;
            //autoPuto.image = req.file.filename;
            autoPuto.id_marca = marcaAux.id;
            autoPuto.estado = req.body.estado;
            autoPuto.externalId = uuid.v4();
    
            const result = await autoPuto.save();
    
            if (!result) {
                return res.status(400).json({
                    msg: "NO SE HAN MODIFICADO EL AUTO",
                    code: 400
                });
            }
    
            return res.status(200).json({
                msg: "SE HA MODIFICADO EL AUTO",
                code: 200
            });
        }catch (error){
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

    async listar(req, res) {
        var lista = await auto.findAll({
            attributes: [
                'modelo',
                'precio',
                'descripcion',
                'year',
                'estado',
                'image',
                'externalId'
            ],
            include: [{
                model: models.marca,
                as: "marca",
                attributes: [
                    'nombre_Marca',
                    'pais_Origen'
                ]
            }]
        });
        res.json({
            msg: "OK!",
            code: 200,
            info: lista
        })
    }

    async eliminar(req, res) {
        const autoPuto = await auto.findOne({
            where: {
                externalId: req.body.externalId
            }
        });

        if (!autoPuto) {
            return res.status(400).json({
                msg: "NO EXISTE EL AUTO",
                code: 400
            });
        }

        const result = await autoPuto.destroy();

        if (!result) {
            return res.status(400).json({
                msg: "NO SE HA ELIMINADO EL AUTO",
                code: 400
            });
        }

        return res.status(200).json({
            msg: "SE HA ELIMINADO EL AUTO",
            code: 200
        });
    }

    async obtener(req, res) {
        const external = req.body.external_Auto;
        var lista = await auto.findOne({
            where: {
                externalId: external
            },
            attributes: [
                'modelo',
                'precio',
                'descripcion',
                'year',
                'image',
                'estado',
                'externalId'
            ],
            include: [{
                model: models.marca,
                as: "marca",
                attributes: [
                    'nombre_Marca',
                    'pais_Origen'
                ]
            }]
        });
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
module.exports = autoController;