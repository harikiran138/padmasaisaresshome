"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { ShoppingBag, Truck, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Step = "details" | "review" | "payment";

export default function CheckoutForm() {
    const { cartItems, subtotal, cartCount, clearCart } = useCart();
    const { showToast } = useToast();
    const router = useRouter();
    const [step, setStep] = useState<Step>("details");
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        line1: "",
        city: "",
        state: "",
        pincode: "",
        paymentMethod: "COD"
    });

    const steps = [
        { id: "details" as Step, label: "Shipping", icon: Truck },
        { id: "review" as Step, label: "Review", icon: ShoppingBag },
        { id: "payment" as Step, label: "Payment", icon: CreditCard }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (step === "details") {
            if (!formData.fullName || !formData.email || !formData.phone || !formData.line1 || !formData.city || !formData.state || !formData.pincode) {
                showToast("error", "Incomplete Details", "Please provide all required shipping information.");
                return;
            }
            setStep("review");
        } else if (step === "review") {
            setStep("payment");
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-session-id": localStorage.getItem("cart_session_id") || ""
                },
                body: JSON.stringify({
                    address: {
                        fullName: formData.fullName,
                        line1: formData.line1,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        phone: formData.phone,
                        country: "India"
                    },
                    paymentMethod: formData.paymentMethod,
                    guestEmail: formData.email
                })
            });

            if (res.ok) {
                const data = await res.json();
                showToast("success", "Order Confirmed", "Your exquisite selection is being prepared.");
                clearCart();
                router.push(`/orders/${data.data.order.orderId || data.data.order._id}`);
            } else {
                const err = await res.json();
                showToast("error", "Checkout Failed", err.message || "Something went wrong.");
            }
        } catch (error) {
            showToast("error", "System Error", "Communication failure. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cartCount === 0 && !loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="text-gray-300" size={32} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Your Bag is Empty</h2>
                <p className="text-gray-500 italic mb-8">Begin your journey by selecting a piece from our gallery.</p>
                <button onClick={() => router.push("/shop")} className="text-xs font-black uppercase tracking-[0.2em] text-primary border-b-2 border-primary/20 pb-1 hover:border-primary transition-all">Explore Collection</button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 py-10">
            {/* Main Flow */}
            <div className="lg:col-span-8">
                {/* Step Indicators */}
                <div className="flex items-center justify-between mb-12 bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
                    {steps.map((s, idx) => {
                        const Icon = s.icon;
                        const isActive = step === s.id;
                        const isPast = steps.findIndex(x => x.id === step) > idx;
                        
                        return (
                            <div key={s.id} className="flex items-center flex-1 last:flex-none">
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                        isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" : isPast ? "bg-green-500 text-white" : "bg-gray-50 text-gray-300"
                                    }`}>
                                        {isPast ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-primary" : "text-gray-400"}`}>{s.label}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="flex-1 h-[2px] mx-4 bg-gray-50">
                                        <motion.div 
                                            initial={{ width: "0%" }}
                                            animate={{ width: isPast ? "100%" : "0%" }}
                                            className="h-full bg-primary/20"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white p-8 md:p-12 rounded-sm border border-gray-100 shadow-sm"
                    >
                        {step === "details" && (
                            <div className="space-y-8">
                                <div className="border-b border-gray-100 pb-4 mb-8">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Shipping Information</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Where should we deliver your selection?</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                                        <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-gray-50 border-none px-4 py-4 rounded-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" placeholder="Arjun Kapoor" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                                        <input name="email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border-none px-4 py-4 rounded-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" placeholder="arjun@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</label>
                                        <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border-none px-4 py-4 rounded-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" placeholder="+91 98765 43210" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pincode</label>
                                        <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-gray-50 border-none px-4 py-4 rounded-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" placeholder="500001" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Shipping Address (Line 1)</label>
                                        <input name="line1" value={formData.line1} onChange={handleChange} className="w-full bg-gray-50 border-none px-4 py-4 rounded-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" placeholder="Suite 402, Heritage Heights" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">City</label>
                                        <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border-none px-4 py-4 rounded-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" placeholder="Hyderabad" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">State</label>
                                        <input name="state" value={formData.state} onChange={handleChange} className="w-full bg-gray-50 border-none px-4 py-4 rounded-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold" placeholder="Telangana" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === "review" && (
                            <div className="space-y-8">
                                <div className="border-b border-gray-100 pb-4 mb-8">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Order Review</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Refine your selection before dispatch.</p>
                                </div>

                                <div className="space-y-4">
                                    {cartItems.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 bg-gray-50/50 rounded-sm">
                                            <div className="w-16 h-20 bg-gray-100 rounded-sm flex-shrink-0" />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-black text-gray-900">{item.product.name}</h4>
                                                <div className="flex gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                                                    <span>Size: {item.size || "Free"}</span>
                                                    <span>•</span>
                                                    <span>Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                            <div className="text-sm font-black text-primary">
                                                ₹{(item.priceAtAddTime * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-gray-900 text-white p-6 rounded-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Shipping To</span>
                                        <button onClick={() => setStep("details")} className="text-[9px] font-black uppercase tracking-widest text-primary">Edit</button>
                                    </div>
                                    <p className="text-xs font-bold">{formData.fullName}</p>
                                    <p className="text-[10px] opacity-70 mt-1">{formData.line1}, {formData.city}, {formData.pincode}</p>
                                </div>
                            </div>
                        )}

                        {step === "payment" && (
                            <div className="space-y-8">
                                <div className="border-b border-gray-100 pb-4 mb-8">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Secure Payment</h3>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">How would you like to settle your acquisition?</p>
                                </div>

                                <div className="space-y-4">
                                    <label className={`flex items-center gap-4 p-6 border-2 rounded-sm cursor-pointer transition-all ${formData.paymentMethod === "COD" ? "border-primary bg-primary/5 shadow-md" : "border-gray-100 hover:border-gray-200"}`}>
                                        <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === "COD"} onChange={handleChange} className="w-4 h-4 text-primary focus:ring-primary" />
                                        <div className="flex-1">
                                            <span className="block text-sm font-black text-gray-900 uppercase tracking-tighter">Cash on Delivery</span>
                                            <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Pay upon safe arrival</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-4 p-6 border-2 rounded-sm cursor-pointer transition-all opacity-50 grayscale ${formData.paymentMethod === "ONLINE" ? "border-primary bg-primary/5" : "border-gray-100"}`}>
                                        <input type="radio" name="paymentMethod" value="ONLINE" disabled />
                                        <div className="flex-1">
                                            <span className="block text-sm font-black text-gray-900 uppercase tracking-tighter">Digital Payment</span>
                                            <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Coming Soon: Cards & UPI</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                            {step !== "details" ? (
                                <button
                                    onClick={() => setStep(step === "review" ? "details" : "review")}
                                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>
                            ) : <div />}

                            <button
                                onClick={step === "payment" ? handleSubmit : handleNext}
                                disabled={loading}
                                className="bg-gray-900 text-white px-10 h-14 rounded-sm flex items-center gap-3 hover:bg-black transition-all shadow-xl hover:shadow-gray-200 active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                            {step === "payment" ? "Complete Order" : "Continue"}
                                        </span>
                                        <ChevronRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Side Summary */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-8 pb-4 border-b border-gray-50">Grand Summary</h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pieces ({cartCount})</span>
                            <span className="text-sm font-black text-gray-900">₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Imperial Shipping</span>
                            <span className="text-sm font-black text-green-600">FREE</span>
                        </div>
                        <div className="pt-6 mt-4 border-t border-gray-100 flex justify-between items-center text-primary">
                            <span className="text-xs font-black uppercase tracking-[0.2em]">Total Value</span>
                            <span className="text-2xl font-black italic">₹{subtotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-sm">
                        <div className="flex gap-3 items-start">
                            <CheckCircle2 size={16} className="text-primary mt-0.5" />
                            <div>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-900">Heritage Guarantee</h4>
                                <p className="text-[9px] text-gray-400 font-medium italic mt-1 leading-relaxed">Every piece is verified for quality and authenticity by our master curators.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Secured by Industry Standard SSL Encryption</p>
                </div>
            </div>
        </div>
    );
}
