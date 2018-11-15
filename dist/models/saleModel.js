"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../utils/util");
exports.default = (sequelize, datatypes) => {
    const sale = sequelize.define("Sale", {
        id: {
            type: datatypes.STRING(50),
            primaryKey: true,
            allowNull: false,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            comment: "Identificador do registro do plano"
        },
        dateTimeMonthPlan: {
            type: datatypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true,
                notEmpty: true,
                max: 36,
                min: 0
            }
        },
        licenseCode: {
            type: datatypes.STRING(50),
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
        proposed: {
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
        salePrincing: {
            type: datatypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        saleTotal: {
            type: datatypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        discountValue: {
            type: datatypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        discountPercentage: {
            type: datatypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {
                notEmpty: true,
                min: 0,
                max: 99
            },
        },
        freeVersion: {
            type: datatypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            validate: {
                notEmpty: true
            }
        },
        freeDay: {
            type: datatypes.INTEGER,
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
            type: datatypes.STRING(90),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        dueDate: {
            type: datatypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: true,
                isDate: true
            }
        }
    }, {
        tableName: "sale"
    });
    sale.associate = (models) => {
        sale.hasMany(models.SaleMobile, {
            foreignKey: {
                allowNull: false,
                field: "saleId",
                name: "saleId"
            }
        });
    };
    return sale;
};
