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
                </div>
              </div>
            ))}
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
