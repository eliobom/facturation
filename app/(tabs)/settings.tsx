import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Bell, Globe, Shield, CircleHelp as HelpCircle, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [trainingReminders, setTrainingReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Bell size={20} color="#0B6E4F" />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingTitle}>Push Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#e0e0e0', true: '#0B6E4F50' }}
            thumbColor={notifications ? '#0B6E4F' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Match Alerts</Text>
            <Text style={styles.settingDescription}>Get notified about upcoming matches</Text>
          </View>
          <Switch
            value={matchAlerts}
            onValueChange={setMatchAlerts}
            disabled={!notifications}
            trackColor={{ false: '#e0e0e0', true: '#0B6E4F50' }}
            thumbColor={matchAlerts && notifications ? '#0B6E4F' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingTitle}>Training Reminders</Text>
            <Text style={styles.settingDescription}>Get reminders for scheduled trainings</Text>
          </View>
          <Switch
            value={trainingReminders}
            onValueChange={setTrainingReminders}
            disabled={!notifications}
            trackColor={{ false: '#e0e0e0', true: '#0B6E4F50' }}
            thumbColor={trainingReminders && notifications ? '#0B6E4F' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Globe size={20} color="#0B6E4F" />
          <Text style={styles.sectionTitle}>Appearance</Text>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingTitle}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#e0e0e0', true: '#0B6E4F50' }}
            thumbColor={darkMode ? '#0B6E4F' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.settingSelectItem}>
          <View>
            <Text style={styles.settingTitle}>Language</Text>
            <Text style={styles.settingDescription}>Set your preferred language</Text>
          </View>
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>{language}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Shield size={20} color="#0B6E4F" />
          <Text style={styles.sectionTitle}>Account & Security</Text>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingTitle}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingTitle}>Privacy Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingTitle}>Connected Accounts</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Info size={20} color="#0B6E4F" />
          <Text style={styles.sectionTitle}>About</Text>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingTitle}>App Version</Text>
          <Text style={styles.versionText}>1.0.0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingTitle}>Terms of Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingTitle}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <HelpCircle size={20} color="#0B6E4F" />
          <Text style={styles.sectionTitle}>Help & Support</Text>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingTitle}>Contact Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingTitle}>FAQs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingTitle}>Report a Bug</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTitle: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Inter-Medium',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  settingValue: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  settingValueText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter-Medium',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Inter-Regular',
  },
});