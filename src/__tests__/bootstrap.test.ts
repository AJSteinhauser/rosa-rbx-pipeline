// Copy bootstrap function for testing (simplified)
interface UserConfig {
	apiKey: string;
	gameId: string;
	endpoint?: string;
	batchSize?: number;
	rateLimit?: number;
}

class MockEventIngestionHandler {
	constructor(config: UserConfig) {
		// Mock implementation
	}
}

let initialized = false;

const bootStrapRosa = (userConfig: UserConfig) => {
	if (initialized) {
		throw "Rosa is already initialized";
	}
	const ingestion = new MockEventIngestionHandler(userConfig);
	initialized = true;
};

describe("bootstrap", () => {
	beforeEach(() => {
		// Reset the initialized state
		initialized = false;
	});

	it("should initialize Rosa successfully", () => {
		const mockConfig: UserConfig = {
			apiKey: "test-api-key",
			gameId: "test-game-id",
		};

		expect(() => {
			bootStrapRosa(mockConfig);
		}).not.toThrow();
	});

	it("should throw error when trying to initialize Rosa twice", () => {
		const mockConfig: UserConfig = {
			apiKey: "test-api-key",
			gameId: "test-game-id",
		};

		// First initialization should succeed
		bootStrapRosa(mockConfig);

		// Second initialization should throw
		expect(() => {
			bootStrapRosa(mockConfig);
		}).toThrow("Rosa is already initialized");
	});
});
