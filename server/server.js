const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ResolveAI API is running',
  })
})
const tickets = [
  {
    id: 1,
    title: 'Unable to reset account password',
    priority: 'High',
    status: 'Open',
    customer: 'Rahul Sharma',
    updatedAt: '12 minutes ago',
  },
  {
    id: 2,
    title: 'Billing plan not updated',
    priority: 'Medium',
    status: 'In Progress',
    customer: 'Sneha Reddy',
    updatedAt: '28 minutes ago',
  },
  {
    id: 3,
    title: 'Login OTP not received',
    priority: 'Low',
    status: 'Resolved',
    customer: 'Amit Kumar',
    updatedAt: '1 hour ago',
  },
]

app.get('/api/tickets', (req, res) => {
  res.status(200).json({
    success: true,
    count: tickets.length,
    tickets,
  })
})
app.listen(PORT, () => {
  console.log(`ResolveAI server running on http://localhost:${PORT}`)
})