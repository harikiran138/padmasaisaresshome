import Hero from "@/components/shop/Hero";
import CategoryGrid from "@/components/shop/CategoryGrid";
import FeaturedProducts from "@/components/shop/FeaturedProducts";
import { Truck, ShieldCheck, RefreshCw, LifeBuoy } from "lucide-react";
import { getBanners, getCategories, getFeaturedProducts } from "@/app/actions/shop";

export default async function Home() {
  const [banners, categories, products] = await Promise.all([
    getBanners(),
    getCategories(),
    getFeaturedProducts()
  ]);

  return (
    <>
      <Hero banners={banners} />
      <CategoryGrid categories={categories} />
      <FeaturedProducts products={products} />

      {/* Info Strip (Trust) */}
      <section className="py-12 bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-full text-primary">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Quality Guarantee</h4>
                <p className="text-xs text-gray-500">Checked for perfection</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-full text-primary">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Fast Shipping</h4>
                <p className="text-xs text-gray-500">Safe & secure delivery</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-full text-primary">
                <RefreshCw size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Easy Returns</h4>
                <p className="text-xs text-gray-500">7-day return policy</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="p-3 bg-gray-50 rounded-full text-primary">
                <LifeBuoy size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">24/7 Support</h4>
                <p className="text-xs text-gray-500">Whatsapp & Email</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Join Our Family</h2>
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
