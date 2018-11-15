import { companyQueries } from "../../oauthApp/account/accountSchema";
import { pricingQueries } from "../../oauthApp/pricing/pricingSchema";
import { promotitonQueries } from "../../oauthApp/promotion/promotionSchema";

const Query = `
    type Query {
        ${companyQueries}
        ${pricingQueries}
        ${promotitonQueries}
    }
`;

export { Query };
