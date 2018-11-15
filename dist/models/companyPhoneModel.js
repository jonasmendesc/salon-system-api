"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../utils/util");
exports.default = (sequelize, dataTypes) => {
    const companyPhone = sequelize.define("CompanyPhone", {
        id: {
            type: dataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => {
                return util_1.generateIdUnique();
            }
        },
        phone: {
            type: dataTypes.STRING(30),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        phoneType: {
            type: dataTypes.ENUM("Comercial", "Residencial", "Outro"),
            allowNull: false,
            validate: {
                notEmpty: true
            },
        },
        isActive: {
            type: dataTypes.BOOLEAN,
            allowNull: true,
            validate: {
                notEmpty: true
            },
            defaultValue: true
        }
    }, {
        tableName: "companyphones", indexes: [
            {
                unique: true,
                fields: ['companyId', 'phone']
            },
            {
                unique: true,
                fields: ['companyId', 'phoneType']
            }
        ]
    });
    return companyPhone;
};
