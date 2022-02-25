const Sequelize = require('sequelize');
const bcrypt = require('bcrypt')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('customer', {
        company_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telephone: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        employees: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        location: {
          type: DataTypes.STRING,
          defaultValue: null
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: null,
        },
    }, {
        sequelize,
        tableName: 'customer',
        timestamps: false,
    });
}
