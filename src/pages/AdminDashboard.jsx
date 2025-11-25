import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/formatPrice';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        user,
        properties,
        approveProperty,
        rejectProperty,
        sendBackProperty,
        deleteProperty,
        mockUsers,
        addUser,
        toggleUserStatus,
        deleteUser,
        // Lead Management
        interests,
        getInterests,
        approveInterest,
        rejectInterest,
        sendBackInterest
    } = useAuth();
    const [activeTab, setActiveTab] = useState('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    if (!user || user.role !== 'admin') {
        return <div className="container" style={{ marginTop: '4rem' }}>{t('common.accessDenied')}</div>;
    }

    // Filter and Sort Logic
    const filteredProperties = properties.filter(p => {
        const matchesSearch = p.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        const matchesType = filterType === 'all' || (p.type || 'apartment') === filterType;
        return matchesSearch && matchesStatus && matchesType;
    }).sort((a, b) => {
        if (sortBy === 'newest') return (b.createdAt || 0) - (a.createdAt || 0);
        if (sortBy === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'price_low') return a.price - b.price;
        return 0;
    });

    const pendingProperties = properties.filter(p => p.status === 'pending');

    const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

    return (
        <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>{t('adminDashboard.title')}</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/add-property">
                        <button className="btn btn-primary">
                            + {t('adminDashboard.addProperty')}
                        </button>
                    </Link>
                    <button
                        className={activeTab === 'pending' ? 'btn btn-primary' : 'btn btn-outline'}
                        onClick={() => setActiveTab('pending')}
                    >
                        {t('adminDashboard.pendingApprovals')} ({pendingProperties.length})
                    </button>
                    <button
                        className={activeTab === 'all' ? 'btn btn-primary' : 'btn btn-outline'}
                        onClick={() => setActiveTab('all')}
                    >
                        {t('adminDashboard.allProperties')}
                    </button>
                    <button
                        className={activeTab === 'users' ? 'btn btn-primary' : 'btn btn-outline'}
                        onClick={() => setActiveTab('users')}
                    >
                        {t('adminDashboard.users')}
                    </button>
                    <button
                        className={activeTab === 'interests' ? 'btn btn-primary' : 'btn btn-outline'}
                        onClick={() => setActiveTab('interests')}
                    >
                        Interests ({interests.filter(i => i.status === 'New').length})
                    </button>
                </div>
            </div>

            {activeTab === 'pending' && (
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>{t('adminDashboard.pendingApprovals')}</h3>
                    {pendingProperties.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>{t('adminDashboard.noPending')}</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {pendingProperties.map(property => (
                                <div key={property.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <img
                                        src={property.image || PLACEHOLDER_IMAGE}
                                        alt={property.address}
                                        onError={(e) => e.target.src = PLACEHOLDER_IMAGE}
                                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: '#f3f4f6' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0' }}>{property.address}</h4>
                                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', fontWeight: 'bold' }}>{formatPrice(property.price)}</p>
                                        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Agent: {property.agentName} | Type: {property.type || 'Apartment'}</p>
                                        <Link to={`/property/${property.id}`} style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>{t('adminDashboard.viewDetails')}</Link>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <button onClick={() => approveProperty(property.id)} className="btn btn-primary" style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}>{t('adminDashboard.approve')}</button>
                                        <button onClick={() => sendBackProperty(property.id)} className="btn btn-outline" style={{ color: '#F59E0B', borderColor: '#F59E0B' }}>{t('adminDashboard.sendBack')}</button>
                                        <button onClick={() => rejectProperty(property.id)} className="btn btn-outline" style={{ color: '#EF4444', borderColor: '#EF4444' }}>{t('adminDashboard.reject')}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'all' && (
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    {/* Controls */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <input
                            type="text"
                            placeholder={t('adminDashboard.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        >
                            <option value="all">{t('adminDashboard.filterStatus')}</option>
                            <option value="pending">{t('dashboard.status.pending')}</option>
                            <option value="approved">{t('dashboard.status.approved')}</option>
                            <option value="needs_revision">{t('dashboard.status.needsRevision')}</option>
                        </select>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        >
                            <option value="all">{t('adminDashboard.filterType')}</option>
                            <option value="apartment">{t('addProperty.types.apartment')}</option>
                            <option value="villa">{t('addProperty.types.villa')}</option>
                            <option value="office">{t('addProperty.types.office')}</option>
                            <option value="land">{t('addProperty.types.land')}</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        >
                            <option value="newest">{t('adminDashboard.sortNewest')}</option>
                            <option value="oldest">{t('adminDashboard.sortOldest')}</option>
                            <option value="price_high">{t('adminDashboard.sortPriceHigh')}</option>
                            <option value="price_low">{t('adminDashboard.sortPriceLow')}</option>
                        </select>
                    </div>

                    {/* List */}
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {filteredProperties.map(property => (
                            <div key={property.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <img
                                        src={property.image || PLACEHOLDER_IMAGE}
                                        alt={property.address}
                                        onError={(e) => e.target.src = PLACEHOLDER_IMAGE}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', backgroundColor: '#f3f4f6' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{property.address}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {formatPrice(property.price)} • {property.type || 'Apartment'}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        backgroundColor: (property.status || 'pending') === 'approved' ? '#D1FAE5' : (property.status || 'pending') === 'pending' ? '#FEF3C7' : '#F3F4F6',
                                        color: (property.status || 'pending') === 'approved' ? '#059669' : (property.status || 'pending') === 'pending' ? '#D97706' : '#4B5563'
                                    }}>
                                        {(property.status || 'pending').toUpperCase()}
                                    </span>
                                    <button
                                        onClick={() => navigate('/add-property', { state: { property } })}
                                        className="btn btn-outline"
                                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                                    >
                                        {t('adminDashboard.edit')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(t('adminDashboard.deleteConfirm'))) {
                                                deleteProperty(property.id);
                                            }
                                        }}
                                        className="btn btn-outline"
                                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', color: '#EF4444', borderColor: '#EF4444' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredProperties.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>{t('adminDashboard.noProperties')}</p>
                        ) : null}
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>{t('adminDashboard.userManagement')}</h3>

                    {/* Add User Form */}
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                        <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Add New User</h4>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const userData = {
                                    name: formData.get('name'),
                                    email: formData.get('email'),
                                    role: formData.get('role'),
                                    phone: formData.get('phone')
                                };
                                const result = addUser(userData);
                                if (result.success) {
                                    alert('User added successfully! Default password: password123');
                                    e.target.reset();
                                } else {
                                    alert(result.error);
                                }
                            }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}
                        >
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Name</label>
                                <input name="name" required type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Email</label>
                                <input name="email" required type="email" style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Phone</label>
                                <input name="phone" type="text" style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Role</label>
                                <select name="role" style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                    <option value="marketer">Marketer</option>
                                    <option value="developer">Developer</option>
                                    <option value="buyer">Buyer</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Add User</button>
                        </form>
                    </div>

                    {/* User List */}
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {mockUsers.map(u => (
                            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{u.name} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({u.role})</span></div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        backgroundColor: u.status === 'active' ? '#D1FAE5' : '#F3F4F6',
                                        color: u.status === 'active' ? '#059669' : '#9CA3AF'
                                    }}>
                                        {u.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                    <button
                                        onClick={() => toggleUserStatus(u.id)}
                                        style={{ fontSize: '0.875rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Delete user?')) deleteUser(u.id);
                                        }}
                                        style={{ fontSize: '0.875rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Debug Section */}
            <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#F1F5F9', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>Debug Tools</h3>
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Storage Used: {Math.round(JSON.stringify(localStorage).length / 1024)} KB / ~5000 KB
                        </p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Last Sync: {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => window.location.reload()} className="btn btn-outline">Force Refresh</button>
                        <button onClick={() => { generateTestData(); alert("Test data generated!"); }} className="btn btn-primary">Generate Test Data</button>
                        <button onClick={() => { if (window.confirm('Reset ALL data?')) { localStorage.clear(); window.location.reload(); } }} className="btn btn-outline" style={{ borderColor: '#EF4444', color: '#EF4444' }}>Reset All Data</button>
                    </div>
                </div>
            </div>
            )}

            {/* Interests Tab */}
            {activeTab === 'interests' && (
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Buyer Interests</h3>

                    {interests.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No buyer interests yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                                        <th style={{ padding: '1rem', fontWeight: '600' }}>Buyer</th>
                                        <th style={{ padding: '1rem', fontWeight: '600' }}>Property</th>
                                        <th style={{ padding: '1rem', fontWeight: '600' }}>Contact</th>
                                        <th style={{ padding: '1rem', fontWeight: '600' }}>Message</th>
                                        <th style={{ padding: '1rem', fontWeight: '600' }}>Date</th>
                                        <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
                                        <th style={{ padding: '1rem', fontWeight: '600' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {interests.map(interest => {
                                        const property = properties.find(p => p.id === interest.property_id);
                                        const buyer = mockUsers.find(u => u.id === interest.buyer_id);

                                        return (
                                            <tr key={interest.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <div>
                                                        <div style={{ fontWeight: '500' }}>{interest.buyer_contact.name}</div>
                                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                            {buyer?.role || 'Buyer'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div>
                                                        <div style={{ fontWeight: '500' }}>{property?.address || 'Unknown Property'}</div>
                                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                            {property ? formatPrice(property.price) : ''}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ fontSize: '0.875rem' }}>
                                                        <div>{interest.buyer_contact.email}</div>
                                                        {interest.buyer_contact.phone && (
                                                            <div style={{ color: 'var(--text-muted)' }}>{interest.buyer_contact.phone}</div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', maxWidth: '200px' }}>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {interest.message || 'No message'}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                    {new Date(interest.created_at).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 'bold',
                                                        backgroundColor:
                                                            interest.status === 'New' ? '#FEF3C7' :
                                                                interest.status === 'Approved' ? '#D1FAE5' :
                                                                    interest.status === 'Rejected' ? '#FEE2E2' :
                                                                        '#F3F4F6',
                                                        color:
                                                            interest.status === 'New' ? '#D97706' :
                                                                interest.status === 'Approved' ? '#059669' :
                                                                    interest.status === 'Rejected' ? '#DC2626' :
                                                                        '#4B5563'
                                                    }}>
                                                        {interest.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    {interest.status === 'New' && (
                                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                            <button
                                                                onClick={() => {
                                                                    try {
                                                                        approveInterest(interest.id);
                                                                        alert('Interest approved and converted to lead!');
                                                                    } catch (error) {
                                                                        alert(error.message);
                                                                    }
                                                                }}
                                                                className="btn btn-primary"
                                                                style={{
                                                                    padding: '0.25rem 0.75rem',
                                                                    fontSize: '0.875rem',
                                                                    backgroundColor: '#10B981',
                                                                    borderColor: '#10B981'
                                                                }}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const reason = prompt('Reason for rejection:');
                                                                    if (reason) {
                                                                        rejectInterest(interest.id, reason);
                                                                        alert('Interest rejected');
                                                                    }
                                                                }}
                                                                className="btn btn-outline"
                                                                style={{
                                                                    padding: '0.25rem 0.75rem',
                                                                    fontSize: '0.875rem',
                                                                    color: '#EF4444',
                                                                    borderColor: '#EF4444'
                                                                }}
                                                            >
                                                                Reject
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const reason = prompt('Reason for sending back:');
                                                                    if (reason) {
                                                                        sendBackInterest(interest.id, reason);
                                                                        alert('Interest sent back for correction');
                                                                    }
                                                                }}
                                                                className="btn btn-outline"
                                                                style={{
                                                                    padding: '0.25rem 0.75rem',
                                                                    fontSize: '0.875rem',
                                                                    color: '#F59E0B',
                                                                    borderColor: '#F59E0B'
                                                                }}
                                                            >
                                                                Send Back
                                                            </button>
                                                        </div>
                                                    )}
                                                    {interest.status !== 'New' && (
                                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                            {interest.status === 'Approved' && 'Converted to Lead'}
                                                            {interest.status === 'Rejected' && interest.rejection_reason}
                                                            {interest.status === 'Sent Back' && interest.sent_back_reason}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
