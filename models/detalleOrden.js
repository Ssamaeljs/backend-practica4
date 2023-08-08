'use strict';
module.exports = (sequelize, DataTypes) =>{
    const detalleOrden = sequelize.define('detalleOrden',{
        numeroDetalle:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cantidad:{
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        precioUnitario:{
            type: DataTypes.FLOAT,
            defaultValue: null
        },
        total:{
            type: DataTypes.FLOAT,
            defaultValue: null
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
    }, {freezeTableName: true})

    detalleOrden.associate = function(models){
        detalleOrden.belongsTo(models.orden,{foreignKey: 'id_orden'});
        detalleOrden.belongsTo(models.repuesto, {foreignKey: 'id_repuesto'});
    }

    return detalleOrden;
}