import React, { useState } from 'react';
import { trpc } from '../lib/trpc';
import { MessageSquare, CheckCircle, XCircle, Clock, DollarSign, Calendar } from 'lucide-react';

interface BookingRequest {
  id: string;
  artistName: string;
  eventDate: string;
  eventTime: string;
  artistRate: number;
  proposedRate?: number;
  status: 'pending' | 'negotiating' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
}

export const VenueBookingRequests: React.FC = () => {
  const [requests, setRequests] = useState<BookingRequest[]>([
    {
      id: '1',
      artistName: 'Luna Waves',
      eventDate: '2026-03-15',
      eventTime: '20:00',
      artistRate: 500,
      proposedRate: 450,
      status: 'negotiating',
      message: 'Can you do $450 instead? Budget is tight for this event.',
      createdAt: '2026-01-18',
    },
    {
      id: '2',
      artistName: 'The Midnight Echo',
      eventDate: '2026-02-28',
      eventTime: '19:30',
      artistRate: 750,
      status: 'pending',
      message: 'Interested in booking for our Valentine\'s Day special event.',
      createdAt: '2026-01-17',
    },
    {
      id: '3',
      artistName: 'Sonic Dreams',
      eventDate: '2026-01-25',
      eventTime: '21:00',
      artistRate: 600,
      status: 'accepted',
      createdAt: '2026-01-15',
    },
  ]);
  
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [counterOffer, setCounterOffer] = useState<number | null>(null);
  const [negotiationMessage, setNegotiationMessage] = useState('');
  
  const handleAccept = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
    setSelectedRequest(null);
  };
  
  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
    setSelectedRequest(null);
  };
  
  const handleCounterOffer = (id: string) => {
    if (counterOffer === null) return;
    setRequests(requests.map(r => r.id === id ? {
      ...r,
      status: 'negotiating',
      proposedRate: counterOffer,
    } : r));
    setCounterOffer(null);
    setNegotiationMessage('');
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={20} />;
      case 'negotiating': return <MessageSquare size={20} />;
      case 'accepted': return <CheckCircle size={20} />;
      case 'rejected': return <XCircle size={20} />;
      default: return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'negotiating': return '#3b82f6';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const negotiatingRequests = requests.filter(r => r.status === 'negotiating');
  const completedRequests = requests.filter(r => ['accepted', 'rejected'].includes(r.status));
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>
          Booking Requests
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>
          Manage incoming booking requests and negotiate terms with artists
        </p>
        
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
        }}>
          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #f59e0b',
          }}>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 5px 0' }}>Pending</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
              {pendingRequests.length}
            </p>
          </div>
          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #3b82f6',
          }}>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 5px 0' }}>Negotiating</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
              {negotiatingRequests.length}
            </p>
          </div>
          <div style={{
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #10b981',
          }}>
            <p style={{ color: '#6b7280', fontSize: '12px', margin: '0 0 5px 0' }}>Accepted</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', color: '#1f2937' }}>
              {requests.filter(r => r.status === 'accepted').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
            Pending Requests
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {pendingRequests.map(request => (
              <div key={request.id} style={{
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}>
                <div style={{
                  background: getStatusColor(request.status),
                  color: 'white',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  {getStatusIcon(request.status)}
                  <div>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600' }}>
                      {request.artistName}
                    </h3>
                    <p style={{ margin: '0', fontSize: '12px', opacity: 0.9 }}>
                      Pending Response
                    </p>
                  </div>
                </div>
                <div style={{ padding: '15px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6b7280', fontSize: '13px' }}>
                      <Calendar size={16} />
                      {new Date(request.eventDate).toLocaleDateString()} at {request.eventTime}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px' }}>
                      <DollarSign size={16} />
                      Asking Rate: ${request.artistRate}
                    </div>
                  </div>
                  
                  {request.message && (
                    <div style={{
                      background: '#f9fafb',
                      padding: '10px',
                      borderRadius: '6px',
                      marginBottom: '15px',
                      borderLeft: '3px solid #7c3aed',
                    }}>
                      <p style={{ margin: '0', color: '#6b7280', fontSize: '13px' }}>
                        {request.message}
                      </p>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleAccept(request.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      Counter Offer
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Negotiating Requests */}
      {negotiatingRequests.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
            Under Negotiation
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {negotiatingRequests.map(request => (
              <div key={request.id} style={{
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}>
                <div style={{
                  background: getStatusColor(request.status),
                  color: 'white',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  {getStatusIcon(request.status)}
                  <div>
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600' }}>
                      {request.artistName}
                    </h3>
                    <p style={{ margin: '0', fontSize: '12px', opacity: 0.9 }}>
                      Negotiating
                    </p>
                  </div>
                </div>
                <div style={{ padding: '15px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6b7280', fontSize: '13px' }}>
                      <Calendar size={16} />
                      {new Date(request.eventDate).toLocaleDateString()} at {request.eventTime}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6b7280', fontSize: '13px' }}>
                      <DollarSign size={16} />
                      <span>Asking: ${request.artistRate}</span>
                      {request.proposedRate && (
                        <span style={{ color: '#10b981', fontWeight: '600' }}>
                          → Your Offer: ${request.proposedRate}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div style={{
                    background: '#f0f9ff',
                    padding: '10px',
                    borderRadius: '6px',
                    marginBottom: '15px',
                    borderLeft: '3px solid #3b82f6',
                  }}>
                    <p style={{ margin: '0', color: '#1e40af', fontSize: '13px', fontWeight: '600' }}>
                      Waiting for artist response
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleAccept(request.id)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      Adjust
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Completed Requests */}
      {completedRequests.length > 0 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
            Completed
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
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>Artist</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>Event Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>Rate</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {completedRequests.map(request => (
                  <tr key={request.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', color: '#1f2937', fontSize: '14px' }}>{request.artistName}</td>
                    <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                      {new Date(request.eventDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', color: '#1f2937', fontSize: '14px', fontWeight: '600' }}>
                      ${request.proposedRate || request.artistRate}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        background: getStatusColor(request.status),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {requests.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6b7280',
        }}>
          <MessageSquare size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <p>No booking requests yet</p>
        </div>
      )}
      
      {/* Counter Offer Modal */}
      {selectedRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setSelectedRequest(null)}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '20px', fontWeight: '600' }}>
              Make Counter Offer
            </h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '5px', fontWeight: '600' }}>
                Artist's Rate: ${selectedRequest.artistRate}
              </label>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '5px', fontWeight: '600' }}>
                Your Counter Offer
              </label>
              <input
                type="number"
                value={counterOffer || ''}
                onChange={(e) => setCounterOffer(parseInt(e.target.value) || null)}
                placeholder="Enter your offer"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#6b7280', fontSize: '14px', marginBottom: '5px', fontWeight: '600' }}>
                Message (Optional)
              </label>
              <textarea
                value={negotiationMessage}
                onChange={(e) => setNegotiationMessage(e.target.value)}
                placeholder="Add a message to your counter offer"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleCounterOffer(selectedRequest.id)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Send Offer
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueBookingRequests;
