import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
  Icon,
} from 'n8n-workflow';

export class ConcordCrmApi implements ICredentialType {
  name = 'concordCrmApi';
  displayName = 'Concord CRM API';
  icon = 'file:concord-crm.svg' as Icon;
  documentationUrl = 'https://www.concordcrm.com/docs/api/1.x/introduction';

  properties: INodeProperties[] = [
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
      description:
        'Your personal API token. Generate it in the Concord CRM dashboard under Profile → Personal Access Tokens.',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiToken}}',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/api/users',
      method: 'GET',
    },
  };
}
