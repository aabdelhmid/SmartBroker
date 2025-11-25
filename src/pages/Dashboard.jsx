import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const { user, properties, getLeadsForProperty, getMyLeads, updateLeadStatus, closeDeal } = useAuth();

    if (!user) {
        return <div className="container" style={{ marginTop: '4rem' }}>Please log in to view your dashboard.</div>;
    }

    // Admin Dashboard
    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    // Buyer Dashboard
    if (user.role === 'buyer') {
        const scoreColor = user.score >= 80 ? '#10B981' : user.score >= 60 ? '#F59E0B' : '#EF4444';

        return (
            <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                <h2 style={{ marginBottom: '2rem' }}>Buyer Dashboard</h2>

                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border)',
                    maxWidth: '500px'
                }}>
                    <h3 style={{ marginBottom: '1rem' }}>Your Buyer Score</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            color: scoreColor
                        }}>
                            {user.score}
                        </div>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                            Based on your profile completeness, budget, and preferences.
                            <br />
                            <span style={{ fontSize: '0.875rem' }}>Higher scores get priority access to new listings!</span>
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <h3>Recommended Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <Link to="/buy" className="btn btn-primary">Browse Properties</Link>
                        <Link to="/profile" className="btn btn-outline">Update Profile</Link>
                    </div>
                </div>
            </div>
        );
    }

    // Marketer / Developer Dashboard
    const myProperties = properties.filter(p => p.agentId === user.id);
    const myLeads = getMyLeads();

    return (
        <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Marketer Dashboard</h2>
                <Link to="/add-property">
                    <button className="btn btn-primary">Add New Property</button>
                </Link>
            </div>

            {/* My Leads Section */}
            <div style={{ marginBottom: '3rem', backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>My Leads ({myLeads.length})</h3>

                {myLeads.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                        No leads assigned yet. Leads will appear here when admin approves buyer interests.
                    </p>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {myLeads.map(lead => {
                            const property = properties.find(p => p.id === lead.property_id);

                            return (
                                <div key={lead.id} style={{
                                    padding: '1.5rem',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: '#F8FAFC'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.5rem 0' }}>{lead.buyer_contact?.name || 'Unknown Buyer'}</h4>
                                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                📧 {lead.buyer_contact?.email}
                                                {lead.buyer_contact?.phone && <><br />📱 {lead.buyer_contact.phone}</>}
                                            </p>
                                        </div>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            backgroundColor:
                                                lead.status === 'Closed Won' ? '#D1FAE5' :
                                                    lead.status === 'Closed Lost' ? '#FEE2E2' :
                                                        '#FEF3C7',
                                            color:
                                                lead.status === 'Closed Won' ? '#059669' :
                                                    lead.status === 'Closed Lost' ? '#DC2626' :
                                                        '#D97706'
                                        }}>
                                            {lead.status || 'New'}
                                        </span>
                                    </div>

                                    <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                                        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>Property:</p>
                                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                                            {property ? (
                                                <Link to={`/property/${property.id}`} style={{ color: 'var(--primary)', fontWeight: '500' }}>
                                                    {property.address}
                                                </Link>
                                            ) : 'Property not found'}
                                            {property && <><br />{formatPrice(property.price)}</>}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <select
                                            value={lead.status || 'New'}
                                            onChange={(e) => {
                                                updateLeadStatus(lead.id, e.target.value, `Status updated to ${e.target.value}`);
                                            }}
                                            style={{
                                                padding: '0.5rem',
                                                borderRadius: 'var(--radius-sm)',
                                                border: '1px solid var(--border)',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Meeting Scheduled">Meeting Scheduled</option>
                                            <option value="Site Visit">Site Visit</option>
                                            <option value="Negotiation">Negotiation</option>
                                            <option value="Closed Won">Closed Won</option>
                                            <option value="Closed Lost">Closed Lost</option>
                                        </select>

                                        {(lead.status === 'Negotiation' || lead.status === 'Site Visit') && (
                                            <button
                                                onClick={() => {
                                                    const dealValue = prompt('Enter deal value (EGP):');
                                                    if (dealValue && !isNaN(dealValue)) {
                                                        closeDeal(lead.id, parseFloat(dealValue), 'Closed Won');
                                                        alert('Deal closed! Commission claim submitted to admin.');
                                                    }
                                                }}
                                                className="btn btn-primary"
                                                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                                            >
                                                Close Deal
                                            </button>
                                        )}
                                    </div>

                                    <p style={{ margin: '1rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Lead created: {new Date(lead.approved_at).toLocaleDateString()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {myProperties.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F1F5F9', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>You haven't listed any properties yet.</p>
                        <Link to="/add-property" className="btn btn-primary">List Your First Property</Link>
                    </div>
                ) : (
                    myProperties.map(property => {
                        const leads = getLeadsForProperty(property.id);
                        const isRevision = property.status === 'needs_revision';

                        return (
                            <div key={property.id} style={{
                                backgroundColor: 'white',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-sm)',
                                border: isRevision ? '2px solid #F59E0B' : '1px solid var(--border)'
                            }}>
                                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <img
                                        src={property.image}
                                        alt={property.address}
                                        style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{property.address}</h3>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                backgroundColor: isRevision ? '#FEF3C7' : property.status === 'approved' ? '#D1FAE5' : '#F3F4F6',
                                                color: isRevision ? '#D97706' : property.status === 'approved' ? '#059669' : '#4B5563'
                                            }}>
                                                {property.status === 'needs_revision' ? 'Needs Revision' : property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                            {formatPrice(property.price)}
                                        </p>
                                        {isRevision && (
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <p style={{ color: '#D97706', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                                    ⚠️ Admin requested changes. Please edit and resubmit.
                                                </p>
                                                <Link to="/add-property" state={{ property }}>
                                                    <button className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
                                                        Edit Property
                                                    </button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Interested Buyers ({leads.length})</h4>
                                    {leads.length === 0 ? (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No leads yet.</p>
                                    ) : (
                                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                                            {leads.map((lead, index) => (
                                                <div key={index} style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    padding: '0.75rem',
                                                    backgroundColor: '#F8FAFC',
                                                    borderRadius: 'var(--radius-md)'
                                                }}>
                                                    <div>
                                                        <span style={{ fontWeight: 500 }}>{lead.name}</span>
                                                        <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                            (Score: {lead.score})
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                        {new Date(lead.timestamp).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Dashboard;
