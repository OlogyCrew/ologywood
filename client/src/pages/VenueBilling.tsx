import React, { useState } from 'react';
import { trpc } from '../lib/trpc';
import { CreditCard, Download, Eye, Filter, Search, TrendingUp } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  artistName: string;
  eventDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
}

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'check';
  date: string;
  status: 'completed' | 'failed' | 'pending';
}

export const VenueBilling: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2026-001',
      artistName: 'Luna Waves',
      eventDate: '2026-03-15',
      amount: 500,
      status: 'pending',
      dueDate: '2026-03-22',
      createdAt: '2026-03-15',
    },
    {
      id: '2',
      invoiceNumber: 'INV-2026-002',
      artistName: 'The Midnight Echo',
      eventDate: '2026-02-28',
      amount: 750,
      status: 'paid',
      dueDate: '2026-03-07',
      createdAt: '2026-02-28',
    },
    {
      id: '3',
      invoiceNumber: 'INV-2026-003',
      artistName: 'Sonic Dreams',
      eventDate: '2026-01-25',
      amount: 600,
      status: 'overdue',
      dueDate: '2026-02-01',
      createdAt: '2026-01-25',
    },
  ]);
  
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      invoiceId: '2',
      amount: 750,
      method: 'credit_card',
      date: '2026-03-05',
      status: 'completed',
    },
  ]);
  
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredInvoices = invoices.filter(inv => {
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchesSearch = inv.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  const calculateMetrics = () => {
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
    const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);
    
    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      paidPercentage: totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(1) : 0,
    };
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'paid': return '#10b981';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  const metrics = calculateMetrics();
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>
          Billing & Payments
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Manage invoices, track payments, and view billing history
        </p>
        
        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #7c3aed',
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px 0' }}>
              Total Amount
            </p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
              ${metrics.totalAmount.toLocaleString()}
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #10b981',
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px 0' }}>
              Paid
            </p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
              ${metrics.paidAmount.toLocaleString()}
            </p>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '5px 0 0 0' }}>
              {metrics.paidPercentage}% of total
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #f59e0b',
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px 0' }}>
              Pending
            </p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
              ${metrics.pendingAmount.toLocaleString()}
            </p>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #ef4444',
          }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 10px 0' }}>
              Overdue
            </p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
              ${metrics.overdueAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div style={{
        background: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ color: '#6b7280' }} />
          <input
            type="text"
            placeholder="Search by artist name or invoice number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'pending', 'paid', 'overdue'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: filterStatus === status ? '#7c3aed' : '#f3f4f6',
                color: filterStatus === status ? 'white' : '#374151',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '13px',
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Invoices Table */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginBottom: '30px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                Invoice
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                Artist
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                Event Date
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                Amount
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                Due Date
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                Status
              </th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>
                  {invoice.invoiceNumber}
                </td>
                <td style={{ padding: '12px', color: '#1f2937', fontSize: '14px' }}>
                  {invoice.artistName}
                </td>
                <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                  {new Date(invoice.eventDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>
                  ${invoice.amount.toLocaleString()}
                </td>
                <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: getStatusColor(invoice.status),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      style={{
                        padding: '6px 12px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Download size={14} />
                      PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredInvoices.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280',
          }}>
            <p>No invoices found</p>
          </div>
        )}
      </div>
      
      {/* Payment Methods */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
          Payment Methods
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e5e7eb',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <CreditCard size={24} style={{ color: '#7c3aed' }} />
              <h3 style={{ margin: '0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
                Credit Card
              </h3>
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>
              Visa, Mastercard, American Express
            </p>
            <button style={{
              width: '100%',
              padding: '10px',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}>
              Add Card
            </button>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e5e7eb',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <CreditCard size={24} style={{ color: '#3b82f6' }} />
              <h3 style={{ margin: '0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
                Bank Transfer
              </h3>
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>
              Direct bank account transfer
            </p>
            <button style={{
              width: '100%',
              padding: '10px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}>
              Add Account
            </button>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e5e7eb',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <CreditCard size={24} style={{ color: '#10b981' }} />
              <h3 style={{ margin: '0', color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>
                Check
              </h3>
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '15px' }}>
              Pay by check
            </p>
            <button style={{
              width: '100%',
              padding: '10px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}>
              Get Details
            </button>
          </div>
        </div>
      </div>
      
      {/* Recent Payments */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
          Recent Payments
        </h2>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                  Invoice
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                  Amount
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                  Method
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                  Date
                </th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => {
                const invoice = invoices.find(inv => inv.id === payment.invoiceId);
                return (
                  <tr key={payment.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>
                      {invoice?.invoiceNumber}
                    </td>
                    <td style={{ padding: '12px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                      {payment.method.replace('_', ' ').toUpperCase()}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        background: payment.status === 'completed' ? '#d1fae5' : payment.status === 'pending' ? '#fef3c7' : '#fee2e2',
                        color: payment.status === 'completed' ? '#065f46' : payment.status === 'pending' ? '#92400e' : '#991b1b',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {payments.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280',
            }}>
              <p>No payments recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueBilling;
