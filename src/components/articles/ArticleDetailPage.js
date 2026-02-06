/**
 * Article Detail Page Component
 * Displays full article content in a paper-style layout
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById } from '../../services/articlesService.firebase';
import './ArticleDetailPage.css';

// Mock articles for reference
const MOCK_ARTICLES = [
  {
    id: 'mock-1',
    title: 'The Power of Daily Prayer',
    excerpt: 'Discover how establishing a daily prayer routine can transform your spiritual life and deepen your connection with God.',
    description: 'Prayer is the foundation of our faith. Learn practical tips for maintaining a meaningful prayer practice that brings you closer to God\'s love and purpose.',
    content: `Prayer is one of the most powerful tools available to us as believers. It\'s a direct line to God, a way to communicate our deepest concerns, gratitude, and desires. Yet many of us struggle to maintain a consistent prayer practice.

Why is daily prayer so important? In the Bible, we see countless examples of people who maintained faithful prayer habits. Jesus himself rose early to pray. Through prayer, we:

• Connect with God on a personal level
• Find peace and clarity in difficult times
• Express gratitude for blessings
• Intercede for others
• Strengthen our faith and trust in God

Starting a daily prayer routine doesn't need to be complicated. Here are some practical steps:

1. Choose a consistent time - Morning, evening, or both work well
2. Find a quiet space - Minimize distractions
3. Start simple - Begin with 5-10 minutes
4. Use a journal - Write down your prayers and God's responses
5. Include Scripture - Read and meditate on God's Word
6. Be authentic - Pray from your heart, not from a script

Remember, prayer is not about perfect words or lengthy conversations. God wants to hear from your heart. Start today, and experience the transformation that comes from daily communion with the Almighty.`,
    category: 'Prayer',
    author: 'Pastor Johnson George',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    link: '#',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Finding Faith in Times of Uncertainty',
    excerpt: 'When life feels overwhelming, how can we maintain our faith and trust in God\'s plan? Explore biblical wisdom and practical guidance.',
    description: 'Faith is not about having all the answers. It\'s about trusting God even when we don\'t understand the journey. Discover how to strengthen your faith during challenging times.',
    content: `Uncertainty is a natural part of life. We face job losses, health challenges, relationship struggles, and countless unknowns. In these moments, our faith is tested. But it\'s precisely in these times that faith becomes most powerful.

What does it mean to have faith during uncertainty? Faith is not the absence of doubt or fear. Rather, it\'s choosing to trust God even when circumstances seem overwhelming. The Bible tells us, "Now faith is confidence in what we hope for and assurance about what we do not see." (Hebrews 11:1)

Throughout Scripture, we see heroes of faith who faced incredible uncertainty:

• Abraham left everything for a land he hadn't seen
• Noah built an ark when it had never rained
• Mary accepted her role as Jesus' mother despite the confusion and scandal
• The disciples followed Jesus without knowing where it would lead

What can we learn from their example?

Trust in God's Character: God is faithful, loving, and sovereign. Even when we can't see His plan, we can trust His character.

Lean on Community: Share your struggles with others. The church is called to bear one another's burdens.

Study Scripture: God's Word offers comfort, wisdom, and examples of faith during difficult times.

Practice Surrender: Let go of the need to control everything. Release your worries to God.

Take Action: Faith without works is dead. Do what you can while trusting God for what you can't.

Remember, faith is not blind optimism. It's grounded in who God is and what He has done. As you face uncertainty, trust that God is working for your good, even when you can't see it.`,
    category: 'Faith',
    author: 'Pastor Johnson George',
    imageUrl: '/placeholder-article.jpg',
    link: '#',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Living a Life of Gratitude',
    excerpt: 'Gratitude is a powerful spiritual practice that transforms our perspective. Learn how thanksgiving can deepen your faith journey.',
    description: 'A grateful heart opens doors to blessings we often overlook. Explore how to cultivate gratitude in your daily life and experience the peace that comes from appreciating God\'s goodness.',
    content: `Gratitude is often overlooked as a spiritual practice, yet it has the power to transform our lives completely. When we cultivate a grateful heart, we shift our focus from what\'s wrong to what\'s right, from what we lack to what we have been blessed with.

In 1 Thessalonians 5:16-18, Paul writes: "Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you."

Notice that Paul doesn't say give thanks for all circumstances, but in all circumstances. There\'s a difference. We don't have to be grateful for difficulties, but we can find things to be grateful for even in difficult times.

The Power of Gratitude:

Shifts Our Perspective: Gratitude helps us see blessings we might otherwise miss.

Increases Joy: A grateful heart naturally experiences more joy and contentment.

Strengthens Relationships: When we express gratitude to others, we deepen our connections.

Improves Mental Health: Research shows that gratitude reduces stress, anxiety, and depression.

Draws Us Closer to God: Gratitude is a form of worship, acknowledging God\'s goodness.

How to Cultivate Gratitude:

1. Start a Gratitude Journal: Each day, write down 3-5 things you\'re grateful for, no matter how small.

2. Practice Gratitude Prayer: Before meals and at bedtime, thank God specifically for His blessings.

3. Express Thanks to Others: Tell people how much they mean to you and how they\'ve impacted your life.

4. Notice the Small Things: A warm cup of coffee, a friend\'s smile, a beautiful sunset—these all deserve gratitude.

5. Reframe Challenges: Even difficulties can teach us valuable lessons and build our character.

6. Share Your Blessings: When we share what we have, we acknowledge that everything is a gift from God.

As you go through your day, I challenge you to pause and count your blessings. No matter what you\'re facing, there\'s always something to be grateful for. A grateful heart is a peaceful heart, and a peaceful heart is a powerful testimony to God\'s goodness.`,
    category: 'Faith',
    author: 'Pastor Johnson George',
    imageUrl: '/placeholder-article.jpg',
    link: '#',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-4',
    title: 'The Holy Spirit: Our Helper and Guide',
    excerpt: 'Understanding the role and power of the Holy Spirit in our daily lives and spiritual journey.',
    description: 'The Holy Spirit is God\'s presence with us, empowering believers to live victoriously. Discover how to walk in the Spirit and experience His gifts, fruit, and guidance in your life.',
    content: `The Holy Spirit is one of the most profound gifts God has given to believers. Yet many Christians struggle to understand who the Holy Spirit is and how to experience His power in daily life.

Who is the Holy Spirit? The Holy Spirit is the third person of the Trinity—fully God, co-equal with the Father and the Son. Jesus promised to send the Holy Spirit as our Helper, Comforter, and Guide after His ascension to heaven.

In John 14:16-17, Jesus says: "And I will ask the Father, and he will give you another Helper, to be with you forever, even the Spirit of truth, whom the world cannot receive, because it neither sees him nor knows him. You know him, for he dwells with you and will be in you."

The Roles of the Holy Spirit:

• Convicts of Sin: The Holy Spirit reveals areas in our lives that need transformation.
• Guides into Truth: He illuminates Scripture and leads us into all truth.
• Empowers for Service: The Holy Spirit equips believers with spiritual gifts for ministry.
• Produces Fruit: He cultivates godly character in us—love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.
• Intercedes in Prayer: When we don't know how to pray, the Spirit intercedes for us.
• Gives Boldness: He empowers us to witness and share the Gospel.

Walking in the Spirit:

Be Filled Daily: Ephesians 5:18 commands us to "be filled with the Spirit." This isn't a one-time event but a continuous experience.

Yield Control: Surrender your plans, desires, and will to God's direction.

Listen and Obey: Develop sensitivity to the Spirit's leading through prayer and meditation on Scripture.

Avoid Grieving the Spirit: Sin, bitterness, and unbelief grieve the Holy Spirit. Maintain a life of repentance and holiness.

Seek His Gifts: The Holy Spirit distributes spiritual gifts for the building up of the church. Ask God to use you.

The Promise of Power: In Acts 1:8, Jesus promised, "But you will receive power when the Holy Spirit has come upon you." This same power that raised Christ from the dead is available to you today.

As you go about your day, remember that you are not alone. The Holy Spirit dwells within you, ready to guide, strengthen, and empower you for every challenge you face. Invite Him to fill you afresh each day and watch how He transforms your life.`,
    category: 'Doctrine',
    author: 'Pastor Johnson George',
    imageUrl: 'https://picsum.photos/800/400?random=4',
    link: '#',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBackClick = () => {
    // Navigate to home and scroll to resources section
    navigate('/', { state: { scrollToResources: true } });
  };

  useEffect(() => {
    const loadArticle = async () => {
      try {
        // Try to fetch from Firebase first
        let foundArticle = await getArticleById(id);
        
        // If not found, check mock articles
        if (!foundArticle) {
          foundArticle = MOCK_ARTICLES.find(a => a.id === id);
        }
        
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading article:', error);
        // Try mock articles as fallback
        const foundArticle = MOCK_ARTICLES.find(a => a.id === id);
        if (foundArticle) {
          setArticle(foundArticle);
        } else {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, navigate]);

  if (loading) {
    return <div className="article-detail-loading">Loading article...</div>;
  }

  if (!article) {
    return null;
  }

  return (
    <div className="article-detail-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Articles
      </button>

      <article className="article-paper">
        <div className="article-paper-header">
          {article.imageUrl && (
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="article-paper-image"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          
          <div className="article-paper-title-section">
            <h1 className="article-paper-title">{article.title}</h1>
            
            <div className="article-paper-meta">
              <div className="meta-group">
                <span className="category-badge">{article.category || 'General'}</span>
              </div>
              <div className="meta-group">
                <span className="author">By {article.author || 'Unknown'}</span>
                <span className="separator">•</span>
                <span className="date">
                  {new Date(article.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="article-paper-content">
          {article.content ? (
            article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="article-paragraph">{article.description}</p>
          )}
        </div>

        <div className="article-paper-footer">
          <div className="footer-divider"></div>
          <p className="footer-text">
            Share this article with your church community to inspire and encourage others in their faith journey.
          </p>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
