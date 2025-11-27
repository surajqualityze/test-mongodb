'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteDownload, updateFollowUpStatus } from '@/actions/download-actions';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { MoreHorizontal, Trash2, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Download, FollowUpStatus } from '@/types/download';

interface DownloadsDataTableProps {
  downloads: (Download & { _id: string })[];
}

export default function DownloadsDataTable({ downloads }: DownloadsDataTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoading(id);
    const result = await deleteDownload(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(null);
  }

  async function handleFollowUpChange(id: string, status: FollowUpStatus) {
    setLoading(id);
    const result = await updateFollowUpStatus(id, status);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(null);
  }

  const getEmailStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'bounced':
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Mail className="h-3 w-3 mr-1" />
            Bounced
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getFollowUpColor = (status: string) => {
    switch (status) {
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'not-interested':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (downloads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">No downloads yet</h3>
        <p className="text-sm text-muted-foreground">
          Download records will appear here once users start downloading resources
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email Status</TableHead>
            <TableHead>Follow-up</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {downloads.map((download) => (
            <TableRow key={download._id}>
              <TableCell className="text-sm">
                {new Date(download.downloadedAt).toLocaleDateString()}
                <br />
                <span className="text-xs text-muted-foreground">
                  {new Date(download.downloadedAt).toLocaleTimeString()}
                </span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{download.resourceTitle}</p>
                  <Badge variant="outline" className="text-xs capitalize">
                    {download.resourceType.replace('-', ' ')}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{download.userName}</p>
                  <p className="text-sm text-muted-foreground">{download.userEmail}</p>
                  {download.userPhone && (
                    <p className="text-xs text-muted-foreground">{download.userPhone}</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {download.userCompany || '-'}
                {download.userJobTitle && (
                  <p className="text-xs text-muted-foreground">{download.userJobTitle}</p>
                )}
              </TableCell>
              <TableCell>
                {getEmailStatusBadge(download.emailStatus)}
              </TableCell>
              <TableCell>
                <Select
                  value={download.followUpStatus}
                  onValueChange={(value: FollowUpStatus) => handleFollowUpChange(download._id, value)}
                  disabled={loading === download._id}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="not-interested">Not Interested</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={loading === download._id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    {download.resourceUrl && (
                      <DropdownMenuItem asChild>
                        <a href={download.resourceUrl} target="_blank" rel="noopener noreferrer">
                          <Mail className="mr-2 h-4 w-4" />
                          View Resource
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
                            This action cannot be undone. This will permanently delete the download record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(download._id)}
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
