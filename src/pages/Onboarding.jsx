import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
    const { user, areas, completeOnboarding } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        budgetMin: '',
        budgetMax: '',
        preferredLocations: [],
        propertyTypes: [],
        paymentPreference: 'cash'
    });

    const propertyTypes = ['apartment', 'villa', 'office', 'land', 'commercial'];
    const totalSteps = 4;

    // Filter areas based on search
    const filteredAreas = areas.filter(area =>
        area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleArrayToggle = (field, value) => {
        setFormData(prev => {
            const current = prev[field] || [];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return formData.budgetMin && formData.budgetMax &&
                    parseFloat(formData.budgetMin) < parseFloat(formData.budgetMax);
            case 2:
                return formData.preferredLocations.length > 0;
            case 3:
                return formData.propertyTypes.length > 0;
            case 4:
                return formData.paymentPreference;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        navigate('/dashboard');
    };

    const handleFinish = async () => {
        setLoading(true);
        const result = await completeOnboarding(formData);
        if (result.success) {
            navigate('/dashboard');
        } else {
            alert('Error saving preferences: ' + result.error);
        }
        setLoading(false);
    };

    const renderProgressBar = () => {
        const steps = ['Budget', 'Locations', 'Types', 'Payment'];
        return (
            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                    {/* Progress Line */}
                    <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '0',
                        right: '0',
                        height: '2px',
                        backgroundColor: '#E5E7EB',
                        zIndex: 0
                    }}>
                        <div style={{
                            height: '100%',
                            backgroundColor: 'var(--primary)',
                            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                            transition: 'width 0.3s ease'
                        }} />
                    </div>

                    {/* Step Indicators */}
                    {steps.map((step, index) => {
                        const stepNumber = index + 1;
                        const isActive = stepNumber === currentStep;
                        const isCompleted = stepNumber < currentStep;

                        return (
                            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: isCompleted || isActive ? 'var(--primary)' : 'white',
                                    border: `2px solid ${isCompleted || isActive ? 'var(--primary)' : '#E5E7EB'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    color: isCompleted || isActive ? 'white' : '#9CA3AF',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.3s ease'
                                }}>
                                    {isCompleted ? '✓' : stepNumber}
                                </div>
                                <span style={{
                                    marginTop: '0.5rem',
                                    fontSize: '0.75rem',
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? 'var(--primary)' : '#6B7280'
                                }}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>What's your budget range?</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Help us find properties that match your budget
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Minimum Budget (EGP)
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.budgetMin}
                                    onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
                                    placeholder="e.g., 1,000,000"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                                    Maximum Budget (EGP)
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    value={formData.budgetMax}
                                    onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
                                    placeholder="e.g., 50,000,000"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                        {formData.budgetMin && formData.budgetMax && parseFloat(formData.budgetMin) >= parseFloat(formData.budgetMax) && (
                            <p style={{ color: '#EF4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                Maximum budget must be greater than minimum budget
                            </p>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Where do you want to live?</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Select one or more preferred locations
                        </p>

                        {/* Search */}
                        <input
                            type="text"
                            className="input"
                            placeholder="Search locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', marginBottom: '1rem' }}
                        />

                        {/* Location List */}
                        <div style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem'
                        }}>
                            {filteredAreas.length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                    {filteredAreas.map(area => (
                                        <label
                                            key={area.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem',
                                                borderRadius: 'var(--radius-sm)',
                                                cursor: 'pointer',
                                                backgroundColor: formData.preferredLocations.includes(area.slug) ? '#EEF2FF' : 'transparent',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!formData.preferredLocations.includes(area.slug)) {
                                                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!formData.preferredLocations.includes(area.slug)) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.preferredLocations.includes(area.slug)}
                                                onChange={() => handleArrayToggle('preferredLocations', area.slug)}
                                            />
                                            <span style={{ fontSize: '0.875rem' }}>{area.name}</span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                                    {searchTerm ? 'No locations found' : 'Loading locations...'}
                                </p>
                            )}
                        </div>

                        {formData.preferredLocations.length > 0 && (
                            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {formData.preferredLocations.length} location{formData.preferredLocations.length > 1 ? 's' : ''} selected
                            </p>
                        )}
                    </div>
                );

            case 3:
                return (
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>What type of property are you looking for?</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Select all that apply
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                            {propertyTypes.map(type => (
                                <label
                                    key={type}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: '1.5rem',
                                        border: `2px solid ${formData.propertyTypes.includes(type) ? 'var(--primary)' : 'var(--border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        backgroundColor: formData.propertyTypes.includes(type) ? '#EEF2FF' : 'white',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!formData.propertyTypes.includes(type)) {
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                            e.currentTarget.style.backgroundColor = '#F9FAFB';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!formData.propertyTypes.includes(type)) {
                                            e.currentTarget.style.borderColor = 'var(--border)';
                                            e.currentTarget.style.backgroundColor = 'white';
                                        }
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.propertyTypes.includes(type)}
                                        onChange={() => handleArrayToggle('propertyTypes', type)}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>How do you plan to pay?</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            Choose your preferred payment method
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {['cash', 'installments', 'mortgage'].map(method => (
                                <label
                                    key={method}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        border: `2px solid ${formData.paymentPreference === method ? 'var(--primary)' : 'var(--border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        backgroundColor: formData.paymentPreference === method ? '#EEF2FF' : 'white',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (formData.paymentPreference !== method) {
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                            e.currentTarget.style.backgroundColor = '#F9FAFB';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (formData.paymentPreference !== method) {
                                            e.currentTarget.style.borderColor = 'var(--border)';
                                            e.currentTarget.style.backgroundColor = 'white';
                                        }
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="paymentPreference"
                                        value={method}
                                        checked={formData.paymentPreference === method}
                                        onChange={(e) => setFormData({ ...formData, paymentPreference: e.target.value })}
                                        style={{ marginRight: '1rem' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                                            {method}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {method === 'cash' && 'Pay the full amount upfront'}
                                            {method === 'installments' && 'Pay in monthly installments'}
                                            {method === 'mortgage' && 'Finance through a bank mortgage'}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Redirect if not a buyer or already completed
    if (!user || user.role !== 'buyer') {
        navigate('/dashboard');
        return null;
    }

    if (user.onboarding_completed) {
        navigate('/dashboard');
        return null;
    }

    return (
        <div className="container" style={{ maxWidth: '700px', marginTop: '4rem', marginBottom: '4rem' }}>
            <div style={{
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>Welcome to SmartBroker! 👋</h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Let's personalize your experience in just a few steps
                    </p>
                </div>

                {/* Progress Bar */}
                {renderProgressBar()}

                {/* Step Content */}
                <div style={{ minHeight: '350px' }}>
                    {renderStep()}
                </div>

                {/* Navigation */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '3rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--border)'
                }}>
                    <button
                        onClick={handleSkip}
                        className="btn btn-outline"
                        style={{ visibility: currentStep < totalSteps ? 'visible' : 'hidden' }}
                    >
                        Skip for Now
                    </button>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {currentStep > 1 && (
                            <button onClick={handleBack} className="btn btn-outline">
                                Back
                            </button>
                        )}

                        {currentStep < totalSteps ? (
                            <button
                                onClick={handleNext}
                                className="btn btn-primary"
                                disabled={!isStepValid()}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={handleFinish}
                                className="btn btn-primary"
                                disabled={!isStepValid() || loading}
                            >
                                {loading ? 'Saving...' : 'Finish'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
