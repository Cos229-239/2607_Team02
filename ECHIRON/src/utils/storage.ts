import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData } from '@/types/models';

const STORAGE_KEY = 'echiron.appdata.v1';

export async function loadAppData(): Promise<AppData | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AppData) : null;
}

export async function saveAppData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function clearAppData(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
