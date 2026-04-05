import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { getSubscription, createSubscriptionPaymentIntent, confirmSubscriptionPayment } from "../../api/User/subscription";
import PaymentModal from "../../components/paymentModal";
import { getAllSubscriptionPlan } from "../../api/Admin/subscription";
import { flushSync } from "react-dom";
import type { RootState } from "../../redux/store";
import { AxiosError } from "axios";

interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    auctionsPerYear: number;
    maxDays: string;
    hasLive: boolean;
    commission: number;
}
interface ActiveSubscription {
    planId: string,
    status: string,
    endDate: string,
}

const getPlanFeatures = (plan: SubscriptionPlan): string[] => [
    `Up to ${plan.auctionsPerYear} auctions Per Year`,
    `Max auction duration:${plan.maxDays} days `,
    plan.hasLive ? 'live auction included' : 'Timed Auctions only',
    `${plan.commission}% platform commission`
];

export default function SubscriptionPlans() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const [paymentSession, setPaymentSession] = useState<{ clientSecret: string, paymentIntentId: string, amount: number, planId: string, planName: string } | null>(null);
    const [initiating, setInitiating] = useState<string | null>(null);

    const fetchPlans = async () => {
        try {
            const res = await getAllSubscriptionPlan();
            setPlans(res.data.data || []);
        } catch (error) {
            console.error('Error fetching plans', error)
        } finally {
            setLoading(false);
        }
    }
    const fetchUserSubscription = async () => {
        try {
            const res = await getSubscription();
            if (res.data && res.data.success) {
                setActiveSubscription(res.data.data.subscription);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchPlans();
        if (currentUser) {
            fetchUserSubscription();
        }
    }, [currentUser])
    const handleSubscribe = async (planId: string, planName: string) => {
        if (!currentUser) {
            toast.error("Please login to subscribe");
            return;
        }
        flushSync(()=>{
            setInitiating(planId);;
        })
        try {
            const res = await createSubscriptionPaymentIntent(planId, planName);
            setPaymentSession({
                clientSecret: res.data.data.clientSecret,
                paymentIntentId: res.data.data.paymentIntentId,
                amount: res.data.data.amount,
                planId: planId,
                planName: planName
            });
        } catch (error: unknown) {
            const err=error as AxiosError<{message:string}>
            toast.error(err.response?.data?.message || "Failed to initiate payment");
        } finally {
            setInitiating(null);
        }
    }
    const handlePaymentSuccess = async () => {
        if (!paymentSession) return;

        try {
            await confirmSubscriptionPayment(
                paymentSession.paymentIntentId,
                paymentSession.planId,
                paymentSession.planName
            );

            toast.success(`Successfully subscribed to ${paymentSession.planName}!`);
            setPaymentSession(null);
            fetchUserSubscription(); // Refresh their status!
        } catch (error: unknown) {
            const err=error as AxiosError<{message:string}>
            toast.error(err.response?.data?.message || "Subscription activation failed");
        }
    };
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Power Up Your Bidding
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose the perfect plan to boost your auction experience and increase your chances of winning.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch max-w-6xl mx-auto">
                    {plans.map((plan) => {
                        const isActive = activeSubscription?.planId === plan.id && activeSubscription?.status === 'active';
                        const isPremium = plan.name.toLowerCase() === 'premium';
                        const currentActivePlan=plans.find(p=>p.id === activeSubscription?.planId);
                        const isLowerPlan=currentActivePlan && plan.price <= currentActivePlan.price && plan.id !== currentActivePlan.id;
                        const upgradePrice=currentActivePlan? plan.price-currentActivePlan.price :plan.price;
                        return (
                            <div
                                key={plan.id}
                                className={`relative flex flex-col bg-white rounded-3xl p-8 shadow-sm border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
                                     ${isActive ? "border-green-500 ring-4 ring-green-500/10" :
                                        isPremium ? "border-blue-500 shadow-blue-500/20" : "border-gray-100"} `}
                            >
                                {isPremium && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-sm">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <div className="mb-6 border-b border-gray-100 pb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h2>
                                    {/* <p className="text-gray-500 text-sm h-10">{plan.description}</p> */}
                                </div>
                                {/* <div className="mb-8 flex items-baseline gap-2">
                                    <span className="text-5xl font-extrabold text-gray-900">₹{plan.price}</span>
                                    <span className="text-gray-500 font-medium">/mo</span>
                                </div> */}
                                <div className="mb-8 flex items-baseline gap-2">
    <span className="text-5xl font-extrabold text-gray-900">
        ₹{currentActivePlan && plan.id !== currentActivePlan.id && plan.price > currentActivePlan.price 
            ? upgradePrice 
            : plan.price}
    </span>
    <span className="text-gray-500 font-medium">/mo</span>
</div>

                                <ul className="flex-grow space-y-4 mb-8">
                                    {getPlanFeatures(plan).map((feature, i) => (
                                        <li key={i} className="flex items-start text-gray-600">
                                            <svg className={`w-5 h-5 mr-3 mt-0.5 flex-shrink-0 ${isPremium ? 'text-blue-500' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span className="text-[15px] font-medium leading-tight">{feature}</span>
                                        </li>
                                    ))}

                                </ul>
                                {isActive ? (
                                    <div className="mt-auto bg-green-50 text-green-700 py-3.5 px-4 rounded-xl flex items-center justify-center font-bold">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                        Active Plan
                                    </div>
                                ) : (
                                    <button
                                        className={`mt-auto w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-200 
                                            ${isPremium
                                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                                                : "bg-gray-900 hover:bg-gray-800 text-white"
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        onClick={() => handleSubscribe(plan.id, plan.name)}
                                        disabled={initiating===plan.id || isLowerPlan}
                                    >
                                        {/* {initiating===plan.id ? 'Preparing...' : `Subscribe to ${plan.name}`} */}
                                        {initiating === plan.id ? 'Preparing...' : isLowerPlan ? 'Lower Plan' : currentActivePlan 
                                    ? `Upgrade to ${plan.name}` 
                                    : `Subscribe to ${plan.name}`}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </main>
            <Footer />
            {/* Reusing our Generic Payment Modal! */}
            {paymentSession && (
                <PaymentModal
                    isOpen={true}
                    clientSecret={paymentSession.clientSecret}
                    amount={paymentSession.amount}
                    title={`Subscribe to ${paymentSession.planName}`}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => setPaymentSession(null)}
                />
            )}
        </div>
    )
}