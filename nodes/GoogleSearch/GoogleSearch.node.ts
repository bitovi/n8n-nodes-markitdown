import type {
	DeclarativeRestApiSettings,
	IDataObject,
	IExecutePaginationFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class GoogleSearch implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Search',
		icon: 'file:google.svg',
		name: 'googleSearch',
		group: ['transform'],
		version: 1,
		description: 'Google Search Node',
		defaults: {
			name: 'Google Search',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'googleSearchCredentialsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://www.googleapis.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Custom Search',
						value: 'customSearch',
						routing: {
							request: {
								url: '=/customsearch/v1',
							},
							send: {
								paginate: true,
							},
							operations: {
								pagination: handlePagination,
							},
						},
					},
				],
				default: 'customSearch',
			},
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				routing: {
					request: {
						qs: {
							q: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Return All',
				description: 'Whether to return all results or only up to a given limit',
				name: 'returnAll',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						returnAll: [false],
					},
				},
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Exact Terms',
						name: 'exactTerms',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									exactTerms: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Exclude Terms',
						name: 'excludeTerms',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									excludeTerms: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'File Type',
						name: 'fileType',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									fileType: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Filter',
						name: 'filter',
						type: 'options',
						options: [
							{
								name: 'Off',
								value: '0',
							},
							{
								name: 'On',
								value: '1',
							},
						],
						default: '1',
						routing: {
							request: {
								qs: {
									filter: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'HQ',
						name: 'hq',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									hq: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Image Color Type',
						name: 'imgColorType',
						type: 'options',
						options: [
							{
								name: 'Color',
								value: 'color',
							},
							{
								name: 'Gray',
								value: 'gray',
							},
							{
								name: 'Black and White',
								value: 'mono',
							},
							{
								name: 'Transparent Background',
								value: 'trans',
							},
						],
						default: 'color',
						routing: {
							request: {
								qs: {
									imgColorType: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Image Dominant Color',
						name: 'imgDominantColor',
						type: 'options',
						options: [
							{
								name: 'Black',
								value: 'black',
							},
							{
								name: 'Blue',
								value: 'blue',
							},
							{
								name: 'Brown',
								value: 'brown',
							},
							{
								name: 'Gray',
								value: 'gray',
							},
							{
								name: 'Green',
								value: 'green',
							},
							{
								name: 'Orange',
								value: 'orange',
							},
							{
								name: 'Pink',
								value: 'pink',
							},
							{
								name: 'Purple',
								value: 'purple',
							},
							{
								name: 'Red',
								value: 'red',
							},
							{
								name: 'Teal',
								value: 'teal',
							},
							{
								name: 'White',
								value: 'white',
							},
							{
								name: 'Yellow',
								value: 'yellow',
							},
						],
						default: 'black',
						routing: {
							request: {
								qs: {
									imgDominantColor: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Image Size',
						name: 'imgSize',
						type: 'options',
						options: [
							{
								name: 'Huge',
								value: 'huge',
							},
							{
								name: 'Icon',
								value: 'icon',
							},
							{
								name: 'Large',
								value: 'large',
							},
							{
								name: 'Medium',
								value: 'medium',
							},
							{
								name: 'Small',
								value: 'small',
							},
							{
								name: 'XL',
								value: 'xlarge',
							},
							{
								name: 'XXL',
								value: 'xxlarge',
							},
						],
						default: 'medium',
						routing: {
							request: {
								qs: {
									imgSize: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Image Type',
						name: 'imgType',
						type: 'options',
						options: [
							{
								name: 'Animated',
								value: 'animated',
							},
							{
								name: 'Clipart',
								value: 'clipart',
							},
							{
								name: 'Face',
								value: 'face',
							},
							{
								name: 'Line Art',
								value: 'lineart',
							},
							{
								name: 'Photo',
								value: 'photo',
							},
							{
								name: 'Stock',
								value: 'stock',
							},
						],
						default: 'photo',
						routing: {
							request: {
								qs: {
									imgType: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Link Site',
						name: 'linkSite',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									linkSite: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Or Terms',
						name: 'orTerms',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									orTerms: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Rights',
						name: 'rights',
						type: 'multiOptions',
						options: [
							{
								name: 'Attribution',
								value: 'cc_attribute',
							},
							{
								name: 'Non Commercial',
								value: 'cc_noncommercial',
							},
							{
								name: 'Non Derived',
								value: 'cc_nonderived',
							},
							{
								name: 'Public Domain',
								value: 'cc_publicdomain',
							},
							{
								name: 'Share Alike',
								value: 'cc_sharealike',
							},
						],
						default: [],
						routing: {
							request: {
								qs: {
									rights: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Search Safety Level',
						name: 'safe',
						type: 'options',
						options: [
							{
								name: 'Active',
								value: 'active',
							},
							{
								name: 'Off',
								value: 'off',
							},
						],
						default: 'off',
						routing: {
							request: {
								qs: {
									safe: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Search Type',
						name: 'searchType',
						type: 'options',
						options: [
							{
								name: 'Image',
								value: 'image',
							},
						],
						default: 'image',
						routing: {
							request: {
								qs: {
									searchType: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Simplified and Traditional Chinese Search',
						name: 'c2off',
						type: 'options',
						options: [
							{
								name: 'Disabled',
								value: '1',
							},
							{
								name: 'Enabled',
								value: '0',
							},
						],
						default: '0',
						routing: {
							request: {
								qs: {
									c2off: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Site Search',
						name: 'siteSearch',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									siteSearch: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Site Search Filter',
						name: 'siteSearchFilter',
						type: 'options',
						options: [
							{
								name: 'Exclude',
								value: 'e',
							},
							{
								name: 'Include',
								value: 'i',
							},
						],
						default: 'i',
						routing: {
							request: {
								qs: {
									siteSearchFilter: '={{ $value }}',
								},
							},
						},
					},
				],
			},
		],
	};
}

async function handlePagination(
	this: IExecutePaginationFunctions,
	resultOptions: DeclarativeRestApiSettings.ResultOptions,
): Promise<INodeExecutionData[]> {
	const aggregatedResult: IDataObject[] = [];
	let nextStartIndex: number | undefined = 1;
	const returnAll = this.getNodeParameter('returnAll') as boolean;
	let limit = 0;
	if (!returnAll) {
		limit = this.getNodeParameter('limit') as number;
		resultOptions.maxResults = limit;
	}
	resultOptions.paginate = true;

	while (nextStartIndex) {
		resultOptions.options.qs!.start = nextStartIndex;
		const responseData = await this.makeRoutingRequest(resultOptions);

		for (const page of responseData) {
			if (page.json.items) {
				const currentData = page.json.items as IDataObject[];
				aggregatedResult.push(...currentData);
			}

			if (!returnAll && aggregatedResult.length >= limit) {
				return aggregatedResult.slice(0, limit).map((item) => ({ json: item }));
			}

			nextStartIndex = ((page.json.queries as IDataObject)?.nextPage as IDataObject[])?.[0]
				?.startIndex as number | undefined;
		}
	}

	return aggregatedResult.map((item) => ({ json: item }));
}
