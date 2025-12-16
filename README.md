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

## Configuration

open .env.example file in backend folder, enter valid url and key, rename file to .env (check if ignored for git)

---

## Running locally

### Backend
```
cd supabase
npx supabase start
```

### Reset database & run migrations
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


