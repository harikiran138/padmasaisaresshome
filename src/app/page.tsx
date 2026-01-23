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

      {/* Trust & Heritage Section */}
      <section className="py-24 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <ShieldCheck size={28} />, title: "Quality Guarantee", desc: "Each piece is hand-inspected for flawlessness." },
              { icon: <Truck size={28} />, title: "Concierge Shipping", desc: "Discreet and secure door-to-door delivery." },
              { icon: <RefreshCw size={28} />, title: "Seamless Returns", desc: "A gracious 7-day windows for returns." },
              { icon: <LifeBuoy size={28} />, title: "Private Support", desc: "Personal styling and support via Whatsapp." }
            ].map((item, i) => (
              <div key={i} className="group flex flex-col items-center text-center">
                <div className="mb-6 p-5 rounded-sm bg-gray-50 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-2">
                  {item.icon}
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-[200px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Salon - Newsletter */}
      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="text-primary font-black tracking-[0.4em] uppercase text-[10px] mb-6 block">Join the Circle</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">The Inner Salon</h2>
          <p className="text-gray-400 mb-12 text-lg font-medium leading-relaxed">
            Be the first to experience our newest weaves and exclusive heritage collections. 
            A curated digest of elegance, delivered to your inbox.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto overflow-hidden rounded-sm ring-1 ring-white/10 p-1 bg-white/[0.03] backdrop-blur-xl">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="flex-1 px-8 py-5 bg-transparent text-white focus:outline-none text-[10px] font-black tracking-[0.2em] placeholder:text-gray-600"
            />
            <button className="px-10 py-5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">
              Subscribe
            </button>
          </form>
          
          <p className="mt-8 text-[9px] font-bold text-gray-600 uppercase tracking-widest">Respecting your privacy at all times.</p>
        </div>
      </section>
    </>
  );
}
