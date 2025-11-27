import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { 
  CreditCard, 
  Mail, 
  Globe, 
  Shield, 
  Database,
  Bell,
  Palette,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  Settings as SettingsIcon
} from 'lucide-react';

const settingsItems = [
  {
    name: 'Payment Settings',
    description: 'Configure Stripe and manage payment processing',
    icon: CreditCard,
    href: '/admin/settings/payments',
    status: 'configured',
    category: 'Financial',
  },
  {
    name: 'Email Configuration',
    description: 'Setup email providers and customize templates',
    icon: Mail,
    href: '/admin/downloads/emails',
    status: 'configured',
    category: 'Communication',
  },
  {
    name: 'General Settings',
    description: 'Site information, branding, and basic configurations',
    icon: Globe,
    href: '/admin/settings/general',
    status: 'pending',
    category: 'General',
  },
  {
    name: 'Security & API',
    description: 'Manage API keys, webhooks, and authentication',
    icon: Shield,
    href: '/admin/settings/security',
    status: 'pending',
    category: 'Security',
  },
  {
    name: 'Database',
    description: 'Backup, restore, and database maintenance',
    icon: Database,
    href: '/admin/settings/database',
    status: 'pending',
    category: 'System',
  },
  {
    name: 'Notifications',
    description: 'Configure alerts and notification preferences',
    icon: Bell,
    href: '/admin/settings/notifications',
    status: 'pending',
    category: 'Communication',
  },
  {
    name: 'Appearance',
    description: 'Customize theme, colors, and UI preferences',
    icon: Palette,
    href: '/admin/settings/appearance',
    status: 'pending',
    category: 'General',
  },
  {
    name: 'User Management',
    description: 'Manage admin users, roles, and permissions',
    icon: Users,
    href: '/admin/settings/users',
    status: 'pending',
    category: 'Security',
  },
];

export default function SettingsPage() {
  const configuredCount = settingsItems.filter(item => item.status === 'configured').length;
  const pendingCount = settingsItems.filter(item => item.status === 'pending').length;

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage application configuration and system preferences
        </p>
      </div>

      {/* Quick Access - Top Priority */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Active Services */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
              {configuredCount} Active
            </Badge>
          </div>
          <h3 className="font-semibold text-lg mb-1">Configured</h3>
          <p className="text-sm text-muted-foreground">Settings ready to use</p>
        </div>

        {/* Pending */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">
              {pendingCount} Pending
            </Badge>
          </div>
          <h3 className="font-semibold text-lg mb-1">Pending Setup</h3>
          <p className="text-sm text-muted-foreground">Awaiting configuration</p>
        </div>

        {/* System Status */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
              Online
            </Badge>
          </div>
          <h3 className="font-semibold text-lg mb-1">System Status</h3>
          <p className="text-sm text-muted-foreground">All systems operational</p>
        </div>

        {/* Version */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <SettingsIcon className="h-5 w-5 text-purple-600" />
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-300">
              v1.0.0
            </Badge>
          </div>
          <h3 className="font-semibold text-lg mb-1">App Version</h3>
          <p className="text-sm text-muted-foreground">Up to date</p>
        </div>
      </div>

      {/* Settings Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Setting</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settingsItems.map((item) => {
              const Icon = item.icon;
              const isConfigured = item.status === 'configured';
              
              return (
                <TableRow 
                  key={item.name}
                  className={isConfigured ? 'hover:bg-muted/50' : 'opacity-60'}
                >
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Icon className={`h-5 w-5 ${isConfigured ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isConfigured ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">Configured</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-600">Pending</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isConfigured ? (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={item.href}>
                          Configure
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4 text-sm">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Database: <span className="font-medium text-foreground">MongoDB Atlas</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            Last updated: <span className="font-medium text-foreground">Just now</span>
          </span>
        </div>
      </div>
    </div>
  );
}
