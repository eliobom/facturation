import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { fetchUpcomingEvents } from '@/services/eventService';
import { EventCard } from '@/components/EventCard';
import { Event } from '@/types';
import { Calendar, Clock, Users, Award } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await fetchUpcomingEvents();
        setUpcomingEvents(events);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Mock stats for demo
  const stats = {
    trainingsAttended: 8,
    matchesPlayed: 3,
    teamRanking: 2
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name}</Text>
          <Text style={styles.role}>{user?.role === 'coach' ? 'Coach' : 'Student'}</Text>
        </View>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/6598/coffee-desk-laptop-notebook.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Clock size={20} color="#0B6E4F" />
          <Text style={styles.statValue}>{stats.trainingsAttended}</Text>
          <Text style={styles.statLabel}>Trainings</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={20} color="#FA7921" />
          <Text style={styles.statValue}>{stats.matchesPlayed}</Text>
          <Text style={styles.statLabel}>Matches</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={20} color="#475B63" />
          <Text style={styles.statValue}>#{stats.teamRanking}</Text>
          <Text style={styles.statLabel}>Ranking</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading events...</Text>
      ) : upcomingEvents.length > 0 ? (
        upcomingEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Calendar size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No upcoming events</Text>
        </View>
      )}

      {user?.role === 'coach' && (
        <View style={styles.coachSection}>
          <Text style={styles.sectionTitle}>Coach Tools</Text>
          <View style={styles.coachTools}>
            <TouchableOpacity style={styles.coachTool}>
              <Calendar size={24} color="#fff" />
              <Text style={styles.coachToolText}>Add Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.coachTool}>
              <Users size={24} color="#fff" />
              <Text style={styles.coachToolText}>Manage Team</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  role: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#0B6E4F',
    fontFamily: 'Inter-Medium',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    marginTop: 10,
    color: '#999',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  coachSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  coachTools: {
    flexDirection: 'row',
    marginTop: 12,
  },
  coachTool: {
    flex: 1,
    backgroundColor: '#0B6E4F',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  coachToolText: {
    color: '#fff',
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
});