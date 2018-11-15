import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { generateIdUnique } from "../utils/util";

export interface SaleMobileAttributes {
    id?: string;
    companyId?: string;
    saleId?: string;
    dateTimeMonthPlan?: number;
    licenseCode?: string;
    serialNumber?: string;
    nameMobile?: string;
    isActive?: boolean;
    freeVersion?: boolean;
    freeDay?: number;
    dueDateExtension?: string;
    dueDate?: string;
    mobileValue?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface SaleMobileInstance extends Sequelize.Instance<SaleMobileAttributes>, SaleMobileAttributes { }

export interface SaleMobileModel extends BaseModelInterface, Sequelize.Model<SaleMobileInstance, SaleMobileAttributes> { }

export default (sequelize: Sequelize.Sequelize, dataTypes: Sequelize.DataTypes): SaleMobileModel => {

    const saleMobile: SaleMobileModel = sequelize.define("SaleMobile", {
        id: {
            type: dataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            defaultValue: (): string => {
                return generateIdUnique();
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
            defaultValue: (): string => {
                return generateIdUnique();
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
}
