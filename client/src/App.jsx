import { useEffect, useState } from 'react'
import './App.css'

const features = [
  {
    icon: '⚡',
    title: 'Smart ticket handling',
    description: 'Create, organize, and track support issues in one place.',
  },
  {
    icon: '🤖',
    title: 'AI assistance',
    description: 'Get ticket summaries and suggested responses for faster support.',
  },
  {
    icon: '📊',
    title: 'Clear visibility',
    description: 'Monitor ticket status, priorities, and team activity.',
  },
]

function App() {
  const [apiStatus, setApiStatus] = useState('Checking backend...')
  const [tickets, setTickets] = useState([])
  const [ticketsLoading, setTicketsLoading] = useState(true)
  const [ticketsError, setTicketsError] = useState(null)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('High')
  const [customer, setCustomer] = useState('')
  const [createTicketLoading, setCreateTicketLoading] = useState(false)
  const [createTicketError, setCreateTicketError] = useState(null)
  const [updatingTicketId, setUpdatingTicketId] = useState(null)
  const [updateTicketError, setUpdateTicketError] = useState(null)
  const [deletingTicketId, setDeletingTicketId] = useState(null)
  const [deleteTicketError, setDeleteTicketError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((response) => response.json())
      .then((data) => setApiStatus(data.message))
      .catch(() => setApiStatus('Backend is not connected'))
  }, [])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setTicketsError(null)

        const response = await fetch('http://localhost:5000/api/tickets')

        if (!response.ok) {
          throw new Error('Unable to load tickets')
        }

        const data = await response.json()
        setTickets(Array.isArray(data.tickets) ? data.tickets : [])
      } catch (error) {
        setTicketsError('Unable to load tickets. Please try again.')
      } finally {
        setTicketsLoading(false)
      }
    }

    fetchTickets()
  }, [])

  const handleCreateTicket = async (event) => {
    event.preventDefault()

    if (!title.trim() || !customer.trim()) {
      setCreateTicketError('Title and customer are required')
      return
    }

    try {
      setCreateTicketLoading(true)
      setCreateTicketError(null)

      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          priority,
          customer: customer.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create ticket')
      }

      setTickets((currentTickets) => [...currentTickets, data.ticket])
      setTitle('')
      setPriority('High')
      setCustomer('')
    } catch (error) {
      setCreateTicketError(error.message || 'Unable to create ticket')
    } finally {
      setCreateTicketLoading(false)
    }
  }

  // Update one ticket's status through the backend.
  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdatingTicketId(ticketId)
    setUpdateTicketError(null)

    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update ticket status')
      }

      // Replace only the ticket returned by the backend.
      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.id === data.ticket.id ? data.ticket : ticket,
        ),
      )
    } catch (error) {
      setUpdateTicketError(
        error.message || 'Unable to update ticket status. Please try again.',
      )
    } finally {
      setUpdatingTicketId(null)
    }
  }

  // Confirm and delete one ticket through the backend.
  const handleDeleteTicket = async (ticketId) => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this ticket?',
    )

    if (!shouldDelete) {
      return
    }

    setDeletingTicketId(ticketId)
    setDeleteTicketError(null)

    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`,
        {
          method: 'DELETE',
        },
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete ticket')
      }

      // Remove only the ticket that was successfully deleted.
      setTickets((currentTickets) =>
        currentTickets.filter((ticket) => ticket.id !== ticketId),
      )
    } catch (error) {
      setDeleteTicketError(
        error.message || 'Unable to delete ticket. Please try again.',
      )
    } finally {
      setDeletingTicketId(null)
    }
  }

  return (
    <main className="landing-page">
      <nav className="navbar">
        <a className="brand" href="/">
          Resolve<span>AI</span>
        </a>

        <div className="nav-actions">
          <button className="text-button">Sign in</button>
          <button className="primary-button">Get started</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <p className="api-status">{apiStatus}</p>
          <p className="eyebrow">AI-POWERED CUSTOMER SUPPORT</p>

          <h1>
            Resolve customer issues
            <span> with confidence.</span>
          </h1>

          <p className="hero-description">
            ResolveAI helps support teams manage tickets, collaborate faster,
            and use AI to deliver better customer experiences.
          </p>

          <div className="hero-actions">
            <button className="primary-button large-button">
              Create your workspace
            </button>
            <button className="secondary-button large-button">
              Explore features
            </button>
          </div>
        </div>

        <div className="hero-dashboard-column">
          <form className="ticket-form" onSubmit={handleCreateTicket}>
          <label htmlFor="ticket-title">Title</label>
          <input
            id="ticket-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label htmlFor="ticket-priority">Priority</label>
          <select
            id="ticket-priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <label htmlFor="ticket-customer">Customer</label>
          <input
            id="ticket-customer"
            type="text"
            value={customer}
            onChange={(event) => setCustomer(event.target.value)}
          />

          <button type="submit" disabled={createTicketLoading}>
            {createTicketLoading ? 'Creating...' : 'Create ticket'}
          </button>

          {createTicketError && (
            <p className="tickets-message">{createTicketError}</p>
          )}
          </form>

          <div className="dashboard-preview">
          <div className="preview-header">
            <span className="preview-logo">R</span>
            <span>Support overview</span>
            <span className="status-dot"></span>
          </div>

          <div className="preview-stats">
            <div>
              <p>Open tickets</p>
              <strong>24</strong>
            </div>
            <div>
              <p>Resolved today</p>
              <strong>18</strong>
            </div>
          </div>

          {ticketsLoading && (
            <p className="tickets-message">Loading tickets...</p>
          )}

          {!ticketsLoading && ticketsError && (
            <p className="tickets-message">{ticketsError}</p>
          )}

          {!ticketsLoading && !ticketsError && tickets.length === 0 && (
            <p className="tickets-message">No tickets available.</p>
          )}

          {updateTicketError && (
            <p className="tickets-message">{updateTicketError}</p>
          )}

          {deleteTicketError && (
            <p className="tickets-message">{deleteTicketError}</p>
          )}

          {!ticketsLoading &&
            !ticketsError &&
            tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <span
                  className={`priority ${ticket.priority.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>

                <div>
                  <strong>{ticket.title}</strong>
                  <p>Updated {ticket.updatedAt}</p>

                  <select
                    value={ticket.status}
                    onChange={(event) =>
                      handleStatusChange(ticket.id, event.target.value)
                    }
                    disabled={
                      updatingTicketId === ticket.id ||
                      deletingTicketId === ticket.id
                    }
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  {updatingTicketId === ticket.id && (
                    <small>Updating...</small>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteTicket(ticket.id)}
                    disabled={
                      deletingTicketId === ticket.id ||
                      updatingTicketId === ticket.id
                    }
                  >
                    {deletingTicketId === ticket.id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        {features.map((feature) => (
          <article className="feature-card" key={feature.title}>
            <span className="feature-icon">{feature.icon}</span>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
