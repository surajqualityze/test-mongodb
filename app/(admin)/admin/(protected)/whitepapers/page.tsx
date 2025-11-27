import { getAllWhitepapers } from '@/actions/whitepaper-actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import WhitepapersDataTable from '@/components/admin/whitepapers/WhitepapersDataTable';
import type { Whitepaper } from '@/types/whitepaper';

async function getWhitepapers() {
  const whitepapers = await getAllWhitepapers();
  return whitepapers as (Whitepaper & { _id: string })[];
}

export default async function WhitepapersPage() {
  const whitepapers = await getWhitepapers();

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Whitepapers</h1>
          <p className="text-muted-foreground">
            Manage your downloadable whitepapers and resources
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/whitepapers/new">
            <Plus className="mr-2 h-4 w-4" />
            New Whitepaper
          </Link>
        </Button>
      </div>

      <WhitepapersDataTable whitepapers={whitepapers} />
    </div>
  );
}
