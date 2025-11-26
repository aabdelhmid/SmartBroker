import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [properties, setProperties] = useState([]);
    const [leads, setLeads] = useState([]);
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Commission settings
    const [commissionSettings] = useState({
        percentage: 2.5,
        type: 'percentage'
    });

    // Initialize session on mount
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                // Fetch user profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                setUser(profile);

                // Fetch initial data
                await Promise.all([
                    fetchProperties(),
                    fetchLeads(),
                    fetchInterests()
                ]);
            }
        } catch (error) {
            console.error('Session check error:', error);
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // AUTHENTICATION
    // ============================================

    const login = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Fetch user profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            setUser(profile);

            // Fetch data
            await Promise.all([
                fetchProperties(),
                fetchLeads(),
                fetchInterests()
            ]);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signup = async (userData) => {
        try {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password
            });

            if (authError) throw authError;

            // Calculate score for buyers
            let buyerScore = 50;
            if (userData.role === 'buyer') {
                if (userData.budget === '1m+') buyerScore += 30;
                else if (userData.budget === '500k-1m') buyerScore += 20;
                else if (userData.budget === '0-500k') buyerScore += 10;
                if (userData.preferredLocation?.length > 0) buyerScore += 10;
            }

            // Create profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: authData.user.id,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    phone: userData.phone,
                    score: buyerScore,
                    status: 'active'
                }]);

            if (profileError) throw profileError;

            return { success: true };
        } catch (error) {
            if (error.message.includes('already registered')) {
                return { success: false, error: 'Email already exists.' };
            }
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProperties([]);
        setLeads([]);
        setInterests([]);
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            // Verify current password by attempting to sign in
            const { error: verifyError } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: currentPassword
            });

            if (verifyError) {
                return { success: false, error: 'Current password is incorrect.' };
            }

            // Update password
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    // ============================================
    // PROPERTIES
    // ============================================

    const fetchProperties = async () => {
        try {
            const { data, error } = await supabase
                .from('properties')
                .select(`
                    *,
                    agent:profiles!agent_id(id, name, email, role),
                    area:areas(id, name, name_ar, city, city_ar, slug)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data to match old format
            const transformedData = data.map(p => ({
                ...p,
                agentId: p.agent_id,
                agentName: p.agent?.name,
                areaId: p.area?.id,
                areaName: p.area?.name,
                areaNameAr: p.area?.name_ar,
                areaCity: p.area?.city,
                areaCityAr: p.area?.city_ar,
                areaSlug: p.area?.slug
            }));

            setProperties(transformedData);
        } catch (error) {
            console.error('Error fetching properties:', error);
        }
    };

    const addProperty = async (propertyData) => {
        try {
            const { data, error } = await supabase
                .from('properties')
                .insert([{
                    address: propertyData.address,
                    price: propertyData.price,
                    beds: propertyData.beds,
                    baths: propertyData.baths,
                    sqft: propertyData.sqft,
                    type: propertyData.type || 'apartment',
                    description: propertyData.description,
                    description_ar: propertyData.description_ar,
                    features: propertyData.features || [],
                    images: propertyData.images || [],
                    agent_id: user.id,
                    area_id: propertyData.area?.id || propertyData.areaId,
                    discount_percentage: propertyData.discount_percentage || 0,
                    status: 'pending'
                }])
                .select()
                .single();

            if (error) throw error;

            await fetchProperties();
            return { success: true };
        } catch (error) {
            console.error('Error adding property:', error);
            return { success: false, error: error.message };
        }
    };

    const updatePropertyStatus = async (propertyId, newStatus) => {
        try {
            const { error } = await supabase
                .from('properties')
                .update({ status: newStatus })
                .eq('id', propertyId);

            if (error) throw error;

            await fetchProperties();
        } catch (error) {
            console.error('Error updating property status:', error);
        }
    };

    const approveProperty = (id) => updatePropertyStatus(id, 'approved');
    const sendBackProperty = (id) => updatePropertyStatus(id, 'needs_revision');

    const rejectProperty = async (propertyId) => {
        try {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', propertyId);

            if (error) throw error;

            await fetchProperties();
        } catch (error) {
            console.error('Error rejecting property:', error);
        }
    };

    const deleteProperty = async (propertyId) => {
        try {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', propertyId);

            if (error) throw error;

            await fetchProperties();
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    // ============================================
    // INTERESTS
    // ============================================

    const fetchInterests = async () => {
        try {
            const { data, error } = await supabase
                .from('interests')
                .select(`
                    *,
                    property:properties(id, address, price, type),
                    buyer:profiles!buyer_id(id, name, email, phone)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setInterests(data || []);
        } catch (error) {
            console.error('Error fetching interests:', error);
        }
    };

    const submitInterest = async (propertyId, message = '') => {
        if (!user) {
            throw new Error('Must be logged in to submit interest');
        }

        try {
            // Check for duplicate
            const { data: existing } = await supabase
                .from('interests')
                .select('id')
                .eq('buyer_id', user.id)
                .eq('property_id', propertyId)
                .neq('status', 'Rejected')
                .single();

            if (existing) {
                throw new Error('You have already expressed interest in this property');
            }

            const { data, error } = await supabase
                .from('interests')
                .insert([{
                    property_id: propertyId,
                    buyer_id: user.id,
                    message,
                    status: 'New'
                }])
                .select()
                .single();

            if (error) throw error;

            await fetchInterests();
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const approveInterest = async (interestId) => {
        try {
            // Get interest details
            const { data: interest } = await supabase
                .from('interests')
                .select('*, property:properties(*)')
                .eq('id', interestId)
                .single();

            if (!interest) throw new Error('Interest not found');

            // Update interest status
            await supabase
                .from('interests')
                .update({
                    status: 'Approved',
                    approved_at: new Date().toISOString()
                })
                .eq('id', interestId);

            // Create lead
            const { data: lead, error: leadError } = await supabase
                .from('leads')
                .insert([{
                    interest_id: interestId,
                    property_id: interest.property_id,
                    buyer_id: interest.buyer_id,
                    marketer_id: interest.property.agent_id,
                    developer_id: interest.property.agent_id,
                    status: 'New',
                    approved_at: new Date().toISOString(),
                    assigned_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (leadError) throw leadError;

            // Add to history
            await addLeadHistory(lead.id, 'New', user.id, 'Lead created from approved interest');

            await Promise.all([fetchInterests(), fetchLeads()]);
            return lead;
        } catch (error) {
            console.error('Error approving interest:', error);
            throw error;
        }
    };

    const rejectInterest = async (interestId, reason = '') => {
        try {
            await supabase
                .from('interests')
                .update({
                    status: 'Rejected',
                    rejected_at: new Date().toISOString(),
                    rejection_reason: reason
                })
                .eq('id', interestId);

            await fetchInterests();
        } catch (error) {
            console.error('Error rejecting interest:', error);
        }
    };

    const sendBackInterest = async (interestId, reason = '') => {
        try {
            await supabase
                .from('interests')
                .update({
                    status: 'Sent Back',
                    sent_back_at: new Date().toISOString(),
                    sent_back_reason: reason
                })
                .eq('id', interestId);

            await fetchInterests();
        } catch (error) {
            console.error('Error sending back interest:', error);
        }
    };

    const getInterests = (filters = {}) => {
        let filtered = [...interests];

        if (filters.status) {
            filtered = filtered.filter(i => i.status === filters.status);
        }

        return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };

    // ============================================
    // LEADS
    // ============================================

    const fetchLeads = async () => {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select(`
                    *,
                    property:properties(id, address, price, type),
                    buyer:profiles!buyer_id(id, name, email, phone),
                    marketer:profiles!marketer_id(id, name, email)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setLeads(data || []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    };

    const addLeadHistory = async (leadId, status, userId, notes = '') => {
        try {
            await supabase
                .from('lead_status_history')
                .insert([{
                    lead_id: leadId,
                    status,
                    updated_by: userId,
                    notes
                }]);
        } catch (error) {
            console.error('Error adding lead history:', error);
        }
    };

    const updateLeadStatus = async (leadId, newStatus, notes = '') => {
        if (!user) {
            throw new Error('Must be logged in');
        }

        try {
            const lead = leads.find(l => l.id === leadId);
            if (!lead) throw new Error('Lead not found');

            // Check authorization
            if (user.role !== 'admin' &&
                lead.marketer_id !== user.id &&
                lead.developer_id !== user.id) {
                throw new Error('Not authorized to update this lead');
            }

            // Update lead
            await supabase
                .from('leads')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', leadId);

            // Add to history
            await addLeadHistory(leadId, newStatus, user.id, notes);

            await fetchLeads();
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const closeDeal = async (leadId, dealValue, status = 'Closed Won') => {
        if (!user) {
            throw new Error('Must be logged in');
        }

        if (!dealValue || dealValue <= 0) {
            throw new Error('Deal value must be greater than 0');
        }

        try {
            const lead = leads.find(l => l.id === leadId);
            if (!lead) throw new Error('Lead not found');

            // Check authorization
            if (user.role !== 'admin' &&
                lead.marketer_id !== user.id &&
                lead.developer_id !== user.id) {
                throw new Error('Not authorized to close this lead');
            }

            // Update lead
            await supabase
                .from('leads')
                .update({
                    status,
                    closed_at: new Date().toISOString(),
                    deal_value: dealValue
                })
                .eq('id', leadId);

            // Add to history
            await addLeadHistory(leadId, status, user.id, `Deal closed with value: ${dealValue}`);

            // Create commission claim if Closed Won
            if (status === 'Closed Won') {
                const commissionAmount = commissionSettings.type === 'percentage'
                    ? (dealValue * commissionSettings.percentage) / 100
                    : commissionSettings.percentage;

                const { data: claim } = await supabase
                    .from('commission_claims')
                    .insert([{
                        lead_id: leadId,
                        property_id: lead.property_id,
                        marketer_id: lead.marketer_id,
                        buyer_id: lead.buyer_id,
                        deal_value: dealValue,
                        commission_amount: commissionAmount,
                        commission_percentage: commissionSettings.percentage,
                        status: 'Pending Admin Review'
                    }])
                    .select()
                    .single();

                await fetchLeads();
                return claim;
            }

            await fetchLeads();
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    };

    const getMyLeads = () => {
        if (!user) return [];
        if (user.role === 'admin') return leads;

        return leads.filter(l => l.marketer_id === user.id || l.developer_id === user.id);
    };

    const getLeadTimeline = async (leadId) => {
        try {
            const { data, error } = await supabase
                .from('lead_status_history')
                .select('*')
                .eq('lead_id', leadId)
                .order('timestamp', { ascending: true });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching lead timeline:', error);
            return [];
        }
    };

    // ============================================
    // COMMISSION CLAIMS
    // ============================================

    const approveCommission = async (commissionId) => {
        try {
            await supabase
                .from('commission_claims')
                .update({
                    status: 'Approved',
                    approved_at: new Date().toISOString()
                })
                .eq('id', commissionId);
        } catch (error) {
            console.error('Error approving commission:', error);
        }
    };

    const rejectCommission = async (commissionId, reason = '') => {
        try {
            await supabase
                .from('commission_claims')
                .update({
                    status: 'Rejected',
                    rejected_at: new Date().toISOString(),
                    rejection_reason: reason
                })
                .eq('id', commissionId);
        } catch (error) {
            console.error('Error rejecting commission:', error);
        }
    };

    const getCommissionClaims = async (filters = {}) => {
        try {
            let query = supabase
                .from('commission_claims')
                .select('*')
                .order('created_at', { ascending: false });

            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.marketer_id) {
                query = query.eq('marketer_id', filters.marketer_id);
            }

            const { data, error } = await query;

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching commission claims:', error);
            return [];
        }
    };

    // ============================================
    // USER MANAGEMENT (Admin)
    // ============================================

    const addUser = async (userData) => {
        try {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: userData.email,
                password: 'password123', // Default password
                email_confirm: true
            });

            if (authError) throw authError;

            // Create profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: authData.user.id,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    phone: userData.phone,
                    status: 'active'
                }]);

            if (profileError) throw profileError;

            return { success: true, userId: authData.user.id };
        } catch (error) {
            if (error.message.includes('already exists')) {
                return { success: false, error: 'Email already exists.' };
            }
            return { success: false, error: error.message };
        }
    };

    const toggleUserStatus = async (userId) => {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('status')
                .eq('id', userId)
                .single();

            const newStatus = profile.status === 'active' ? 'inactive' : 'active';

            await supabase
                .from('profiles')
                .update({ status: newStatus })
                .eq('id', userId);
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await supabase.auth.admin.deleteUser(userId);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // ============================================
    // LEGACY FUNCTIONS (for compatibility)
    // ============================================

    const addLead = async (propertyId) => {
        // This is now handled by submitInterest + approveInterest
        return submitInterest(propertyId);
    };

    const getLeadsForProperty = (propertyId) => {
        return leads
            .filter(l => l.property_id === propertyId)
            .map(l => ({
                name: l.buyer?.name,
                score: l.buyer?.score,
                timestamp: l.created_at
            }));
    };

    const searchGlobal = async (query, filters = {}) => {
        // This would need to be implemented with Supabase full-text search
        // For now, return empty results
        return {
            properties: [],
            agents: [],
            locations: []
        };
    };

    const generateTestData = () => {
        console.warn('generateTestData is not supported with Supabase');
        return { success: false, error: 'Not supported with database' };
    };

    // Fetch all users (for admin)
    const [mockUsers, setMockUsers] = useState([]);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAllUsers();
        }
    }, [user]);

    const fetchAllUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setMockUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            changePassword,
            signup,
            properties,
            addProperty,
            generateTestData,
            approveProperty,
            rejectProperty,
            sendBackProperty,
            deleteProperty,
            addLead,
            getLeadsForProperty,
            searchGlobal,
            leads,

            // User Management
            mockUsers,
            addUser,
            toggleUserStatus,
            deleteUser,

            // Lead Management System
            interests,
            submitInterest,
            approveInterest,
            rejectInterest,
            sendBackInterest,
            getInterests,

            // Leads
            getMyLeads,
            updateLeadStatus,
            closeDeal,
            getLeadTimeline,

            // Commission
            approveCommission,
            rejectCommission,
            getCommissionClaims,
            commissionSettings
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
