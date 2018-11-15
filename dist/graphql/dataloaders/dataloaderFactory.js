"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataLoader = require("dataloader");
const companyPhoneLoader_1 = require("./companyPhoneLoader");
const companyAddressLoader_1 = require("./companyAddressLoader");
const saleMobileLoader_1 = require("./saleMobileLoader");
class DataloaderFactory {
    constructor(db, requestFields) {
        this.db = db;
        this.requestFields = requestFields;
    }
    getLoaders() {
        return {
            companyPhoneLoader: new DataLoader((params) => companyPhoneLoader_1.CompanyPhoneLoader.bathCompanyPhone(this.db.CompanyPhone, params, this.requestFields), { cacheKeyFn: (param) => param.key }),
            companyAddressLoader: new DataLoader((params) => companyAddressLoader_1.CompanyAddressLoader.batchCompanyAddressLoader(this.db.CompanyAddress, params, this.requestFields), { cacheKeyFn: (param) => param.key }),
            saleMobileLoader: new DataLoader((params) => saleMobileLoader_1.SaleMobileLoader.batchSaleMobileLoader(this.db.SaleMobile, params, this.requestFields), { cacheKeyFn: (param) => param.key })
        };
    }
}
exports.DataloaderFactory = DataloaderFactory;
