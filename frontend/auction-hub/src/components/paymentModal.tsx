import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../utils/stripe";
import CheckoutForm from "./CheckoutForm";
import { useEffect } from "react";



interface PaymentModalProps{
    isOpen:boolean;
    clientSecret:string;
    paymentIntentId:string;
    auctionId:string;
    amount:number;
    onSuccess:()=>void;
    onClose:()=>void;
}

export default function PaymentModal({
    isOpen,clientSecret,
    paymentIntentId,auctionId,amount,onSuccess,onClose
}:PaymentModalProps){
    useEffect(()=>{
        if(isOpen){
            document.body.style.overflow='hidden'
        }else{
            document.body.style.overflow=''
        }
        return (()=>{document.body.style.overflow=''})
    },[isOpen]);

    if(!isOpen || !clientSecret) return null;

    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Complete Payment</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Amount:{' '}
                <span className="font-bold text-blue-600">
                  ₹{(amount / 100).toLocaleString('en-IN')}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition text-xl font-bold leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          {/* Stripe Elements — must receive clientSecret in options */}
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: { theme: 'stripe' }, // or 'night' for dark UI
            }}
          >
            <CheckoutForm
              paymentIntentId={paymentIntentId}
              auctionId={auctionId}
              onSuccess={onSuccess}
              onCancel={onClose}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}




