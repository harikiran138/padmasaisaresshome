"use client";

import { useState } from "react";
import { Database } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SeedButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSeed = async () => {
        if (!confirm("Are you sure? This will DELETE all existing data and reset the database!")) return;

        setLoading(true);
        try {
            const res = await fetch("/api/seed");
            if (res.ok) {
                alert("Database seeded successfully! You can now login with admin@admin.com / admin");
                router.refresh();
            } else {
                alert("Failed to seed database.");
            }
        } catch (error) {
            console.error(error);
            alert("Error seeding database.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSeed}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
            <Database size={16} className="mr-2" />
            {loading ? "Seeding..." : "Reset & Seed Data"}
        </button>
    );
}
