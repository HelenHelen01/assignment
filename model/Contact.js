const Sequelize = require('sequelize');
const bcrypt = require('bcrypt')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('contact', {
        firstname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        phone_number: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          validate: {
              is: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              notNull: {
                  msg: "Email is invalid."
              },
              notEmpty: true,
              isEmail: true,
          }
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
     },
      createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
      }
    }, {
        sequelize,
        tableName: 'contact',
        timestamps: false,
    });
}
