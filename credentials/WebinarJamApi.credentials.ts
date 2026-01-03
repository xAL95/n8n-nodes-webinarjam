import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WebinarJamApi implements ICredentialType {
	name = 'webinarJamApi';
	displayName = 'WebinarJam / EverWebinar API';
	documentationUrl = 'https://support.webinarjam.com/support/solutions/153000174610';
	icon: Icon = {
		light: 'file:../icons/webinarjam.light.svg',
		dark: 'file:../icons/webinarjam.dark.svg',
	};
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			body: {
				api_key: '={{$credentials?.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.webinarjam.com',
			url: '/webinarjam/webinars',
			method: 'POST',
		},
	};
}
