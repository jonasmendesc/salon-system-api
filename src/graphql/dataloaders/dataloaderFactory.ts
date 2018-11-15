import { DbConnection } from '../../interfaces/DbConnectionInterface'
import { Dataloaders } from '../../interfaces/DataloaderInterface';
import * as DataLoader from 'dataloader';
import { RequestedFields } from '../ast/requestedFields';
import { DataloaderParameter } from '../../interfaces/DataloaderParamInterface';
import { CompanyPhoneLoader } from './companyPhoneLoader';
import { CompanyPhoneInstance } from '../../models/companyPhoneModel';
import { CompanyAddressInstance } from '../../models/companyAddressModel';
import { CompanyAddressLoader } from './companyAddressLoader';
import { SaleMobileLoader } from './saleMobileLoader';
import { SaleMobileInstance } from '../../models/saleMobileModel';

export class DataloaderFactory {
	constructor(private db: DbConnection, private requestFields: RequestedFields) { }

	getLoaders(): Dataloaders {
		return {
			companyPhoneLoader: new DataLoader<DataloaderParameter<number>, CompanyPhoneInstance>(
                (params: DataloaderParameter<number>[]) => CompanyPhoneLoader.bathCompanyPhone(this.db.CompanyPhone, params, this.requestFields),
                { cacheKeyFn: (param: DataloaderParameter<number[]>) => param.key }
            ),
            companyAddressLoader: new DataLoader<DataloaderParameter<number>, CompanyAddressInstance>(
                (params: DataloaderParameter<number>[]) => CompanyAddressLoader.batchCompanyAddressLoader(this.db.CompanyAddress, params, this.requestFields),
                { cacheKeyFn: (param: DataloaderParameter<number[]>) => param.key }
            ),
						saleMobileLoader: new DataLoader<DataloaderParameter<number>, SaleMobileInstance>(
							(params: DataloaderParameter<number>[]) => SaleMobileLoader.batchSaleMobileLoader(this.db.SaleMobile, params, this.requestFields),
							{ cacheKeyFn: (param: DataloaderParameter<number[]>) => param.key }
						)
		}
	}
}
