'use strict';
module.exports = (sequelize, DataTypes) => {
    const repuesto = sequelize.define('repuesto',{
        modelo:{
            type: DataTypes.STRING(20),
            defaultValue: 'Camioneta'
        },
        precio:{
            type: DataTypes.FLOAT,
            defaultValue: 10000.00
        },
        descripcion:{
            type: DataTypes.TEXT,
            defaultValue: 'nueva marca'
        },
        year:{
            type: DataTypes.INTEGER,
            defaultValue: 2023
        },
        stock:{
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        estado:{
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        externalId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },{freezeTableName: true})

    repuesto.associate = function (models) {
        repuesto.hasMany(models.detalleOrden,{ foreignKey: 'id_repuesto', as: "detalleFactura"})
    }

    repuesto.beforeSave(async (repuesto) => {
        if (repuesto.stock === 0 || repuesto.stock < 0) {
            repuesto.estado = false;
        }else{
            repuesto.estado = true;
        }
    });

    return repuesto;
}