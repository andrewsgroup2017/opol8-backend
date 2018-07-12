export class InvalidTimeClockError extends Error {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, InvalidTimeClockError.prototype);
	}
}
