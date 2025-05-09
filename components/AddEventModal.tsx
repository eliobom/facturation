import { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react-native';
import { Event } from '@/types';
import DateTimePicker from '@/components/DateTimePicker';
import { addEvent } from '@/services/eventService';

type AddEventModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (event: Event) => void;
};

export function AddEventModal({ visible, onClose, onAdd }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [team, setTeam] = useState('All Teams');
  const [type, setType] = useState<'training' | 'match'>('training');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setTeam('All Teams');
    setType('training');
    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date(Date.now() + 60 * 60 * 1000));
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateEvent = async () => {
    if (!title || !location) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get full date+time by combining date with time
      const start = new Date(date);
      start.setHours(startTime.getHours(), startTime.getMinutes());
      
      const end = new Date(date);
      end.setHours(endTime.getHours(), endTime.getMinutes());

      if (end <= start) {
        setError('End time must be after start time');
        setLoading(false);
        return;
      }

      const newEvent: Event = {
        id: String(Date.now()), // Temporary ID (would be assigned by backend)
        title,
        description,
        location,
        team,
        type,
        startTime: start,
        endTime: end,
        createdAt: new Date(),
      };

      // In a real app, we would save to backend here
      await addEvent(newEvent);
      onAdd(newEvent);
      handleClose();
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modal}>
              <View style={styles.header}>
                <Text style={styles.title}>Create New Event</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <X size={20} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.body}>
                {error && (
                  <Text style={styles.errorText}>{error}</Text>
                )}

                <View style={styles.typeSelector}>
                  <TouchableOpacity 
                    style={[styles.typeOption, type === 'training' && styles.typeOptionActive]}
                    onPress={() => setType('training')}
                  >
                    <Text 
                      style={[styles.typeText, type === 'training' && styles.typeTextActive]}
                    >
                      Training
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.typeOption, type === 'match' && styles.typeOptionActive]}
                    onPress={() => setType('match')}
                  >
                    <Text 
                      style={[styles.typeText, type === 'match' && styles.typeTextActive]}
                    >
                      Match
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Title *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter event title"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter event description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Calendar size={16} color="#666" />
                    <Text style={styles.label}>Date *</Text>
                  </View>
                  <DateTimePicker
                    value={date}
                    onChange={setDate}
                    mode="date"
                  />
                </View>

                <View style={styles.timeContainer}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                    <View style={styles.labelContainer}>
                      <Clock size={16} color="#666" />
                      <Text style={styles.label}>Start Time *</Text>
                    </View>
                    <DateTimePicker
                      value={startTime}
                      onChange={setStartTime}
                      mode="time"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <View style={styles.labelContainer}>
                      <Clock size={16} color="#666" />
                      <Text style={styles.label}>End Time *</Text>
                    </View>
                    <DateTimePicker
                      value={endTime}
                      onChange={setEndTime}
                      mode="time"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <MapPin size={16} color="#666" />
                    <Text style={styles.label}>Location *</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter location"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Users size={16} color="#666" />
                    <Text style={styles.label}>Team</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="All Teams"
                    value={team}
                    onChangeText={setTeam}
                  />
                </View>
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.createButton, loading && styles.disabledButton]}
                  onPress={handleCreateEvent}
                  disabled={loading}
                >
                  <Text style={styles.createButtonText}>
                    {loading ? 'Creating...' : 'Create Event'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  body: {
    padding: 20,
    maxHeight: '70%',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 15,
    fontFamily: 'Inter-Regular',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  typeOptionActive: {
    backgroundColor: type === 'training' ? '#0B6E4F' : '#FA7921',
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  typeTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  createButton: {
    flex: 2,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#0B6E4F',
  },
  disabledButton: {
    backgroundColor: '#0B6E4F80',
  },
  createButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
});