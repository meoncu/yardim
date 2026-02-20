import { Announcement } from '../types';

export const mockAnnouncements: Announcement[] = [
    {
        id: "a-1",
        associationId: "assoc-1",
        title: "Kahramanmaraş Deprem Bölgesi Temel İhtiyaç Desteği",
        shortDescription: "Bölgedeki vatandaşlarımız için acil gıda ve hijyen paketi yardımı.",
        fullDescription: "Kış aylarının yaklaşmasıyla barınma alanlarındaki gıda, hijyen ve çocuk bezi gibi temel ihtiyaçlara yönelik kampanyamız başlatılmıştır. Desteklerinizle daha fazla aileye ulaşmayı umuyoruz.",
        images: ["https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800"],
        videos: [],
        contactInfo: {
            fullName: "Ahmet Yıldız",
            email: "ahmet@yardimp.org",
            whatsappPhone: "905551234567"
        },
        status: "active",
        featured: true,
        randomWeight: 800,
        createdAt: Date.now() - 86400000 * 2,
        updatedAt: Date.now() - 86400000,
    },
    {
        id: "a-2",
        associationId: "assoc-2",
        title: "Köy Okullarına Kitap Bağışı Kampanyası",
        shortDescription: "Geleceğimizin teminatı çocuklar için kütüphane kuruyoruz.",
        fullDescription: "Anadolu'daki 50 farklı köy okuluna ulaşmayı hedeflediğimiz bu projede, kullanılabilir durumdaki hikaye ve ders kitaplarınızı bekliyoruz.",
        images: ["https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=800"],
        videos: [],
        status: "active",
        featured: false,
        randomWeight: 450,
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now() - 86400000 * 5,
    }
];

export const mockAssociations: Record<string, { name: string, logoUrl: string }> = {
    "assoc-1": {
        name: "Umut Eli Derneği",
        logoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150"
    },
    "assoc-2": {
        name: "Eğitim Gönüllüleri Portalı",
        logoUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=150"
    }
};
