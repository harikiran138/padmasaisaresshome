
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    {/* Try to include an image or logo if possible, but for now just text or we can revisit logo */}
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join us to access exclusive collections
                    </p>
                </div>

                <RegisterForm />
            </div>
        </div>
    );
}
