import Hero from "@/components/shop/Hero";
import CategoryGrid from "@/components/shop/CategoryGrid";
import FeaturedProducts from "@/components/shop/FeaturedProducts";
import { Truck, ShieldCheck, RefreshCw } from "lucide-react";

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />

      {/* Why Shop With Us */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4 text-primary">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Guarantee</h3>
              <p className="text-black">
                Every piece is quality checked to ensure the finest fabrics and stitching.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4 text-primary">
                <Truck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
              <p className="text-black">
                We ensure your order reaches you on time, safely and securely.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4 text-primary">
                <RefreshCw size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-black">
                Not satisfied? Return it easily within 7 days of delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Placeholder */}
      <section className="py-16 bg-gray-100 text-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">Join Our Family</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-96"
            />
            <button className="px-8 py-3 bg-primary text-white font-bold rounded-md hover:bg-primary/90 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
