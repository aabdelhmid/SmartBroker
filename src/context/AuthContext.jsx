import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage if available
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    // Mock database of users to check for duplicates
    const [mockUsers, setMockUsers] = useState(() => {
        const savedUsers = localStorage.getItem('mockUsers');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });
    // Mock database for properties and leads
    const [properties, setProperties] = useState(() => {
        const savedProperties = localStorage.getItem('properties');
        return savedProperties ? JSON.parse(savedProperties) : [];
    });
    const [leads, setLeads] = useState(() => {
        const savedLeads = localStorage.getItem('leads');
        return savedLeads ? JSON.parse(savedLeads) : [];
    });

    // Buyer interests (before admin approval)
    const [interests, setInterests] = useState(() => {
        const savedInterests = localStorage.getItem('interests');
        return savedInterests ? JSON.parse(savedInterests) : [];
    });

    // Lead status history for timeline tracking
    const [leadStatusHistory, setLeadStatusHistory] = useState(() => {
        const savedHistory = localStorage.getItem('leadStatusHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });

    // Commission claims
    const [commissionClaims, setCommissionClaims] = useState(() => {
        const savedClaims = localStorage.getItem('commissionClaims');
        return savedClaims ? JSON.parse(savedClaims) : [];
    });

    // Commission settings
    const [commissionSettings] = useState({
        percentage: 2.5, // 2.5% commission
        type: 'percentage' // or 'fixed'
    });

    // Sync state across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'properties') {
                setProperties(e.newValue ? JSON.parse(e.newValue) : []);
            }
            if (e.key === 'leads') {
                setLeads(e.newValue ? JSON.parse(e.newValue) : []);
            }
            if (e.key === 'mockUsers') {
                setMockUsers(e.newValue ? JSON.parse(e.newValue) : []);
            }
            if (e.key === 'interests') {
                setInterests(e.newValue ? JSON.parse(e.newValue) : []);
            }
            if (e.key === 'leadStatusHistory') {
                setLeadStatusHistory(e.newValue ? JSON.parse(e.newValue) : []);
            }
            if (e.key === 'commissionClaims') {
                setCommissionClaims(e.newValue ? JSON.parse(e.newValue) : []);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Persist state changes to localStorage
    useEffect(() => {
        try {
            if (user) localStorage.setItem('user', JSON.stringify(user));
            else localStorage.removeItem('user');
        } catch (error) {
            console.error("Failed to save user to localStorage:", error);
        }
    }, [user]);

    useEffect(() => {
        try {
            // Only save if mockUsers has changed and is not empty (to avoid overwriting with empty on init race conditions)
            // Actually, we initialized from localStorage, so it's safe.
            localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        } catch (error) {
            console.error("Failed to save mockUsers to localStorage:", error);
        }
    }, [mockUsers]);

    useEffect(() => {
        try {
            localStorage.setItem('properties', JSON.stringify(properties));
        } catch (error) {
            console.error("Failed to save properties to localStorage:", error);
            // Alert is handled in UI components usually, but here is a last resort
        }
    }, [properties]);

    useEffect(() => {
        try {
            localStorage.setItem('leads', JSON.stringify(leads));
        } catch (error) {
            console.error("Failed to save leads to localStorage:", error);
        }
    }, [leads]);

    useEffect(() => {
        try {
            localStorage.setItem('interests', JSON.stringify(interests));
        } catch (error) {
            console.error("Failed to save interests to localStorage:", error);
        }
    }, [interests]);

    useEffect(() => {
        try {
            localStorage.setItem('leadStatusHistory', JSON.stringify(leadStatusHistory));
        } catch (error) {
            console.error("Failed to save leadStatusHistory to localStorage:", error);
        }
    }, [leadStatusHistory]);

    useEffect(() => {
        try {
            localStorage.setItem('commissionClaims', JSON.stringify(commissionClaims));
        } catch (error) {
            console.error("Failed to save commissionClaims to localStorage:", error);
        }
    }, [commissionClaims]);

    const login = (email, password) => {
        // Admin Login
        if (email === 'admin@smartbroker.com' && password === 'admin123') {
            setUser({ id: 'admin', name: 'Admin', email: 'admin@smartbroker.com', role: 'admin' });
            return true;
        }

        // Mock login logic
        const foundUser = mockUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const changePassword = (currentPassword, newPassword) => {
        if (!user) {
            return { success: false, error: 'User not logged in' };
        }

        // Check if current password is correct
        if (user.role === 'admin') {
            // For admin, check hardcoded password
            if (currentPassword !== 'admin123') {
                return { success: false, error: 'Current password is incorrect.' };
            }
            // Note: In a real app, you would update the admin password in a database
            // For this mock implementation, we'll just return success
            return { success: true };
        } else {
            // For regular users, check against mockUsers
            const foundUser = mockUsers.find(u => u.id === user.id && u.password === currentPassword);
            if (!foundUser) {
                return { success: false, error: 'Current password is incorrect.' };
            }

            // Update password in mockUsers
            const updatedUsers = mockUsers.map(u =>
                u.id === user.id ? { ...u, password: newPassword } : u
            );
            setMockUsers(updatedUsers);

            // Update current user object
            setUser({ ...user, password: newPassword });

            return { success: true };
        }
    };


    const calculateBuyerScore = (userData) => {
        let score = 50; // Base score
        if (userData.budget === '1m+') score += 30;
        else if (userData.budget === '500k-1m') score += 20;
        else if (userData.budget === '0-500k') score += 10;

        if (userData.preferredLocation && userData.preferredLocation.length > 0) score += 10;

        return Math.min(score, 100);
    };

    const signup = (userData) => {
        // Validation: Check for unique email and phone
        const emailExists = mockUsers.some(u => u.email === userData.email);
        const phoneExists = mockUsers.some(u => u.phone === userData.phone);

        if (emailExists) {
            return { success: false, error: 'Email already exists.' };
        }
        if (phoneExists) {
            return { success: false, error: 'Phone number already exists.' };
        }

        // Calculate score for buyers
        let buyerScore = 0;
        if (userData.role === 'buyer') {
            buyerScore = calculateBuyerScore(userData);
        }

        // Save user to mock database
        const newUser = { ...userData, id: Date.now(), score: buyerScore };
        setMockUsers([...mockUsers, newUser]);

        // Do not auto login. User must login manually.
        // setUser(newUser); 
        return { success: true };
    };

    // BroadcastChannel for real-time tab sync
    const channel = new BroadcastChannel('smart_broker_sync');

    useEffect(() => {
        channel.onmessage = (event) => {
            const { type, payload } = event.data;
            if (type === 'UPDATE_PROPERTIES') {
                setProperties(payload);
            }
        };
        return () => channel.close();
    }, []);

    const addProperty = (propertyData) => {
        // Check if we are updating an existing property
        let updatedProperties;
        const timestamp = Date.now();

        if (propertyData.id) {
            updatedProperties = properties.map(p =>
                p.id === propertyData.id ? {
                    ...propertyData,
                    status: 'pending',
                    updatedAt: timestamp,
                    // Preserve area fields if present
                    areaId: propertyData.area?.id || p.areaId,
                    areaName: propertyData.area?.name || p.areaName,
                    areaCity: propertyData.area?.city || p.areaCity,
                    areaSlug: propertyData.area?.slug || p.areaSlug
                } : p
            );
        } else {
            // Create new property
            const newProperty = {
                ...propertyData,
                id: timestamp,
                agentId: user?.id,
                agentName: user?.name,
                status: 'pending', // Default status
                createdAt: timestamp,
                updatedAt: timestamp,
                type: propertyData.type || 'apartment', // Default type
                discount_percentage: propertyData.discount_percentage ? Number(propertyData.discount_percentage) : 0,
                // Area fields (optional)
                areaId: propertyData.area?.id || null,
                areaName: propertyData.area?.name || '',
                areaCity: propertyData.area?.city || '',
                areaSlug: propertyData.area?.slug || ''
            };

            // Validate discount
            if (newProperty.discount_percentage < 0 || newProperty.discount_percentage > 100) {
                throw new Error('Discount must be between 0 and 100');
            }

            updatedProperties = [...properties, newProperty];
        }

        // 1. Update In-Memory (Immediate UI feedback)
        setProperties(updatedProperties);

        // 2. Notify other tabs via BroadcastChannel (Works even if storage fails)
        channel.postMessage({ type: 'UPDATE_PROPERTIES', payload: updatedProperties });

        // 3. Persist to LocalStorage (With Fallback)
        try {
            localStorage.setItem('properties', JSON.stringify(updatedProperties));
            return { success: true };
        } catch (error) {
            console.warn("Storage full with images. Attempting to save without images...");

            // Fallback: Strip images from ALL properties to save space
            // We only keep the text data.
            const strippedProperties = updatedProperties.map(p => ({
                ...p,
                image: p.image && p.image.startsWith('data:') ? null : p.image // Keep URLs, remove base64
            }));

            try {
                localStorage.setItem('properties', JSON.stringify(strippedProperties));
                return { success: true, warning: 'Storage full! Property saved WITHOUT image.' };
            } catch (retryError) {
                console.error("Critical Storage Failure:", retryError);
                return { success: true, warning: 'Critical: Storage full. Data will be lost on refresh.' };
            }
        }
    };

    const generateTestData = () => {
        const testProperties = [
            {
                id: Date.now(),
                address: 'Test Property 1',
                price: 500000,
                beds: 3,
                baths: 2,
                sqft: 1500,
                status: 'pending',
                agentName: 'Test Agent',
                image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: Date.now() + 1,
                address: 'Test Property 2',
                price: 750000,
                beds: 4,
                baths: 3,
                sqft: 2200,
                status: 'pending',
                agentName: 'Test Agent',
                image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ];

        setProperties(prev => [...prev, ...testProperties]);
        try {
            const potentialNewState = [...properties, ...testProperties];
            localStorage.setItem('properties', JSON.stringify(potentialNewState));
            return { success: true };
        } catch (error) {
            console.error("Failed to save test data:", error);
            return { success: true, warning: 'Test data added to memory, but storage failed.' };
        }
    };

    const updatePropertyStatus = (propertyId, newStatus) => {
        const updatedProperties = properties.map(p =>
            p.id === propertyId ? { ...p, status: newStatus } : p
        );

        setProperties(updatedProperties);
        channel.postMessage({ type: 'UPDATE_PROPERTIES', payload: updatedProperties });

        try {
            localStorage.setItem('properties', JSON.stringify(updatedProperties));
        } catch (error) {
            console.error("Failed to update status in storage:", error);
        }
    };

    const approveProperty = (id) => updatePropertyStatus(id, 'approved');
    const sendBackProperty = (id) => updatePropertyStatus(id, 'needs_revision');

    const rejectProperty = (propertyId) => {
        const updatedProperties = properties.filter(p => p.id !== propertyId);
        setProperties(updatedProperties);
        channel.postMessage({ type: 'UPDATE_PROPERTIES', payload: updatedProperties });
        try {
            localStorage.setItem('properties', JSON.stringify(updatedProperties));
        } catch (error) { console.error(error); }
    };

    const deleteProperty = (propertyId) => {
        const updatedProperties = properties.filter(p => p.id !== propertyId);
        setProperties(updatedProperties);
        channel.postMessage({ type: 'UPDATE_PROPERTIES', payload: updatedProperties });
        try {
            localStorage.setItem('properties', JSON.stringify(updatedProperties));
        } catch (error) { console.error(error); }
    };

    const addLead = (propertyId) => {
        if (!user) return { success: false, error: 'Must be logged in' };

        const exists = leads.some(l => l.propertyId === propertyId && l.buyerId === user.id);
        if (exists) return { success: false, error: 'Already interested' };

        const newLead = {
            id: Date.now(),
            propertyId,
            buyerId: user.id,
            buyerName: user.name,
            buyerScore: user.score,
            timestamp: Date.now()
        };
        setLeads(prev => [...prev, newLead]);
        return { success: true };
    };

    // Get leads for a specific property (Redacted for privacy)
    const getLeadsForProperty = (propertyId) => {
        return leads
            .filter(l => l.propertyId === propertyId)
            .map(l => ({
                name: l.buyerName,
                score: l.buyerScore,
                timestamp: l.timestamp,
                // Phone and Email are NOT included here
            }));
    };

    const searchGlobal = (query, filters = {}) => {
        const lowerQuery = query.toLowerCase();
        const results = {
            properties: [],
            agents: [],
            locations: [] // Derived from properties
        };

        // 1. Search Properties
        results.properties = properties.filter(p => {
            // Status filter (default to approved if not specified, unless searching all)
            if (filters.status && p.status !== filters.status) return false;
            if (!filters.status && p.status !== 'approved') return false; // Default to approved only

            // Price range filter
            if (filters.minPrice && p.price < filters.minPrice) return false;
            if (filters.maxPrice && p.price > filters.maxPrice) return false;

            // Type filter
            if (filters.type && p.type !== filters.type) return false;

            // Keyword match
            const matchAddress = p.address.toLowerCase().includes(lowerQuery);
            const matchType = (p.type || '').toLowerCase().includes(lowerQuery);
            return matchAddress || matchType;
        });

        // 2. Search Agents (Mock Users)
        if (!filters.type || filters.type === 'agent') {
            results.agents = mockUsers.filter(u => {
                if (u.role !== 'agent' && u.role !== 'admin') return false;
                const matchName = u.name.toLowerCase().includes(lowerQuery);
                const matchEmail = u.email.toLowerCase().includes(lowerQuery);
                return matchName || matchEmail;
            });
        }

        // 3. Derive Locations from matching properties
        const locations = new Set();
        results.properties.forEach(p => {
            // Simple extraction: assume last part of address is state/city
            // This is a heuristic for the demo
            const parts = p.address.split(',');
            if (parts.length > 1) {
                locations.add(parts[parts.length - 1].trim());
            }
        });
        results.locations = Array.from(locations).map(loc => ({ name: loc, type: 'location' }));

        return results;
    };

    // --- User Management (Admin) ---

    const addUser = (userData) => {
        // Check for duplicates
        if (mockUsers.some(u => u.email === userData.email)) {
            return { success: false, error: 'Email already exists.' };
        }

        const newUser = {
            ...userData,
            id: Date.now(),
            status: 'active', // Default status
            createdAt: Date.now(),
            password: 'password123' // Default password for manually added users
        };

        setMockUsers(prev => [...prev, newUser]);
        return { success: true, userId: newUser.id };
    };

    const toggleUserStatus = (userId) => {
        setMockUsers(prev => prev.map(u => {
            if (u.id === userId) {
                return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
            }
            return u;
        }));
    };

    const deleteUser = (userId) => {
        setMockUsers(prev => prev.filter(u => u.id !== userId));
    };

    // ============================================
    // LEAD MANAGEMENT SYSTEM FUNCTIONS
    // ============================================

    // Submit buyer interest
    const submitInterest = (propertyId, message = '') => {
        if (!user) {
            throw new Error('Must be logged in to submit interest');
        }

        // Check for duplicate interest
        const existingInterest = interests.find(
            i => i.buyer_id === user.id && i.property_id === propertyId && i.status !== 'Rejected'
        );

        if (existingInterest) {
            throw new Error('You have already expressed interest in this property');
        }

        const newInterest = {
            id: Date.now().toString(),
            buyer_id: user.id,
            property_id: propertyId,
            message,
            created_at: new Date().toISOString(),
            status: 'New', // New, Approved, Rejected, Sent Back
            source: 'website',
            buyer_contact: {
                name: user.name,
                email: user.email,
                phone: user.phone || ''
            }
        };

        setInterests(prev => [...prev, newInterest]);
        return newInterest;
    };

    // Admin approves interest and converts to lead
    const approveInterest = (interestId) => {
        const interest = interests.find(i => i.id === interestId);
        if (!interest) {
            throw new Error('Interest not found');
        }

        const property = properties.find(p => p.id === interest.property_id);
        if (!property) {
            throw new Error('Property not found');
        }

        // Update interest status
        setInterests(prev => prev.map(i =>
            i.id === interestId ? { ...i, status: 'Approved', approved_at: new Date().toISOString() } : i
        ));

        // Create lead
        const newLead = {
            id: Date.now().toString(),
            interest_id: interestId,
            property_id: interest.property_id,
            buyer_id: interest.buyer_id,
            marketer_id: property.agentId || property.userId, // Use agentId (from addProperty) or fallback
            developer_id: property.agentId || property.userId,
            status: 'New',
            approved_at: new Date().toISOString(),
            assigned_at: new Date().toISOString(),
            buyer_contact: interest.buyer_contact
        };

        setLeads(prev => [...prev, newLead]);

        // Add to history
        addLeadHistory(newLead.id, 'New', user.id, 'Lead created from approved interest');

        return newLead;
    };

    // Admin rejects interest
    const rejectInterest = (interestId, reason = '') => {
        setInterests(prev => prev.map(i =>
            i.id === interestId
                ? { ...i, status: 'Rejected', rejected_at: new Date().toISOString(), rejection_reason: reason }
                : i
        ));
    };

    // Admin sends back interest for correction
    const sendBackInterest = (interestId, reason = '') => {
        setInterests(prev => prev.map(i =>
            i.id === interestId
                ? { ...i, status: 'Sent Back', sent_back_at: new Date().toISOString(), sent_back_reason: reason }
                : i
        ));
    };

    // Add entry to lead status history
    const addLeadHistory = (leadId, status, userId, notes = '') => {
        const historyEntry = {
            id: Date.now().toString() + Math.random(),
            lead_id: leadId,
            status,
            updated_by: userId,
            timestamp: new Date().toISOString(),
            notes
        };

        setLeadStatusHistory(prev => [...prev, historyEntry]);
        return historyEntry;
    };

    // Update lead status (by marketer/developer)
    const updateLeadStatus = (leadId, newStatus, notes = '') => {
        if (!user) {
            throw new Error('Must be logged in');
        }

        const lead = leads.find(l => l.id === leadId);
        if (!lead) {
            throw new Error('Lead not found');
        }

        // Check if user is authorized (marketer/developer assigned to this lead, or admin)
        if (user.role !== 'admin' && lead.marketer_id !== user.id && lead.developer_id !== user.id) {
            throw new Error('Not authorized to update this lead');
        }

        // Update lead status
        setLeads(prev => prev.map(l =>
            l.id === leadId
                ? { ...l, status: newStatus, last_updated: new Date().toISOString() }
                : l
        ));

        // Add to history
        addLeadHistory(leadId, newStatus, user.id, notes);

        return true;
    };

    // Close deal and create commission claim
    const closeDeal = (leadId, dealValue, status = 'Closed Won') => {
        if (!user) {
            throw new Error('Must be logged in');
        }

        if (!dealValue || dealValue <= 0) {
            throw new Error('Deal value must be greater than 0');
        }

        const lead = leads.find(l => l.id === leadId);
        if (!lead) {
            throw new Error('Lead not found');
        }

        // Check authorization
        if (user.role !== 'admin' && lead.marketer_id !== user.id && lead.developer_id !== user.id) {
            throw new Error('Not authorized to close this lead');
        }

        // Update lead status
        setLeads(prev => prev.map(l =>
            l.id === leadId
                ? {
                    ...l,
                    status,
                    closed_at: new Date().toISOString(),
                    deal_value: dealValue
                }
                : l
        ));

        // Add to history
        addLeadHistory(leadId, status, user.id, `Deal closed with value: ${dealValue}`);

        // Create commission claim if Closed Won
        if (status === 'Closed Won') {
            const commissionAmount = commissionSettings.type === 'percentage'
                ? (dealValue * commissionSettings.percentage) / 100
                : commissionSettings.percentage;

            const claim = {
                id: Date.now().toString(),
                lead_id: leadId,
                property_id: lead.property_id,
                marketer_id: lead.marketer_id,
                buyer_id: lead.buyer_id,
                deal_value: dealValue,
                commission_amount: commissionAmount,
                commission_percentage: commissionSettings.percentage,
                status: 'Pending Admin Review',
                created_at: new Date().toISOString()
            };

            setCommissionClaims(prev => [...prev, claim]);
            return claim;
        }

        return true;
    };

    // Admin approves commission
    const approveCommission = (commissionId) => {
        setCommissionClaims(prev => prev.map(c =>
            c.id === commissionId
                ? { ...c, status: 'Approved', approved_at: new Date().toISOString() }
                : c
        ));
    };

    // Admin rejects commission
    const rejectCommission = (commissionId, reason = '') => {
        setCommissionClaims(prev => prev.map(c =>
            c.id === commissionId
                ? { ...c, status: 'Rejected', rejected_at: new Date().toISOString(), rejection_reason: reason }
                : c
        ));
    };

    // Get lead timeline
    const getLeadTimeline = (leadId) => {
        return leadStatusHistory.filter(h => h.lead_id === leadId).sort((a, b) =>
            new Date(a.timestamp) - new Date(b.timestamp)
        );
    };

    // Get interests for admin
    const getInterests = (filters = {}) => {
        let filtered = [...interests];

        if (filters.status) {
            filtered = filtered.filter(i => i.status === filters.status);
        }

        return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };

    // Get leads for marketer/developer
    const getMyLeads = () => {
        if (!user) return [];
        if (user.role === 'admin') return leads;

        return leads.filter(l => l.marketer_id === user.id || l.developer_id === user.id);
    };

    // Get commission claims
    const getCommissionClaims = (filters = {}) => {
        let filtered = [...commissionClaims];

        if (filters.status) {
            filtered = filtered.filter(c => c.status === filters.status);
        }

        if (filters.marketer_id) {
            filtered = filtered.filter(c => c.marketer_id === filters.marketer_id);
        }

        return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    };


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
            leads, // Exposing raw leads for demo purposes if needed, but getLeadsForProperty is safer

            // User Management exports
            mockUsers,
            addUser,
            toggleUserStatus,
            deleteUser,

            // Lead Management System exports
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
            leadStatusHistory,

            // Commission Management
            commissionClaims,
            commissionSettings,
            approveCommission,
            rejectCommission,
            getCommissionClaims
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

