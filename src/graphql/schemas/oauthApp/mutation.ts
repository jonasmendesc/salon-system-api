import { tokenMutations } from "../../oauthApp/tokens/tokenSchema";
import { mutationsAuhorization } from '../../oauthApp/authorizations/authorizationSchema';
import { companyMutations  } from '../../oauthApp/account/accountSchema';
import { pricingMutations } from '../../oauthApp/pricing/pricingSchema';
import { promotionMutations } from "../../oauthApp/promotion/promotionSchema";

const Mutation = `
  type Mutation {
    ${tokenMutations}
    ${mutationsAuhorization}
    ${companyMutations}
    ${pricingMutations}
    ${promotionMutations}
  }
`;
export { Mutation };
