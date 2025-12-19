import React, { useState } from 'react'
import Navbar from '../components/Layout/Navbar'
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCalendar, FiDownload } from 'react-icons/fi'
import './Earnings.css'

const Earnings = () => {
  const [timeRange, setTimeRange] = useState('month') // week, month, year

  // Mock data - replace with API calls
  const earnings = {
    total: 12500,
    thisMonth: 3200,
    lastMonth: 2800,
    change: 14.3,
    pending: 450,
    completed: 12050
  }

  const recentTransactions = [
    {
      id: 1,
      customer: 'Sarah M.',
      service: 'Pipe Repair',
      amount: 150,
      date: '2024-01-15',
      status: 'completed',
      type: 'payment'
    },
    {
      id: 2,
      customer: 'Mike T.',
      service: 'Drain Cleaning',
      amount: 100,
      date: '2024-01-14',
      status: 'pending',
      type: 'payment'
    },
    {
      id: 3,
      customer: 'Lisa K.',
      service: 'Water Heater Installation',
      amount: 500,
      date: '2024-01-13',
      status: 'completed',
      type: 'payment'
    },
    {
      id: 4,
      customer: 'John D.',
      service: 'Leak Detection',
      amount: 150,
      date: '2024-01-12',
      status: 'completed',
      type: 'payment'
    },
    {
      id: 5,
      customer: 'Emma W.',
      service: 'Fixture Installation',
      amount: 85,
      date: '2024-01-11',
      status: 'completed',
      type: 'payment'
    }
  ]

  const monthlyEarnings = [
    { month: 'Jan', amount: 3200 },
    { month: 'Feb', amount: 2800 },
    { month: 'Mar', amount: 3500 },
    { month: 'Apr', amount: 3000 }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="earnings-page">
      <Navbar />
      <div className="earnings-container">
        <div className="earnings-header">
          <div>
            <h1>Earnings & Analytics</h1>
            <p>Track your revenue and financial performance</p>
          </div>
          <div className="header-actions">
            <select 
              className="time-select"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button className="btn-secondary">
              <FiDownload /> Export Report
            </button>
          </div>
        </div>

        <div className="earnings-stats">
          <div className="stat-card primary">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Earnings</p>
              <h2>{formatCurrency(earnings.total)}</h2>
              <span className="stat-change positive">
                <FiTrendingUp /> All time
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FiCalendar />
            </div>
            <div className="stat-content">
              <p className="stat-label">This Month</p>
              <h2>{formatCurrency(earnings.thisMonth)}</h2>
              <span className={`stat-change ${earnings.change > 0 ? 'positive' : 'negative'}`}>
                {earnings.change > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                {Math.abs(earnings.change)}% from last month
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FiDollarSign />
            </div>
            <div className="stat-content">
              <p className="stat-label">Completed</p>
              <h2>{formatCurrency(earnings.completed)}</h2>
              <span className="stat-change">Paid out</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-content">
              <p className="stat-label">Pending</p>
              <h2>{formatCurrency(earnings.pending)}</h2>
              <span className="stat-change">Awaiting payment</span>
            </div>
          </div>
        </div>

        <div className="earnings-grid">
          <div className="earnings-section">
            <div className="section-header">
              <h2>Recent Transactions</h2>
            </div>
            <div className="transactions-list">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-info">
                    <h4>{transaction.customer}</h4>
                    <p>{transaction.service}</p>
                    <span className="transaction-date">{formatDate(transaction.date)}</span>
                  </div>
                  <div className="transaction-right">
                    <div className={`transaction-amount ${transaction.status}`}>
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className={`transaction-status ${transaction.status}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="earnings-section">
            <div className="section-header">
              <h2>Monthly Overview</h2>
            </div>
            <div className="monthly-chart">
              {monthlyEarnings.map((item, index) => {
                const maxAmount = Math.max(...monthlyEarnings.map(e => e.amount))
                const height = (item.amount / maxAmount) * 100
                
                return (
                  <div key={index} className="chart-bar">
                    <div className="bar-value">{formatCurrency(item.amount)}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <div className="bar-label">{item.month}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="earnings-summary">
          <h2>Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Services Completed</span>
              <span className="summary-value">48</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Average per Service</span>
              <span className="summary-value">{formatCurrency(earnings.total / 48)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Best Month</span>
              <span className="summary-value">March 2024</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Growth Rate</span>
              <span className="summary-value positive">+{earnings.change}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Earnings

