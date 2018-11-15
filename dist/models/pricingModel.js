"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../utils/util");
exports.default = (sequelize, dataTypes) => {
    const pricing = sequelize.define("Pricing", {
        id: {
            type: dataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            comment: "Identificador do registro"
        },
        pricingValue: {
            type: dataTypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },
        isActive: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            defaultValue: true
        },
        pricingType: {
            type: dataTypes.ENUM("PLAN", "MOBILE"),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, { tableName: 'pricing' });
    return pricing;
};
