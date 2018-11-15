import { GraphQLResolveInfo } from 'graphql'

export interface DataloaderParameter<T>{

	key : T;
	info : GraphQLResolveInfo

}

