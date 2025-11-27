'use client';

import { useState } from 'react';
import Link from 'next/link';
import { refundPayment } from '@/actions/payment-actions';
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
import { MoreHorizontal, Eye, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Payment } from '@/types/payment';

interface PaymentsDataTableProps {
  payments: (Payment & { _id: string })[];
}

export default function PaymentsDataTable({ payments }: PaymentsDataTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleRefund(id: string) {
    setLoading(id);
    const result = await refundPayment(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(null);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <RefreshCw className="h-3 w-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">No payments yet</h3>
        <p className="text-sm text-muted-foreground">
          Payment records will appear here once users start purchasing trainings
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
            <TableHead>Training</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell className="text-sm">
                {new Date(payment.createdAt).toLocaleDateString()}
                <br />
                <span className="text-xs text-muted-foreground">
                  {new Date(payment.createdAt).toLocaleTimeString()}
                </span>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{payment.trainingTitle}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {payment.trainingType}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{payment.userName}</p>
                  <p className="text-sm text-muted-foreground">{payment.userEmail}</p>
                  {payment.userCompany && (
                    <p className="text-xs text-muted-foreground">{payment.userCompany}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {formatCurrency(payment.finalAmount, payment.currency)}
                  </p>
                  {payment.discountApplied && payment.discountApplied > 0 && (
                    <p className="text-xs text-green-600">
                      Saved: {formatCurrency(payment.discountApplied, payment.currency)}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(payment.paymentStatus)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={loading === payment._id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/payments/${payment._id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    {payment.paymentStatus === 'completed' && (
                      <>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-orange-600"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Refund Payment
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Refund Payment?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will refund the full amount of{' '}
                                {formatCurrency(payment.finalAmount, payment.currency)} to the
                                customer. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRefund(payment._id)}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                Process Refund
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
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
