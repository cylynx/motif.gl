import React from 'react';

export interface ImportTabs {
  title: string;
  key: string;
  component: React.ReactNode;
}

export type TActiveKey = {
  activeKey: string;
};
