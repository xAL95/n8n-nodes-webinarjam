import type { INodeProperties } from 'n8n-workflow';

export const operationGeneral: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'getCountries',
		displayOptions: {
			show: {
				resource: ['general'],
			},
		},
		options: [
			{
				name: 'Get Countries',
				value: 'getCountries',
				action: 'Retrieve a list of countries and states provinces',
				description: 'Retrieve a list of countries and states/provinces',
				routing: {
					request: {
						method: 'POST',
						url: '/api/webinarjam/countries',
					},
				},
			},
		],
	},
];
