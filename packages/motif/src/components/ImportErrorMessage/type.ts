import { ReactNode } from 'react';

export type ImportError =
  | 'restricted-words'
  | 'empty-dataset'
  | 'missing-nodes-or-edges';

export type ErrorMessageProps = { title: ReactNode; content?: ReactNode };
