import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type CustomDateTimePickerProps = {
  value: Date;
  onChange: (date: Date) => void;
  mode: 'date' | 'time';
};

export default function CustomDateTimePicker({ value, onChange, mode }: CustomDateTimePickerProps) {
  const [show, setShow] = useState(false);

  const formatDate = (date: Date) => {
    if (mode === 'date') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } else {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const handleChange = (_: any, selectedDate?: Date) => {
    const currentDate = selectedDate || value;
    if (Platform.OS === 'android') {
      setShow(false);
    }
    onChange(currentDate);
  };

  // For web, we'll use native input since DateTimePicker might not work well
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <input
          type={mode}
          value={
            mode === 'date'
              ? value.toISOString().split('T')[0]
              : `${String(value.getHours()).padStart(2, '0')}:${String(value.getMinutes()).padStart(2, '0')}`
          }
          onChange={(e) => {
            let newDate = new Date(value);
            if (mode === 'date') {
              newDate = new Date(e.target.value);
            } else {
              const [hours, minutes] = e.target.value.split(':');
              newDate.setHours(Number(hours));
              newDate.setMinutes(Number(minutes));
            }
            onChange(newDate);
          }}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            color: '#333',
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShow(true)}
      >
        <Text style={styles.inputText}>{formatDate(value)}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour={false}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
});