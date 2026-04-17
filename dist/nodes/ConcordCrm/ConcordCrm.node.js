"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcordCrm = void 0;
const n8n_workflow_1 = require("n8n-workflow");
// ─────────────────────────────────────────────
// Shared option lists
// ─────────────────────────────────────────────
const ASSOCIATION_RESOURCES = [
    { name: 'Contacts', value: 'contacts' },
    { name: 'Companies', value: 'companies' },
    { name: 'Deals', value: 'deals' },
    { name: 'Activities', value: 'activities' },
];
// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function stripTrailingSlash(url) {
    return url.replace(/\/+$/, '');
}
function buildQueryString(params) {
    const parts = [];
    for (const [key, val] of Object.entries(params)) {
        if (val !== undefined && val !== '' && val !== null) {
            parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
        }
    }
    return parts.length ? '?' + parts.join('&') : '';
}
async function concordRequest(method, endpoint, body, qs) {
    const credentials = await this.getCredentials('concordCrmApi');
    const baseUrl = stripTrailingSlash(credentials.baseUrl);
    const url = `${baseUrl}/api${endpoint}${qs ? buildQueryString(qs) : ''}`;
    const response = await this.helpers.httpRequestWithAuthentication.call(this, 'concordCrmApi', {
        method: method,
        url,
        body: body && Object.keys(body).length ? body : undefined,
        json: true,
    });
    return response;
}
// ─────────────────────────────────────────────
// Node definition
// ─────────────────────────────────────────────
class ConcordCrm {
    constructor() {
        this.description = {
            displayName: 'Concord CRM',
            name: 'concordCrm',
            icon: 'file:concord-crm.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            description: 'Interact with the Concord CRM API — Deals, Contacts, Companies, Activities, Notes, Calls, Documents, Products, Pipelines, Stages, Users and more.',
            defaults: { name: 'Concord CRM' },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            credentials: [
                {
                    name: 'concordCrmApi',
                    required: true,
                },
            ],
            properties: [
                // ── Resource ──────────────────────────────────
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        { name: 'Activity', value: 'activities' },
                        { name: 'Activity Type', value: 'activityTypes' },
                        { name: 'Call', value: 'calls' },
                        { name: 'Call Outcome', value: 'callOutcomes' },
                        { name: 'Comment', value: 'comments' },
                        { name: 'Company', value: 'companies' },
                        { name: 'Contact', value: 'contacts' },
                        { name: 'Country', value: 'countries' },
                        { name: 'Currency', value: 'currencies' },
                        { name: 'Deal', value: 'deals' },
                        { name: 'Document', value: 'documents' },
                        { name: 'Document Type', value: 'documentTypes' },
                        { name: 'Industry', value: 'industries' },
                        { name: 'Note', value: 'notes' },
                        { name: 'Pipeline', value: 'pipelines' },
                        { name: 'Product', value: 'products' },
                        { name: 'Role', value: 'roles' },
                        { name: 'Source', value: 'sources' },
                        { name: 'Stage', value: 'stages' },
                        { name: 'Team', value: 'teams' },
                        { name: 'Timezone', value: 'timezones' },
                        { name: 'Trashed Record', value: 'trashed' },
                        { name: 'User', value: 'users' },
                    ],
                    default: 'deals',
                },
                // ═══════════════════════════════════════════════
                // OPERATIONS
                // ═══════════════════════════════════════════════
                // ── Full CRUD + Search + Associations (Deals, Contacts, Companies, Activities) ──
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: { resource: ['deals', 'contacts', 'companies', 'activities'] },
                    },
                    options: [
                        { name: 'List', value: 'list', description: 'Get a paginated list', action: 'List records' },
                        { name: 'Get', value: 'get', description: 'Retrieve a single record by ID', action: 'Get a record' },
                        { name: 'Create', value: 'create', description: 'Create a new record', action: 'Create a record' },
                        { name: 'Update', value: 'update', description: 'Update an existing record', action: 'Update a record' },
                        { name: 'Delete', value: 'delete', description: 'Delete a record', action: 'Delete a record' },
                        { name: 'Search', value: 'search', description: 'Search records by keyword', action: 'Search records' },
                        { name: 'Attach Associations', value: 'attachAssociation', description: 'Attach related records', action: 'Attach associations' },
                        { name: 'Detach Associations', value: 'detachAssociation', description: 'Detach related records', action: 'Detach associations' },
                        { name: 'Sync Associations', value: 'syncAssociation', description: 'Sync (replace) related records', action: 'Sync associations' },
                    ],
                    default: 'list',
                },
                // ── Full CRUD + Search (Documents, Products, Calls, Notes) ──
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: { resource: ['documents', 'products', 'calls', 'notes'] },
                    },
                    options: [
                        { name: 'List', value: 'list', action: 'List records' },
                        { name: 'Get', value: 'get', action: 'Get a record' },
                        { name: 'Create', value: 'create', action: 'Create a record' },
                        { name: 'Update', value: 'update', action: 'Update a record' },
                        { name: 'Delete', value: 'delete', action: 'Delete a record' },
                        { name: 'Search', value: 'search', action: 'Search records' },
                    ],
                    default: 'list',
                },
                // ── Full CRUD (Pipelines, Stages, Users, Teams, Activity Types, Call Outcomes) ──
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: { resource: ['pipelines', 'stages', 'users', 'teams', 'activityTypes', 'callOutcomes'] },
                    },
                    options: [
                        { name: 'List', value: 'list', action: 'List records' },
                        { name: 'Get', value: 'get', action: 'Get a record' },
                        { name: 'Create', value: 'create', action: 'Create a record' },
                        { name: 'Update', value: 'update', action: 'Update a record' },
                        { name: 'Delete', value: 'delete', action: 'Delete a record' },
                    ],
                    default: 'list',
                },
                // ── Comments ──
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['comments'] } },
                    options: [
                        { name: 'List', value: 'list', action: 'List comments' },
                        { name: 'Create', value: 'create', action: 'Create a comment' },
                        { name: 'Update', value: 'update', action: 'Update a comment' },
                        { name: 'Delete', value: 'delete', action: 'Delete a comment' },
                    ],
                    default: 'list',
                },
                // ── Trashed ──
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['trashed'] } },
                    options: [
                        { name: 'List', value: 'list', action: 'List trashed records' },
                        { name: 'Restore', value: 'restore', action: 'Restore a trashed record' },
                        { name: 'Permanently Delete', value: 'delete', action: 'Permanently delete a record' },
                    ],
                    default: 'list',
                },
                // ── Lookup-only resources ──
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: { resource: ['countries', 'currencies', 'timezones', 'industries', 'sources', 'roles', 'documentTypes'] },
                    },
                    options: [
                        { name: 'List', value: 'list', action: 'List all records' },
                    ],
                    default: 'list',
                },
                // ═══════════════════════════════════════════════
                // SHARED FIELDS
                // ═══════════════════════════════════════════════
                // ID field — for get / update / delete / associations
                {
                    displayName: 'Record ID',
                    name: 'recordId',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['get', 'update', 'delete', 'attachAssociation', 'detachAssociation', 'syncAssociation', 'restore'],
                        },
                    },
                    description: 'The ID of the record to act on',
                },
                // Pagination
                {
                    displayName: 'Page',
                    name: 'page',
                    type: 'number',
                    default: 1,
                    displayOptions: { show: { operation: ['list'] } },
                    description: 'Page number to retrieve (default 1)',
                },
                {
                    displayName: 'Per Page',
                    name: 'perPage',
                    type: 'number',
                    default: 15,
                    typeOptions: { maxValue: 100, minValue: 1 },
                    displayOptions: { show: { operation: ['list'] } },
                    description: 'Number of items per page (max 100)',
                },
                // Search query
                {
                    displayName: 'Search Query',
                    name: 'searchQuery',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: { show: { operation: ['search'] } },
                    description: 'The keyword(s) to search for',
                },
                // ═══════════════════════════════════════════════
                // ASSOCIATIONS FIELDS
                // ═══════════════════════════════════════════════
                {
                    displayName: 'Association Resource',
                    name: 'associationResource',
                    type: 'options',
                    options: ASSOCIATION_RESOURCES,
                    default: 'contacts',
                    required: true,
                    displayOptions: {
                        show: { operation: ['attachAssociation', 'detachAssociation', 'syncAssociation'] },
                    },
                    description: 'The related resource type to associate',
                },
                {
                    displayName: 'Associated Record IDs',
                    name: 'associationIds',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: { operation: ['attachAssociation', 'detachAssociation', 'syncAssociation'] },
                    },
                    description: 'Comma-separated list of IDs to attach/detach/sync (e.g. 1,2,3)',
                },
                // ═══════════════════════════════════════════════
                // TRASHED FIELDS
                // ═══════════════════════════════════════════════
                {
                    displayName: 'Trashed Resource',
                    name: 'trashedResource',
                    type: 'options',
                    options: [
                        { name: 'Deals', value: 'deals' },
                        { name: 'Contacts', value: 'contacts' },
                        { name: 'Companies', value: 'companies' },
                        { name: 'Activities', value: 'activities' },
                        { name: 'Documents', value: 'documents' },
                        { name: 'Notes', value: 'notes' },
                        { name: 'Calls', value: 'calls' },
                    ],
                    default: 'deals',
                    displayOptions: { show: { resource: ['trashed'] } },
                    description: 'The resource type to operate on in the trash',
                },
                // ═══════════════════════════════════════════════
                // COMMENT FIELDS
                // ═══════════════════════════════════════════════
                {
                    displayName: 'Commentable Resource',
                    name: 'commentableResource',
                    type: 'options',
                    options: [
                        { name: 'Deals', value: 'deals' },
                        { name: 'Contacts', value: 'contacts' },
                        { name: 'Companies', value: 'companies' },
                        { name: 'Activities', value: 'activities' },
                        { name: 'Documents', value: 'documents' },
                    ],
                    default: 'deals',
                    displayOptions: { show: { resource: ['comments'] } },
                    description: 'The parent resource that the comment belongs to',
                },
                {
                    displayName: 'Parent Record ID',
                    name: 'commentableId',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: { show: { resource: ['comments'] } },
                    description: 'The ID of the parent record (deal, contact, etc.)',
                },
                // ═══════════════════════════════════════════════
                // BODY — JSON fields for create/update
                // ═══════════════════════════════════════════════
                // ── DEALS ──────────────────────────────────────
                {
                    displayName: 'Deal Fields',
                    name: 'dealFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['deals'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Name', name: 'name', type: 'string', default: '' },
                        { displayName: 'Amount', name: 'amount', type: 'number', default: 0 },
                        { displayName: 'Expected Close Date', name: 'expected_close_date', type: 'string', default: '', description: 'Format: YYYY-MM-DD' },
                        { displayName: 'Pipeline ID', name: 'pipeline_id', type: 'number', default: 0 },
                        { displayName: 'Stage ID', name: 'stage_id', type: 'number', default: 0 },
                        { displayName: 'User (Owner) ID', name: 'user_id', type: 'number', default: 0 },
                        {
                            displayName: 'Status',
                            name: 'status',
                            type: 'options',
                            options: [
                                { name: 'Open', value: 'open' },
                                { name: 'Won', value: 'won' },
                                { name: 'Lost', value: 'lost' },
                            ],
                            default: 'open',
                        },
                        { displayName: 'Lost Reason', name: 'lost_reason', type: 'string', default: '' },
                        { displayName: 'Custom Fields (JSON)', name: 'custom_fields', type: 'json', default: '{}', description: 'Key-value pairs for custom fields, using their field IDs as keys' },
                    ],
                },
                // ── CONTACTS ──────────────────────────────────
                {
                    displayName: 'Contact Fields',
                    name: 'contactFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['contacts'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'First Name', name: 'first_name', type: 'string', default: '' },
                        { displayName: 'Last Name', name: 'last_name', type: 'string', default: '' },
                        { displayName: 'Email', name: 'email', type: 'string', default: '' },
                        { displayName: 'Phone', name: 'phones', type: 'string', default: '', description: 'Phone number(s) — comma-separated for multiple' },
                        { displayName: 'Job Title', name: 'job_title', type: 'string', default: '' },
                        { displayName: 'Source', name: 'source_id', type: 'number', default: 0 },
                        { displayName: 'User (Owner) ID', name: 'user_id', type: 'number', default: 0 },
                        { displayName: 'Street', name: 'street', type: 'string', default: '' },
                        { displayName: 'City', name: 'city', type: 'string', default: '' },
                        { displayName: 'State', name: 'state', type: 'string', default: '' },
                        { displayName: 'Postal Code', name: 'postal_code', type: 'string', default: '' },
                        { displayName: 'Country', name: 'country_id', type: 'number', default: 0 },
                        { displayName: 'Custom Fields (JSON)', name: 'custom_fields', type: 'json', default: '{}' },
                    ],
                },
                // ── COMPANIES ─────────────────────────────────
                {
                    displayName: 'Company Fields',
                    name: 'companyFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['companies'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Name', name: 'name', type: 'string', default: '' },
                        { displayName: 'Domain', name: 'domain', type: 'string', default: '' },
                        { displayName: 'Email', name: 'email', type: 'string', default: '' },
                        { displayName: 'Phone', name: 'phones', type: 'string', default: '' },
                        { displayName: 'Industry', name: 'industry_id', type: 'number', default: 0 },
                        { displayName: 'Source', name: 'source_id', type: 'number', default: 0 },
                        { displayName: 'User (Owner) ID', name: 'user_id', type: 'number', default: 0 },
                        { displayName: 'Street', name: 'street', type: 'string', default: '' },
                        { displayName: 'City', name: 'city', type: 'string', default: '' },
                        { displayName: 'State', name: 'state', type: 'string', default: '' },
                        { displayName: 'Postal Code', name: 'postal_code', type: 'string', default: '' },
                        { displayName: 'Country', name: 'country_id', type: 'number', default: 0 },
                        { displayName: 'Custom Fields (JSON)', name: 'custom_fields', type: 'json', default: '{}' },
                    ],
                },
                // ── ACTIVITIES ────────────────────────────────
                {
                    displayName: 'Activity Fields',
                    name: 'activityFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['activities'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Title', name: 'title', type: 'string', default: '' },
                        { displayName: 'Activity Type ID', name: 'activity_type_id', type: 'number', default: 0 },
                        { displayName: 'Due Date', name: 'due_date', type: 'string', default: '', description: 'Format: YYYY-MM-DD' },
                        { displayName: 'Due Time', name: 'due_time', type: 'string', default: '', description: 'Format: HH:MM' },
                        { displayName: 'End Time', name: 'end_time', type: 'string', default: '', description: 'Format: HH:MM' },
                        { displayName: 'Note', name: 'note', type: 'string', default: '' },
                        { displayName: 'Is Completed', name: 'is_completed', type: 'boolean', default: false },
                        { displayName: 'User (Owner) ID', name: 'user_id', type: 'number', default: 0 },
                        { displayName: 'Custom Fields (JSON)', name: 'custom_fields', type: 'json', default: '{}' },
                    ],
                },
                // ── NOTES ─────────────────────────────────────
                {
                    displayName: 'Note Fields',
                    name: 'noteFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['notes'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Body', name: 'body', type: 'string', typeOptions: { rows: 4 }, default: '' },
                        { displayName: 'User (Owner) ID', name: 'user_id', type: 'number', default: 0 },
                    ],
                },
                // ── CALLS ─────────────────────────────────────
                {
                    displayName: 'Call Fields',
                    name: 'callFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['calls'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Body', name: 'body', type: 'string', typeOptions: { rows: 4 }, default: '' },
                        { displayName: 'Call Outcome ID', name: 'call_outcome_id', type: 'number', default: 0 },
                        { displayName: 'Date', name: 'date', type: 'string', default: '', description: 'Format: YYYY-MM-DD HH:MM:SS (UTC)' },
                        { displayName: 'User (Owner) ID', name: 'user_id', type: 'number', default: 0 },
                    ],
                },
                // ── DOCUMENTS ─────────────────────────────────
                {
                    displayName: 'Document Fields',
                    name: 'documentFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['documents'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Title', name: 'title', type: 'string', default: '' },
                        { displayName: 'Document Type ID', name: 'document_type_id', type: 'number', default: 0 },
                        { displayName: 'Content', name: 'content', type: 'string', typeOptions: { rows: 5 }, default: '' },
                        { displayName: 'User (Owner) ID', name: 'user_id', type: 'number', default: 0 },
                    ],
                },
                // ── PRODUCTS ──────────────────────────────────
                {
                    displayName: 'Product Fields',
                    name: 'productFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['products'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Name', name: 'name', type: 'string', default: '' },
                        { displayName: 'Description', name: 'description', type: 'string', default: '' },
                        { displayName: 'Unit Price', name: 'unit_price', type: 'number', default: 0 },
                        { displayName: 'SKU', name: 'sku', type: 'string', default: '' },
                        { displayName: 'Currency', name: 'currency', type: 'string', default: 'USD' },
                    ],
                },
                // ── PIPELINES ─────────────────────────────────
                {
                    displayName: 'Pipeline Fields',
                    name: 'pipelineFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['pipelines'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Name', name: 'name', type: 'string', default: '' },
                    ],
                },
                // ── STAGES ────────────────────────────────────
                {
                    displayName: 'Stage Fields',
                    name: 'stageFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['stages'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Name', name: 'name', type: 'string', default: '' },
                        { displayName: 'Pipeline ID', name: 'pipeline_id', type: 'number', default: 0 },
                        { displayName: 'Win Probability (%)', name: 'win_probability', type: 'number', default: 0 },
                        { displayName: 'Display Order', name: 'display_order', type: 'number', default: 0 },
                    ],
                },
                // ── USERS ─────────────────────────────────────
                {
                    displayName: 'User Fields',
                    name: 'userFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['users'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Name', name: 'name', type: 'string', default: '' },
                        { displayName: 'Email', name: 'email', type: 'string', default: '' },
                        { displayName: 'Password', name: 'password', type: 'string', typeOptions: { password: true }, default: '' },
                        { displayName: 'Role ID', name: 'role_id', type: 'number', default: 0 },
                        { displayName: 'Timezone', name: 'timezone', type: 'string', default: '' },
                    ],
                },
                // ── TEAMS ─────────────────────────────────────
                {
                    displayName: 'Team Fields',
                    name: 'teamFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['teams'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Name', name: 'name', type: 'string', default: '' },
                        { displayName: 'Description', name: 'description', type: 'string', default: '' },
                        { displayName: 'Manager User ID', name: 'user_id', type: 'number', default: 0 },
                    ],
                },
                // ── ACTIVITY TYPES ────────────────────────────
                {
                    displayName: 'Activity Type Fields',
                    name: 'activityTypeFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['activityTypes'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Name', name: 'name', type: 'string', default: '' },
                        { displayName: 'Icon', name: 'icon', type: 'string', default: '' },
                    ],
                },
                // ── CALL OUTCOMES ─────────────────────────────
                {
                    displayName: 'Call Outcome Fields',
                    name: 'callOutcomeFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    displayOptions: {
                        show: { resource: ['callOutcomes'], operation: ['create', 'update'] },
                    },
                    options: [
                        { displayName: 'Name', name: 'name', type: 'string', default: '' },
                    ],
                },
                // ── COMMENTS ──────────────────────────────────
                {
                    displayName: 'Comment Body',
                    name: 'commentBody',
                    type: 'string',
                    typeOptions: { rows: 4 },
                    default: '',
                    displayOptions: {
                        show: { resource: ['comments'], operation: ['create', 'update'] },
                    },
                    description: 'The text content of the comment',
                },
                // ── ADDITIONAL FILTERS (list) ─────────────────
                {
                    displayName: 'Additional Filters',
                    name: 'additionalFilters',
                    type: 'collection',
                    placeholder: 'Add Filter',
                    default: {},
                    displayOptions: { show: { operation: ['list'] } },
                    options: [
                        { displayName: 'Sort By Field', name: 'sort_field', type: 'string', default: '' },
                        {
                            displayName: 'Sort Direction',
                            name: 'sort_direction',
                            type: 'options',
                            options: [
                                { name: 'Ascending', value: 'asc' },
                                { name: 'Descending', value: 'desc' },
                            ],
                            default: 'desc',
                        },
                    ],
                },
            ],
        };
    }
    // ─────────────────────────────────────────────
    // execute()
    // ─────────────────────────────────────────────
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter('resource', i);
            const operation = this.getNodeParameter('operation', i);
            let responseData = {};
            try {
                // ── Helper to read collection fields ────────
                const getFields = (paramName) => {
                    const fields = this.getNodeParameter(paramName, i, {});
                    const result = {};
                    for (const [key, val] of Object.entries(fields)) {
                        if (val !== '' && val !== 0 && val !== null && val !== undefined) {
                            if (key === 'custom_fields' && typeof val === 'string') {
                                try {
                                    const parsed = JSON.parse(val);
                                    Object.assign(result, parsed);
                                }
                                catch (parseError) {
                                    throw new n8n_workflow_1.NodeApiError(this.getNode(), { message: `Invalid JSON in custom_fields: ${parseError.message}` }, { itemIndex: i });
                                }
                            }
                            else {
                                result[key] = val;
                            }
                        }
                    }
                    return result;
                };
                // ────────────────────────────────────────────────────────
                // LOOKUP-ONLY RESOURCES (list only)
                // ────────────────────────────────────────────────────────
                if (['countries', 'currencies', 'timezones', 'industries', 'sources', 'roles', 'documentTypes'].includes(resource)) {
                    responseData = await concordRequest.call(this, 'GET', `/${resource}`);
                }
                // ────────────────────────────────────────────────────────
                // TRASHED
                // ────────────────────────────────────────────────────────
                else if (resource === 'trashed') {
                    const trashedResource = this.getNodeParameter('trashedResource', i);
                    if (operation === 'list') {
                        const page = this.getNodeParameter('page', i, 1);
                        const perPage = this.getNodeParameter('perPage', i, 15);
                        responseData = await concordRequest.call(this, 'GET', `/${trashedResource}/trashed`, undefined, { page, per_page: perPage });
                    }
                    else if (operation === 'restore') {
                        const recordId = this.getNodeParameter('recordId', i);
                        responseData = await concordRequest.call(this, 'POST', `/${trashedResource}/${recordId}/restore`);
                    }
                    else if (operation === 'delete') {
                        const recordId = this.getNodeParameter('recordId', i);
                        responseData = await concordRequest.call(this, 'DELETE', `/${trashedResource}/${recordId}/force`);
                    }
                }
                // ────────────────────────────────────────────────────────
                // COMMENTS
                // ────────────────────────────────────────────────────────
                else if (resource === 'comments') {
                    const commentableResource = this.getNodeParameter('commentableResource', i);
                    const commentableId = this.getNodeParameter('commentableId', i);
                    if (operation === 'list') {
                        responseData = await concordRequest.call(this, 'GET', `/${commentableResource}/${commentableId}/comments`);
                    }
                    else if (operation === 'create') {
                        const body = this.getNodeParameter('commentBody', i);
                        responseData = await concordRequest.call(this, 'POST', `/${commentableResource}/${commentableId}/comments`, { body });
                    }
                    else if (operation === 'update') {
                        const recordId = this.getNodeParameter('recordId', i);
                        const body = this.getNodeParameter('commentBody', i);
                        responseData = await concordRequest.call(this, 'PUT', `/comments/${recordId}`, { body });
                    }
                    else if (operation === 'delete') {
                        const recordId = this.getNodeParameter('recordId', i);
                        responseData = await concordRequest.call(this, 'DELETE', `/comments/${recordId}`);
                    }
                }
                // ────────────────────────────────────────────────────────
                // ALL OTHER RESOURCES (standard REST pattern)
                // ────────────────────────────────────────────────────────
                else {
                    // Map resource name → field collection param name
                    const fieldParamMap = {
                        deals: 'dealFields',
                        contacts: 'contactFields',
                        companies: 'companyFields',
                        activities: 'activityFields',
                        notes: 'noteFields',
                        calls: 'callFields',
                        documents: 'documentFields',
                        products: 'productFields',
                        pipelines: 'pipelineFields',
                        stages: 'stageFields',
                        users: 'userFields',
                        teams: 'teamFields',
                        activityTypes: 'activityTypeFields',
                        callOutcomes: 'callOutcomeFields',
                    };
                    const fieldParam = fieldParamMap[resource];
                    if (operation === 'list') {
                        const page = this.getNodeParameter('page', i, 1);
                        const perPage = this.getNodeParameter('perPage', i, 15);
                        const additionalFilters = this.getNodeParameter('additionalFilters', i, {});
                        const qs = { page, per_page: perPage, ...additionalFilters };
                        responseData = await concordRequest.call(this, 'GET', `/${resource}`, undefined, qs);
                    }
                    else if (operation === 'get') {
                        const recordId = this.getNodeParameter('recordId', i);
                        responseData = await concordRequest.call(this, 'GET', `/${resource}/${recordId}`);
                    }
                    else if (operation === 'create') {
                        const body = fieldParam ? getFields(fieldParam) : {};
                        responseData = await concordRequest.call(this, 'POST', `/${resource}`, body);
                    }
                    else if (operation === 'update') {
                        const recordId = this.getNodeParameter('recordId', i);
                        const body = fieldParam ? getFields(fieldParam) : {};
                        responseData = await concordRequest.call(this, 'PUT', `/${resource}/${recordId}`, body);
                    }
                    else if (operation === 'delete') {
                        const recordId = this.getNodeParameter('recordId', i);
                        responseData = await concordRequest.call(this, 'DELETE', `/${resource}/${recordId}`);
                    }
                    else if (operation === 'search') {
                        const q = this.getNodeParameter('searchQuery', i);
                        responseData = await concordRequest.call(this, 'GET', `/${resource}/search`, undefined, { q });
                    }
                    else if (operation === 'attachAssociation') {
                        const recordId = this.getNodeParameter('recordId', i);
                        const assocResource = this.getNodeParameter('associationResource', i);
                        const rawIds = this.getNodeParameter('associationIds', i);
                        const ids = rawIds.split(',').map((id) => parseInt(id.trim(), 10)).filter(Boolean);
                        responseData = await concordRequest.call(this, 'POST', `/${resource}/${recordId}/associations/${assocResource}`, { ids });
                    }
                    else if (operation === 'detachAssociation') {
                        const recordId = this.getNodeParameter('recordId', i);
                        const assocResource = this.getNodeParameter('associationResource', i);
                        const rawIds = this.getNodeParameter('associationIds', i);
                        const ids = rawIds.split(',').map((id) => parseInt(id.trim(), 10)).filter(Boolean);
                        responseData = await concordRequest.call(this, 'DELETE', `/${resource}/${recordId}/associations/${assocResource}`, { ids });
                    }
                    else if (operation === 'syncAssociation') {
                        const recordId = this.getNodeParameter('recordId', i);
                        const assocResource = this.getNodeParameter('associationResource', i);
                        const rawIds = this.getNodeParameter('associationIds', i);
                        const ids = rawIds.split(',').map((id) => parseInt(id.trim(), 10)).filter(Boolean);
                        responseData = await concordRequest.call(this, 'PUT', `/${resource}/${recordId}/associations/${assocResource}`, { ids });
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
                    continue;
                }
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error, { itemIndex: i });
            }
            // Normalise: if the response has a `data` array, flatten it
            if (Array.isArray(responseData === null || responseData === void 0 ? void 0 : responseData.data)) {
                for (const item of responseData.data) {
                    returnData.push({ json: item, pairedItem: { item: i } });
                }
            }
            else {
                returnData.push({ json: responseData, pairedItem: { item: i } });
            }
        }
        return [returnData];
    }
}
exports.ConcordCrm = ConcordCrm;
//# sourceMappingURL=ConcordCrm.node.js.map