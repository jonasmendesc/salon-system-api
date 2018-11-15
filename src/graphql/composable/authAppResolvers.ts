import { GraphQLFieldResolver } from "graphql";
import { ComposableResolver } from "./composableResolvers";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";
import { verifyTokenAppREsolver } from "./verifyTokenAppResolvers";
import { GraphqlRequestRestError } from "../../utils/customerErrors/graphqlRequestRestError";

export const authAppResolver: ComposableResolver<any, ResolverContext> = (
  resolver: GraphQLFieldResolver<any, ResolverContext>
): GraphQLFieldResolver<any, ResolverContext> => {
  return (parent, args, context: ResolverContext, info) => {
    if (context.authorization || context.oauthApplication)
      return resolver(parent, args, context, info);
    throw new GraphqlRequestRestError({
      code: 404,
      messageError: "Bad request token not provider!"
    });
  };
};

export const authAppResolvers = [authAppResolver, verifyTokenAppREsolver];
