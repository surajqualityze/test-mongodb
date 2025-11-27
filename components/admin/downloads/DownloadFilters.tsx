'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, Download } from 'lucide-react';
import { exportDownloadsToCSV } from '@/actions/download-actions';

export default function DownloadFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    resourceType: searchParams.get('resourceType') || 'all',
    emailStatus: searchParams.get('emailStatus') || 'all',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
  });

  function applyFilters() {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });

    router.push(`/admin/downloads?${params.toString()}`);
  }

  function clearFilters() {
    setFilters({
      search: '',
      resourceType: 'all',
      emailStatus: 'all',
      dateFrom: '',
      dateTo: '',
    });
    router.push('/admin/downloads');
  }

  async function handleExport() {
    setExporting(true);
    const result = await exportDownloadsToCSV({
      resourceType: filters.resourceType !== 'all' ? filters.resourceType as any : undefined,
      dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
    });

    if (result.success && result.csv) {
      // Create download link
      const blob = new Blob([result.csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename || 'downloads.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      alert(result.error || 'Export failed');
    }
    setExporting(false);
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value !== '' && value !== 'all'
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {/* Search */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, email, company..."
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                className="pl-9"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyFilters();
                }}
              />
            </div>
          </div>

          {/* Resource Type */}
          <div className="space-y-2">
            <Label htmlFor="resourceType">Resource Type</Label>
            <Select
              value={filters.resourceType}
              onValueChange={(value) => setFilters(f => ({ ...f, resourceType: value }))}
            >
              <SelectTrigger id="resourceType">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="whitepaper">Whitepaper</SelectItem>
                <SelectItem value="case-study">Case Study</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="brochure">Brochure</SelectItem>
                <SelectItem value="datasheet">Datasheet</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email Status */}
          <div className="space-y-2">
            <Label htmlFor="emailStatus">Email Status</Label>
            <Select
              value={filters.emailStatus}
              onValueChange={(value) => setFilters(f => ({ ...f, emailStatus: value }))}
            >
              <SelectTrigger id="emailStatus">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label htmlFor="dateFrom">From Date</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
            />
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label htmlFor="dateTo">To Date</Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button onClick={applyFilters}>
            <Search className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleExport}
            disabled={exporting}
            className="ml-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
