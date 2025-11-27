'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Eye, TrendingUp, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import type { DownloadStats } from '@/types/download';

interface DownloadsDashboardProps {
  stats: DownloadStats;
}

export default function DownloadsDashboard({ stats }: DownloadsDashboardProps) {
  const emailDeliveryRate = stats.total > 0 
    ? ((stats.byStatus.delivered || 0) / stats.total * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time downloads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Delivery</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailDeliveryRate}%</div>
            <p className="text-xs text-muted-foreground">
              Success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Downloads by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Downloads by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byResourceType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
              {Object.keys(stats.byResourceType).length === 0 && (
                <p className="text-sm text-muted-foreground">No downloads yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email Status */}
        <Card>
          <CardHeader>
            <CardTitle>Email Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byStatus).map(([status, count]) => {
                const Icon = status === 'delivered' ? CheckCircle : 
                            status === 'failed' ? AlertCircle : Mail;
                const color = status === 'delivered' ? 'text-green-600' : 
                             status === 'failed' ? 'text-red-600' : 'text-yellow-600';
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm capitalize">{status}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                );
              })}
              {Object.keys(stats.byStatus).length === 0 && (
                <p className="text-sm text-muted-foreground">No email data yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Top Downloaded Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topResources.map((resource, index) => (
              <div key={resource.resourceId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{resource.resourceTitle}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {resource.resourceType.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{resource.count}</span>
                </div>
              </div>
            ))}
            {stats.topResources.length === 0 && (
              <p className="text-sm text-muted-foreground">No downloads yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
