"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../utils/util");
exports.default = (sequelize, datatypes) => {
    const companyAddress = sequelize.define("CompanyAddress", {
        id: {
            type: datatypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            comment: "Identificador do endereço da empresa"
        },
        address: {
            type: datatypes.STRING(300),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        addressNumber: {
            type: datatypes.STRING(15),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        addressPurpose: {
            type: datatypes.ENUM('Comercial', 'Entrega', 'Cobranca'),
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        cep: {
            type: datatypes.STRING(15),
            allowNull: true,
        },
        addressType: {
            type: datatypes.ENUM("Avenida", "Rua"),
            allowNull: false
        },
        neighbordhood: {
            type: datatypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        city: {
            type: datatypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        state: {
            type: datatypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        country: {
            type: datatypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true
            },
            defaultValue: 'Brasil'
        },
        isActive: {
            type: datatypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            defaultValue: true
        }
    }, {
        tableName: "companyAddresses"
    });
    return companyAddress;
};
