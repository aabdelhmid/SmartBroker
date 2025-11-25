import React from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <section style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '8rem 0',
            textAlign: 'center'
        }}>
            <div className="container">
                <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    marginBottom: 'var(--spacing-md)'
                }}>
                    {t('hero.title')}
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    marginBottom: '2rem',
                    opacity: 0.9
                }}>
                    {t('hero.subtitle')}
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const query = e.target.elements.search.value;
                        if (query.trim()) {
                            window.location.href = `/search?q=${encodeURIComponent(query)}`;
                        }
                    }}
                    style={{
                        backgroundColor: 'white',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        maxWidth: '800px',
                        margin: '0 auto',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    <input
                        name="search"
                        type="text"
                        placeholder={t('hero.searchPlaceholder')}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '1rem'
                        }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                        {t('common.search')}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Hero;
