"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../utils/util");
exports.default = (sequelize, dataTypes) => {
    const authorization = sequelize.define("Authorization", {
        id: {
            type: dataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            validate: {
                notEmpty: true
            }
        },
        clientId: {
            type: dataTypes.STRING(50),
            allowNull: false,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            validate: {
                notEmpty: true
            },
            unique: 'uq_client_id'
        },
        clientSecret: {
            type: dataTypes.STRING(50),
            allowNull: false,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            validate: {
                notEmpty: true
            },
            unique: 'uq_client_secret'
        },
        name: {
            type: dataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        isActive: {
            type: dataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            validate: {
                notEmpty: false
            }
        },
        authorizationType: {
            type: dataTypes.ENUM('application', 'company'),
            allowNull: false,
            defaultValue: 'application'
        }
    }, { tableName: "authorizations" });
    authorization.associate = (models) => {
        authorization.hasOne(models.Company, {
            foreignKey: {
                allowNull: false,
                field: "authorizationId",
                name: "authorizationId"
            },
            foreignKeyConstraint: true
        });
    };
    return authorization;
};
