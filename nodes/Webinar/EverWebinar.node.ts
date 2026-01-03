import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { operationGeneral } from './shared/operationGeneral';

export class EverWebinar implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'EverWebinar',
		name: 'everWebinar',
		icon: {
			light: 'file:../../icons/everwebinar.light.svg',
			dark: 'file:../../icons/everwebinar.dark.svg',
		},
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'EverWebinar API',
		defaults: {
			name: 'EverWebinar',
		},
		usableAsTool: undefined,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'webinarJamApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['apiKey'],
					},
				},
			},
		],
		requestDefaults: {
			baseURL: 'https://api.webinarjam.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'API Key',
						value: 'apiKey',
					},
				],
				default: 'apiKey',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'General',
						value: 'general',
					},
					{
						name: 'EverWebinar',
						value: 'everWebinar',
					},
				],
				default: 'everWebinar',
			},
			...operationGeneral,
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['everWebinar'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a webinar',
						description: 'Retrieve a Webinar',
						routing: {
							request: {
								method: 'POST',
								url: '/everwebinar/webinar',
							},
						},
					},
					{
						name: 'Get Many',
						value: 'getMany',
						action: 'Get all webinars',
						description: 'Retrieve all Webinars',
						routing: {
							request: {
								method: 'POST',
								url: '/everwebinar/webinars',
							},
						},
					},
					{
						name: 'Get Registrants',
						value: 'getRegistrants',
						action: 'Get a list of registrants and attendees',
						description: 'Get a list of registrants and attendees',
						routing: {
							send: {
								paginate: '={{ $parameter.returnAll || ($parameter.limit ?? 1) > 1 }}',
							},
							request: {
								method: 'POST',
								url: '/everwebinar/registrants',
							},
							operations: {
								pagination: {
									type: 'generic',
									properties: {
										continue: `={{ !!$response.body.registrants.next_page_url && 
																	(
																		$parameter.returnAll || 
																		($response.body.registrants.current_page < ($parameter.limit ?? 1))
																	)
																}}`,
										request: {
											qs: {
												page: '={{ ($response.body.registrants.current_page ?? 1) + 1 }}',
											},
										},
									},
								},
							},
						},
					},
					{
						name: 'Register',
						value: 'register',
						action: 'Register a person',
						description: 'Register a person to a specific webinar',
						routing: {
							request: {
								method: 'POST',
								url: '/everwebinar/register',
							},
						},
					},
					{
						name: 'Unsubscribe',
						value: 'unsubscribe',
						action: 'Unsubscribe leads from a webinar',
						description: 'Unsubscribe leads from a webinar',
						routing: {
							request: {
								method: 'POST',
								url: '/everwebinar/unsubscribe',
							},
						},
					},
				],
				default: 'getMany',
			},
			{
				displayName: 'Webinar ID',
				name: 'webinarId',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['everWebinar'],
						operation: ['get', 'register', 'getRegistrants', 'unsubscribe'],
					},
				},
				routing: {
					request: {
						body: {
							webinar_id: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Schedule ID',
				name: 'schedule',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['everWebinar'],
						operation: ['register', 'getRegistrants'],
					},
				},
				routing: {
					request: {
						body: {
							schedule: '={{$value}}',
						},
					},
				},
				default: 0,
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						resource: ['everWebinar'],
						operation: ['register'],
					},
				},
				routing: {
					request: {
						body: {
							email: '={{$value}}',
						},
					},
				},
				default: '',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['everWebinar'],
						operation: ['register'],
					},
				},
				routing: {
					request: {
						body: {
							first_name: '={{$value}}',
						},
					},
				},
				default: '',
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				hint: 'Examples: GMT-5 or GMT+2 or GMT+4:30',
				description:
					'Required if your webinar timezone is set to “Auto-detect the user’s time zone”',
				default: 'UTC',
				displayOptions: {
					show: {
						resource: ['everWebinar'],
						operation: ['get'],
					},
				},
				routing: {
					request: {
						body: {
							timezone: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				description: 'Whether to return all results or only up to a given limit',
				default: false,
				displayOptions: {
					show: {
						resource: ['everWebinar'],
						operation: ['getRegistrants'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				description: 'Max number of results to return',
				default: 50,
				displayOptions: {
					show: {
						resource: ['everWebinar'],
						operation: ['getRegistrants'],
						returnAll: [false],
					},
				},
			},
			{
				displayName: 'Lead ID',
				name: 'lead_id',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['everWebinar'],
						operation: ['unsubscribe'],
					},
				},
				routing: {
					request: {
						body: {
							lead_id: '={{ $value }}',
						},
					},
				},
			},

			{
				displayName: 'Additional Fields',
				name: 'additionalRegisterFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['everWebinar'],
						operation: ['register'],
					},
				},
				options: [
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						routing: {
							request: {
								body: {
									country: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Date',
						name: 'date',
						type: 'string',
						hint: '2025-01-01 09:00',
						description:
							'Use the DATE parameter to register a person to a specific webinar session date. Make sure it matches a valid date returned by a previous API call, or else the API will not be able to register the user to any event at all. Also, if the call was made using a custom timezone, make sure that the same timezone is passed with the request.',
						default: '',
						routing: { request: { body: { date: '={{ $value }}' } } },
					},
					{
						displayName: 'IP Address',
						name: 'ipAddress',
						type: 'string',
						default: '',
						routing: {
							request: {
								body: {
									ip_address: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
						routing: {
							request: {
								body: {
									last_name: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						hint: 'Only numbers',
						placeholder: '1622020155',
						default: '',
						routing: {
							request: {
								body: {
									phone: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Phone Country Code',
						name: 'phoneCountryCode',
						type: 'string',
						hint: 'Must start with "+"',
						placeholder: '+49',
						default: '',
						routing: {
							request: {
								body: {
									phone_country_code: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						routing: {
							request: {
								body: {
									country: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Timezone',
						name: 'timezone',
						type: 'string',
						hint: 'Examples: GMT-5 or GMT+2 or GMT+4:30',
						description:
							'For webinars configured to display the schedule in the attendee’s own time zone, the API will automatically convert the time zone to EST, unless you specify a particular time zone',
						default: 'UTC',
						routing: { request: { body: { timezone: '={{ $value }}' } } },
					},
					{
						displayName: 'Timezone ID',
						name: 'timezoneId',
						type: 'options',
						hint: 'This field is mandatory if the registrants are from Texas, USA.',
						default: '2',
						options: [
							{ name: 'Mountain Time (US and Canada)', value: '2' },
							{ name: 'Central Time (US and Canada)', value: '3' },
						],
						routing: {
							request: {
								body: {
									timezone_id: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Twilio Consent',
						name: 'twilioConsent',
						type: 'boolean',
						hint: 'This field will be mandatory if the phone number field is enabled for the webinar',
						default: false,
						routing: {
							request: {
								body: {
									twilio_consent: '={{ $value }}',
								},
							},
						},
					},
				],
			},

			{
				displayName: 'Additional Fields',
				name: 'additionalRegistrantsFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['everWebinar'],
						operation: ['getRegistrants'],
					},
				},
				options: [
					{
						displayName: 'Attended Live',
						name: 'attendedLive',
						type: 'collection',
						default: {},
						options: [
							{
								displayName: 'Attended Live',
								name: 'attended_live',
								type: 'options',
								default: '1',
								options: [
									//{ name: 'All Registrants', value: '0' },
									{ name: 'Attended Live Session', value: '1' },
									{ name: 'Did Not Attend Live Session', value: '2' },
									{ name: 'Attended and Left Before a Specific Timestamp', value: '3' },
									{ name: 'Attended and Left After a Specific Timestamp', value: '4' },
								],
								routing: {
									request: { body: { attended_live: '={{ $value }}' } },
								},
							},
							{
								displayName: 'Attended Live Timestamp',
								name: 'attended_live_timestamp',
								type: 'dateTime',
								default: 0,
								displayOptions: {
									show: {
										attended_live: ['3', '4'],
									},
								},
								routing: {
									request: { body: { attended_live_timestamp: '={{ $value.toSeconds() }}' } },
								},
							},
						],
					},
					{
						displayName: 'Attended Replay',
						name: 'attendedReplay',
						type: 'collection',
						default: {},
						options: [
							{
								displayName: 'Attended Replay',
								name: 'attended_replay',
								type: 'options',
								default: '1',
								options: [
									//{ name: 'All Registrants', value: '0' },
									{ name: 'Attended Replay Session', value: '1' },
									{ name: 'Did Not Attend Replay Session', value: '2' },
									{ name: 'Attended and Left Before a Specific Timestamp', value: '3' },
									{ name: 'Attended and Left After a Specific Timestamp', value: '4' },
								],
								routing: {
									request: { body: { attended_replay: '={{ $value }}' } },
								},
							},
							{
								displayName: 'Attended Replay Timestamp',
								name: 'attended_replay_timestamp',
								type: 'dateTime',
								default: 0,
								displayOptions: {
									show: {
										attended_replay: ['3', '4'],
									},
								},
								routing: {
									request: { body: { attended_replay_timestamp: '={{ $value.toSeconds() }}' } },
								},
							},
						],
					},
					{
						displayName: 'Date Range',
						name: 'date_range',
						type: 'options',
						default: '0',
						options: [
							{ name: 'All Time', value: '0' },
							{ name: 'Today', value: '1' },
							{ name: 'Yesterday', value: '2' },
							{ name: 'This Week', value: '3' },
							{ name: 'Last Week', value: '4' },
							{ name: 'Last 7 Days', value: '5' },
							{ name: 'This Month', value: '6' },
							{ name: 'Last Month', value: '7' },
							{ name: 'Last 30 Days', value: '8' },
						],
						routing: { request: { body: { date_range: '={{ $value }}' } } },
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
						typeOptions: {
							minValue: 1,
						},
						routing: {
							request: { body: { page: '={{ $value }}' } },
						},
					},
					{
						displayName: 'Purchased',
						name: 'purchased',
						type: 'options',
						default: '1',
						options: [
							//{ name: 'All Registrants', value: '0' },
							{ name: 'Purchased a Product', value: '1' },
							{ name: 'Did Not Purchase a Product', value: '2' },
						],
						routing: { request: { body: { purchased: '={{ $value }}' } } },
					},
					{
						displayName: 'Search',
						name: 'search',
						type: 'string',
						default: '',
						routing: { request: { body: { search: '={{ $value }}' } } },
					},
				],
			},
		],
	};
}
