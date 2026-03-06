"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcordCrmApi = void 0;
class ConcordCrmApi {
    constructor() {
        this.name = 'concordCrmApi';
        this.displayName = 'Concord CRM API';
        this.icon = 'file:concord-crm.svg';
        this.documentationUrl = 'https://www.concordcrm.com/docs/api/1.x/introduction';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: '',
                required: true,
                placeholder: 'https://crm.yourdomain.com',
                description: 'The base URL of your Concord CRM installation (no trailing slash)',
            },
            {
                displayName: 'API Token',
                name: 'apiToken',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                description: 'Your personal API token. Generate it in the Concord CRM dashboard under Profile → Personal Access Tokens.',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiToken}}',
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/api/users',
                method: 'GET',
            },
        };
    }
}
exports.ConcordCrmApi = ConcordCrmApi;
//# sourceMappingURL=ConcordCrmApi.credentials.js.map