import { GraphQLFieldResolver } from "graphql";
import { ComposableResolver } from "./composableResolvers";
import { ResolverContext } from "../../interfaces/ResolverContextInterface";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/util";

// Verifica o token que foi passado na requisição
export const verifyTokenResolver: ComposableResolver<any, ResolverContext> = (
  resolver: GraphQLFieldResolver<any, ResolverContext>
): GraphQLFieldResolver<any, ResolverContext> => {
  return (parent, args, context: ResolverContext, info) => {
    const token: string = context.authorization
      ? context.authorization.split(" ")[1]
      : undefined;
    return jwt.verify(token, context.authCompany.clientSecret, (err, decode: any) => {
      if (!err) return resolver(parent, args, context, info);
      throw new Error(`${err.name}: ${err.message}`);
    });
  };
};
