'use strict';
module.exports = (sequelize, DataTypes) =>{
    const marca = sequelize.define('marca',{
        nombre_Marca:{
            type: DataTypes.STRING(15),
            unique: true,
            defaultValue: null
        },
        pais_Origen:{
            type: DataTypes.STRING(15),
            defaultValue: "Ecuador"
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

    marca.associate = function(models){
        marca.hasMany(models.auto, {foreignKey: 'id_marca', as: "auto"} );
    }

    return marca;
}