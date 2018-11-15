import { DataloaderParameter } from "../../interfaces/DataloaderParamInterface";
import { RequestedFields } from "../ast/requestedFields";
import { SaleMobileModel, SaleMobileInstance } from "../../models/saleMobileModel";

export class SaleMobileLoader {

   static batchSaleMobileLoader(saleMobileModel: SaleMobileModel, params:  DataloaderParameter<number>[], requestFields: RequestedFields): Promise<SaleMobileInstance[]>{
       let ids: number[] = params.map(param => param.key);
       return Promise.resolve(saleMobileModel.findAll({ where: { saleId : { $in : ids } },
         attributes: requestFields.getFields(params[0].info, { exclude: ['saleMobiles'] }) }
       ));
   }

}
