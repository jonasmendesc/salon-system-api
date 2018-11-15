import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { generateIdUnique } from "../utils/util";
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface SaleAttribute {
  id?: string;
  companyId?: string;
  dateTimeMonthPlan?: number;
  licenseCode?: string;
  proposed?: boolean;
  isActive?: boolean;
  salePrincing?: number;
  saleTotal?: number;
  discountValue?: number;
  discountPercentage?: number;
  freeVersion?: boolean;
  freeDay?: number;
  dueDateExtension?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaleInstance extends Sequelize.Instance<SaleAttribute>, SaleAttribute { }

export interface SaleModel extends BaseModelInterface, Sequelize.Model<SaleInstance, SaleAttribute> { }

export default (sequelize: Sequelize.Sequelize, datatypes: Sequelize.DataTypes): SaleModel => {
  const sale: SaleModel = sequelize.define("Sale", {
    id: {
      type: datatypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      defaultValue: (): string => {
        return generateIdUnique();
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
      defaultValue: (): string => {
        return generateIdUnique();
      },
      validate: {
        notEmpty: true
      },
      unique: true,
      comment: "Identificador do registro do plano"
    },
    proposed: {
      type: datatypes.BOOLEAN,
      allowNull : false,
      validate: {
        notEmpty : true
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

  sale.associate = (models: ModelsInterface): void => {
    sale.hasMany(models.SaleMobile, {
      foreignKey: {
        allowNull: false,
        field: "saleId",
        name: "saleId"
      }
    })
  }

  return sale;
};
