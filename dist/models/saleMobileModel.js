"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../utils/util");
exports.default = (sequelize, dataTypes) => {
    const saleMobile = sequelize.define("SaleMobile", {
        id: {
            type: dataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => {
                return util_1.generateIdUnique();
            }
        },
        dateTimeMonthPlan: {
            type: dataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
                max: 12,
                min: 0
            }
        },
        licenseCode: {
            type: dataTypes.STRING(50),
            allowNull: false,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            validate: {
                notEmpty: true
            },
            unique: true,
            comment: "Identificador do registro do plano"
        },
        serialNumber: {
            type: dataTypes.STRING(50),
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        nameMobile: {
            type: dataTypes.STRING(50),
            allowNull: true
        },
        isActive: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                notEmpty: true,
            }
        },
        freeVersion: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                notEmpty: true
            }
        },
        freeDay: {
            type: dataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                isInt: true,
                min: 0,
                max: 31
            },
            defaultValue: 0
        },
        dueDateExtension: {
            type: dataTypes.STRING(90),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        dueDate: {
            type: dataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
                isDate: true
            }
        },
        mobileValue: {
            type: dataTypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
    }, {
        tableName: "saleMobile"
    });
    return saleMobile;
};
