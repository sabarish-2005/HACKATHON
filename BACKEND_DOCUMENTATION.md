# Backend Architecture - Supabase Integration

## Project Architecture

The backend is built using **Supabase**, a PostgreSQL-based Backend-as-a-Service platform. This document outlines the complete backend structure, database schema, API services, and integration patterns.

---

## 🏗️ Database Schema

### Tables

#### 1. **registrations**

Stores team registration data for the hackathon

```sql
- id: BIGSERIAL PRIMARY KEY
- team_name: VARCHAR(50)
- leader_name: VARCHAR(100)
- email: VARCHAR(255)
- mobile: VARCHAR(10)
- college: VARCHAR(200)
- leader_dept: VARCHAR(50)
- member2_name: VARCHAR(100)
- member2_email: VARCHAR(255)
- member2_dept: VARCHAR(50)
- member3_name: VARCHAR(100) (Optional)
- member3_email: VARCHAR(255) (Optional)
- member3_dept: VARCHAR(50) (Optional)
- project_title: VARCHAR(255) (Optional)
- project_description: TEXT (Optional)
- git_link: VARCHAR(500) (Optional)
- notes: TEXT (Optional)
- status: VARCHAR(20) (ENUM: pending, selected, not_selected)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 2. **admin_users**

Stores admin user credentials and information

```sql
- id: BIGSERIAL PRIMARY KEY
- username: VARCHAR(100) UNIQUE
- email: VARCHAR(255) UNIQUE
- password_hash: VARCHAR(255)
- role: VARCHAR(50) (ENUM: admin, super_admin, moderator)
- is_active: BOOLEAN
- last_login: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 3. **events**

Stores hackathon events and schedules

```sql
- id: BIGSERIAL PRIMARY KEY
- title: VARCHAR(255)
- description: TEXT
- event_date: DATE
- event_time: TIME
- location: VARCHAR(255)
- event_type: VARCHAR(100)
- max_capacity: INTEGER
- registered_count: INTEGER
- status: VARCHAR(50) (ENUM: upcoming, ongoing, completed, cancelled, published)
- created_by: BIGINT (Foreign Key to admin_users)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### 4. **audit_logs**

Tracks all changes to important data

```sql
- id: BIGSERIAL PRIMARY KEY
- action: VARCHAR(50) (ENUM: CREATE, UPDATE, DELETE)
- table_name: VARCHAR(100)
- record_id: BIGINT
- admin_id: BIGINT (Foreign Key)
- old_values: JSONB
- new_values: JSONB
- performed_at: TIMESTAMPTZ
```

---

## 📁 Service Files

### 1. **src/lib/api.ts**

Main API service for registration operations

- `createRegistration()` - Create new team registration
- `fetchRegistrations()` - Get filterable registrations list
- `getRegistrationById()` - Get single registration
- `updateRegistration()` - Update registration details
- `updateRegistrationStatus()` - Update team status
- `deleteRegistration()` - Delete registration
- `getRegistrationStats()` - Get stats (total, by status, by dept)
- `exportRegistrationsAsCSV()` - Export data to CSV
- `bulkUpdateRegistrationStatus()` - Update multiple registrations
- `bulkDeleteRegistrations()` - Delete multiple registrations

**Types:**

```typescript
- RegistrationPayload: Input data for creating/updating registrations
- RegistrationRecord: Complete registration record with metadata
```

### 2. **src/lib/admin-service.ts**

Admin authentication and user management

- `adminLogin()` - Authenticate admin user
- `adminLogout()` - Clear admin session
- `isAdminAuthenticated()` - Check auth status
- `getAuthenticatedAdmin()` - Get current admin info
- `getAdminById()` - Fetch admin by ID
- `getAllAdmins()` - Get all active admins
- `createAdminUser()` - Create new admin (super_admin only)
- `updateAdminUser()` - Update admin settings
- `deactivateAdminUser()` - Soft delete admin
- `updateAdminLastLogin()` - Track login

**Types:**

```typescript
- AdminUser: User object with role and permissions
```

### 3. **src/lib/event-service.ts**

Event management for hackathon schedule

- `createEvent()` - Create new event
- `getEvents()` - List events (filtered by status)
- `getEventById()` - Get single event details
- `updateEvent()` - Update event information
- `deleteEvent()` - Remove event
- `incrementEventRegistrationCount()` - Track registrations
- `getUpcomingEvents()` - Get future events

**Types:**

```typescript
- Event: Event record with schedule and metadata
```

### 4. **src/lib/audit-service.ts**

Audit trail and change tracking

- `logAuditAction()` - Generic audit logging
- `getAuditLogs()` - Get logs by table
- `getAuditLogsByAction()` - Filter by action type
- `getAuditLogsByAdmin()` - Filter by admin
- `getRecordHistory()` - Get change history
- `logRegistrationCreated()` - Log new registration
- `logRegistrationUpdated()` - Log updates
- `logRegistrationDeleted()` - Log deletion
- `cleanupOldAuditLogs()` - Remove old records

**Types:**

```typescript
- AuditLog: Audit trail record
```

---

## 🔐 Security & Row Level Security (RLS)

### Policies Configured

#### Registrations

- **Public Write**: Anyone can submit registrations
- **Authenticated Read**: Only logged-in admins can view
- **Authenticated Update**: Only admins can modify status

#### Admin Users

- **Authenticated Read**: Users can only read their own record
- **Authenticated Update**: Users can only update their own record

#### Events

- **Public Read**: Anyone can view published events
- **Authenticated Update**: Only event creator can modify

#### Audit Logs

- **Authenticated Read**: Only admins can access logs

---

## 🚀 Environment Setup

### Required Environment Variables

Create a `.env.local` file (already in .gitignore):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Get Keys from Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Settings → API
4. Copy `Project URL` and `anon public key`

---

## 💻 Example Usage

### Create a Registration

```typescript
import { createRegistration } from '@/lib/api';

