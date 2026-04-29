import { useState } from "react";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface CheckoutFormProps {

  onSuccess: () => Promise<void>;
  onCancel: () => void;
}

export default function CheckoutForm({ onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements, 
        confirmParams: { return_url: `${window.location.origin}/user/dashboard` },
        redirect: 'if_required'
      });
      
      if (error) {
        setPaymentError(error.message || 'Payment failed. Please try again');
        return;
      }

      await onSuccess();
      toast.success('Payment successful');
      
    } catch (error: unknown) {
        const err=error as AxiosError<{message:string}>
      setPaymentError(err?.response?.data?.message || "Payment confirmation failed. Please try again");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {paymentError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <span className="text-red-500 text-lg">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-red-600">Payment Failed</p>
            <p className="text-xs text-red-500 mt-0.5">{paymentError}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : paymentError ? 'Try Again' : 'Pay Now'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="px-5 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}


