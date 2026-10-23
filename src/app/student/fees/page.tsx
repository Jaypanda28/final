'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { MetricCard } from '@/components/ui/MetricCard';
import { Modal } from '@/components/ui/Modal';
import { Invoice, PaymentRecord, UserProfile } from '@/types';
import { formatINR } from '@/lib/calculations';

export default function StudentFeesPage() {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-stu-01',
    name: 'Enrolled Student',
    email: 'student.aarav@pinnakeedge.edu',
    role: 'student',
    instituteId: 'SPE-STU-2026-001',
    status: 'active',
    createdAt: '',
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<PaymentRecord | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          const sId = data.user.id || data.user.studentId || 'stu-001';
          Promise.all([
            fetch(`/api/fees/invoices?studentId=${sId}`).then((r) => r.json()),
            fetch(`/api/fees/payments?studentId=${sId}`).then((r) => r.json()),
          ]).then(([invData, payData]) => {
            if (invData?.success && invData.invoices) setInvoices(invData.invoices);
            if (payData?.success && payData.payments) setPayments(payData.payments);
          });
        }
      })
      .catch(() => {});
  }, []);

  const totalPaid = invoices.reduce((acc, i) => acc + (i.amountPaid || 0), 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + (i.outstandingBalance || 0), 0);

  return (
    <DashboardShell
      user={user}
      title="Fee Invoices & Payment Receipts"
      subtitle="Track tuition installments, download verified digital payment receipts, and view upcoming due dates."
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Total Fees Paid"
          value={formatINR(totalPaid)}
          subtitle="Installment 1 Settled"
          trend="Receipt Active"
          trendType="positive"
          icon={CreditCard}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <MetricCard
          title="Outstanding Balance"
          value={formatINR(totalOutstanding)}
          subtitle="Installment 2 due 15-Nov-2026"
          trend="Upcoming Due"
          trendType="neutral"
          icon={Receipt}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        <MetricCard
          title="Payment Receipts"
          value={payments.length}
          subtitle="Verified by Accounts"
          icon={CheckCircle2}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs mb-8">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Assigned Fee Invoices</h3>
          <span className="text-xs text-slate-500">Academic Session 2026-2027</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Outstanding</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-700">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{inv.feeDescription}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{formatINR(inv.totalAmount)}</td>
                  <td className="py-3.5 px-4 text-emerald-600 font-medium">{formatINR(inv.discountAmount)}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{formatINR(inv.amountPaid)}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{formatINR(inv.outstandingBalance)}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.dueDate}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Receipts History */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Verified Payment Receipts</h3>
          <span className="text-xs text-slate-500">Official digital vouchers</span>
        </div>

        <div className="divide-y divide-slate-100">
          {payments.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <span className="font-mono text-xs font-bold text-orange-700 block">{p.receiptNumber}</span>
                <span className="text-xs text-slate-700 mt-0.5 block">
                  Paid via {p.paymentMethod.toUpperCase()} (Ref: {p.referenceNumber})
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Date: {p.paymentDate} &bull; Recorded by: {p.recordedBy}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-base font-extrabold text-slate-900">{formatINR(p.amount)}</span>
                <button
                  onClick={() => setActiveReceipt(p)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  View & Print Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRINTABLE RECEIPT MODAL */}
      {activeReceipt && (
        <Modal
          isOpen={true}
          onClose={() => setActiveReceipt(null)}
          title="Digital Fee Receipt"
          description="Official payment receipt issued by Shri PinnakeEdge Coaching Center."
          maxWidth="md"
        >
          <div className="p-4 border-2 border-slate-900 rounded-2xl bg-white space-y-4 print:border-black">
            <div className="text-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                SHRI PINNAKEEDGE COACHING CENTER
              </h3>
              <p className="text-[10px] text-slate-500">Official Student Payment Voucher</p>
              <span className="font-mono text-xs font-bold text-orange-700 mt-1 block">
                {activeReceipt.receiptNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <p><span className="font-bold text-slate-900">Student Name:</span> {activeReceipt.studentName}</p>
              <p><span className="font-bold text-slate-900">Student ID:</span> SPE-STU-2026-001</p>
              <p><span className="font-bold text-slate-900">Payment Date:</span> {activeReceipt.paymentDate}</p>
              <p><span className="font-bold text-slate-900">Payment Mode:</span> {activeReceipt.paymentMethod.toUpperCase()}</p>
              <p className="col-span-2 truncate"><span className="font-bold text-slate-900">Txn Ref:</span> {activeReceipt.referenceNumber}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Amount Received</span>
              <span className="text-2xl font-black text-slate-900 block">{formatINR(activeReceipt.amount)}</span>
            </div>

            <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Status: Verified & Stamped</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Voucher
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
