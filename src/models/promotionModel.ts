import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { generateIdUnique } from "../utils/util";
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface PromotionAttribute {
    id?: string;
    dateTimeMonthInitial?: number;
    dateTimeMonthEnd?: number;
    discountPercentage?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PromotionInstance extends Sequelize.Instance<PromotionAttribute>, PromotionAttribute { }

export interface PromotionModel extends BaseModelInterface, Sequelize.Model<PromotionInstance, PromotionAttribute> { }

export default (sequelize: Sequelize.Sequelize, dataTypes : Sequelize.DataTypes): PromotionModel => {

  const promotion : PromotionModel = sequelize.define("Promotion", {
      id: {
        type: dataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        defaultValue: (): string => {
          return generateIdUnique();
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
}
