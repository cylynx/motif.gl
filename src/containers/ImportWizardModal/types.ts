import React from 'react';
import { Tab } from 'baseui/tabs-motion';

export interface Tab {
  title: string;
  key: string;
  component: React.ReactNode;
}

export interface ImportWizardProps {
  tabs: Tab[];
}
