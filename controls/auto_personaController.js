'use strict'
var models = require('../models/');
var auto_persona = models.auto_persona;

const { validationResult } = require('express-validator');

class auto_personaController{
    async listar(req, res){
        var lista = await auto_persona.findAll({
            attributes: [
                'externalId'
            ],
            include: [{
                model: models.persona,
                as: "persona",
                attributes: [
                    'nombres',
                    'apellidos',
                    'tipo_Identificacion',
                    'identificacion',
                    'direccion'
                ]
            },{
                model: models.auto,
                as: "auto",
                attributes: [
                    'modelo',
                    'descripcion',
                    'year'
                ]
            }
        ]
    });
    res.json({
        msg: "OK!",
        code: 200,
        info: lista
    })
    console.log(lista)
    }
    
    async obtener(req, res){
        const identificacion = req.body.identificacion;

        const personaAux = await models.persona.findOne({
            where: {
                identificacion: identificacion
            }
        });
        if (!personaAux) {
            return res.status(400).json({
                msg: "NO EXISTE ESA PERSONA",
                code: 400
            })
        }
        var lista = await auto_persona.findAll({
            where:{
                id_persona : personaAux.id
            },
            attributes: [
                'externalId'
            ],
            include: [{
                model: models.persona,
                as: "persona",
                attributes: [
                    'nombres',
                    'apellidos',
                    'tipo_Identificacion',
                    'identificacion',
                    'direccion'
                ]
            },{
                model: models.auto,
                as: "auto",
                attributes: [
                    'modelo',
                    'descripcion',
                    'year',
                    'externalId'
                ]
            }
        ]
    });
    res.json({
        msg: "OK!",
        code: 200,
        info: lista
    })
    console.log(lista)
    }
}
module.exports = auto_personaController;