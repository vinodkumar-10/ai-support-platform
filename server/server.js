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

app.post('/api/tickets', (req, res) => {
  const { title, priority, customer } = req.body

  if (!title || !priority || !customer) {
    return res.status(400).json({
      success: false,
      message: 'Title, priority, and customer are required',
    })
  }

  const highestTicketId = tickets.reduce(
    (highestId, ticket) => Math.max(highestId, ticket.id),
    0,
  )

  const newTicket = {
    id: highestTicketId + 1,
    title,
    priority,
    status: 'Open',
    customer,
    updatedAt: 'Just now',
  }

  tickets.push(newTicket)

  res.status(201).json({
    success: true,
    ticket: newTicket,
  })
})

app.put('/api/tickets/:id', (req, res) => {
  // Read the ticket ID from the URL and convert it to a number.
  const ticketId = Number(req.params.id)

  // Read and validate the requested status.
  const { status } = req.body
  const allowedStatuses = ['Open', 'In Progress', 'Resolved']

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be Open, In Progress, or Resolved',
    })
  }

  // Find the ticket with the matching ID.
  const ticket = tickets.find((ticket) => ticket.id === ticketId)

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found',
    })
  }

  // Update only the ticket status and modification time.
  ticket.status = status
  ticket.updatedAt = 'Just now'

  // Return the updated ticket.
  return res.status(200).json({
    success: true,
    ticket,
  })
})

app.delete('/api/tickets/:id', (req, res) => {
  // Read the ticket ID from the URL and convert it to a number.
  const ticketId = Number(req.params.id)

  // Find the position of the ticket with the matching ID.
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === ticketId)

  if (ticketIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Ticket not found',
    })
  }

  // Store the ticket before removing it from the array.
  const deletedTicket = tickets[ticketIndex]
  tickets.splice(ticketIndex, 1)

  // Return the deleted ticket.
  return res.status(200).json({
    success: true,
    message: 'Ticket deleted successfully',
    ticket: deletedTicket,
  })
})

app.listen(PORT, () => {
  console.log(`ResolveAI server running on http://localhost:${PORT}`)
})
