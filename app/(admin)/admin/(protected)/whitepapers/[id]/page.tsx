import { getWhitepaper } from '@/actions/whitepaper-actions';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Edit, ArrowLeft, Download, Eye, FileText, Calendar, User } from 'lucide-react';

export default async function WhitepaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const whitepaper = await getWhitepaper(id);

  if (!whitepaper) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/whitepapers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{whitepaper.title}</h1>
          <p className="text-muted-foreground">{whitepaper.description}</p>
        </div>
        <Button asChild>
          <Link href={`/admin/whitepapers/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className={getStatusColor(whitepaper.status)}>
              {whitepaper.status}
            </Badge>
            {whitepaper.featured && (
              <Badge variant="secondary" className="ml-2">
                ⭐ Featured
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{whitepaper.downloads}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{whitepaper.views}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{whitepaper.pageCount || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Details */}
      <Card>
        <CardHeader>
          <CardTitle>Content Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{whitepaper.summary}</p>
        </CardContent>
      </Card>

      {/* Key Highlights */}
      {whitepaper.highlights && whitepaper.highlights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {whitepaper.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* File & Media */}
      <Card>
        <CardHeader>
          <CardTitle>Files & Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">PDF Document</p>
            {whitepaper.pdfUrl ? (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <a href={whitepaper.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </a>
                </Button>
                {whitepaper.fileSize && (
                  <span className="text-sm text-muted-foreground">
                    ({whitepaper.fileSize})
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No PDF uploaded</p>
            )}
          </div>

          {whitepaper.coverImage && (
            <div>
              <p className="text-sm font-medium mb-2">Cover Image</p>
              <img
                src={whitepaper.coverImage}
                alt={whitepaper.title}
                className="w-64 h-auto rounded-lg border"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Category</p>
              <p className="text-sm text-muted-foreground">{whitepaper.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Slug</p>
              <p className="text-sm text-muted-foreground">{whitepaper.slug}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Author</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{whitepaper.author}</p>
                  {whitepaper.authorTitle && (
                    <p className="text-xs text-muted-foreground">{whitepaper.authorTitle}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Publish Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {new Date(whitepaper.publishDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {whitepaper.industries && whitepaper.industries.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Industries</p>
              <div className="flex flex-wrap gap-2">
                {whitepaper.industries.map((industry) => (
                  <Badge key={industry} variant="outline">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(whitepaper.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm text-muted-foreground">
                {new Date(whitepaper.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
