/**
 * Members List Component
 * Display and manage church members
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMembers, deleteMember, setSearchTerm, setFilters, updateMember } from '../../redux/slices/memberSlice';
import { 
  getAllMembers, 
  deleteMember as deleteMemberService,
  generateMemberCredentials,
  resetMemberCredentials,
  revokeMemberAccess
} from '../../services/memberService.firebase';
import MemberModal from './MemberModal';
import CredentialsModal from './CredentialsModal';
import BirthdayCard from './BirthdayCard';
import AnniversaryCard from './AnniversaryCard';
import './Members.css';

const Members = () => {
  const dispatch = useDispatch();
  const { filteredMembers, searchTerm, filters } = useSelector((state) => state.members);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [showBirthdayCard, setShowBirthdayCard] = useState(false);
  const [showAnniversaryCard, setShowAnniversaryCard] = useState(false);
  const [cardMember, setCardMember] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await getAllMembers();
      dispatch(setMembers(data));
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setShowModal(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMemberService(id);
        dispatch(deleteMember(id));
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value }));
  };

  const handleGenerateCredentials = async (member) => {
    try {
      const updatedMember = await generateMemberCredentials(member.id);
      dispatch(updateMember(updatedMember));
      setCredentials({
        ...updatedMember.credentials,
        phone: updatedMember.phone,
        name: updatedMember.name || `${updatedMember.firstName || ''} ${updatedMember.lastName || ''}`.trim(),
        email: updatedMember.email,
      });
      setShowCredentials(true);
      alert('✅ Credentials generated! Email notification sent to member.');
    } catch (error) {
      alert('Failed to generate credentials: ' + error.message);
    }
  };

  const handleResetCredentials = async (member) => {
    if (window.confirm('Are you sure you want to reset this member\'s password?')) {
      try {
        const updatedMember = await resetMemberCredentials(member.id);
        dispatch(updateMember(updatedMember));
        setCredentials({
          ...updatedMember.credentials,
          phone: updatedMember.phone,
          name: updatedMember.name || `${updatedMember.firstName || ''} ${updatedMember.lastName || ''}`.trim(),
          email: updatedMember.email,
        });
        setShowCredentials(true);
        alert('✅ Password reset! Email notification sent to member.');
      } catch (error) {
        alert('Failed to reset credentials: ' + error.message);
      }
    }
  };

  const handleRevokeAccess = async (member) => {
    if (window.confirm('Are you sure you want to revoke portal access for this member?')) {
      try {
        const updatedMember = await revokeMemberAccess(member.id);
        dispatch(updateMember(updatedMember));
        alert('✅ Portal access revoked.');
      } catch (error) {
        alert('Failed to revoke access: ' + error.message);
      }
    }
  };

  const handleViewCredentials = (member) => {
    if (member.credentials) {
      setCredentials({
        ...member.credentials,
        phone: member.phone,
        name: member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim(),
        email: member.email,
      });
      setShowCredentials(true);
    }
  };

  if (loading) {
    return <div className="loading">Loading members...</div>;
  }

  return (
    <div className="members-container">
      <div className="members-header">
        <h2>Members Management</h2>
        <button onClick={handleAddMember} className="members-btn-primary">
          ➕ Add Member
        </button>
      </div>

      <div className="members-filters">
        <input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={filters.membershipType}
          onChange={(e) => handleFilterChange('membershipType', e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="Regular">Regular</option>
          <option value="Youth">Youth</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      <div className="members-table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Type</th>
              <th>Date of Birth</th>
              <th>Portal Access</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              (() => {
                const today = new Date();
                const dayOfWeek = today.getDay();
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - dayOfWeek);
                startOfWeek.setHours(0, 0, 0, 0);
                
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                
                const startOfNextWeek = new Date(startOfWeek);
                startOfNextWeek.setDate(startOfWeek.getDate() + 7);
                
                const endOfNextWeek = new Date(endOfWeek);
                endOfNextWeek.setDate(endOfWeek.getDate() + 7);
                
                // Helper function to check birthday type
                const getBirthdayType = (member) => {
                  const dob = member.dateOfBirth ? new Date(member.dateOfBirth) : null;
                  if (!dob) return 0;
                  
                  // Check if birthday is today
                  if (today.getMonth() === dob.getMonth() && today.getDate() === dob.getDate()) {
                    return 3; // Today
                  }
                  
                  // Check if birthday falls in current week
                  let checkDate = new Date(startOfWeek);
                  while (checkDate <= endOfWeek) {
                    if (checkDate.getMonth() === dob.getMonth() && checkDate.getDate() === dob.getDate()) {
                      return 2; // This week
                    }
                    checkDate.setDate(checkDate.getDate() + 1);
                  }
                  
                  // Check if birthday falls in next week
                  checkDate = new Date(startOfNextWeek);
                  while (checkDate <= endOfNextWeek) {
                    if (checkDate.getMonth() === dob.getMonth() && checkDate.getDate() === dob.getDate()) {
                      return 1; // Next week
                    }
                    checkDate.setDate(checkDate.getDate() + 1);
                  }
                  
                  return 0; // No upcoming birthday
                };
                
                // Sort members by birthday priority
                const sortedMembers = [...filteredMembers].sort((a, b) => {
                  return getBirthdayType(b) - getBirthdayType(a);
                });
                
                return sortedMembers.map((member) => {
                const dob = member.dateOfBirth ? new Date(member.dateOfBirth) : null;
                
                // Check if birthday is today
                const isBirthday = dob && 
                  today.getMonth() === dob.getMonth() && 
                  today.getDate() === dob.getDate();
                
                // Check if birthday falls in current week or next week
                const isInCurrentWeek = dob && !isBirthday && (() => {
                  let checkDate = new Date(startOfWeek);
                  while (checkDate <= endOfWeek) {
                    if (checkDate.getMonth() === dob.getMonth() && checkDate.getDate() === dob.getDate()) {
                      return true;
                    }
                    checkDate.setDate(checkDate.getDate() + 1);
                  }
                  return false;
                })();
                
                const isInNextWeek = dob && !isBirthday && (() => {
                  let checkDate = new Date(startOfNextWeek);
                  while (checkDate <= endOfNextWeek) {
                    if (checkDate.getMonth() === dob.getMonth() && checkDate.getDate() === dob.getDate()) {
                      return true;
                    }
                    checkDate.setDate(checkDate.getDate() + 1);
                  }
                  return false;
                })();

                // Check for anniversary
                const marriageDate = member.marriageDate ? new Date(member.marriageDate) : null;
                const isAnniversary = marriageDate && 
                  today.getMonth() === marriageDate.getMonth() && 
                  today.getDate() === marriageDate.getDate();
                
                const isAnniversaryInCurrentWeek = marriageDate && !isAnniversary && (() => {
                  let checkDate = new Date(startOfWeek);
                  while (checkDate <= endOfWeek) {
                    if (checkDate.getMonth() === marriageDate.getMonth() && checkDate.getDate() === marriageDate.getDate()) {
                      return true;
                    }
                    checkDate.setDate(checkDate.getDate() + 1);
                  }
                  return false;
                })();
                
                const isAnniversaryInNextWeek = marriageDate && !isAnniversary && (() => {
                  let checkDate = new Date(startOfNextWeek);
                  while (checkDate <= endOfNextWeek) {
                    if (checkDate.getMonth() === marriageDate.getMonth() && checkDate.getDate() === marriageDate.getDate()) {
                      return true;
                    }
                    checkDate.setDate(checkDate.getDate() + 1);
                  }
                  return false;
                })();
                
                const rowClass = isBirthday ? 'birthday-row' : 
                                isInCurrentWeek ? 'birthday-this-week' : 
                                isInNextWeek ? 'birthday-next-week' : '';
                
                return (
                <tr key={member.id} className={rowClass}>
                  <td>{member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim()}</td>
                  <td>{member.phone}</td>
                  <td>
                    <span className={`members-status-badge ${member.status.toLowerCase()}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>{member.membershipType}</td>
                  <td>
                    {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : '-'}
                    {isBirthday && <span className="birthday-indicator"> 🎂</span>}
                    {isInCurrentWeek && <span className="birthday-indicator"> 🎉</span>}
                    {isInNextWeek && <span className="birthday-indicator" style={{opacity: 0.6}}> 🎈</span>}
                  </td>
                  <td>
                    {member.hasPortalAccess ? (
                      <>
                        <span className="members-portal-access-yes">✓ Yes</span>
                        <button 
                          onClick={() => handleViewCredentials(member)}
                          className="members-btn-icon"
                          title="View Credentials"
                        >
                          🔑
                        </button>
                        <button 
                          onClick={() => handleResetCredentials(member)}
                          className="members-btn-icon"
                          title="Reset Password"
                        >
                          🔄
                        </button>
                        <button 
                          onClick={() => handleRevokeAccess(member)}
                          className="members-btn-icon members-btn-danger"
                          title="Revoke Access"
                        >
                          🚫
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="members-portal-access-no">✗ No</span>
                        <button 
                          onClick={() => handleGenerateCredentials(member)}
                          className="members-btn-icon members-btn-success"
                          title="Generate Credentials"
                        >
                          ➕
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    {(isBirthday || isInCurrentWeek || isInNextWeek) && (
                      <button
                        onClick={() => {
                          setCardMember(member);
                          setShowBirthdayCard(true);
                        }}
                        className="members-btn-action members-btn-whatsapp"
                        title="Send Birthday Wishes"
                      >
                        🎂 Birthday
                      </button>
                    )}
                    {(isAnniversary || isAnniversaryInCurrentWeek || isAnniversaryInNextWeek) && (
                      <button
                        onClick={() => {
                          setCardMember(member);
                          setShowAnniversaryCard(true);
                        }}
                        className="members-btn-action members-btn-whatsapp members-btn-anniversary"
                        title="Send Anniversary Wishes"
                      >
                        💕 Anniversary
                      </button>
                    )}
                    <button
                      onClick={() => handleEditMember(member)}
                      className="members-btn-action members-btn-edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="members-btn-action members-btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
                );
              });
              })()
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <MemberModal
          member={selectedMember}
          onClose={() => setShowModal(false)}
          onRefresh={loadMembers}
        />
      )}

      {showCredentials && credentials && (
        <CredentialsModal
          credentials={credentials}
          onClose={() => {
            setShowCredentials(false);
            setCredentials(null);
          }}
        />
      )}

      {showBirthdayCard && cardMember && (
        <BirthdayCard
          member={cardMember}
          onClose={() => {
            setShowBirthdayCard(false);
            setCardMember(null);
          }}
        />
      )}

      {showAnniversaryCard && cardMember && (
        <AnniversaryCard
          member={cardMember}
          onClose={() => {
            setShowAnniversaryCard(false);
            setCardMember(null);
          }}
        />
      )}
    </div>
  );
};

export default Members;
