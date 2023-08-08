'use strict';
module.exports = (sequelize, DataTypes) => {
    const factura = sequelize.define('factura', {
        numeroFactura: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '0000-0000-0001'       
        },
        fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
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

    factura.associate = function (models) {
        factura.hasMany(models.detalleFactura, { foreignKey: 'id_factura', as: "detalleFactura"});
        factura.belongsTo(models.persona, { foreignKey: 'id_persona'});
    };

    factura.beforeCreate(async (factura, options) => {
        const lastFactura = await factura.constructor.findOne({
            order: [['numeroFactura', 'DESC']]
        });

        if (lastFactura) {
            const lastNumeroFactura = parseInt(lastFactura.numeroFactura.replace(/-/g, ''));
            const newNumeroFactura = (lastNumeroFactura + 1).toString().padStart(12, '0');
            factura.numeroFactura = newNumeroFactura.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
        }
    });
    return factura;
};