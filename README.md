# n8n-nodes-concord-crm

A custom n8n community node for the [Concord CRM](https://www.concordcrm.com) API (v1.x). Supports full CRUD, search, and association management across all resources.

---

## Supported Resources & Operations

| Resource | Operations |
|---|---|
| **Deal** | List, Get, Create, Update, Delete, Search, Attach/Detach/Sync Associations |
| **Contact** | List, Get, Create, Update, Delete, Search, Attach/Detach/Sync Associations |
| **Company** | List, Get, Create, Update, Delete, Search, Attach/Detach/Sync Associations |
| **Activity** | List, Get, Create, Update, Delete, Search, Attach/Detach/Sync Associations |
| **Note** | List, Get, Create, Update, Delete, Search |
| **Call** | List, Get, Create, Update, Delete, Search |
| **Document** | List, Get, Create, Update, Delete, Search |
| **Product** | List, Get, Create, Update, Delete, Search |
| **Pipeline** | List, Get, Create, Update, Delete |
| **Stage** | List, Get, Create, Update, Delete |
| **User** | List, Get, Create, Update, Delete |
| **Team** | List, Get, Create, Update, Delete |
| **Activity Type** | List, Get, Create, Update, Delete |
| **Call Outcome** | List, Get, Create, Update, Delete |
| **Comment** | List, Create, Update, Delete |
| **Trashed Record** | List, Restore, Permanently Delete |
| **Country** | List |
| **Currency** | List |
| **Timezone** | List |
| **Industry** | List |
| **Source** | List |
| **Role** | List |
| **Document Type** | List |

---

## Installation

### Option A — Copy into your n8n custom nodes directory

```bash
# Clone or copy this package into your n8n custom nodes folder
cp -r n8n-nodes-concord-crm ~/.n8n/custom/

# Install dependencies
cd ~/.n8n/custom/n8n-nodes-concord-crm
npm install

# Build
npm run build
```

### Option B — npm link (development)

```bash
cd n8n-nodes-concord-crm
npm install
npm run build
npm link

cd ~/.n8n   # or wherever n8n is installed
npm link n8n-nodes-concord-crm
```

### Option C — Publish to npm then install via n8n UI

```bash
npm publish
# Then in n8n: Settings → Community Nodes → Install → n8n-nodes-concord-crm
```

---

## Configuration

1. In n8n, go to **Credentials → New Credential → Concord CRM API**
2. Enter your **Base URL** (e.g. `https://crm.yourdomain.com`) — no trailing slash
3. Enter your **API Token** — generate it in the Concord CRM dashboard under **Profile → Personal Access Tokens**
4. Click **Test** to verify the connection

---

## Usage Notes

### Custom Fields
When creating or updating records, use the **Custom Fields (JSON)** field inside the record's field collection. Provide a JSON object where keys are the custom field IDs you defined in Concord CRM:

```json
{
  "my_custom_field_id": "value",
  "another_field_id": true
}
```

### Associations
For Attach/Detach/Sync associations, provide a comma-separated list of IDs in the **Associated Record IDs** field, e.g. `1,2,3`.

- **Attach** — adds the specified records without affecting existing associations
- **Detach** — removes the specified records from the association
- **Sync** — replaces all associations with exactly the specified records

### Pagination
All List operations support **Page** (default: 1) and **Per Page** (default: 15, max: 100) parameters. Note that not all endpoints respect `per_page` per the API documentation.

### Trashed Records
Use the **Trashed Record** resource to list, restore, or permanently delete soft-deleted records. Select the underlying resource type (e.g. Deals, Contacts) from the **Trashed Resource** dropdown.

### Comments
Comments are scoped to a parent resource. Select the **Commentable Resource** (e.g. Deals) and provide the **Parent Record ID**.

---

## Important: Headers
Do **not** include `referer` or `origin` headers in requests — they conflict with Laravel Sanctum's CSRF validation. This node handles headers correctly by default.

---

## License

MIT
