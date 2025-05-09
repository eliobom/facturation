import AsyncStorage from '@react-native-async-storage/async-storage';

// Store user data in AsyncStorage
export const saveUserToStorage = async (user: any) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to storage:', error);
  }
};

// Get user data from AsyncStorage
export const getUserFromStorage = async () => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user from storage:', error);
    return null;
  }
};

// Remove user data from AsyncStorage
export const removeUserFromStorage = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing user from storage:', error);
  }
};