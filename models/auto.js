'use strict';
module.exports = (sequelize, DataTypes) => {
    const auto = sequelize.define('auto',{
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
        image: {
          type: DataTypes.STRING,
          defaultValue: null
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

    auto.associate = function (models) {
        auto.belongsTo(models.marca,{ foreignKey: 'id_marca'});
        auto.hasMany(models.detalleFactura,{ foreignKey: 'id_auto', as: "detalleFactura"})
    }

    return auto;
}