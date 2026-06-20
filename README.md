# 🌌 Creatoria: Multi-Vendor Digital Marketplace

Creatoria is a high-performance, premium multi-vendor digital marketplace optimized for developer assets, themes, code templates, and design files. It supports web (Next.js), mobile (React Native/Expo), and a Node.js/Express backend, all styled in a premium dark mode default.

---

## 🏗️ System Architecture & Tech Stack

Creatoria is structured as a monorepo containing three core workspaces:

```text
digital-marketplace/
├── backend/      # Node.js + Express + MongoDB (Mongoose) + JWT Auth
├── web/          # Next.js 14 + Tailwind CSS + Axios + Stripe Web Client
└── mobile/       # React Native + Expo + React Navigation + Secure Storage
```

### 🛠️ Core Stack & Integrations
* **Backend:** Node.js & Express API with MongoDB/Mongoose ORM.
* **Frontend Web:** Next.js (React) styled using premium Tailwind CSS dark variables (`#020617` Navy defaults).
* **Mobile Client:** React Native / Expo utilizing bottom tab navigation, SecureStore credentials caching, and native browser overlays.
* **Cloud Storage (AWS S3):** Used for secure digital asset storage. Direct downloads are strictly protected behind temporary presigned URLs (1-hour expiry).
* **Payments (Stripe Connect):** Features split-commission logic transferring payouts directly to vendor connected Stripe Express accounts.

---

## 🔒 Security & Compliance Protocols

### 🔑 Secure Digital Delivery
* **Pre-signed Download URLs:** The backend implements AWS S3 `getSignedUrl` with an `Expires: 3600` parameter. Links are only issued if the requesting user has a verified, paid order or active subscription for the specific product.
* **Direct Browser Uploads:** Vendors request pre-signed `PutObject` URLs, allowing direct binary uploads from the browser to S3. This eliminates server bottleneck issues.

### 💳 Payment & Platform Commissions
* **Stripe Connect Express:** When a customer completes checkout, Stripe automatically routes the funds:
  - **Vendor Payout:** Total amount minus platform fee.
  - **Platform Fee:** Routed back to the marketplace owner (default 10% commission fee).
* **App Store Policy Compliance:** The mobile application contains disclosures and architecture logic separating in-app digital purchases (which must use Apple/Google IAP channels) from Stripe web-checkouts.

---

## 🚀 Getting Started

### 📦 1. Clone & Set Up Environment Variables

First, create a `.env` file in the `backend/` directory using the template below:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_signing_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
AWS_BUCKET=your_s3_bucket_name
AWS_ACCESS_KEY=your_aws_access_key_id
AWS_SECRET_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
FRONTEND_URL=http://localhost:3000
```

### 🖥️ 2. Launch the Backend API Server
```bash
cd backend
npm install
npm run dev
```
The backend server will launch on `http://localhost:5000`.

### 🌐 3. Launch the Next.js Web App
```bash
cd ../web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the marketplace.

### 📱 4. Launch the Expo Mobile App
Ensure you have the Expo Go app installed on your physical device or emulator.
```bash
cd ../mobile
npm install
npm start
```

---

## 📂 Codebase Details

### 🗄️ Database Schemas
* **`User`:** Emails (unique), Passwords (hashed using `bcryptjs` with salt 12), Roles (`user`, `vendor`, `admin`).
* **`Vendor`:** Relates to a User, tracks `stripeAccountId` for payouts, verification status, and commission rates.
* **`Product`:** Relates to a Vendor, supports `one-time` lifetime purchases and recurring `subscription` accesses. Stored using S3 file keys.
* **`Order`:** Connects User, Product, Vendor, checkout session, and net commission split values.

### 📡 API Routes Summary
* `POST /api/auth/register` & `POST /api/auth/login` - User registration and authentication (JWT).
* `POST /api/vendors/apply` - Creates a Stripe Express Connect account.
* `POST /api/products` - Publishes digital listings (authorized vendors/admins only).
* `POST /api/checkout/create-session` - Generates Stripe payment links based on billing modes.
* `GET /api/checkout/download/:productId` - Validates purchases and generates secure S3 download links.
* `POST /api/webhooks/stripe` - Listens to Stripe events to update paid orders and active subscriptions.

---

## 🎨 Premium UI Guidelines
* **Color Palette:** Navy Dark background (`#020617`), Slate surface tiles (`#0F172A`), and Indigo buttons (`#6366F1`) with subtle glowing rings.
* **Glassmorphism:** Navigation menus and dashboard cards use transparent layouts with heavy blur overlays (`backdrop-blur-md`).
* **Interactive Motion:** Interactive elements use smooth scale modifications and hover transitions via Framer Motion.
