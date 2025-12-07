import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6">
                            PADMA SAI <span className="text-secondary">SAREES HOME</span>
                        </h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Everyday fashion. Everyday you. We bring you the finest collection of traditional and contemporary wear, crafted with love and tradition.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-secondary transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-secondary transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-secondary transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-gray-100">Shop</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/shop?category=Women" className="text-gray-400 hover:text-white transition-colors">
                                    Women
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=Men" className="text-gray-400 hover:text-white transition-colors">
                                    Men
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=Kids" className="text-gray-400 hover:text-white transition-colors">
                                    Kids
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?sort=newest" className="text-gray-400 hover:text-white transition-colors">
                                    New Arrivals
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-gray-100">Help</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/track-order" className="text-gray-400 hover:text-white transition-colors">
                                    Track Order
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                                    Returns & Exchanges
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6 text-gray-100">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-400">
                                <MapPin size={20} className="mt-1 flex-shrink-0 text-secondary" />
                                <span>123 Fashion Street, Hyderabad, Telangana, 500001</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Phone size={20} className="flex-shrink-0 text-secondary" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400">
                                <Mail size={20} className="flex-shrink-0 text-secondary" />
                                <span>support@padmasaisarees.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Padma Sai Sarees Home. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
