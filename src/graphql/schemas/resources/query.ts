import { companiesQueries } from '../../resources/company/companySchema';
import { companyEmailQueries } from '../../resources/companyEmail/companyEmailSchema';
import { compaanyPhoneQueries } from '../../resources/companyPhone/companyPhoneSchema';
import { companyAddressQueries } from '../../resources/companyAddress/companyAddressSchema';
import { saleQueries } from "../../resources/sale/saleSchema";

const Query = `
  type Query {
      ${companiesQueries}
      ${companyEmailQueries}
      ${compaanyPhoneQueries}
      ${companyAddressQueries}
      ${saleQueries}
  }
`;

export { Query }
