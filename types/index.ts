export type Event = {
  id: string;
  title: string;
  description?: string;
  location: string;
  team?: string;
  type: 'training' | 'match';
  startTime: Date;
  endTime: Date;
  createdAt?: Date;
};