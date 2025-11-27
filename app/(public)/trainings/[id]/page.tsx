// Add this card to show payment stats
import { getAllPayments } from '@/actions/payment-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// In your component:
const payments = await getAllPayments({ trainingId: id });
const completedPayments = payments.filter(p => p.paymentStatus === 'completed');
const totalRevenue = completedPayments.reduce((sum, p) => sum + p.finalAmount, 0);

// Add this stats card:
<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">
      ${totalRevenue.toFixed(2)}
    </div>
    <p className="text-xs text-muted-foreground">
      {completedPayments.length} enrollments
    </p>
  </CardContent>
</Card>
