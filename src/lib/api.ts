import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types for the MongoDB documents
export interface User {
  _id: string;
  email: string;
  role: 'patient' | 'caregiver';
  full_name: string;
  caregiver_code?: string;
  linked_caregiver_id?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  _id: string;
  patient_id: string;
  name: string;
  dosage: string;
  total_count: number;
  current_count: number;
  low_stock_threshold: number;
  morning_dose: boolean;
  afternoon_dose: boolean;
  night_dose: boolean;
  instructions?: string;
  image_url?: string;
  audio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  _id: string;
  medication_id: string;
  patient_id: string;
  reminder_time: string;
  acknowledged: boolean;
  escalated: boolean;
  created_at: string;
}

export interface MoodEntry {
  _id: string;
  patient_id: string;
  mood_score: number;
  notes?: string;
  date: string;
  created_at: string;
}

export interface GameScore {
  _id: string;
  patient_id: string;
  score: number;
  total_questions: number;
  date: string;
  created_at: string;
}

// API functions
export const apiClient = {
  // User management
  auth: {
    register: async (userData: {
      email: string;
      password: string;
      full_name: string;
      role: 'patient' | 'caregiver';
      caregiver_code?: string;
      linked_caregiver_id?: string;
      emergency_contact?: string;
      emergency_phone?: string;
    }) => {
      const response = await api.post('/users/register', userData);
      return response.data;
    },
    login: async (credentials: { email: string; password: string }) => {
      const response = await api.post('/users/login', credentials);
      return response.data;
    },
  },

  // Users
  users: {
    getPatientsByCaregiver: async (caregiverId: string): Promise<User[]> => {
      const response = await api.get(`/users/patients/${caregiverId}`);
      return response.data.patients;
    },
  },

  // Medications
  medications: {
    getByPatientId: async (patientId: string): Promise<Medication[]> => {
      const response = await api.get(`/medications?patient_id=${patientId}`);
      return response.data;
    },
    create: async (medication: Omit<Medication, '_id' | 'created_at' | 'updated_at'>): Promise<Medication> => {
      const response = await api.post('/medications', medication);
      return response.data;
    },
    update: async (id: string, medication: Partial<Medication>): Promise<Medication> => {
      const response = await api.put(`/medications/${id}`, medication);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await api.delete(`/medications/${id}`);
    },
  },

  // Reminders
  reminders: {
    getByPatientId: async (patientId: string, date?: string): Promise<Reminder[]> => {
      const params = new URLSearchParams({ patient_id: patientId });
      if (date) params.append('date', date);
      const response = await api.get(`/reminders?${params.toString()}`);
      return response.data;
    },
    create: async (reminder: Omit<Reminder, '_id' | 'created_at'>): Promise<Reminder> => {
      const response = await api.post('/reminders', reminder);
      return response.data;
    },
    update: async (id: string, reminder: Partial<Reminder>): Promise<Reminder> => {
      const response = await api.put(`/reminders/${id}`, reminder);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await api.delete(`/reminders/${id}`);
    },
  },

  // Mood Entries
  moodEntries: {
    getByPatientId: async (patientId: string, limit?: number): Promise<MoodEntry[]> => {
      const params = new URLSearchParams({ patient_id: patientId });
      if (limit) params.append('limit', limit.toString());
      const response = await api.get(`/mood_entries?${params.toString()}`);
      return response.data;
    },
    create: async (entry: Omit<MoodEntry, '_id' | 'created_at'>): Promise<MoodEntry> => {
      const response = await api.post('/mood_entries', entry);
      return response.data;
    },
    update: async (id: string, entry: Partial<MoodEntry>): Promise<MoodEntry> => {
      const response = await api.put(`/mood_entries/${id}`, entry);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await api.delete(`/mood_entries/${id}`);
    },
  },

  // Game Scores
  gameScores: {
    getByPatientId: async (patientId: string, limit?: number): Promise<GameScore[]> => {
      const params = new URLSearchParams({ patient_id: patientId });
      if (limit) params.append('limit', limit.toString());
      const response = await api.get(`/game_scores?${params.toString()}`);
      return response.data;
    },
    create: async (score: Omit<GameScore, '_id' | 'created_at'>): Promise<GameScore> => {
      const response = await api.post('/game_scores', score);
      return response.data;
    },
    update: async (id: string, score: Partial<GameScore>): Promise<GameScore> => {
      const response = await api.put(`/game_scores/${id}`, score);
      return response.data;
    },
    delete: async (id: string): Promise<void> => {
      await api.delete(`/game_scores/${id}`);
    },
  },

  // Emergency
  emergency: {
    get: async (userId: string) => {
      const response = await api.get(`/emergency/${userId}`);
      return response.data;
    },
    update: async (userId: string, emergencyData: { emergency_contact?: string; emergency_phone?: string }) => {
      const response = await api.put(`/emergency/${userId}`, emergencyData);
      return response.data;
    },
  },
};
