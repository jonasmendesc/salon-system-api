import { tokenQueries } from "../../oauth/tokens/tokenSchema";

const Query = `
    type Query {
        ${tokenQueries}
    }
`;

export { Query };
