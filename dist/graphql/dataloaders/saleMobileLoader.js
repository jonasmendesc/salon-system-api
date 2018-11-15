"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SaleMobileLoader {
    static batchSaleMobileLoader(saleMobileModel, params, requestFields) {
        let ids = params.map(param => param.key);
        return Promise.resolve(saleMobileModel.findAll({ where: { saleId: { $in: ids } },
            attributes: requestFields.getFields(params[0].info, { exclude: ['saleMobiles'] }) }));
    }
}
exports.SaleMobileLoader = SaleMobileLoader;