const newTeam = await createRegistration({
  team_name: "Code Warriors",
  leader_name: "John Doe",
  email: "john@college.edu",
  mobile: "9876543210",
  college: "Tech University",
  leader_dept: "CS",
  member2_name: "Jane Smith",
  member2_email: "jane@college.edu",
  member2_dept: "IT",
  project_title: "AI Chatbot",
  git_link: "https://github.com/example/project"
});
```

### Fetch with Filters

```typescript
import { fetchRegistrations } from '@/lib/api';

// Get all registrations for CS department
const teams = await fetchRegistrations("", "CS");

// Search by team name
const results = await fetchRegistrations("Warriors", "All");
```

### Update Status

```typescript
import { updateRegistrationStatus } from '@/lib/api';

await updateRegistrationStatus(123, "selected");
```

### Get Statistics

```typescript
import { getRegistrationStats } from '@/lib/api';

const stats = await getRegistrationStats();
console.log(stats);
// Output: {
//   total: 50,
//   pending: 30,
//   selected: 15,
//   not_selected: 5,
//   byDept: { CS: 20, IT: 15, AIML: 15 }
// }
```

### Admin Login

```typescript
import { adminLogin } from '@/lib/admin-service';

const result = await adminLogin("admin", "hackathon2026");
if (result.success) {
  console.log("Logged in as:", result.user?.username);
}
```

### Create Event

```typescript
import { createEvent } from '@/lib/event-service';

const event = await createEvent({
  title: "Opening Ceremony",
  description: "Kickoff event",
  event_date: "2026-02-10",
  event_time: "10:00:00",
  location: "Main Auditorium",
  status: "upcoming"
});
```

### Log Audit

```typescript
import { logAuditAction } from '@/lib/audit-service';

await logAuditAction(
  "UPDATE",
  "registrations",
  123,
  { status: "pending" },
  { status: "selected" }
);
```

---

## 🗄️ Database Migrations

All migrations are in `supabase/migrations/` directory:

1. **20260204_create_registrations_table.sql** - Initial registrations table
2. **20260207_add_member2_email.sql** - Add member2_email column
3. **20260207_allow_public_read_write.sql** - Public read/write policies
4. **20260207_create_admin_users_table.sql** - Admin users table
5. **20260207_create_events_table.sql** - Events table
6. **20260207_add_enhancements.sql** - Additional columns, audit logs

### Applying Migrations

```bash
# Deploy migrations to Supabase
supabase db push

