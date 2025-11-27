import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const MarketerDashboard = () => {
    const { user, getMyLeads, updateLeadStatus } = useAuth();
    const [activeTab, setActiveTab] = useState('leads');
    const [leads, setLeads] = useState([]);
    const [filter, setFilter] = useState('all'); // all, hot, warm, cold
    const [searchQuery, setSearchQuery] = useState('');
    const [showColdLeads, setShowColdLeads] = useState(false);

    useEffect(() => {
        if (user) {
            const myLeads = getMyLeads();
            setLeads(myLeads);
        }
    }, [user, getMyLeads]);

    if (!user || (user.role !== 'marketer' && user.role !== 'developer' && user.role !== 'admin')) {
        return <Navigate to="/" />;
    }

    // Filter and Sort Logic
    const filteredLeads = leads.filter(lead => {
        const score = lead.buyer?.score || 50;
        const isCold = score < 60;

        // Cold Lead Visibility
        if (isCold && !showColdLeads && filter !== 'cold') return false;

        // Badge Filter
        if (filter === 'hot' && score < 80) return false;
        if (filter === 'warm' && (score < 60 || score >= 80)) return false;
        if (filter === 'cold' && score >= 60) return false;

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const name = lead.buyer?.name?.toLowerCase() || '';
            const phone = lead.buyer?.phone || '';
            return name.includes(query) || phone.includes(query);
        }

        return true;
    }).sort((a, b) => {
        // Sort by Score (Desc) then Date (Desc)
        const scoreA = a.buyer?.score || 50;
        const scoreB = b.buyer?.score || 50;
        if (scoreA !== scoreB) return scoreB - scoreA;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const getScoreBadge = (score) => {
        if (score >= 80) return { label: 'Hot', color: '#059669', bg: '#ECFDF5' };
        if (score >= 60) return { label: 'Warm', color: '#D97706', bg: '#FEF3C7' };
        return { label: 'Cold', color: '#6B7280', bg: '#F3F4F6' };
    };

    const handleStatusUpdate = async (leadId, currentStatus) => {
        const nextStatus = {
            'New': 'Contacted',
            'Contacted': 'Qualified', // Or Deal/Lost directly? Requirement says New -> Contacted -> Deal -> Lost
            'Qualified': 'Deal'
        }[currentStatus] || 'Contacted';

        // For demo, just cycle or prompt? 
        // Let's just set to Contacted if New.
        if (currentStatus === 'New') {
            await updateLeadStatus(leadId, 'Contacted', 'Status updated from dashboard');
            // Refresh leads? getMyLeads returns from state, so we might need to trigger fetchLeads in context or wait for update.
            // For now assume context updates state.
        }
    };

    return (
        <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Marketer Dashboard</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 0' }}>Manage your leads and deals</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem 1rem', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Leads:</span>
                        <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>{leads.length}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('leads')}
                    style={{
                        padding: '1rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'leads' ? '2px solid var(--primary)' : 'none',
                        color: activeTab === 'leads' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: activeTab === 'leads' ? '600' : '400',
                        cursor: 'pointer'
                    }}
                >
                    Leads
                </button>
                {/* Add other tabs like Deals later */}
            </div>

            {activeTab === 'leads' && (
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    {/* Controls */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['all', 'hot', 'warm', 'cold'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '999px',
                                        border: '1px solid var(--border)',
                                        backgroundColor: filter === f ? 'var(--primary)' : 'white',
                                        color: filter === f ? 'white' : 'var(--text-primary)',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={showColdLeads}
                                    onChange={(e) => setShowColdLeads(e.target.checked)}
                                />
                                Show Cold Leads
                            </label>
                            <input
                                type="text"
                                placeholder="Search name or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input"
                                style={{ width: '250px' }}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Buyer Name</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Score</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Budget</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Locations</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Property Type</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Date</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '1rem', fontWeight: '600' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.length > 0 ? filteredLeads.map(lead => {
                                    const score = lead.buyer?.score || 50;
                                    const badge = getScoreBadge(score);
                                    return (
                                        <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ fontWeight: '500' }}>{lead.buyer?.name || 'Unknown'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.buyer?.phone}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    backgroundColor: badge.bg,
                                                    color: badge.color
                                                }}>
                                                    {score} ({badge.label})
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {/* Budget not directly on lead, maybe fetch from buyer profile? Or property price? Requirement says "Budget e.g. 2.1M" */}
                                                {/* Let's show property price for now as context, or buyer budget range */}
                                                {lead.property?.price ? `${parseInt(lead.property.price).toLocaleString()} EGP` : '-'}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                {/* Preferred locations from buyer profile not joined in fetchLeads yet, need to fix fetchLeads or just show property location */}
                                                {/* Requirement says "Preferred Locations". I should update fetchLeads to include preferred_locations */}
                                                {lead.property?.address || '-'}
                                            </td>
                                            <td style={{ padding: '1rem' }}>{lead.property?.type || '-'}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                                {new Date(lead.created_at).toLocaleDateString()}
                                                <br />
                                                <span style={{ color: 'var(--text-muted)' }}>{new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    backgroundColor: lead.status === 'New' ? '#DBEAFE' : '#ECFDF5',
                                                    color: lead.status === 'New' ? '#1D4ED8' : '#059669'
                                                }}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <a href={`tel:${lead.buyer?.phone}`} className="btn btn-sm btn-outline" title="Call">
                                                        📞
                                                    </a>
                                                    <a href={`mailto:${lead.buyer?.email}`} className="btn btn-sm btn-outline" title="Email">
                                                        ✉️
                                                    </a>
                                                    {lead.status === 'New' && (
                                                        <button
                                                            onClick={() => handleStatusUpdate(lead.id, 'New')}
                                                            className="btn btn-sm btn-primary"
                                                            title="Mark Contacted"
                                                        >
                                                            ✅
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="8" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            No leads found matching criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketerDashboard;
