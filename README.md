# Calda Challenge

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Prerequisites](#prerequisites)  
4. [Installation](#installation)  
5. [Configuration](#configuration)  
6. [Running Locally](#running-locally)

---

## Features

- Order creation with Supabase Edge Functions 
- Items, orders, order history 
- Authentication via Supabase Auth  
- Database migrations & seeding
- Cloud + Local backend support
- CORS configured for dev & prod
- Basic Angular UI 

---

## Tech Stack

- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions) 
- **Frontend**: Angular (standalone components, Reactive Forms), TypeScript  

---

## Prerequisites

- **Node.js (version 18+)**  
- **npm**
- **Supabase CLI**
  ```
  npm install -g supabase
  ```

---

## Installation

### Clone repo
```
git clone https://github.com/antonelaparovic/CaldaChallenge.git
cd CaldaChallenge
```


### Open new Terminal, navigate to frontend folder (from root folder), install frontend dependencies
```
cd ../calda-challenge-frontend
npm install
```

---

## Running locally
Docker Desktop must be opened in the background

### Backend
```
cd supabase
npx supabase start
```
After succesfull running the backend, CLI will print something like
```
Studio URL: http://localhost:54323
API URL: http://localhost:54321
DB: postgres://postgres:postgres@localhost:54322/postgres
```
Open Supabase Studio from url.

### Reset database & run migrations
In terminal, run
```
npx supabase db reset
```

### Frontend
```
cd calda-challenge-frontend
npm run build
ng serve
```

Open http://localhost:4200

Sign up with new user, with email antonelaparovic@gmail.com (or use prefered email).

In Supabase Studio (previously opened), open SQL Editor, paste and run code from orders_seed.sql (if you signed up with different email, change script accordingly)

Go back to UI and you will see your orders!

---

## Running on Cloud/Production

The Supabase backend is already deployed and fully configured in the cloud.

### Accessing the Cloud Supabase Project

Use the credentials provided in the submission email to log into:

https://supabase.com/dashboard

### Running Angular to test cloud backend

```
cd calda-challenge-frontend
ng serve --c production
```

The app will automatically connect to the cloud Supabase backend.

Open:

http://localhost:4200

Sign up with prefered email address (you will have to confirm login via that email!)

If not seeing items in dropdown, email is still not confirmed.

Successfully created orders can be seen in the previously opened Cloud Dashboard.


