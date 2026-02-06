/**
 * Indian Pentecostal Church of God - Bethel Church, Naigaon East Home Page Component
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import churchLogo from '../../assets/ipc-logo.png';
import pastorImage from '../../assets/pr-family.jpg';
import churchGroupImage from '../../assets/church-group.jpg';
import './HomePage.css';
import { getAllEvents } from '../../services/eventService.firebase';
import { getAllArticles } from '../../services/articlesService.firebase';
import { getAllTestimonials } from '../../services/testimonialService.firebase';
import { formatTo12Hour } from '../../utils/timeFormatter';
import YouTubeFeed from '../common/youtubeFeed';
// Mock articles for demonstration
const MOCK_ARTICLES = [
  {
    id: 'mock-1',
    title: 'The Power of Daily Prayer',
    excerpt: 'Discover how establishing a daily prayer routine can transform your spiritual life and deepen your connection with God.',
    description: 'Prayer is the foundation of our faith. Learn practical tips for maintaining a meaningful prayer practice that brings you closer to God\'s love and purpose.',
    category: 'Prayer',
    author: 'Pastor Johnson George',
    imageUrl: 'https://picsum.photos/400/250?random=1',
    link: '#',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Finding Faith in Times of Uncertainty',
    excerpt: 'When life feels overwhelming, how can we maintain our faith and trust in God\'s plan? Explore biblical wisdom and practical guidance.',
    description: 'Faith is not about having all the answers. It\'s about trusting God even when we don\'t understand the journey. Discover how to strengthen your faith during challenging times.',
    category: 'Faith',
    author: 'Pr Johnson',
    imageUrl: 'https://picsum.photos/400/250?random=2',
    link: '#',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Living a Life of Gratitude',
    excerpt: 'Gratitude is a powerful spiritual practice that transforms our perspective. Learn how thanksgiving can deepen your faith journey.',
    description: 'A grateful heart opens doors to blessings we often overlook. Explore how to cultivate gratitude in your daily life and experience the peace that comes from appreciating God\'s goodness.',
    category: 'Faith',
    author: 'Pr Johnson',
    imageUrl: 'https://picsum.photos/400/250?random=3',
    link: '#',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-4',
    title: 'The Holy Spirit: Our Helper and Guide',
    excerpt: 'Understanding the role and power of the Holy Spirit in our daily lives and spiritual journey.',
    description: 'The Holy Spirit is God\'s presence with us, empowering believers to live victoriously. Discover how to walk in the Spirit and experience His gifts, fruit, and guidance in your life.',
    category: 'Doctrine',
    author: 'Pastor Johnson George',
    imageUrl: 'https://picsum.photos/400/250?random=4',
    link: '#',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [weeklyEvents, setWeeklyEvents] = useState([]);
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Scroll to resources section if coming from article detail page
  useEffect(() => {
    if (location.state?.scrollToResources) {
      // Use a longer timeout to ensure the DOM is fully rendered
      const scrollTimeout = setTimeout(() => {
        const resourcesContent = document.querySelector('.resources-content h2');
        if (resourcesContent) {
          window.scrollTo({
            top: resourcesContent.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }, 300);
      
      return () => clearTimeout(scrollTimeout);
    }
  }, [location]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    }, observerOptions);

    // Observe all sections and cards
    const elements = document.querySelectorAll('.about-card, .service-item, .ministry-card, .testimonial-card, .contact-item');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [testimonials]); // Added testimonials dependency so observer updates when testimonials load

  // Load weekly events (Sunday to Saturday of current week) from Firebase
  useEffect(() => {
    let mounted = true;
    const loadWeekly = async () => {
      try {
        const allEvents = await getAllEvents();
        const now = new Date();
        
        // Calculate Sunday of the current week
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const sunday = new Date(now);
        sunday.setDate(now.getDate() - day);
        sunday.setHours(0, 0, 0, 0);
        
        // Calculate Saturday of the current week
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        saturday.setHours(23, 59, 59, 999);

        const weekEvents = allEvents
          .filter(e => {
            const d = new Date(e.date);
            return d >= sunday && d <= saturday;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (mounted) setWeeklyEvents(weekEvents);
      } catch (err) {
        console.error('Failed to load weekly events', err);
      }
    };

    loadWeekly();
    return () => { mounted = false; };
  }, []);

  // Load articles from Firebase
  useEffect(() => {
    let mounted = true;
    const loadArticles = async () => {
      try {
        const allArticles = await getAllArticles();
        // Merge Firebase articles with mock articles (if any real articles exist, use them; otherwise use mock)
        const articlesToShow = allArticles.length > 0 ? allArticles : MOCK_ARTICLES;
        // Get the most recent articles for homepage
        const recentArticles = articlesToShow.slice(0, 4);
        if (mounted) setArticles(recentArticles);
      } catch (err) {
        console.error('Failed to load articles', err);
        // Keep mock articles as fallback
      }
    };

    loadArticles();
    return () => { mounted = false; };
  }, []);

  // Load testimonials from Firebase
  useEffect(() => {
    let mounted = true;
    const loadTestimonials = async () => {
      try {
        console.log('Loading testimonials from Firebase...');
        const allTestimonials = await getAllTestimonials();
        console.log('Testimonials loaded from Firebase:', allTestimonials);
        
        if (mounted) {
          setTestimonials(allTestimonials);
        }
      } catch (err) {
        console.error('Failed to load testimonials from Firebase:', err);
        if (mounted) setTestimonials([]);
      }
    };

    loadTestimonials();
    return () => { mounted = false; };
  }, []);

  // Log testimonials state changes for debugging
  useEffect(() => {
    console.log('Testimonials state updated:', testimonials);
  }, [testimonials]);

  // Scroll to top button visibility and parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTopBtn = document.querySelector('.scroll-to-top');
      if (scrollTopBtn) {
        if (window.pageYOffset > 300) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }

      // Parallax effect for hero
      const heroContent = document.querySelector('.hero-content');
      if (heroContent && window.pageYOffset < window.innerHeight) {
        const scrolled = window.pageYOffset;
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Video background commented out - replace with your own video file if needed
        <video className="hero-video-background" autoPlay loop muted playsInline>
          <source src="https://cdn.coverr.co/videos/coverr-church-worship-service-9637/1080p.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        */}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="church-header">
            <div className="hero-logos">
              <img src={churchLogo} alt="IPC Naigaon Logo" className="hero-logo church-logo-main" />
            </div>
            <h1 className="church-name">India Pentecostal Church of God</h1>
            <p className="church-location">Bethel Church, Naigaon East Mumbai</p>
          </div>
          <p className="church-tagline">
            "I can do all things through Christ who strengthens me." - Philippians 4:13
          </p>
          
          <div className="hero-cta">
            <button className="primary-cta" onClick={() => window.scrollTo({ top: document.querySelector('.services-section').offsetTop, behavior: 'smooth' })}>
              Explore Our Services
            </button>
            <button className="secondary-cta" onClick={() => window.scrollTo({ top: document.querySelector('.contact-section').offsetTop, behavior: 'smooth' })}>
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      {/* Quick Info Banner */}
      <section className="info-banner">
        <div className="info-content">
          <div className="info-item">
            <div className="info-icon"></div>
            <div className="info-text">
              <h4>Daily</h4>
              <p>Prayer & Worship</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">🎯</div>
            <div className="info-text">
              <h4>25+</h4>
              <p>Years of Ministry</p>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">❤️</div>
            <div className="info-text">
              <h4>One Family</h4>
              <p>In God's Love</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <h2>Welcome to IPC Naigaon Mumbai</h2>
          
          {/* Pastor Introduction */}
          <div className="pastor-section">
            <div className="pastor-card">
              <div className="pastor-image-container">
                <img 
                  src={pastorImage} 
                  alt="Pastor Johnson George" 
                  className="pastor-image"
                />
                <div className="pastor-icon-badge">✝️</div>
              </div>
              <h3>Pastor Johnson George</h3>
              <p className="pastor-title">Senior Pastor</p>
              <p className="pastor-message">
                "Welcome to India Pentecostal Church of God, Naigaon Mumbai! We are a vibrant family 
                united in faith, dedicated to worshiping God, growing spiritually together, and serving 
                our community with the love of Christ."
              </p>
            </div>
          </div>

          <div className="about-grid">
            <div className="about-card">
              <div className="about-icon">⛪</div>
              <h3>Our Mission</h3>
              <p>To spread the Gospel of Jesus Christ and build a strong community of believers in Naigaon and beyond, transforming lives through faith, prayer, and service.</p>
            </div>
            <div className="about-card">
              <div className="about-icon">📖</div>
              <h3>Our Vision</h3>
              <p>Empowering believers to live spirit-filled lives through biblical teaching, fervent worship, and dedicated service to God and humanity.</p>
            </div>
            <div className="about-card">
              <div className="about-icon">❤️</div>
              <h3>Our Values</h3>
              <p>Faith, Holiness, Prayer, Unity, and Service guide our walk as we follow the teachings of Jesus Christ and the leading of the Holy Spirit.</p>
            </div>
          </div>

          {/* Church Leadership */}
          <div className="leadership-section">
            <h3 className="leadership-title">Church Leadership</h3>
            <div className="leadership-grid">
              <div className="leadership-card">
                <div className="leadership-image-container">
                  <img 
                    src={pastorImage} 
                    alt="Pastor Johnson George" 
                    className="leadership-image"
                  />
                </div>
                <h4>Pastor Johnson George</h4>
                <p className="leadership-role">Senior Pastor</p>
                <div className="leadership-contact">
                  <a href="tel:+919284333603" className="leadership-phone">📞 +91 92843 33603</a>
                  <a href="https://wa.me/919284333603" target="_blank" rel="noopener noreferrer" className="leadership-whatsapp">
                    💬 WhatsApp
                  </a>
                </div>
              </div>
              <div className="leadership-card">
                <div className="leadership-image-container">
                  <div className="leadership-placeholder">
                    <span className="placeholder-icon">👤</span>
                  </div>
                </div>
                <h4>Br. Reji Abraham</h4>
                <p className="leadership-role">Secretary</p>
                <div className="leadership-contact">
                  <a href="tel:+919107208316998" className="leadership-phone">📞 +91 7208316998</a>
                  <a href="https://wa.me/917208316998" target="_blank" rel="noopener noreferrer" className="leadership-whatsapp">
                    💬 WhatsApp
                  </a>
                </div>
              </div>
              <div className="leadership-card">
                <div className="leadership-image-container">
                  <div className="leadership-placeholder">
                    <span className="placeholder-icon">👤</span>
                  </div>
                </div>
                <h4>Br. Jackson Prince</h4>
                <p className="leadership-role">Treasurer</p>
                <div className="leadership-contact">
                  <a href="tel:+917510541625" className="leadership-phone">📞 +91 75105 41625</a>
                  <a href="https://wa.me/917510541625" target="_blank" rel="noopener noreferrer" className="leadership-whatsapp">
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-content">
          <h2>Weekly Services & Events</h2>
          <div className="services-grid">
            {/* Sunday Services */}
            <div className="service-item">
              <div className="service-day">Sunday</div>
              <div className="service-details">
                <h4>📖 Sunday School</h4>
                <p>9:30 AM - 10:30 AM</p>
              </div>
            </div>
            <div className="service-item">
              <div className="service-day">Sunday</div>
              <div className="service-details">
                <h4>🙏 Sunday Service</h4>
                <p>10:30 AM - 1:00 PM</p>
              </div>
            </div>
            
            {/* Weekday Services */}
            <div className="service-item">
              <div className="service-day">Friday</div>
              <div className="service-details">
                <h4>🙏 Fasting Prayer</h4>
                <p>10:30 AM - 12:30 PM</p>
              </div>
            </div>
            <div className="service-item">
              <div className="service-day">Wednesday</div>
              <div className="service-details">
                <h4>👥 Cottage Meeting</h4>
                <p>Every Second Wednesday of the Month</p>
              </div>
            </div>
            <div className="service-item">
              <div className="service-day">Sunday</div>
              <div className="service-details">
                <h4>✨ PYPA</h4>
                <p>Every Last Sunday of the Month</p>
              </div>
            </div>
          </div>
          {weeklyEvents.length > 0 && (
            <div className="this-week-section">
              <div className="week-header">
                <h3>📅 This Week's Events</h3>
                <div className="week-duration">
                  {(() => {
                    const now = new Date();
                    const day = now.getDay();
                    const sunday = new Date(now);
                    sunday.setDate(now.getDate() - day);
                    
                    const saturday = new Date(sunday);
                    saturday.setDate(sunday.getDate() + 6);
                    
                    const sundayStr = sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const saturdayStr = saturday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    
                    return <p>{sundayStr} - {saturdayStr}</p>;
                  })()}
                </div>
              </div>
              <div className="week-events-list">
                {weeklyEvents.map(e => {
                  const eventDate = new Date(e.date);
                  const today = new Date();
                  const isToday = today.toDateString() === eventDate.toDateString();
                  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][eventDate.getDay()];
                  
                  return (
                    <div 
                      key={e.id} 
                      className={`home-week-event-card ${isToday ? 'today' : ''}`}
                      onClick={() => {
                        setSelectedEvent(e);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="event-date-badge">
                        <span className="day">{eventDate.getDate()}</span>
                        <span className="month">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="weekday">{dayName}</span>
                      </div>
                      <div className="event-details">
                        <h4 className="event-title">{e.title}</h4>
                        {e.description && <p className="event-description">{e.description}</p>}
                        <div className="event-meta-info">
                          {e.time && (
                            <span className="meta-item">
                              <span className="icon">🕐</span>
                              {formatTo12Hour(e.time)}
                            </span>
                          )}
                          {e.location && (
                            <span className="meta-item">
                              <span className="icon">📍</span>
                              {e.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* YouTube Feed Section */}
      {/* <section className="youtube-section">
        <div className="youtube-content">
          <YouTubeFeed 
            channelId={process.env.REACT_APP_YOUTUBE_CHANNEL_ID} 
            apiKey={process.env.REACT_APP_YOUTUBE_API_KEY} 
          />
        </div>
      </section> */}

      {/* Ministries Section */}
      <section className="ministries-section">
        <div className="ministries-content">
          <h2>Our Ministries</h2>
          <div className="ministries-grid">
            <div className="ministry-card">
              <div className="ministry-icon">👶</div>
              <h4>Children's Ministry</h4>
              <p>Nurturing young hearts with Bible stories, worship, and Christian values in a fun and engaging environment.</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">🎓</div>
              <h4>Youth Ministry</h4>
              <p>Empowering young people to grow in faith, build friendships, and discover their purpose in Christ.</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">🎵</div>
              <h4>Worship Ministry</h4>
              <p>Leading the congregation in heartfelt praise and worship through music, song, and creative expression.</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">👨‍👩‍👧‍👦</div>
              <h4>Family Ministry</h4>
              <p>Strengthening families through biblical teaching, support groups, and community fellowship activities.</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">🌍</div>
              <h4>Outreach Ministry</h4>
              <p>Sharing God's love beyond our walls through community service, missions, and evangelism programs.</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">🙏</div>
              <h4>Prayer Ministry</h4>
              <p>Interceding for our church, community, and nation through organized prayer meetings and chains.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-content">
          <h2>Life Transformations</h2>
          {testimonials.length === 0 ? (
            <div className="no-testimonials">
              <p>No testimonials available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="testimonials-grid">
              {testimonials.map(testimonial => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-quote">"</div>
                  <p>{testimonial.content}</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery-section">
        <div className="gallery-content">
          <h2>📸 Church Photo Gallery</h2>
          <p className="section-subtitle">Moments of worship, fellowship, and service in our community</p>
          <div className="gallery-grid">
            {[
              { id: 1, title: 'Youth Camp', url: 'https://picsum.photos/800/600?random=1' },
              { id: 2, title: 'Sunday Service', url: 'https://picsum.photos/800/600?random=2' },
              { id: 3, title: 'Sunday School', url: 'https://picsum.photos/800/600?random=3' },
              { id: 4, title: 'Parenting Sessions', url: 'https://picsum.photos/800/600?random=4' },
              { id: 5, title: 'Church Group', url: 'https://picsum.photos/800/600?random=5' },
            
            ].map(photo => (
              <div 
                key={photo.id} 
                className="gallery-item"
                onClick={() => {
                  setSelectedPhoto(photo);
                  setIsPhotoModalOpen(true);
                }}
              >
                <img 
                  src={photo.url} 
                  alt={photo.title}
                  className="gallery-image"
                />
                <div className="gallery-overlay">
                  <div className="gallery-info">
                    <h4>{photo.title}</h4>
                    <p className="view-text">Click to view</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources-section">
        <div className="resources-content">
          <h2>📚 Resources & Articles</h2>
          <p className="section-subtitle">Spiritual growth and learning materials for our community</p>
          
          {articles.length === 0 ? (
            <div className="no-articles">
              <p>No articles available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="articles-grid">
              {articles.slice(0, 10).map(article => (
                <div key={article.id} className="article-card">
                  {article.imageUrl && (
                    <div className="article-image">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="article-content">
                    <div className="article-meta">
                      <span className="article-category">{article.category || 'General'}</span>
                      <span className="article-date">
                        {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">{article.excerpt || article.description}</p>
                    {article.author && (
                      <p className="article-author">By {article.author}</p>
                    )}
                    <button 
                      className="read-more-btn"
                      onClick={() => navigate(`/article/${article.id}`)}
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-content">
          <h2>Visit Us or Get In Touch</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <h4>Address</h4>
              <p>Navkarcity Phase 2<br/>B1.402<br/>Naigaon East<br/>Mumbai, Maharashtra, India</p>
              <a href="https://maps.app.goo.gl/NgNbo2HViARxn5g36" target="_blank" rel="noopener noreferrer" className="map-link">
                🗺️ Open in Google Maps
              </a>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <h4>Phone</h4>
              <p>
                <a href="tel:+919284333603" className="phone-link">+91 92843 33603</a>
                <br/>
                <a href="https://wa.me/919284333603" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                  💬 WhatsApp Us
                </a>
                <br/>Office Hours:<br/>Mon-Sat: 10 AM - 6 PM
              </p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <h4>Email</h4>
              <p>ipcnaigaon@gmail.com</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">🌐</div>
              <h4>Connect Online</h4>
              <p><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> | <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a> | <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a><br/>Join our online community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="portal-access-section">
        <div className="portal-access-content">
          <h3>Member & Staff Portal Access</h3>
          <p>Access your personal dashboard and church management tools</p>
          <div className="portal-links">
            <button className="portal-link-btn admin-link" onClick={() => navigate('/login')}>
              <span className="portal-link-icon">👨‍💼</span>
              <span className="portal-link-text">Admin Login</span>
            </button>
            <button className="portal-link-btn member-link" onClick={() => navigate('/member-portal/login')}>
              <span className="portal-link-icon">🙏</span>
              <span className="portal-link-text">Member Login</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="footer-logos">
              <img src={churchLogo} alt="IPC Naigaon" className="church-logo" />
            </div>
            <p>India Pentecostal Church of God</p>
            <p className="footer-location">Naigaon, Mumbai</p>
          </div>
          <div className="footer-nav">
            <div className="footer-section">
              <h4>Quick Links</h4>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="footer-link">Home</button>
              <button onClick={() => window.scrollTo({ top: document.querySelector('.about-section').offsetTop, behavior: 'smooth' })} className="footer-link">About Us</button>
              <button onClick={() => window.scrollTo({ top: document.querySelector('.services-section').offsetTop, behavior: 'smooth' })} className="footer-link">Services</button>
              <button onClick={() => window.scrollTo({ top: document.querySelector('.ministries-section').offsetTop, behavior: 'smooth' })} className="footer-link">Ministries</button>
              <button onClick={() => navigate('/celebrations')} className="footer-link">🎉 Celebrations</button>
            </div>
            <div className="footer-section">
              <h4>Portal Access</h4>
              <button onClick={() => navigate('/login')} className="footer-link">Admin Login</button>
              <button onClick={() => navigate('/member-portal/login')} className="footer-link">Member Login</button>
            </div>
            <div className="footer-section">
              <h4>Connect With Us</h4>
              <p className="footer-text"><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> | <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a><br/><a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a> | <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></p>
            </div>
          </div>
          <p className="footer-copyright">
            © 2025 Indian Pentecostal Church of God - Bethel Church, Naigaon East. All rights reserved. | Built with ❤️ for God's Glory
          </p>
          <p className="footer-developer">
            Developed and maintained by <a href="https://wa.me/919496792739" target="_blank" rel="noopener noreferrer">Jeremi Digital Labs</a>
          </p>
          </div>
      </footer>

      {/* Scroll to Top Button */}
      <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
        <span>↑</span>
      </button>

      {/* Event Details Modal */}
      {isModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>📅 Date & Time</h3>
                <p>{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                {selectedEvent.time && <p><strong>Time:</strong> {formatTo12Hour(selectedEvent.time)}</p>}
              </div>

              {selectedEvent.location && (
                <div className="modal-section">
                  <h3>📍 Location</h3>
                  <p>{selectedEvent.location}</p>
                </div>
              )}

              {selectedEvent.description && (
                <div className="modal-section">
                  <h3>📝 Description</h3>
                  <p>{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.zoomLink && (
                <div className="modal-section">
                  <h3>🎥 Join Online</h3>
                  <p>Zoom Meeting Available</p>
                  <button 
                    className="zoom-button"
                    onClick={() => {
                      if (selectedEvent.zoomLink.startsWith('http')) {
                        window.open(selectedEvent.zoomLink, '_blank');
                      } else {
                        window.location.href = selectedEvent.zoomLink;
                      }
                    }}
                  >
                    🔗 Join Zoom
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="modal-btn-close" onClick={() => setIsModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {isPhotoModalOpen && selectedPhoto && (
        <div className="photo-modal-overlay" onClick={() => setIsPhotoModalOpen(false)}>
          <div className="photo-modal-content" onClick={e => e.stopPropagation()}>
            <button className="photo-modal-close-btn" onClick={() => setIsPhotoModalOpen(false)}>✕</button>
            <div className="photo-modal-body">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title}
                className="photo-modal-image"
              />
              <div className="photo-modal-info">
                <h3>{selectedPhoto.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default HomePage;