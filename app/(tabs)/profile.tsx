import { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, Award, Calendar, Clock, Star, CreditCard as Edit2 } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stats');

  const attendance = {
    trainings: { total: 42, attended: 36 },
    matches: { total: 12, attended: 10 }
  };

  const skills = [
    { name: 'Speed', level: 4 },
    { name: 'Passing', level: 3 },
    { name: 'Shooting', level: 5 },
    { name: 'Dribbling', level: 4 },
    { name: 'Defense', level: 3 }
  ];

  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        fill={i < count ? '#FA7921' : 'none'} 
        color={i < count ? '#FA7921' : '#ccc'} 
      />
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/6598/coffee-desk-laptop-notebook.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }}
            style={styles.profileImage}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileRole}>{user?.role === 'coach' ? 'Coach' : 'Student'}</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>
                {user?.role === 'coach' ? 'Senior Coach' : 'Team A'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Edit2 size={18} color="#0B6E4F" />
        </TouchableOpacity>
      </View>

      <View style={styles.contactInfo}>
        <View style={styles.contactItem}>
          <Mail size={16} color="#666" />
          <Text style={styles.contactText}>{user?.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Phone size={16} color="#666" />
          <Text style={styles.contactText}>+1 234 567 8900</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            Stats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'skills' && styles.activeTab]}
          onPress={() => setActiveTab('skills')}
        >
          <Text style={[styles.tabText, activeTab === 'skills' && styles.activeTabText]}>
            Skills
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'stats' && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Calendar size={18} color="#0B6E4F" />
              <Text style={styles.statTitle}>Training Attendance</Text>
            </View>
            <View style={styles.statContent}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(attendance.trainings.attended / attendance.trainings.total) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.statValue}>
                {attendance.trainings.attended}/{attendance.trainings.total} sessions
              </Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Award size={18} color="#FA7921" />
              <Text style={styles.statTitle}>Match Participation</Text>
            </View>
            <View style={styles.statContent}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${(attendance.matches.attended / attendance.matches.total) * 100}%`,
                      backgroundColor: '#FA7921' 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.statValue}>
                {attendance.matches.attended}/{attendance.matches.total} matches
              </Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Clock size={18} color="#475B63" />
              <Text style={styles.statTitle}>Hours Played</Text>
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statLargeValue, { color: '#475B63' }]}>64</Text>
              <Text style={styles.statUnit}>hours</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'skills' && (
        <View style={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <View style={styles.skillStars}>
                {renderStars(skill.level)}
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === 'history' && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyEmptyText}>No history available yet</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          signOut();
          router.replace('/login');
        }}
      >
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ddd',
  },
  profileDetails: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  profileRole: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
  },
  profileBadge: {
    backgroundColor: '#0B6E4F20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    fontSize: 12,
    color: '#0B6E4F',
    fontFamily: 'Inter-Medium',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#0B6E4F',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: '#fff',
  },
  statsContainer: {
    paddingHorizontal: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter-Medium',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: 15,
  },
  progressFill: {
    height: 8,
    backgroundColor: '#0B6E4F',
    borderRadius: 4,
  },
  statValue: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
    width: 100,
    textAlign: 'right',
  },
  statLargeValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#0B6E4F',
  },
  statUnit: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter-Regular',
    marginLeft: 5,
  },
  skillsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  skillName: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Medium',
  },
  skillStars: {
    flexDirection: 'row',
  },
  historyContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyEmptyText: {
    color: '#999',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});