export interface User {
  isSelected: boolean;
  id: number;
  displayName: string;
  link: string;
  status: string;
  isEdit: boolean;
}

export const UserColumns = [
  
  // {
  //   key: 'id',
  //   type: 'text',
  //   label: 'ID',
  //   required: true,
  // },
  {
    key: 'displayName',
    type: 'text',
    label: 'Display Name',
    required: true,
  },
  {
    key: 'link',
    type: 'text',
    label: 'Link',
    required: true,
    pattern: '.+@.+',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];
