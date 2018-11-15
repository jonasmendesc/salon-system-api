import { tokenMutations } from "../../oauth/tokens/tokenSchema";

const Mutation = `
    type Mutation {
        ${tokenMutations}
    }
`;
export { Mutation }