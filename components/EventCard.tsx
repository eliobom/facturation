import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Event } from '@/types';
import { MapPin, Clock, Calendar, Users, CreditCard as Edit, Trash } from 'lucide-react-native';
import { EditEventModal } from './EditEventModal';

type EventCardProps = {
  event: Event;
  isEditable?: boolean;
  onEdit?: (updatedEvent: Event) => void;
};

export function EventCard({ event, isEditable = false, onEdit }: EventCardProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleEdit = (updatedEvent: Event) => {
    if (onEdit) {
      onEdit(updatedEvent);
    }
    setModalVisible(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[
      styles.container,
      event.type === 'match' ? styles.matchContainer : {}
    ]}>
      <View style={styles.header}>
        <View style={[
          styles.badge,
          event.type === 'match' ? styles.matchBadge : styles.trainingBadge
        ]}>
          <Text style={styles.badgeText}>{event.type === 'match' ? 'Match' : 'Training'}</Text>
        </View>
        
        {isEditable && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setModalVisible(true)}
            >
              <Edit size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Trash size={16} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.title}>{event.title}</Text>
      
      {event.description && (
        <Text style={styles.description}>{event.description}</Text>
      )}

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Calendar size={16} color="#666" />
          <Text style={styles.detailText}>{formatDate(event.startTime)}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Clock size={16} color="#666" />
          <Text style={styles.detailText}>
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </Text>
        </View>
        
        <View style={styles.detailItem}>
          <MapPin size={16} color="#666" />
          <Text style={styles.detailText}>{event.location}</Text>
        </View>

        {event.team && (
          <View style={styles.detailItem}>
            <Users size={16} color="#666" />
            <Text style={styles.detailText}>{event.team}</Text>
          </View>
        )}
      </View>

      {isEditable && (
        <EditEventModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleEdit}
          event={event}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#0B6E4F',
  },
  matchContainer: {
    borderLeftColor: '#FA7921',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trainingBadge: {
    backgroundColor: '#0B6E4F20',
  },
  matchBadge: {
    backgroundColor: '#FA792120',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
});