import Sibyl from '..';

type ServiceCallbackFn = (sibyl: Sibyl) => Promise<void>;

export default class Service {
	public readonly name: string;
	private startCallbackFn: ServiceCallbackFn;
	private stopCallbackFn?: ServiceCallbackFn;

	constructor(
		options: { name: string },
		methods: {
			start: ServiceCallbackFn;
			[name: string]: (sibyl: Sibyl, ...args: any[]) => Promise<any>;
		}
	) {
		this.name = options.name;
		this.startCallbackFn = methods.start;
		this.stopCallbackFn = methods.stop;

		// TODO: Implement other methods
	}

	public async start(sibyl: Sibyl) {
		await this.startCallbackFn(sibyl);
	}

	public async stop(sibyl: Sibyl) {
		if (this.stopCallbackFn) {
			await this.stopCallbackFn(sibyl);
		}
	}
}
