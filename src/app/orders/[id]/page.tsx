import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { CheckCircle2, Package, MapPin, Truck, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen bg-[#fafafa]">
            <Navbar />
            
            <div className="container mx-auto px-4 pt-40 pb-20">
                <div className="max-w-2xl mx-auto bg-white p-10 md:p-16 rounded-sm border border-gray-100 shadow-xl text-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="text-green-500" size={48} />
                    </div>
                    
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                        Acquisition <span className="text-primary italic">Confirmed</span>
                    </h1>
                    <p className="text-gray-500 font-medium italic mb-8">
                        Your exquisite choice is now part of our heritage. We have received your order and our master curators are preparing it for shipment.
                    </p>

                    <div className="bg-gray-50 p-6 rounded-sm text-left mb-10 border border-gray-100">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Reference</span>
                            <span className="text-sm font-black text-gray-900">#{params.id}</span>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <Package size={14} className="text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Preparation</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">Estimated Dispatch: 2-3 Business Days</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link href="/shop" className="bg-gray-900 text-white px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg">
                            Continue Journey
                        </Link>
                        <Link href="/" className="bg-white text-gray-900 border border-gray-100 px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all">
                            Back to Gallery
                        </Link>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto mt-12 text-center text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">
                    Thank you for choosing Padma Sai Saree Home
                </div>
            </div>

            <Footer />
        </main>
    );
}
