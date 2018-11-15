import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";
import { generateIdUnique } from "../utils/util";

export interface CompanyEmailAttributes {
  id?: string;
  companyId?: string;
  email?: string;
  isMain?: boolean;
  isActive?: boolean;
  isValidade?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyEmailInstance
  extends Sequelize.Instance<CompanyEmailAttributes>,
    CompanyEmailAttributes {}

export interface CompanyEmailModel
  extends BaseModelInterface,
    Sequelize.Model<CompanyEmailInstance, CompanyEmailAttributes> {}

export default (
  sequelize: Sequelize.Sequelize,
  datatypes: Sequelize.DataTypes
): CompanyEmailModel => {
  const companyEmail: CompanyEmailModel = sequelize.define(
    "CompanyEmail",
    {
      id: {
        type: datatypes.STRING(50),
        allowNull: false,
        primaryKey: true,
        defaultValue: (): string => {
          return generateIdUnique();
        },
        comment: "Identificador do registro do email da empresa"
      },
      email: {
        type: datatypes.STRING(200),
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      isMain: {
        type: datatypes.BOOLEAN,
        allowNull: false,
        validate : {
          notEmpty : true
        }
      },
      isActive : {
        type: datatypes.BOOLEAN,
        allowNull : false,
        validate : {
          notEmpty : true
        },
        defaultValue : true
      },
      isValidade: {
        type: datatypes.BOOLEAN,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        defaultValue : false
      }
    },

    { tableName: "companyemails" }
  );

  return companyEmail;
};
