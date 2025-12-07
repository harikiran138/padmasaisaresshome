
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. We have received your order request.<br />
                    Order ID: <span className="font-mono text-gray-900 font-bold">#{params.id.slice(-6).toUpperCase()}</span>
                </p>

                <div className="space-y-4">
                    <Link
                        href="/account?tab=orders"
                        className="block w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        View Order Details
                    </Link>
                    <Link
                        href="/"
                        className="block w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
