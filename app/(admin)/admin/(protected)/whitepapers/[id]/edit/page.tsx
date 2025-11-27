import { getWhitepaper } from '@/actions/whitepaper-actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WhitepaperForm from '@/components/admin/whitepapers/WhitepaperForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditWhitepaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const whitepaper = await getWhitepaper(id);

  if (!whitepaper) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/whitepapers/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Whitepaper</h1>
          <p className="text-muted-foreground">
            Update whitepaper details
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Whitepaper Details</CardTitle>
        </CardHeader>
        <CardContent>
          <WhitepaperForm
            initialData={{
              title: whitepaper.title,
              slug: whitepaper.slug,
              description: whitepaper.description,
              category: whitepaper.category,
              industries: whitepaper.industries,
              summary: whitepaper.summary,
              highlights: whitepaper.highlights,
              coverImage: whitepaper.coverImage,
              pdfUrl: whitepaper.pdfUrl,
              fileSize: whitepaper.fileSize,
              pageCount: whitepaper.pageCount,
              author: whitepaper.author,
              authorTitle: whitepaper.authorTitle,
              publishDate: whitepaper.publishDate,
              status: whitepaper.status,
              scheduledDate: whitepaper.scheduledDate,
              featured: whitepaper.featured,
              seo: whitepaper.seo,
            }}
            whitepaperId={id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