# Or via the Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Paste migration content
# 3. Execute
```

---

## 🔍 Querying Best Practices

### Filter & Search

```typescript
// Multiple conditions
const results = await fetchRegistrations("john", "CS");

// Advanced filtering
const { data } = await supabase
  .from('registrations')
  .select()
  .or('email.ilike.%john%,mobile.ilike.%9876%')
  .eq('status', 'selected');
```

### Error Handling

```typescript
try {
  const team = await createRegistration(data);
} catch (error) {
  console.error('Registration failed:', error.message);
  // Handle error in UI
}
```

### Pagination

```typescript
const pageSize = 10;
const pageNum = 1;

const { data } = await supabase
  .from('registrations')
  .select()
  .range((pageNum - 1) * pageSize, pageNum * pageSize - 1);
```

---

## 📊 Admin Dashboard Features

The admin dashboard (`/admin/dashboard`) uses these services to:

- ✅ View all team registrations
- 🔍 Search by team name or leader name
- 🏷️ Filter by department
- ✏️ Update team status (pending/selected/rejected)
- 🗑️ Delete registrations
- 📊 View statistics and charts
- 📥 Download/export as CSV

---

## 🔒 Authentication Flow

1. Admin enters credentials on `/admin` page
2. Credentials verified (currently hardcoded for demo)
3. Auth token stored in localStorage
4. Protected routes check `isAdminAuthenticated()`
5. All data access requires authentication
6. Logout clears session and token

### Future: Migrate to Supabase Auth

```typescript
// After implementation
const { data } = await supabase.auth.signInWithPassword({
  email: "admin@example.com",
  password: "password"
});
```

---

## 🧪 Testing

### Manual Testing Workflow

1. **Register Team**
   - Fill form at `/register`
   - Submit and verify in DB

2. **Admin Access**
   - Navigate to `/admin`
   - Login with admin credentials
   - Verify dashboard loads

3. **Update Status**
   - Open admin dashboard
   - Click edit on a team
   - Change status and save
   - Verify in database

4. **Export Data**
   - Click download button
   - Verify CSV format and content

---

## 📝 Logging & Monitoring

### View Audit Logs

```typescript
import { getAuditLogs } from '@/lib/audit-service';

// Get all changes to registrations table
const logs = await getAuditLogs('registrations');

// Get changes to specific record
const recordHistory = await getAuditLogs('registrations', 123);
```

### Parse Audit Data

```typescript
logs.forEach(log => {
  console.log(`${log.action} at ${log.performed_at}`);
  console.log('Before:', log.old_values);
  console.log('After:', log.new_values);
});
```

---

## 🐛 Troubleshooting

### Common Issues

#### Q: "Failed to fetch registrations"

- A: Check Supabase URL and API key in `.env.local`
- A: Verify RLS policies allow public access

#### Q: Admin login fails

- A: Check hardcoded credentials in `admin-service.ts`
- A: Verify admin auth token in localStorage

#### Q: CSV export empty

- A: Ensure registrations have data
- A: Check CSV formatting in `api.ts`

#### Q: Audit logs not recording

- A: Verify audit_logs table exists (run migrations)
- A: Check admin ID is valid

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)

---

## 📋 Checklist for Production

- [ ] Create strong admin password (not hardcoded)
- [ ] Implement Supabase Auth instead of local credentials
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Enable database backups
- [ ] Review and adjust RLS policies
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerts
- [ ] Test disaster recovery
- [ ] Review audit logs regularly

---

## 🤝 Contributing

When adding new features:

1. Create migration file for schema changes
2. Update TypeScript types
3. Add service function with error handling
4. Log audit trail for sensitive operations
5. Test thoroughly before deploying

---

Last Updated: February 7, 2026
