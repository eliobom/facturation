import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { fetchEvents } from '@/services/eventService';
import { EventCard } from '@/components/EventCard';
import { AddEventModal } from '@/components/AddEventModal';
import { Event } from '@/types';
import { Calendar as CalIcon, Plus, Filter } from 'lucide-react-native';

export default function CalendarScreen() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'training', 'match'

  const isCoach = user?.role === 'coach';

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents(selectedMonth);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [selectedMonth]);

  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
    setModalVisible(false);
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const currentDate = new Date();
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date();
      date.setDate(currentDate.getDate() + i);
      
      const day = {
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: i === 0,
        isSelected: 
          date.getDate() === selectedDate.getDate() && 
          date.getMonth() === selectedDate.getMonth()
      };
      
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.filterButton} onPress={() => {
            setFilter(filter === 'all' ? 'training' : filter === 'training' ? 'match' : 'all');
          }}>
            <Filter size={20} color="#333" />
            <Text style={styles.filterText}>
              {filter === 'all' ? 'All' : filter === 'training' ? 'Training' : 'Match'}
            </Text>
          </TouchableOpacity>

          {isCoach && (
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => setModalVisible(true)}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={calendarDays}
          keyExtractor={(item) => item.date.toISOString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dayItem,
                item.isSelected && styles.selectedDayItem
              ]}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={[
                styles.dayName,
                item.isSelected && styles.selectedDayText
              ]}>
                {item.dayName}
              </Text>
              <View style={[
                styles.dayNumber,
                item.isToday && styles.todayCircle,
                item.isSelected && styles.selectedDayCircle
              ]}>
                <Text style={[
                  styles.dayNumberText,
                  item.isToday && styles.todayText,
                  item.isSelected && styles.selectedDayText
                ]}>
                  {item.dayNumber}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.daysContainer}
        />
      </View>

      <View style={styles.eventsHeaderContainer}>
        <Text style={styles.eventsHeader}>
          {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : filteredEvents.length > 0 ? (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard 
              event={item} 
              isEditable={isCoach}
              onEdit={isCoach ? (updatedEvent) => {
                setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
              } : undefined}
            />
          )}
          contentContainerStyle={styles.eventsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <CalIcon size={50} color="#ccc" />
          <Text style={styles.emptyText}>No events scheduled</Text>
          {isCoach && (
            <TouchableOpacity 
              style={styles.emptyAddButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.emptyAddButtonText}>Add New Event</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {isCoach && (
        <AddEventModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleAddEvent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter-Medium',
  },
  addButton: {
    backgroundColor: '#0B6E4F',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  daysContainer: {
    paddingHorizontal: 10,
  },
  dayItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
  },
  selectedDayItem: {
    backgroundColor: '#f0f8f5',
  },
  dayName: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
  },
  dayNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    backgroundColor: '#f0f0f0',
  },
  selectedDayCircle: {
    backgroundColor: '#0B6E4F',
  },
  dayNumberText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Medium',
  },
  todayText: {
    fontFamily: 'Inter-Bold',
  },
  selectedDayText: {
    color: '#fff',
  },
  eventsHeaderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  eventsHeader: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  eventsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    fontFamily: 'Inter-Regular',
  },
  emptyAddButton: {
    marginTop: 20,
    backgroundColor: '#0B6E4F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});