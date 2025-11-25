import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { areas } from '../data/areas';

const AddProperty = () => {
    const { user, addProperty } = useAuth();
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const editProperty = location.state?.property;
    const isArabic = i18n.language === 'ar';
    const [formData, setFormData] = useState({
        address: '',
        price: '',
        beds: '',
        baths: '',
        sqft: '',
        type: 'apartment',
        status: 'pending',
        images: [], // Array of base64 strings
        description: '',
        discount_percentage: '',
        area: null // Selected area object
    });

    useEffect(() => {
        if (editProperty) {
            setFormData({
                address: editProperty.address,
                price: editProperty.price,
                beds: editProperty.beds,
                baths: editProperty.baths,
                sqft: editProperty.sqft,
                description: editProperty.description || '',
                type: editProperty.type || 'apartment',
                status: editProperty.status || 'pending',
                images: editProperty.images || (editProperty.image ? [editProperty.image] : []),
                discount_percentage: editProperty.discount_percentage || '',
                area: editProperty.areaId ? {
                    id: editProperty.areaId,
                    name: editProperty.areaName,
                    city: editProperty.areaCity,
                    slug: editProperty.areaSlug
                } : null
            });
        }
    }, [editProperty]);

    if (!user || (user.role !== 'marketer' && user.role !== 'developer' && user.role !== 'admin')) {
        return <div className="container" style={{ marginTop: '4rem' }}>Access Denied. Only Marketers, Developers, and Admins can add properties.</div>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + formData.images.length > 5) {
            alert("You can only upload a maximum of 5 images.");
            return;
        }

        const newImages = [];
        let processedCount = 0;

        files.forEach(file => {
            // Limit file size to 10MB
            if (file.size > 10000000) {
                alert(`File ${file.name} is too large! Max 10MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result);
                processedCount++;

                if (processedCount === files.length) {
                    setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, ...newImages]
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.address || !formData.price) return;

        const propertyData = {
            ...formData,
            id: editProperty?.id, // Include ID if editing
            price: Number(formData.price),
            beds: Number(formData.beds),
            baths: Number(formData.baths),
            sqft: Number(formData.sqft),
            discount_percentage: formData.discount_percentage ? Number(formData.discount_percentage) : 0,
            // Area fields
            areaId: formData.area?.id || null,
            areaName: formData.area?.name || '',
            areaCity: formData.area?.city || '',
            areaSlug: formData.area?.slug || '',
            // Use first image as main thumbnail, or default if none
            image: formData.images.length > 0 ? formData.images[0] : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            images: formData.images,
            // Use form status if admin, otherwise auto-approve if admin created it (fallback), or pending
            status: user.role === 'admin' ? formData.status : 'pending'
        };

        try {
            const result = addProperty(propertyData);
            if (result.success) {
                if (result.warning) {
                    alert(result.warning);
                }
                if (user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '4rem', marginBottom: '4rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>{editProperty ? 'Edit Property' : 'Add New Property'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* ... (Address, Price, Sqft, Beds, Baths inputs remain same) ... */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Property Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Sqft</label>
                        <input
                            type="number"
                            name="sqft"
                            value={formData.sqft}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        />
                    </div>
                </div>

                {/* Area Dropdown */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        {isArabic ? 'المنطقة' : 'Area'}
                    </label>
                    <input
                        list="area-list"
                        name="area"
                        value={isArabic ? (formData.area?.nameAr || '') : (formData.area?.name || '')}
                        onChange={e => {
                            const selected = areas.find(a =>
                                isArabic ? a.nameAr === e.target.value : a.name === e.target.value
                            );
                            setFormData(prev => ({ ...prev, area: selected || null }));
                        }}
                        placeholder={isArabic ? 'ابدأ الكتابة...' : 'Start typing...'}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                    <datalist id="area-list">
                        {areas.map(a => (
                            <option key={a.id} value={isArabic ? a.nameAr : a.name} />
                        ))}
                    </datalist>
                </div>
                {/* Discount Field */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                        Discount Percentage / نسبة الخصم (%)
                    </label>
                    <input
                        type="number"
                        name="discount_percentage"
                        value={formData.discount_percentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        placeholder="0 - 100"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                    <small style={{ color: 'var(--text-muted)' }}>Optional. Leave empty or 0 for no discount.</small>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Bedrooms</label>
                        <input
                            type="number"
                            name="beds"
                            value={formData.beds}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Bathrooms</label>
                        <input
                            type="number"
                            name="baths"
                            value={formData.baths}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Property Images (Max 5)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'white' }}
                    />

                    {/* Image Previews */}
                    {formData.images.length > 0 && (
                        <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                            {formData.images.map((img, index) => (
                                <div key={index} style={{ position: 'relative', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                    <img src={img} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Property Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    >
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                        <option value="office">Office</option>
                        <option value="land">Land</option>
                    </select>
                </div>

                {user.role === 'admin' && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status (Admin Only)</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Published</option>
                            <option value="needs_revision">Under Review</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                )}

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                    />
                </div>

                <button type="submit" className="btn btn-primary">{editProperty ? 'Update Property' : 'List Property'}</button>
            </form>
        </div>
    );
};

export default AddProperty;
