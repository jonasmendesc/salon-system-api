import { companiesMutations } from '../../resources/company/companySchema';
import { companyEmailMutations } from '../../resources/companyEmail/companyEmailSchema';
import { companyPhoneMutations } from '../../resources/companyPhone/companyPhoneSchema';
import { companAddressMutations } from '../../resources/companyAddress/companyAddressSchema';
import { saleMutations } from '../../resources/sale//saleSchema';
import { saleMobileMutations } from '../../resources/salemobile/saleMobileSchema';

const Mutation = `
  type Mutation {
    ${companiesMutations}
    ${companyEmailMutations}
    ${companyPhoneMutations}
    ${companAddressMutations}
    ${saleMutations}
    ${saleMobileMutations}
  }
`

export { Mutation }
