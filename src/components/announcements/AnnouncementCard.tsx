"use client";

import Image from "next/image";
import { type Announcement } from "@/types";
import { MessageCircle, Share2 } from "lucide-react";
import React, { useState } from "react";

interface Props {
    announcement: Announcement;
    associationProps: { name: string; logoUrl: string };
}

export default function AnnouncementCard({ announcement, associationProps }: Props) {
    const [copied, setCopied] = useState(false);

    const getWhatsappLink = () => {
        // Falls back to generic phone if individual is missing
        const phone = announcement.contactInfo?.whatsappPhone || "905551234567";
        const text = `Merhaba, platformdaki ilanınız için ulaşıyorum:\n📌 ${announcement.title}\nID: ${announcement.id}\n\nDetaylı bilgi alabilir miyim?`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };

    const handleShare = async () => {
        const shareData = {
            title: announcement.title,
            text: announcement.shortDescription,
            url: window.location.href, // Or absolute detail link
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.warn(err);
            }
        } else {
            navigator.clipboard.writeText(shareData.url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const timeAgo = (ts: number) => {
        const diffDays = Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Bugün";
        if (diffDays === 1) return "Dün";
        return `${diffDays} gün önce`;
    };

    return (
        <div className="relative flex flex-col group overflow-hidden rounded-[1.5rem] bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Featured Badge */}
            {announcement.featured && (
                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-[#e11d48] text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg uppercase tracking-wider backdrop-blur-md bg-opacity-90">
                    Öne Çıkan
                </div>
            )}

            {/* Hero Image */}
            <div className="relative h-56 sm:h-64 w-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                <Image
                    src={announcement.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'}
                    alt={announcement.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={announcement.featured}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>

            {/* Card Content Base */}
            <div className="relative flex flex-col flex-1 p-5 lg:p-6 -mt-10 rounded-t-3xl bg-white dark:bg-slate-900 z-10 transition-colors">

                {/* Association Badge Header */}
                <div className="flex items-center gap-3 mb-4 shrink-0 mt-[-2.5rem] p-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-full shadow-sm w-fit max-w-[90%] self-end">
                    <Image
                        src={associationProps.logoUrl}
                        alt={associationProps.name}
                        width={32}
                        height={32}
                        className="rounded-full shrink-0 border border-black/10 shadow-sm object-cover"
                    />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 pr-3 tracking-tight">
                        {associationProps.name}
                    </span>
                </div>

                <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
                        İlan Tarihi: {timeAgo(announcement.createdAt)}
                    </p>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white leading-tight">
                        {announcement.title}
                    </h3>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                        {announcement.shortDescription}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <a
                        href={getWhatsappLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-md shadow-[#25D366]/20 active:scale-[0.98]"
                    >
                        <MessageCircle className="w-5 h-5 fill-current" />
                        <span className="truncate">Sor & Detay Al</span>
                    </a>

                    <button
                        onClick={handleShare}
                        className="shrink-0 flex items-center justify-center p-3 sm:px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 active:scale-[0.98]"
                    >
                        <Share2 className="w-5 h-5" />
                        <span className="hidden sm:inline ml-2 text-sm font-semibold">
                            {copied ? 'Kopyalandı' : 'Paylaş'}
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
}
