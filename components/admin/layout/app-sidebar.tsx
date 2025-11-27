'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FileType,
  Video,
  Briefcase,
  GraduationCap,
  Settings,
  Wrench,
  Users,
  Image,
  MessageSquare,
  BarChart3,
  Presentation,
  Mic,
  Download,
  CreditCard,
  LogOut,
  ChevronRight,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const navigation = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Content',
    icon: FileText,
    items: [
      { title: 'Blogs', url: '/admin/blogs', icon: FileText },
      { title: 'Whitepapers', url: '/admin/whitepapers', icon: FileType },
      { title: 'Webinars', url: '/admin/webinars', icon: Video },
      { title: 'Case Studies', url: '/admin/case-studies', icon: Briefcase },
      { title: 'Services', url: '/admin/services', icon: Wrench },
      { title: 'Careers', url: '/admin/careers', icon: Users },
    ],
  },
  {
    title: 'Training',
    icon: GraduationCap,
    items: [
      { title: 'Trainings', url: '/admin/trainings', icon: Presentation },
      { title: 'Speakers', url: '/admin/speakers', icon: Mic },
    ],
  },
  {
    title: 'Downloads',
    url: '/admin/downloads',
    icon: Download,
  },
  {
    title: 'Payments',
    url: '/admin/payments',
    icon: CreditCard,
  },
  {
    title: 'Media',
    url: '/admin/media',
    icon: Image,
  },
  {
    title: 'Forms',
    url: '/admin/forms',
    icon: MessageSquare,
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings,
  },
];

export function AppSidebar({ user }: { user?: { email: string } }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Settings className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Admin Panel</p>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;

                if (item.items) {
                  // Collapsible menu with sub-items
                  return (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => {
                              const SubIcon = subItem.icon;
                              return (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link href={subItem.url}>
                                      <SubIcon className="h-4 w-4" />
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Regular menu item
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url!}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                    {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium text-sm">
                      {user?.email || 'Admin'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Administrator
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
