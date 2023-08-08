'use strict'
module.exports = (sequelize, DataTypes) => {
    const auto_persona = sequelize.define('auto_persona',{
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

    auto_persona.associate = function (models) {
        auto_persona.belongsTo(models.persona,{ foreignKey: 'id_persona'});
        auto_persona.belongsTo(models.auto, {foreignKey: 'id_auto'});
    }

    return auto_persona;
}