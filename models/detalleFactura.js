'use strict';
module.exports = (sequelize, DataTypes) =>{
    const detalleFactura = sequelize.define('detalleFactura',{
        numeroDetalle:{
            type: DataTypes.INTEGER,
            allowNull: false
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

    detalleFactura.associate = function(models){
        detalleFactura.belongsTo(models.factura,{foreignKey: 'id_factura'});
        detalleFactura.belongsTo(models.auto, {foreignKey: 'id_auto'});
    }

    return detalleFactura;
}