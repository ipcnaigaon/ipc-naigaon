/**
 * Dashboard Overview Component
 * Main dashboard with key metrics and charts
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMembers } from '../../redux/slices/memberSlice';
import { setEvents } from '../../redux/slices/eventSlice';
import { setDonations } from '../../redux/slices/donationSlice';
import { openCelebrationsModal } from '../../redux/slices/uiSlice';
import { getAllMembers } from '../../services/memberService.firebase';
import { getAllEvents } from '../../services/eventService.firebase';
import { getAllDonations } from '../../services/donationService.firebase';
import StatsCard from './StatsCard';
import DonationChart from './DonationChart';
import MemberGrowthChart from './MemberGrowthChart';
import RecentActivity from './RecentActivity';
import UpcomingEvents from './UpcomingEvents';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.members);
  const { events } = useSelector((state) => state.events);
  const { donations, totalAmount, monthlyTotal } = useSelector((state) => state.donations);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  // Check if user is event manager or resource manager
  const isEventOrResourceManager = user?.role === 'events_manager' || user?.role === 'resource_manager';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [membersData, eventsData, donationsData] = await Promise.all([
        getAllMembers(),
        getAllEvents(),
        getAllDonations(),
      ]);

      dispatch(setMembers(membersData));
      dispatch(setEvents(eventsData));
      dispatch(setDonations(donationsData));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate upcoming events
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Calculate stats
  const activeMembers = members.filter((m) => m.status === 'active').length;
  const recentDonations = donations.slice(0, 5);

  if (loading) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome back! Here's what's happening today. | Pastor: Pr. Jobin Alisha</p>
          </div>
          <button 
            className="celebrations-btn"
            onClick={() => dispatch(openCelebrationsModal())}
            title="View This Week's Celebrations"
          >
            🎉 This Week's Celebrations
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Members"
          value={members.length}
          subtitle={`${activeMembers} active`}
          icon="👥"
          color="#667eea"
        />
        <StatsCard
          title="Upcoming Events"
          value={upcomingEvents.length}
          subtitle="This month"
          icon="📅"
          color="#48bb78"
        />
        {!isEventOrResourceManager && (
          <StatsCard
            title="Total Donations"
            value={`₹${totalAmount.toLocaleString()}`}
            subtitle={`₹${monthlyTotal.toLocaleString()} this month`}
            icon="💰"
            color="#ed8936"
          />
        )}
        <StatsCard
          title="Recent Activities"
          value={isEventOrResourceManager ? events.length : donations.length + events.length}
          subtitle="All time"
          icon="📊"
          color="#9f7aea"
        />
      </div>

      {/* Charts Section */}
      {!isEventOrResourceManager && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Donation Trends</h3>
            <DonationChart donations={donations} />
          </div>
          <div className="chart-card">
            <h3>Member Growth</h3>
            <MemberGrowthChart members={members} />
          </div>
        </div>
      )}

      {isEventOrResourceManager && (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Member Growth</h3>
            <MemberGrowthChart members={members} />
          </div>
        </div>
      )}

      {/* Activity and Events */}
      <div className="activity-grid">
        <div className="activity-card">
          <h3>Recent Activity</h3>
          <RecentActivity donations={recentDonations} events={events} />
        </div>
        <div className="activity-card">
          <h3>Upcoming Events</h3>
          <UpcomingEvents events={upcomingEvents} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
