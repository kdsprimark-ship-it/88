
import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  UserCog, 
  Settings as SettingsIcon, 
  FileSpreadsheet, 
  Receipt, 
  Wallet, 
  BarChart3,
  LogOut,
  Bell,
  Search,
  Printer,
  Download,
  Filter,
  Plus,
  Trash2,
  Clock,
  User as UserIcon,
  Table,
  Share2,
  MessageSquare,
  Globe,
  Database,
  Lock,
  RefreshCw,
  Box,
  Cloud,
  Palette,
  Expand,
  Shrink,
  Tags
} from 'lucide-react';

export const THEMES = [
  { name: 'Ocean Breeze', class: 'bg-cyan-500', from: 'from-cyan-400', to: 'to-blue-600', text: 'text-white' },
  { name: 'Sunset Glow', class: 'bg-orange-500', from: 'from-orange-400', to: 'to-red-600', text: 'text-white' },
  { name: 'Purple Dream', class: 'bg-purple-600', from: 'from-purple-500', to: 'to-indigo-700', text: 'text-white' },
  { name: 'Green Fields', class: 'bg-emerald-500', from: 'from-emerald-400', to: 'to-teal-600', text: 'text-white' },
  { name: 'Red Passion', class: 'bg-rose-600', from: 'from-rose-500', to: 'to-red-800', text: 'text-white' },
  { name: 'Royal Gold', class: 'bg-amber-500', from: 'from-amber-400', to: 'to-yellow-600', text: 'text-white' },
  { name: 'Sky', class: 'bg-sky-400', from: 'from-sky-300', to: 'to-blue-500', text: 'text-white' },
  { name: 'Violet', class: 'bg-violet-600', from: 'from-violet-500', to: 'to-purple-800', text: 'text-white' },
  { name: 'Forest', class: 'bg-green-700', from: 'from-green-600', to: 'to-emerald-900', text: 'text-white' },
  { name: 'Aqua', class: 'bg-teal-400', from: 'from-teal-300', to: 'to-cyan-600', text: 'text-white' },
  { name: 'Sunrise', class: 'bg-yellow-400', from: 'from-yellow-300', to: 'to-orange-500', text: 'text-white' }
];

export const FONT_FAMILIES = [
  'Poppins', 'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Lato'
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'Bangla' },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'indian-entry', label: 'Indian Entry', icon: <FileSpreadsheet size={20} /> },
  { id: 'bill-info', label: 'Bill Information', icon: <Receipt size={20} /> },
  { id: 'account-info', label: 'Account Info', icon: <Wallet size={20} /> },
  { id: 'hm-cutoff', label: 'H&M Cutoff Info', icon: <BarChart3 size={20} /> },
  { id: 'truck-info', label: 'Truck Info', icon: <Truck size={20} /> },
  { id: 'price-rates', label: 'Price Rate Settings', icon: <Tags size={20} /> },
  { id: 'master-data', label: 'Master Data Sheet', icon: <Table size={20} /> },
  { id: 'export-info', label: 'Export Info', icon: <Share2 size={20} /> },
  { id: 'user-management', label: 'User Management', icon: <UserCog size={20} /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
];

// Added missing icons to the Icons object export
export const Icons = {
  LogOut,
  Bell,
  Search,
  Printer,
  Download,
  Filter,
  Plus,
  Trash2,
  Clock,
  UserIcon,
  BarChart3,
  RefreshCw,
  Globe,
  Share2,
  MessageSquare,
  Database,
  Lock,
  Box,
  Cloud,
  Palette,
  FileSpreadsheet,
  Receipt,
  Truck,
  Table,
  Wallet,
  LayoutDashboard,
  UserCog,
  SettingsIcon,
  Expand,
  Shrink,
  Tags
};
