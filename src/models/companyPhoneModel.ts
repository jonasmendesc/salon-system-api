import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { generateIdUnique } from "../utils/util";
import { BOOLEAN } from "graphql/language/kinds";

export interface CompanyPhoneAttributes {
    id?: string;
    companyId?: string;
    phone?: string;
    phoneType?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CompanyPhoneInstance extends Sequelize.Instance<CompanyPhoneAttributes>, CompanyPhoneAttributes { }

export interface CompanyPhoneModel extends BaseModelInterface, Sequelize.Model<CompanyPhoneInstance, CompanyPhoneAttributes> { }

export default (sequelize: Sequelize.Sequelize, dataTypes: Sequelize.DataTypes): CompanyPhoneModel => {

    const companyPhone: CompanyPhoneModel = sequelize.define("CompanyPhone", {
        id: {
            type: dataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            defaultValue: (): string => {
                return generateIdUnique();
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
            allowNull : true,
            validate : {
                notEmpty : true
            },
            defaultValue : true
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

}