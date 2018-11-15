"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../utils/util");
exports.default = (sequelize, datatypes) => {
    const companyEmail = sequelize.define("CompanyEmail", {
        id: {
            type: datatypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            comment: "Identificador do registro do email da empresa"
        },
        email: {
            type: datatypes.STRING(200),
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        isMain: {
            type: datatypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        isActive: {
            type: datatypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            defaultValue: true
        },
        isValidade: {
            type: datatypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            defaultValue: false
        }
    }, { tableName: "companyemails" });
    return companyEmail;
};
