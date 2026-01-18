import React, { useState } from 'react';
import { trpc } from '../lib/trpc';
import { Calendar, Plus, Edit2, Trash2, Users, DollarSign, MapPin } from 'lucide-react';

interface VenueEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  capacity: number;
  budget: number;
  spent: number;
  artistCount: number;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  description?: string;
}

export const VenueEvents: React.FC = () => {
  const [events, setEvents] = useState<VenueEvent[]>([
    {
      id: '1',
      name: 'Summer Music Festival',
      date: '2026-06-15',
      time: '18:00',
      capacity: 500,
      budget: 15000,
      spent: 8500,
      artistCount: 8,
      status: 'planning',
      description: 'Annual summer festival featuring local and regional artists',
    },
    {
      id: '2',
      name: 'Jazz Night',
      date: '2026-02-14',
      time: '20:00',
      capacity: 150,
      budget: 3000,
      spent: 2500,
      artistCount: 2,
      status: 'confirmed',
      description: 'Intimate jazz performance for Valentine\'s Day',
    },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<VenueEvent>>({
    name: '',
    date: '',
    time: '19:00',
    capacity: 200,
    budget: 5000,
    status: 'planning',
  });
  
  const handleAddEvent = () => {
    if (editingId) {
      setEvents(events.map(e => e.id === editingId ? { ...formData, id: editingId } as VenueEvent : e));
      setEditingId(null);
    } else {
      const newEvent: VenueEvent = {
        ...formData,
        id: Date.now().toString(),
        spent: 0,
        artistCount: 0,
      } as VenueEvent;
      setEvents([...events, newEvent]);
    }
    setFormData({ name: '', date: '', time: '19:00', capacity: 200, budget: 5000, status: 'planning' });
    setShowForm(false);
  };
  
  const handleEdit = (event: VenueEvent) => {
    setFormData(event);
    setEditingId(event.id);
    setShowForm(true);
  };
  
  const handleDelete = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return '#f59e0b';
      case 'confirmed': return '#10b981';
      case 'completed': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(e => new Date(e.date) <= new Date()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>
            Events Management
          </h1>
          <p style={{ color: '#6b7280' }}>
            Create and manage your venue events
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', date: '', time: '19:00', capacity: 200, budget: 5000, status: 'planning' });
            setEditingId(null);
            setShowForm(true);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          <Plus size={20} />
          New Event
        </button>
      </div>
      
      {/* Event Form */}
      {showForm && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px',
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
            {editingId ? 'Edit Event' : 'Create New Event'}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginBottom: '20px',
          }}>
            <input
              type="text"
              placeholder="Event Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <input
              type="date"
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              style={{
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <input
              type="time"
              value={formData.time || '19:00'}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              style={{
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <input
              type="number"
              placeholder="Capacity"
              value={formData.capacity || ''}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              style={{
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <input
              type="number"
              placeholder="Budget"
              value={formData.budget || ''}
              onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
              style={{
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <select
              value={formData.status || 'planning'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              style={{
                padding: '10px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              <option value="planning">Planning</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <textarea
            placeholder="Event Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              minHeight: '100px',
              fontFamily: 'inherit',
              marginBottom: '15px',
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddEvent}
              style={{
                padding: '10px 20px',
                background: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              {editingId ? 'Update Event' : 'Create Event'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              style={{
                padding: '10px 20px',
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
      )}
      
      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
            Upcoming Events
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
          }}>
            {upcomingEvents.map(event => (
              <div key={event.id} style={{
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s',
              }} onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  background: getStatusColor(event.status),
                  color: 'white',
                  padding: '15px',
                }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600' }}>
                    {event.name}
                  </h3>
                  <p style={{ margin: '0', fontSize: '12px', opacity: 0.9 }}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </p>
                </div>
                <div style={{ padding: '15px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>
                      <Calendar size={16} />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    {event.description && (
                      <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>
                        {event.description}
                      </p>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #e5e7eb',
                  }}>
                    <div>
                      <p style={{ margin: '0', color: '#6b7280', fontSize: '12px' }}>Capacity</p>
                      <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {event.capacity}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0', color: '#6b7280', fontSize: '12px' }}>Artists</p>
                      <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {event.artistCount}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0', color: '#6b7280', fontSize: '12px' }}>Budget</p>
                      <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        ${event.budget.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: '0', color: '#6b7280', fontSize: '12px' }}>Spent</p>
                      <p style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        ${event.spent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    height: '6px',
                    marginBottom: '15px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      background: '#7c3aed',
                      height: '100%',
                      width: `${(event.spent / event.budget) * 100}%`,
                      transition: 'width 0.3s',
                    }} />
                  </div>
                  <p style={{ margin: '0 0 15px 0', color: '#6b7280', fontSize: '12px' }}>
                    Budget: {((event.spent / event.budget) * 100).toFixed(0)}% spent
                  </p>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(event)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
            Past Events
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
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>Event</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>Budget</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontWeight: '600', fontSize: '14px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pastEvents.map(event => (
                  <tr key={event.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', color: '#1f2937', fontSize: '14px' }}>{event.name}</td>
                    <td style={{ padding: '12px', color: '#6b7280', fontSize: '14px' }}>
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        background: getStatusColor(event.status),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#1f2937', fontSize: '14px' }}>
                      ${event.budget.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => handleDelete(event.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {events.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6b7280',
        }}>
          <Calendar size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            No events yet. Create your first event to get started!
          </p>
          <button
            onClick={() => {
              setFormData({ name: '', date: '', time: '19:00', capacity: 200, budget: 5000, status: 'planning' });
              setEditingId(null);
              setShowForm(true);
            }}
            style={{
              padding: '10px 20px',
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Create Event
          </button>
        </div>
      )}
    </div>
  );
};

export default VenueEvents;
