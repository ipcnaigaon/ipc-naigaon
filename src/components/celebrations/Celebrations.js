/**
 * Celebrations Modal Component
 * Full-screen popup displaying this week's birthdays, anniversaries, and church joining anniversaries
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMembers } from '../../redux/slices/memberSlice';
import { getAllMembers } from '../../services/memberService.firebase';
import BirthdayCard from '../members/BirthdayCard';
import AnniversaryCard from '../members/AnniversaryCard';
import './Celebrations.css';

const Celebrations = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.members);
  const [loading, setLoading] = useState(true);
  const [showNextWeek, setShowNextWeek] = useState(false);
  const [showBirthdayCard, setShowBirthdayCard] = useState(false);
  const [showAnniversaryCard, setShowAnniversaryCard] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      loadMembersData();
    }
  }, [isOpen]);

  const loadMembersData = async () => {
    try {
      setLoading(true);
      const membersData = await getAllMembers();
      dispatch(setMembers(membersData));
    } catch (error) {
      console.error('Error loading members data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current week range (Sunday to Saturday)
  const getWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromSunday = -dayOfWeek;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + daysFromSunday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  };

  // Get next week range (Sunday to Saturday)
  const getNextWeekRange = () => {
    const { startOfWeek, endOfWeek } = getWeekRange();
    const nextWeekStart = new Date(startOfWeek);
    nextWeekStart.setDate(startOfWeek.getDate() + 7);
    
    const nextWeekEnd = new Date(endOfWeek);
    nextWeekEnd.setDate(endOfWeek.getDate() + 7);
    
    return { startOfWeek: nextWeekStart, endOfWeek: nextWeekEnd };
  };

  // Check if a date (month/day only) falls within current week
  const isInCurrentWeek = (monthDay) => {
    if (!monthDay) return false;
    const { startOfWeek, endOfWeek } = getWeekRange();
    const dateObj = new Date(monthDay);
    const month = dateObj.getMonth();
    const day = dateObj.getDate();

    let checkDate = new Date(startOfWeek);
    while (checkDate <= endOfWeek) {
      if (checkDate.getMonth() === month && checkDate.getDate() === day) {
        return true;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
    return false;
  };

  // Check if a date (month/day only) falls within next week
  const isInNextWeek = (monthDay) => {
    if (!monthDay) return false;
    const { startOfWeek, endOfWeek } = getNextWeekRange();
    const dateObj = new Date(monthDay);
    const month = dateObj.getMonth();
    const day = dateObj.getDate();

    let checkDate = new Date(startOfWeek);
    while (checkDate <= endOfWeek) {
      if (checkDate.getMonth() === month && checkDate.getDate() === day) {
        return true;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
    return false;
  };

  // Get members celebrating birthdays this week
  const birthdayMembers = members.filter(
    (m) => m.dateOfBirth && isInCurrentWeek(m.dateOfBirth)
  );

  // Get members celebrating birthdays next week
  const nextWeekBirthdayMembers = members.filter(
    (m) => m.dateOfBirth && isInNextWeek(m.dateOfBirth)
  );

  // Get members celebrating anniversaries this week
  const anniversaryMembers = members.filter(
    (m) => m.marriageDate && isInCurrentWeek(m.marriageDate)
  );

  // Get members celebrating anniversaries next week
  const nextWeekAnniversaryMembers = members.filter(
    (m) => m.marriageDate && isInNextWeek(m.marriageDate)
  );

  // Get members celebrating church joining anniversaries this week
  const churchJoinAnniversaryMembers = members.filter(
    (m) => m.joinDate && isInCurrentWeek(m.joinDate)
  );

  // Combine and sort by date
  const weekCelebrations = [
    ...birthdayMembers.map((m) => ({
      ...m,
      type: 'birthday',
      celebrationDate: new Date(m.dateOfBirth),
      icon: '🎂',
      week: 'this',
    })),
    ...nextWeekBirthdayMembers.map((m) => ({
      ...m,
      type: 'birthday',
      celebrationDate: new Date(m.dateOfBirth),
      icon: '🎂',
      week: 'next',
    })),
    ...anniversaryMembers.map((m) => ({
      ...m,
      type: 'anniversary',
      celebrationDate: new Date(m.marriageDate),
      icon: '❤️',
      years: new Date().getFullYear() - new Date(m.marriageDate).getFullYear(),
      week: 'this',
    })),
    ...nextWeekAnniversaryMembers.map((m) => ({
      ...m,
      type: 'anniversary',
      celebrationDate: new Date(m.marriageDate),
      icon: '❤️',
      years: new Date().getFullYear() - new Date(m.marriageDate).getFullYear(),
      week: 'next',
    })),
    ...churchJoinAnniversaryMembers.map((m) => ({
      ...m,
      type: 'churchJoinAnniversary',
      celebrationDate: new Date(m.joinDate),
      icon: '⛪',
      years: new Date().getFullYear() - new Date(m.joinDate).getFullYear(),
      week: 'this',
    })),
  ].sort((a, b) => a.celebrationDate.getDate() - b.celebrationDate.getDate());

  // Get week range for display
  const { startOfWeek, endOfWeek } = getWeekRange();
  const weekRangeText = `${startOfWeek.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${endOfWeek.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;

  if (!isOpen) {
    return null;
  }

  if (loading) {
    return (
      <div className="celebrations-modal-overlay">
        <div className="celebrations-page loading">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="celebrations-modal-overlay" onClick={onClose}>
      <div className="celebrations-page" onClick={(e) => e.stopPropagation()}>
        <button className="celebrations-close-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
        
        <div className="celebrations-header">
        <div className="celebrations-title-wrapper">
          <h1 className="celebrations-title">🎉 This Week's Celebrations</h1>
          <p className="celebrations-subtitle">Celebrating life's special moments together</p>
          <p className="celebrations-week-range">{weekRangeText}</p>
        </div>
        {(nextWeekBirthdayMembers.length > 0 || nextWeekAnniversaryMembers.length > 0) && (
          <button 
            className="toggle-next-week-btn"
            onClick={() => setShowNextWeek(!showNextWeek)}
          >
            {showNextWeek ? '👁️ Hide' : '👀 Show'} Next Week
          </button>
        )}
      </div>

      <div className="celebrations-content">
        {weekCelebrations.length === 0 ? (
          <div className="no-celebrations">
            <div className="no-celebrations-icon">🎈</div>
            <h2>No Celebrations This Week</h2>
            <p>Check back next week to see who's celebrating!</p>
          </div>
        ) : (
          <>
            {/* Birthday Section */}
            {(birthdayMembers.length > 0 || nextWeekBirthdayMembers.length > 0) && (
              <div className="celebration-category">
                <h2 className="category-title">
                  <span className="category-icon">🎂</span>
                  Birthdays ({showNextWeek ? birthdayMembers.length + nextWeekBirthdayMembers.length : birthdayMembers.length})
                </h2>
                
                {/* This Week's Birthdays */}
                {birthdayMembers.length > 0 && (
                  <>
                    <h3 className="week-subtitle">This Week</h3>
                    <div className="celebrations-grid">
                      {weekCelebrations
                        .filter((c) => c.type === 'birthday' && c.week === 'this')
                        .map((member) => (
                          <div
                            key={`${member.id}-${member.type}-this`}
                            className="celebration-card birthday"
                          >
                            <div className="celebration-display">
                              <div className="celebration-icon">{member.icon}</div>
                            </div>
                            <div className="celebration-info">
                              <h4>{member.name}</h4>
                              <p className="celebration-type">Birthday</p>
                              <p className="celebration-date">
                                {new Date(member.dateOfBirth).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="celebration-wish">
                              🎈 Happy Birthday!
                            </div>
                            <button
                              className="celebration-whatsapp-btn"
                              onClick={() => {
                                setSelectedMember(member);
                                setShowBirthdayCard(true);
                              }}
                              title="Send Birthday Wishes"
                            >
                                📤
                            </button>
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {/* Next Week's Birthdays */}
                {showNextWeek && nextWeekBirthdayMembers.length > 0 && (
                  <>
                    <h3 className="week-subtitle">Next Week</h3>
                    <div className="celebrations-grid">
                      {weekCelebrations
                        .filter((c) => c.type === 'birthday' && c.week === 'next')
                        .map((member) => (
                          <div
                            key={`${member.id}-${member.type}-next`}
                            className="celebration-card birthday"
                          >
                            <div className="celebration-display">
                              <div className="celebration-icon">{member.icon}</div>
                            </div>
                            <div className="celebration-info">
                              <h4>{member.name}</h4>
                              <p className="celebration-type">Birthday</p>
                              <p className="celebration-date">
                                {new Date(member.dateOfBirth).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="celebration-wish">
                              🎈 Happy Birthday!
                            </div>
                            <button
                              className="celebration-whatsapp-btn"
                              onClick={() => {
                                setSelectedMember(member);
                                setShowBirthdayCard(true);
                              }}
                              title="Send Birthday Wishes"
                            >
                              📤
                            </button>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Anniversary Section */}
            {(anniversaryMembers.length > 0 || nextWeekAnniversaryMembers.length > 0) && (
              <div className="celebration-category">
                <h2 className="category-title">
                  <span className="category-icon">❤️</span>
                  Wedding Anniversaries ({showNextWeek ? anniversaryMembers.length + nextWeekAnniversaryMembers.length : anniversaryMembers.length})
                </h2>
                
                {/* This Week's Anniversaries */}
                {anniversaryMembers.length > 0 && (
                  <>
                    <h3 className="week-subtitle">This Week</h3>
                    <div className="celebrations-grid">
                      {weekCelebrations
                        .filter((c) => c.type === 'anniversary' && c.week === 'this')
                        .map((member) => (
                          <div
                            key={`${member.id}-${member.type}-this`}
                            className="celebration-card anniversary"
                          >
                            <div className="celebration-display">
                              <div className="celebration-icon">{member.icon}</div>
                              <div className="anniversary-badge">
                                <span className="years-number">{member.years}</span>
                                <span className="years-text">years</span>
                              </div>
                            </div>
                            <div className="celebration-info">
                              <h4>{member.name}</h4>
                              <p className="celebration-type">Wedding Anniversary</p>
                              <p className="celebration-date">
                                {new Date(member.marriageDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="celebration-wish">
                              💕 Happy Anniversary!
                            </div>
                            <button
                              className="celebration-whatsapp-btn"
                              onClick={() => {
                                setSelectedMember(member);
                                setShowAnniversaryCard(true);
                              }}
                              title="Send Anniversary Wishes"
                            >
                                📤
                            </button>
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {/* Next Week's Anniversaries */}
                {showNextWeek && nextWeekAnniversaryMembers.length > 0 && (
                  <>
                    <h3 className="week-subtitle">Next Week</h3>
                    <div className="celebrations-grid">
                      {weekCelebrations
                        .filter((c) => c.type === 'anniversary' && c.week === 'next')
                        .map((member) => (
                          <div
                            key={`${member.id}-${member.type}-next`}
                            className="celebration-card anniversary"
                          >
                            <div className="celebration-display">
                              <div className="celebration-icon">{member.icon}</div>
                              <div className="anniversary-badge">
                                <span className="years-number">{member.years}</span>
                                <span className="years-text">years</span>
                              </div>
                            </div>
                            <div className="celebration-info">
                              <h4>{member.name}</h4>
                              <p className="celebration-type">Wedding Anniversary</p>
                              <p className="celebration-date">
                                {new Date(member.marriageDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="celebration-wish">
                              💕 Happy Anniversary!
                            </div>
                            <button
                              className="celebration-whatsapp-btn"
                              onClick={() => {
                                setSelectedMember(member);
                                setShowAnniversaryCard(true);
                              }}
                              title="Send Anniversary Wishes"
                            >
                              📤
                            </button>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Church Joining Anniversary Section */}
            {churchJoinAnniversaryMembers.length > 0 && (
              <div className="celebration-category">
                <h2 className="category-title">
                  <span className="category-icon">⛪</span>
                  Church Joining Anniversaries ({churchJoinAnniversaryMembers.length})
                </h2>
                <div className="celebrations-grid">
                  {weekCelebrations
                    .filter((c) => c.type === 'churchJoinAnniversary')
                    .map((member) => (
                      <div
                        key={`${member.id}-${member.type}`}
                        className="celebration-card churchJoinAnniversary"
                      >
                        <div className="celebration-display">
                          <div className="celebration-icon">{member.icon}</div>
                          <div className="anniversary-badge">
                            <span className="years-number">{member.years}</span>
                            <span className="years-text">years</span>
                          </div>
                        </div>
                        <div className="celebration-info">
                          <h4>{member.name}</h4>
                          <p className="celebration-type">Church Joining</p>
                          <p className="celebration-date">
                            {new Date(member.joinDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="celebration-wish">
                          🙏 Blessed Anniversary!
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </div>

      {showBirthdayCard && selectedMember && (
        <BirthdayCard
          member={selectedMember}
          onClose={() => {
            setShowBirthdayCard(false);
            setSelectedMember(null);
          }}
        />
      )}

      {showAnniversaryCard && selectedMember && (
        <AnniversaryCard
          member={selectedMember}
          onClose={() => {
            setShowAnniversaryCard(false);
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
};

export default Celebrations;
