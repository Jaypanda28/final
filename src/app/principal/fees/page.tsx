'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Printer,
  Receipt,
  Download,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StatusBadge } from '@/components/ui/Badge';
import { MetricCard } from '@/components/ui/MetricCard';
import { Modal } from '@/components/ui/Modal';
import { Invoice, PaymentRecord, UserProfile } from '@/types';
import { formatINR } from '@/lib/calculations';

export default function PrincipalFeesPage() {
  const [user] = useState<UserProfile>({
    id: 'usr-prn-01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'principal@pinnakeedge.edu',
    role: 'principal',
    instituteId: 'SPE-PRN-01',
    status: 'active',
    createdAt: '',
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'net_banking' | 'cash' | 'cheque' | 'card'>('upi');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  // Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState<PaymentRecord | null>(null);

  const fetchFinancials = async () => {
    try {
      setLoading(true);
      const [invRes, payRes] = await Promise.all([
        fetch('/api/fees/invoices'),
        fetch('/api/fees/payments'),
      ]);
      const invData = await invRes.json();
      const payData = await payRes.json();
      if (invData.success) setInvoices(invData.invoices);
      if (payData.success) setPayments(payData.payments);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancials();
  }, []);

  const totalCollected = invoices.reduce((acc, i) => acc + (i.amountPaid || 0), 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + (i.outstandingBalance || 0), 0);

  const filteredInvoices =
    statusFilter === 'all' ? invoices : invoices.filter((i) => i.status === statusFilter);

  const openPaymentModal = (invoice: Invoice) => {
    setSelectedInvoiceForPayment(invoice);
    setPaymentAmount(invoice.outstandingBalance > 0 ? invoice.outstandingBalance : invoice.totalAmount);
    setReferenceNumber(`UPI/AXIS/${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setShowPaymentModal(true);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    try {
      const res = await fetch('/api/fees/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoiceForPayment.id,
          invoiceNumber: selectedInvoiceForPayment.invoiceNumber,
          studentId: selectedInvoiceForPayment.studentId,
          studentName: selectedInvoiceForPayment.studentName,
          amount: Number(paymentAmount),
          paymentMethod,
          referenceNumber,
          notes: 'Principal Office Verified Payment',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPaymentSuccessMsg(`Payment recorded! Issued Receipt: ${data.payment.receiptNumber}`);
        fetchFinancials();
        setTimeout(() => {
          setPaymentSuccessMsg('');
          setShowPaymentModal(false);
          setActiveReceipt(data.payment);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardShell
      user={user}
      title="Fee Management & Fee Invoicing"
      subtitle="Issue fee invoices, record offline and online collections, and generate verifiable digital receipts."
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Total Collected Revenue"
          value={formatINR(totalCollected)}
          subtitle="Realized fee payments"
          trend="Real-time"
          trendType="positive"
          icon={CreditCard}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <MetricCard
          title="Total Outstanding Receivables"
          value={formatINR(totalOutstanding)}
          subtitle="Due from enrolled students"
          trend="Monitor"
          trendType="negative"
          icon={Receipt}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
        />

        <MetricCard
          title="Issued Receipts"
          value={payments.length}
          subtitle="Reconciled transactions"
          icon={CheckCircle2}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Filter Invoices:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white"
          >
            <option value="all">All Invoices</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Amount Paid</th>
                <th className="py-3.5 px-4">Outstanding</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-orange-700">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{inv.studentName}</td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{inv.feeDescription}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{formatINR(inv.totalAmount)}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{formatINR(inv.amountPaid)}</td>
                  <td className="py-3.5 px-4 font-bold text-rose-600">{formatINR(inv.outstandingBalance)}</td>
                  <td className="py-3.5 px-4 text-slate-500">{inv.dueDate}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {inv.outstandingBalance > 0 ? (
                      <button
                        onClick={() => openPaymentModal(inv)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
                      >
                        Record Payment
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-600">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Record Fee Payment & Issue Receipt"
        description="Updates the student's balance in the database and generates an official receipt number."
      >
        {paymentSuccessMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}

        {selectedInvoiceForPayment && (
          <form onSubmit={handleRecordPayment} className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p>
                <span className="font-semibold text-slate-700">Invoice:</span> {selectedInvoiceForPayment.invoiceNumber}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Student:</span> {selectedInvoiceForPayment.studentName}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Current Outstanding:</span>{' '}
                <span className="font-bold text-rose-600">{formatINR(selectedInvoiceForPayment.outstandingBalance)}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Amount (INR) *</label>
              <input
                type="number"
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden bg-white"
                >
                  <option value="upi">UPI / QR Code</option>
                  <option value="net_banking">Net Banking / NEFT</option>
                  <option value="cash">Cash Voucher</option>
                  <option value="cheque">Bank Cheque</option>
                  <option value="card">Debit / Credit Card</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Ref / Cheque No *</label>
                <input
                  type="text"
                  required
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="e.g. UPI txn id or Cheque number"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700"
              >
                Record & Issue Receipt
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* PRINTABLE OFFICIAL RECEIPT MODAL */}
      {activeReceipt && (
        <Modal
          isOpen={true}
          onClose={() => setActiveReceipt(null)}
          title="Official Digital Fee Receipt"
          description="Institution-stamped fee receipt issued by Shri PinnakeEdge Coaching Center."
          maxWidth="md"
        >
          <div className="p-4 border-2 border-slate-900 rounded-2xl bg-white space-y-4 print:border-black">
            <div className="text-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                SHRI PINNAKEEDGE COACHING CENTER
              </h3>
              <p className="text-[10px] text-slate-500">Official Electronic Payment Receipt</p>
              <span className="font-mono text-xs font-bold text-orange-700 mt-1 block">
                {activeReceipt.receiptNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <p><span className="font-bold text-slate-900">Student Name:</span> {activeReceipt.studentName}</p>
              <p><span className="font-bold text-slate-900">Payment Date:</span> {activeReceipt.paymentDate}</p>
              <p><span className="font-bold text-slate-900">Invoice Ref:</span> {activeReceipt.invoiceNumber}</p>
              <p><span className="font-bold text-slate-900">Payment Mode:</span> {activeReceipt.paymentMethod.toUpperCase()}</p>
              <p className="col-span-2 truncate"><span className="font-bold text-slate-900">Txn Ref:</span> {activeReceipt.referenceNumber}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Amount Paid</span>
              <span className="text-2xl font-black text-slate-900 block">{formatINR(activeReceipt.amount)}</span>
            </div>

            <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Verified & Stamped by Accounts</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Receipt
              </button>
            </div>
          </div>
        </Modal>
      )}
    </DashboardShell>
  );
}
