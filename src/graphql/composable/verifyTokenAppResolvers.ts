import { GraphQLFieldResolver } from "graphql";
import { ComposableResolver } from "./composableResolvers";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/util";
import { GraphqlRequestRestError } from "../../utils/customerErrors/graphqlRequestRestError";

export const verifyTokenAppREsolver: ComposableResolver<
  any,
  ResolverContext
> = (
  resolver: GraphQLFieldResolver<any, ResolverContext>
): GraphQLFieldResolver<any, ResolverContext> => {
  return (parent, args, context: ResolverContext, info) => {
    const token: string = context.authorization
      ? context.authorization.split(" ")[1]
      : undefined;
    return jwt.verify(
      token,
      context.oauthApplication.clientSecret,
      (err, decode: any) => {
        if (!err) return resolver(parent, args, context, info);
        throw new GraphqlRequestRestError({
          code: 401,
          messageError: "Token invalid or not informed"
        });
      }
    );
  };
};
