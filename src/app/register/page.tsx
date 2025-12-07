
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Side: Image/Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-primary">
                <Image
                    src="https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1968&auto=format&fit=crop"
                    alt="Elegant Silk Fabric"
                    fill
                    className="object-cover opacity-80 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-12 text-white">
                    <h1 className="text-4xl font-serif font-bold mb-4">Join Our Community</h1>
                    <p className="text-lg text-gray-200">Experience the heritage of weaving with exclusive access to our newest collections.</p>
                </div>
            </div>

            {/* Right Side: Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900">
                            Create an Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign up to start shopping
                        </p>
                    </div>

                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
