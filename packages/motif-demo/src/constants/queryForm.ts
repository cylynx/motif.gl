/* eslint-disable no-console */
// @ts-ignore
import { NestedFormData, SimpleFormData } from 'motif.gl';

export const queryForm: NestedFormData = {
  id: 'query',
  label: 'Customer',
  value: 'id',
  callback: (data: any) => console.log(data),
  options: [
    { id: 'customers', label: 'Customers' },
    { id: 'ownership', label: 'Ownership' },
    { id: 'relationship', label: 'Relationship' },
    { id: 'transactions', label: 'Transactions' },
  ],
  customers: [
    {
      id: 'customer',
      label: 'Customer Id',
      kind: 'input',
      value: '',
    },
    {
      id: 'risk_category',
      label: 'Risk Category',
      options: [
        { id: 'low', label: 'Low' },
        { id: 'mid', label: 'Middle' },
        { id: 'high', label: 'high' },
      ],
      kind: 'select',
      value: 'high',
    },
  ],
  ownership: [
    {
      id: 'customer',
      label: 'Customer Id',
      kind: 'input',
      value: '',
    },
  ],
  relationship: [
    {
      id: 'customer',
      label: 'Customer Id',
      kind: 'input',
      value: '',
    },
  ],
  transactions: [
    {
      id: 'entity',
      label: 'Entity',
      kind: 'select',
      options: [
        { id: 'customer', label: 'Customer' },
        { id: 'atm', label: 'ATM' },
        { id: 'account', label: 'Account' },
        { id: 'atm_card', label: 'ATM Card' },
        { id: 'credit_card', label: 'Credit Card' },
        { id: 'pos', label: 'POS' },
      ],
      value: 'customer',
    },
    {
      id: 'id_num',
      label: 'Entity Id',
      kind: 'input',
      value: '',
    },
    {
      id: 'txn_type',
      label: 'Transaction Type',
      kind: 'select',
      options: [
        { id: 'atm', label: 'ATM Txns' },
        { id: 'credit_card', label: 'Credit Card Txns' },
        { id: 'ib', label: 'Internet Banking Txns' },
      ],
      value: 'ib',
    },
  ],
};

export const neo4jHost: SimpleFormData = {
  id: 'neo4jHost',
  label: 'Host',
  kind: 'input',
  value: '',
  callback: (data: any) => console.log(data),
};

export const neo4jPort: SimpleFormData = {
  id: 'neo4jPort',
  label: 'Port',
  kind: 'input',
  value: '',
  callback: (data: any) => console.log(data),
};

export const neo4jUsername: SimpleFormData = {
  id: 'neo4jUsername',
  label: 'Username',
  kind: 'input',
  value: '',
  callback: (data: any) => console.log(data),
};

export const neo4jPassword: SimpleFormData = {
  id: 'neo4jPassword',
  label: 'Password',
  kind: 'input',
  type: 'password',
  value: '',
  callback: (data: any) => console.log(data),
};
