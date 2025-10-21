export type TVBrand = 'samsung' | 'lg' | 'tcl' | 'sony' | 'philips' | 'panasonic';

export interface TVBrandInfo {
  id: TVBrand;
  name: string;
  description: string;
  color: string;
  gradient: string;
  supported: boolean;
}

export const TV_BRANDS: TVBrandInfo[] = [
  {
    id: 'samsung',
    name: 'Samsung',
    description: 'Tizen OS',
    color: 'from-blue-600 to-blue-800',
    gradient: 'bg-gradient-to-br from-blue-600 to-blue-800',
    supported: true,
  },
  {
    id: 'lg',
    name: 'LG',
    description: 'WebOS',
    color: 'from-red-600 to-pink-600',
    gradient: 'bg-gradient-to-br from-red-600 to-pink-600',
    supported: true,
  },
  {
    id: 'tcl',
    name: 'TCL',
    description: 'Roku TV',
    color: 'from-purple-600 to-purple-800',
    gradient: 'bg-gradient-to-br from-purple-600 to-purple-800',
    supported: true,
  },
  {
    id: 'sony',
    name: 'Sony',
    description: 'Android TV',
    color: 'from-gray-700 to-gray-900',
    gradient: 'bg-gradient-to-br from-gray-700 to-gray-900',
    supported: false,
  },
  {
    id: 'philips',
    name: 'Philips',
    description: 'Saphi/Android',
    color: 'from-teal-600 to-teal-800',
    gradient: 'bg-gradient-to-br from-teal-600 to-teal-800',
    supported: false,
  },
  {
    id: 'panasonic',
    name: 'Panasonic',
    description: 'My Home Screen',
    color: 'from-orange-600 to-orange-800',
    gradient: 'bg-gradient-to-br from-orange-600 to-orange-800',
    supported: false,
  },
];
