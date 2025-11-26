'use client';

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
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface TrainingFiltersProps {
  speakers: Array<{ _id: string; name: string }>;
}

export default function TrainingFilters({ speakers }: TrainingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    speaker: searchParams.get('speaker') || 'all',
    type: searchParams.get('type') || 'all',
    level: searchParams.get('level') || 'all',
    status: searchParams.get('status') || 'all',
  });

  function applyFilters() {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });

    router.push(`/admin/trainings?${params.toString()}`);
  }

  function clearFilters() {
    setFilters({
      search: '',
      speaker: 'all',
      type: 'all',
      level: 'all',
      status: 'all',
    });
    router.push('/admin/trainings');
  }

  function handleFilterChange(key: string, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value !== '' && value !== 'all'
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {/* Search */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search trainings..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyFilters();
                }}
              />
            </div>
          </div>

          {/* Speaker */}
          <div className="space-y-2">
            <Label htmlFor="speaker">Speaker</Label>
            <Select
              value={filters.speaker}
              onValueChange={(value) => handleFilterChange('speaker', value)}
            >
              <SelectTrigger id="speaker">
                <SelectValue placeholder="All speakers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All speakers</SelectItem>
                {speakers.map((speaker) => (
                  <SelectItem key={speaker._id} value={speaker._id}>
                    {speaker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="live">Live Webinar</SelectItem>
                <SelectItem value="recorded">Recorded</SelectItem>
                <SelectItem value="on-demand">On-Demand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={filters.level}
              onValueChange={(value) => handleFilterChange('level', value)}
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="basic/intermediate">Basic/Intermediate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
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
        </div>
      </CardContent>
    </Card>
  );
}
