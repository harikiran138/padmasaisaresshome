import CheckoutForm from "@/components/shop/CheckoutForm";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata = {
    title: "Checkout | Padma Sai Collection",
    description: "Complete your acquisition of the finest heritage handloom sarees.",
};

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-[#fafafa]">
            <Navbar />
            
            <div className="container mx-auto px-4 pt-32 pb-20">
                <header className="max-w-6xl mx-auto mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-4">
                        Final <span className="text-primary italic">Acquisition</span>
                    </h1>
                    <div className="w-24 h-1 bg-primary mb-6" />
                    <p className="text-gray-500 font-medium italic">
                        Please provide your delivery details and review your collection before we finalize your selection.
                    </p>
                </header>

                <CheckoutForm />
            </div>

            <Footer />
        </main>
    );
}
