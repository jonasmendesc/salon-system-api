"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../utils/util");
exports.default = (sequelize, dataTypes) => {
    const promotion = sequelize.define("Promotion", {
        id: {
            type: dataTypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            comment: "Identificador do registro"
        },
        dateTimeMonthInitial: {
            type: dataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                isInt: true
            }
        },
        dateTimeMonthEnd: {
            type: dataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                isInt: true
            }
        },
        discountPercentage: {
            type: dataTypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {
                notEmpty: true,
                isDecimal: true
            }
        },
        isActive: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, { tableName: 'promotion' });
    return promotion;
};
