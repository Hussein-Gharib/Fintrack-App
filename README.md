# FinTrack

FinTrack is a full-stack personal finance tracker built to help users manage income, expenses, categories, and monthly financial insights through a clean dashboard interface.

## Features

- User registration and login
- JWT authentication
- Protected routes
- Starting balance setup for new users
- Dashboard with financial summary
- Monthly dashboard filtering
- Expense breakdown chart
- Income breakdown chart
- Expense and income category totals
- Recent transactions list
- Full CRUD for categories
- Full CRUD for transactions
- Search, filter, and sort transactions
- Currency selector
- Custom logo and favicon
- Responsive modern UI

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt
- dotenv
- cors
- pg

## Project Structure

```txt
fintrack/
  client/
    src/
      api/
      components/
      pages/
      styles/
      utils/
  server/
    src/
      config/
      controllers/
      middleware/
      routes/
  README.md