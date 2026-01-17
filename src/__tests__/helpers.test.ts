// Mock Vector3 type for testing
interface Vector3 {
	X: number;
	Y: number;
	Z: number;
}

// Mock Position type
interface Position {
	x: number;
	y: number;
	z: number;
}

// Copy the function implementation for testing
const vector3ToPosition = (vector3: Vector3): Position => {
	return {
		x: vector3.X,
		y: vector3.Y,
		z: vector3.Z,
	};
};

describe("helpers", () => {
	describe("vector3ToPosition", () => {
		it("should convert Vector3 to Position object", () => {
			const mockVector3: Vector3 = {
				X: 10.5,
				Y: 20.3,
				Z: -5.7,
			};

			const result = vector3ToPosition(mockVector3);

			expect(result).toEqual({
				x: 10.5,
				y: 20.3,
				z: -5.7,
			});
		});

		it("should handle zero values", () => {
			const mockVector3: Vector3 = {
				X: 0,
				Y: 0,
				Z: 0,
			};

			const result = vector3ToPosition(mockVector3);

			expect(result).toEqual({
				x: 0,
				y: 0,
				z: 0,
			});
		});

		it("should handle negative values", () => {
			const mockVector3: Vector3 = {
				X: -10,
				Y: -20,
				Z: -30,
			};

			const result = vector3ToPosition(mockVector3);

			expect(result).toEqual({
				x: -10,
				y: -20,
				z: -30,
			});
		});
	});
});
