import { getDownloadStats, getAllDownloads } from '@/actions/download-actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import DownloadsDashboard from '@/components/admin/downloads/DownloadsDashboard';
import DownloadsDataTable from '@/components/admin/downloads/DownloadsDataTable';
import DownloadFilters from '@/components/admin/downloads/DownloadFilters';
import type { Download, ResourceType, EmailStatus } from '@/types/download';

async function getDownloadsData(searchParams: any) {
  const filters: any = {};

  if (searchParams.resourceType && searchParams.resourceType !== 'all') {
    filters.resourceType = searchParams.resourceType as ResourceType;
  }

  if (searchParams.emailStatus && searchParams.emailStatus !== 'all') {
    filters.emailStatus = searchParams.emailStatus as EmailStatus;
  }

  if (searchParams.dateFrom) {
    filters.dateFrom = new Date(searchParams.dateFrom);
  }

  if (searchParams.dateTo) {
    filters.dateTo = new Date(searchParams.dateTo);
  }

  if (searchParams.search) {
    filters.search = searchParams.search;
  }

  const [stats, downloads] = await Promise.all([
    getDownloadStats(),
    getAllDownloads(filters),
  ]);

  return { stats, downloads };
}

export default async function DownloadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { stats, downloads } = await getDownloadsData(params);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Downloads</h1>
          <p className="text-muted-foreground">
            Track and manage all resource downloads
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/downloads/emails">
            <Settings className="mr-2 h-4 w-4" />
            Email Settings
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="downloads">All Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DownloadsDashboard stats={stats} />
        </TabsContent>

        <TabsContent value="downloads" className="space-y-4">
          <DownloadFilters />
          <DownloadsDataTable downloads={downloads as (Download & { _id: string })[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
