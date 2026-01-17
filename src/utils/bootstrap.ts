import { EventIngestionHandler } from "../ingestion/event-ingestion-handler";
import { UserConfig } from "../models/user-config.model";

let initialized = false;

export const bootStrapRosa = (userConfig: UserConfig) => {
	if (initialized) {
		throw "Rosa is already initialized";
	}
	const ingestion = new EventIngestionHandler(userConfig);
	initialized = true;
};
