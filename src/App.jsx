import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider, useAuth } from './context/AuthContext';
import { areas } from './data/areas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import Footer from './components/Footer';
import SpecialOffers from './components/SpecialOffers';
import LatestProperties from './components/LatestProperties';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Buy from './pages/Buy';
import Rent from './pages/Rent';
import Sell from './pages/Sell';
import Agents from './pages/Agents';
import PropertyDetails from './pages/PropertyDetails';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import SearchResults from './pages/SearchResults';
import Areas from './pages/Areas';
import Properties from './pages/Properties';



const Home = () => {
  const { properties, mockUsers } = useAuth();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = React.useState('all');
  const isArabic = i18n.language === 'ar';

  // 1. Featured Properties (Tabs)
  const getFeaturedProperties = () => {
    let filtered = properties.filter(p => p.status === 'approved');
    if (activeTab !== 'all') {
      filtered = filtered.filter(p => (p.type || 'apartment') === activeTab);
    }
    // Sort by featured/random or just newest for now
    return filtered.slice(0, 6);
  };

  // 2. Special Offers (Discount > 0)
  const specialOffers = properties
    .filter(p => p.status === 'approved' && p.discount_percentage > 0)
    .sort((a, b) => b.discount_percentage - a.discount_percentage)
    .slice(0, 4);

  // 3. Latest Properties
  const latestProperties = properties
    .filter(p => p.status === 'approved')
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 4);

  // 4. Agents (Marketers)
  const agents = mockUsers.filter(u => u.role === 'marketer').slice(0, 4);

  // 5. Popular Areas (Top 4 by property count)
  const popularAreas = areas
    .map(area => ({
      ...area,
      count: properties.filter(p => p.areaSlug === area.slug).length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const featuredProperties = getFeaturedProperties();

  return (
    <>
      <Hero />

      {/* 1. Featured Properties Section */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #F0F4F8 0%, #F7F9FB 100%)',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>{t('home.featuredProperties')}</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', marginBottom: '2rem' }}>
              {t('home.featuredDescription')}
            </p>

            {/* Tabs */}
            <div style={{ display: 'inline-flex', backgroundColor: 'white', padding: '0.5rem', borderRadius: '999px', boxShadow: 'var(--shadow-sm)', gap: '0.25rem' }}>
              {(isArabic ? ['villa', 'apartment', 'all'] : ['all', 'apartment', 'villa']).map((tabType) => (
                <button
                  key={tabType}
                  onClick={() => setActiveTab(tabType)}
                  style={{
                    padding: '0.75rem 2rem',
                    borderRadius: '999px',
                    border: 'none',
                    backgroundColor: activeTab === tabType ? 'var(--primary)' : 'transparent',
                    color: activeTab === tabType ? 'white' : 'var(--text-muted)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tabType === 'villa' ? t('home.tabs.villas') :
                    tabType === 'apartment' ? t('home.tabs.apartments') :
                      t('home.tabs.all')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* View All Properties Button */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/properties">
              <button className="btn btn-primary" style={{ padding: '0.75rem 2.5rem', fontSize: '1rem' }}>
                {isArabic ? 'عرض جميع العقارات' : 'View All Properties'}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Special Offers Section */}
      <SpecialOffers />

      {/* 3. Latest Properties Section */}
      <LatestProperties />

      {/* 4. Popular Areas Section */}
      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #F8FAFB 0%, #EDF2F7 100%)',
        position: 'relative'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            {isArabic ? 'المناطق الأكثر طلباً' : 'Popular Areas'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {popularAreas.map((area) => (
              <Link key={area.id} to={`/search?area=${area.slug}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    height: '250px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <img
                    src={area.image}
                    alt={area.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.5rem'
                  }}>
                    <h3 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {isArabic ? area.nameAr : area.name}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
                      {area.count} {isArabic ? 'عقار' : 'Properties'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Areas Button */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/areas">
              <button className="btn btn-outline" style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}>
                {isArabic ? 'عرض جميع المناطق' : 'View All Areas'}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Agents Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#F7F9FB' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            {isArabic ? 'وكلاؤنا المميزون' : 'Meet Our Agents'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {agents.map(agent => (
              <div key={agent.id} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#E5E7EB', margin: '0 auto 1rem', overflow: 'hidden' }}>
                  <img src={`https://ui-avatars.com/api/?name=${agent.name}&background=random`} alt={agent.name} style={{ width: '100%', height: '100%' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{agent.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Real Estate Agent</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <Link to="/agents">
          <button className="btn btn-outline">View All Agents</button>
        </Link>
      </div>

      {/* Why Choose Us Section */}
      <section style={{ padding: '4rem 0', backgroundColor: '#F0F5FA' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{t('home.whyChooseUs')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.5rem' }}>✓</div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('home.features.verifiedListings')}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>{t('home.features.verifiedDescription')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.5rem' }}>✓</div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('home.features.expertAgents')}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>{t('home.features.expertDescription')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.5rem' }}>✓</div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t('home.features.smartInsights')}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>{t('home.features.smartDescription')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Modern Interior" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section >
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/buy" element={<Buy />} />
              <Route path="/rent" element={<Rent />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/areas" element={<Areas />} />
              <Route path="/properties" element={<Properties />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
