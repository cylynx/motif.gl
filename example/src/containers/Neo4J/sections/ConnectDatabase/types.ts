import { ReactNode } from 'react';

export type TNotification = {
  kind?: 'negative' | 'positive';
  children?: ReactNode;
};
