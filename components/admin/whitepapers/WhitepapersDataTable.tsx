'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteWhitepaper, toggleFeatured } from '@/actions/whitepaper-actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash2, Eye, Star, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Whitepaper } from '@/types/whitepaper';

interface WhitepapersDataTableProps {
  whitepapers: (Whitepaper & { _id: string })[];
}

export default function WhitepapersDataTable({ whitepapers }: WhitepapersDataTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoading(id);
    const result = await deleteWhitepaper(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(null);
  }

  async function handleToggleFeatured(id: string) {
    setLoading(id);
    const result = await toggleFeatured(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(null);
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

  if (whitepapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">No whitepapers yet</h3>
        <p className="text-sm text-muted-foreground">
          Create your first whitepaper to get started
        </p>
        <Button asChild className="mt-4">
          <Link href="/admin/whitepapers/new">Create Whitepaper</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Downloads</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {whitepapers.map((whitepaper) => (
            <TableRow key={whitepaper._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {whitepaper.featured && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  )}
                  <div>
                    <Link
                      href={`/admin/whitepapers/${whitepaper._id}`}
                      className="font-medium hover:underline"
                    >
                      {whitepaper.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {whitepaper.description}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">{whitepaper.category}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStatusColor(whitepaper.status)}>
                  {whitepaper.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {whitepaper.downloads}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {whitepaper.views}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {new Date(whitepaper.publishDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={loading === whitepaper._id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/whitepapers/${whitepaper._id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/whitepapers/${whitepaper._id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleFeatured(whitepaper._id)}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      {whitepaper.featured ? 'Unfeature' : 'Feature'}
                    </DropdownMenuItem>
                    {whitepaper.pdfUrl && (
                      <DropdownMenuItem asChild>
                        <a href={whitepaper.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the whitepaper.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(whitepaper._id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
