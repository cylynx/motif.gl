import { NestedFormData } from './form';

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
      type: 'input',
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
      type: 'select',
      value: 'high',
    },
  ],
  ownership: [
    {
      id: 'customer',
      label: 'Customer Id',
      type: 'input',
      value: '',
    },
  ],
  relationship: [
    {
      id: 'customer',
      label: 'Customer Id',
      type: 'input',
      value: '',
    },
  ],
  transactions: [
    {
      id: 'entity',
      label: 'Entity',
      type: 'select',
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
      type: 'input',
      value: '',
    },
    {
      id: 'txn_type',
      label: 'Transaction Type',
      type: 'select',
      options: [
        { id: 'atm', label: 'ATM Txns' },
        { id: 'credit_card', label: 'Credit Card Txns' },
        { id: 'ib', label: 'Internet Banking Txns' },
      ],
      value: 'ib',
    },
  ],
};
