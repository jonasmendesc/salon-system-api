import { AuthorizationModel } from "./../models/authorizationModel";
import { CompanyModel } from "../models/companyModel";
import { CompanyEmailModel } from "../models/companyEmailModel";
import { CompanyAddressModel } from "../models/companyAddressModel";
import { CompanyPhoneModel } from "../models/companyPhoneModel";
import { SaleModel } from "../models/saleModel";
import { SaleMobileModel } from "../models/saleMobileModel";
import { PricingModel } from "../models/pricingModel";
import { PromotionModel } from "../models/promotionModel"

export interface ModelsInterface {
  Company: CompanyModel;
  CompanyEmail: CompanyEmailModel;
  CompanyAddress: CompanyAddressModel;
  Authorization: AuthorizationModel;
  CompanyPhone: CompanyPhoneModel;
  Sale: SaleModel;
  SaleMobile: SaleMobileModel;
  Pricing: PricingModel;
  Promotion: PromotionModel;
}
