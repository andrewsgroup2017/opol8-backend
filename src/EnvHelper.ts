// const dotEnv = require('./env.json');

export interface Environment {
	SLACK_VERIFICATION_TOKEN: string;
	SLACK_BOT_TOKEN: string;
	SLACK_OAUTH_TOKEN: string;
}
const envblah = {
	SLACK_VERIFICATION_TOKEN: 'foo',
	SLACK_BOT_TOKEN: 'bar',
	' SLACK_OAUTH_TOKEN': 'baz'
};
export class EnvHelper {
	env: any;

	constructor() {
		// this.env = dotEnv;
		this.env = envblah;
	}

	public getEnv(): Environment {
		return <Environment>this.parse();
	}

	private parse() {
		try {
			return JSON.parse(this.env);
		} catch (e) {
			return this.env;
		}
	}
}

export default new EnvHelper().getEnv();
