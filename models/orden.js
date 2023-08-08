'use strict';
module.exports = (sequelize, DataTypes) => {
    const orden = sequelize.define('orden', {
        numeroOrden: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0001'       
        },
        fechaRegistro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        fechaReserva: {
            type:DataTypes.DATE,
            defaultValue: () => {
                const today = new Date();
                today.setDate(today.getDate() + 5);
                return today;
            }
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
    }, { freezeTableName: true });

    orden.beforeCreate((orden, options) => {
        return orden.constructor.findOne({
            order: [['numeroOrden', 'DESC']]
        })
        .then((lastOrden) => {
            if (lastOrden) {
                const lastNumeroOrden = parseInt(lastOrden.numeroOrden.split('-')[1]);
                const newNumeroOrden = `0000-${(lastNumeroOrden + 1).toString().padStart(4, '0')}`;
                orden.numeroOrden = newNumeroOrden;
            } else {
                orden.numeroOrden = '0000-0001';
            }
        });
    });

    orden.associate = function (models) {
        orden.hasMany(models.detalleOrden, { foreignKey: 'id_orden', as: "detalleOrden"});
        orden.belongsTo(models.persona, { foreignKey: 'id_persona'});
  
    };
    return orden;
};
