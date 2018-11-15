import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { generateIdUnique } from "../utils/util";

export interface CompanyAddressAtrribute {
  id?: string;
  companyId?: string;
  address?: string;
  addressNumber?: string;
  addressPurpose?: string;
  cep?: string;
  addressType?: string;
  neighbordhood?: string;
  city?: string;
  state?: string;
  country?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyAddressInstance
  extends Sequelize.Instance<CompanyAddressAtrribute>,
    CompanyAddressAtrribute {}
export interface CompanyAddressModel
  extends BaseModelInterface,
    Sequelize.Model<CompanyAddressInstance, CompanyAddressAtrribute> {}

export default (
  sequelize: Sequelize.Sequelize,
  datatypes: Sequelize.DataTypes
): CompanyAddressModel => {
  const companyAddress: CompanyAddressModel = sequelize.define(
    "CompanyAddress",
    {
      id: {
        type: datatypes.STRING(50),
        allowNull: false,
        primaryKey: true,
        defaultValue: (): string => {
          return generateIdUnique();
        },
        comment: "Identificador do endereço da empresa"
      },
      address: {
        type: datatypes.STRING(300),
        allowNull: false,
        validate : {
          notEmpty : true
        }
      },
      addressNumber: {
        type: datatypes.STRING(15),
        allowNull: false,
        validate: {
          notEmpty : true
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
        validate : {
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
          notEmpty : true
        },
        defaultValue: true
      }
    },
    {
      tableName: "companyAddresses"
    }
  );

  return companyAddress;
};
