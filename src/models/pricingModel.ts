import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { generateIdUnique } from "../utils/util";
import { ModelsInterface } from "../interfaces/ModelsInterface";


export interface PricingAttribute {
  id?: string;
  pricingValue?: number;
  isActive?: boolean;
  pricingType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingInstance extends Sequelize.Instance<PricingAttribute>, PricingAttribute { }

export interface PricingModel extends BaseModelInterface, Sequelize.Model<PricingInstance, PricingAttribute> { }

export default (sequelize: Sequelize.Sequelize, dataTypes: Sequelize.DataTypes): PricingModel => {

    const pricing : PricingModel = sequelize.define("Pricing", {
      id: {
        type: dataTypes.STRING(50),
        primaryKey: true,
        allowNull: false,
        defaultValue: (): string => {
          return generateIdUnique();
        },
        comment: "Identificador do registro"
      },
    pricingValue: {
      type: dataTypes.DECIMAL(18, 2),
      allowNull: false,
      validate: {
        notEmpty: false,
      }
    },
    isActive: {
      type: dataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      defaultValue: true
    },
    pricingType: {
        type: dataTypes.ENUM("PLAN", "MOBILE"),
        allowNull: false,
        validate: {
          notEmpty: true
        }
    }
    }, { tableName: 'pricing' });

    return pricing;

}
