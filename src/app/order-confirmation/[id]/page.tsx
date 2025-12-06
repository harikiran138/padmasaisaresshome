import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }> | { id: string };
}

export default async function OrderConfirmationPage({ params }: PageProps) {
    const resolvedParams = params instanceof Promise ? await params : await Promise.resolve(params);
    const { id } = resolvedParams;

    await connectToDatabase();
    const order = await Order.findById(id).lean();

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Order not found.</p>
            </div>
        );
    }

    // Calculate estimated delivery
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="text-green-500 w-16 h-16" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for shopping with Padma Sai Sarees Home. Your order ID is <span className="font-mono font-medium text-gray-900">#{order._id.toString()}</span>.
                </p>

                <div className="bg-gray-50 p-6 rounded-md mb-8 text-left">
                    <h3 className="font-bold text-gray-900 mb-4">Order Details</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Amount Paid:</span> ₹{order.totalPrice}</p>
                        <p><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                        <p><span className="font-medium">Estimated Delivery:</span> {deliveryDate.toDateString()}</p>
                        <p><span className="font-medium">Shipping To:</span> {order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                    </div>
                </div>

                <Link
                    href="/shop"
                    className="inline-block px-8 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
