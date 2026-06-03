<!-- KROXIA Platform - Quick Start Guide -->

# KROXIA - Complete Agency Operating System

আপনার সম্পূর্ণ KROXIA প্ল্যাটফর্ম তৈরি হয়েছে! এটি একটি enterprise-grade multi-tenant SaaS অ্যাপ্লিকেশন।

## প্রজেক্ট স্ট্রাকচার

```
src/
├── contexts/              # Global state management
│   ├── AuthContext.tsx   # Authentication logic
│   └── AppContext.tsx    # Organization & user context
├── components/
│   ├── Sidebar.tsx       # Navigation sidebar
│   ├── ProtectedRoute.tsx
│   └── shared/
│       └── FormComponents.tsx  # Reusable UI components
├── pages/                # Complete feature pages
│   ├── SignInPage.tsx
│   ├── DashboardPage.tsx
│   ├── CRMPage.tsx       # Leads management
│   ├── ContactsPage.tsx
│   ├── DealsPage.tsx
│   ├── ProjectsPage.tsx
│   ├── TasksPage.tsx
│   ├── InvoicesPage.tsx
│   ├── TicketsPage.tsx
│   ├── MarketplacePage.tsx
│   └── SettingsPage.tsx
├── lib/
│   └── supabase.ts       # Supabase client setup
└── App.tsx               # Main router
```

## ডাটাবেস স্কিমা

সম্পূর্ণ স্কিমা সেটআপ করা হয়েছে 55+ টেবিল সহ:

- **Authentication & Users**: roles, staff, departments, organizations
- **CRM**: leads, contacts, deals, activities, pipelines
- **Projects**: projects, milestones, tasks, time_logs, approvals
- **Finance**: invoices, proposals, payments, expenses, tax_rates
- **Support**: tickets, ticket_messages, knowledge_base
- **Marketplace**: products, orders, licenses, product_reviews, payouts
- **Platform**: notifications, audit_logs, settings, integrations

সব টেবিল RLS enabled এবং secure policies সহ।

## কীভাবে চালাবেন

```bash
npm run dev       # ডেভেলপমেন্ট সার্ভার শুরু করুন
npm run build     # প্রোডাকশনের জন্য বিল্ড করুন
npm run typecheck # TypeScript চেক করুন
```

## প্রধান ফিচার

### 1. Authentication
- Email/password signup এবং login
- Supabase Auth সহ বিল্ট-ইন
- Session ম্যানেজমেন্ট

### 2. Admin Dashboard
- KPI কার্ডস (লিড, প্রজেক্ট, টাস্ক, রেভিনিউ)
- Recent activities
- Quick actions

### 3. CRM মডিউল
- লিড ট্র্যাকিং এবং স্কোরিং
- কন্টাক্ট ম্যানেজমেন্ট
- ডিল পাইপলাইন

### 4. প্রজেক্ট ম্যানেজমেন্ট
- প্রজেক্ট ক্রিয়েশন এবং ট্র্যাকিং
- টাস্ক অ্যাসাইনমেন্ট
- মাইলস্টোন ম্যানেজমেন্ট

### 5. ইনভয়েসিং
- ইনভয়েস জেনারেশন
- পেমেন্ট ট্র্যাকিং
- স্ট্যাটাস ম্যানেজমেন্ট

### 6. সাপোর্ট সিস্টেম
- টিকেট ক্রিয়েশন এবং ট্র্যাকিং
- প্রায়োরিটি ম্যানেজমেন্ট
- স্ট্যাটাস আপডেট

### 7. মার্কেটপ্লেস
- প্রোডাক্ট লিস্টিং
- ফিল্টারিং এবং সার্চ
- রেটিং এবং রিভিউ

## পেজগুলি এবং রুটস

| পেজ | রুট | ফিচার |
|------|------|--------|
| Dashboard | `/dashboard` | KPI overview, recent activities |
| CRM | `/crm` | Lead management |
| Contacts | `/contacts` | Contact database |
| Deals | `/deals` | Sales pipeline |
| Projects | `/projects` | Project management |
| Tasks | `/tasks` | Task assignments |
| Invoices | `/invoices` | Invoice management |
| Tickets | `/tickets` | Support ticketing |
| Marketplace | `/marketplace` | Product browsing |
| Settings | `/settings` | Organization settings |

## কাস্টমাইজেশন গাইড

### নতুন পেজ যোগ করুন

1. `src/pages/` এ একটি নতুন `.tsx` ফাইল তৈরি করুন
2. `App.tsx` এ রুট যোগ করুন
3. `Sidebar.tsx` এ মেনু আইটেম যোগ করুন

```tsx
// src/pages/NewPage.tsx
export function NewPage() {
  return <div>Your content</div>;
}
```

### নতুন ডাটাবেস টেবিল যোগ করুন

Supabase migration ব্যবহার করুন:

```bash
supabase migration new add_my_table
# তারপর migration ফাইল সম্পাদনা করুন
```

### প্রি-বিল্ট কম্পোনেন্ট ব্যবহার করুন

```tsx
import { Button, Card, Input, Badge } from '@/components/shared/FormComponents';
```

## এনভায়রনমেন্ট ভেরিয়েবল

`.env` ফাইলে Supabase ক্রেডেনশিয়াল সেট করুন:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## Supabase Setup

1. [supabase.com](https://supabase.com) এ অ্যাকাউন্ট তৈরি করুন
2. নতুন প্রজেক্ট তৈরি করুন
3. URLs এবং keys কপি করুন `.env` এ পেস্ট করুন
4. মাইগ্রেশনস অ্যাপ্লাই হয়ে গেছে - ডাটাবেস সেটআপ সম্পূর্ণ!

## পরবর্তী পদক্ষেপ

### Short term (Week 1-2)
- [ ] কাস্টম ব্র্যান্ডিং যোগ করুন
- [ ] টেস্ট ডাটা পপুলেট করুন
- [ ] মোবাইল UI পালিশ করুন
- [ ] Email টেমপ্লেট যোগ করুন

### Medium term (Month 2-3)
- [ ] Advanced filtering এবং search
- [ ] Kanban বোর্ড ভিউ (টাস্ক এবং ডিল)
- [ ] File upload ফিচার
- [ ] Real-time notifications
- [ ] Time tracking dashboard

### Long term (Month 4+)
- [ ] AI features (lead scoring, proposal generation)
- [ ] API documentation
- [ ] White-label customization
- [ ] Mobile app
- [ ] Integrations (Stripe, Zapier, etc.)

## টাইপস্ক্রিপ্ট ইন্টিগ্রেশন

প্রজেক্ট সম্পূর্ণ TypeScript সাপোর্ট সহ আসে। Supabase থেকে অটো-জেনারেট টাইপস পান:

```bash
supabase gen types typescript --local > src/types/database.ts
```

## পারফরম্যান্স

- Lazy loading এবং code splitting ইতিমধ্যে সেটআপ করা হয়েছে
- Tailwind CSS দিয়ে অপটিমাইজড স্টাইলিং
- সব পেজ fast এবং responsive

## সিকিউরিটি

- RLS (Row Level Security) সব টেবিলে enabled
- Auth-based access control
- Secure client initialization
- No sensitive data in frontend code

## ডকুমেন্টেশন ফাইলসের লিঙ্ক

- Supabase: https://supabase.com/docs
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

---

**আপনার সম্পূর্ণ এন্টারপ্রাইজ প্ল্যাটফর্ম প্রস্তুত!** 🚀

আরও কিছু চান? আমি যেকোনো পেজ আরও কাস্টমাইজ করতে বা নতুন ফিচার যোগ করতে প্রস্তুত।
