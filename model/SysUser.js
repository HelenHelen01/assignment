const Sequelize = require('sequelize');
const bcrypt = require('bcrypt')
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('sys_user', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
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
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [8, 1000] },
        },
        rememberToken: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        email_verified_at: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        active: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: "active"
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        tableName: 'sys_user',
        timestamps: false,
        hooks: {
            beforeCreate: async function (user) {
                const salt = await bcrypt.genSalt(10);
                return user.password = await bcrypt.hash(user.password, salt);
            },
        }
    });
}
