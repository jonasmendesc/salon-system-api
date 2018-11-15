"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const util_1 = require("../utils/util");
exports.default = (sequelize, datatypes) => {
    const company = sequelize.define("Company", {
        id: {
            type: datatypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            comment: "Identificador do registro da empresa"
        },
        name: {
            type: datatypes.STRING(128),
            allowNull: false,
            validate: {
                notEmpty: true
            },
            comment: "Nome da empresa"
        },
        validateEmailCode: {
            type: datatypes.BOOLEAN,
            allowNull: false,
            comment: "Codigo para a validação do email",
            defaultValue: () => {
                return false;
            }
        },
        licenseCode: {
            type: datatypes.STRING(125),
            allowNull: false,
            defaultValue: () => {
                return util_1.generateIdUnique();
            },
            comment: "Código da licenca do cliente"
        },
        isActive: {
            type: datatypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            },
            defaultValue: true
        },
        password: {
            type: datatypes.STRING(128),
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            },
            comment: "Senha criptografada da empresa"
        }
    }, {
        tableName: "companies",
        hooks: {
            beforeCreate: (company, options) => {
                const salt = bcryptjs_1.genSaltSync();
                company.password = bcryptjs_1.hashSync(company.password, salt);
            },
            beforeUpdate: (company, options) => {
                if (company.changed("password")) {
                    const salt = bcryptjs_1.genSaltSync();
                    company.password = bcryptjs_1.hashSync(company.password, salt);
                }
            }
        }
    });
    company.prototype.IsPassword = (encodedPassword, password) => {
        return bcryptjs_1.compareSync(password, encodedPassword);
    };
    company.associate = (models) => {
        company.hasMany(models.CompanyEmail, {
            foreignKey: {
                allowNull: false,
                field: "companyId",
                name: "companyId"
            }
        }),
            company.hasMany(models.CompanyAddress, {
                foreignKey: {
                    allowNull: false,
                    field: "companyId",
                    name: "companyId"
                }
            }),
            company.hasMany(models.CompanyPhone, {
                foreignKey: {
                    allowNull: false,
                    field: "companyId",
                    name: "companyId"
                }
            }),
            company.hasMany(models.Sale, {
                foreignKey: {
                    allowNull: false,
                    field: "companyId",
                    name: "companyId"
                }
            }),
            company.hasMany(models.SaleMobile, {
                foreignKey: {
                    allowNull: false,
                    field: "companyId",
                    name: "companyId"
                }
            });
    };
    return company;
};
