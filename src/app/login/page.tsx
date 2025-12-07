import { Suspense } from "react";
import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Side: Image/Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-primary">
                <Image
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop"
                    alt="Traditional Saree"
                    fill
                    className="object-cover opacity-80 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
                    <h1 className="text-4xl font-serif font-bold mb-4">Timeless Elegance</h1>
                    <p className="text-lg text-gray-200">Discover the finest collection of traditional and modern sarees.</p>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
