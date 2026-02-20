import { Metadata } from 'next';
import { mockAnnouncements, mockAssociations } from '@/utils/dummyData';
import AnnouncementCard from '@/components/announcements/AnnouncementCard';

// Using edge/ISR caching strategy as requested in architecture
export const revalidate = 3600; // Refetch every hour

export const metadata: Metadata = {
  title: 'Aktif İlanlar - Yardım Platformu',
  description: 'Türkiye\'nin her yanındaki güncel yardım kampanyalarına ve ilanlara ulaşın.',
};

export default function HomePage() {
  // In a real application, we'd fetch from Firestore via Server Action here
  // const announcements = await getActiveAnnouncements();

  // Sort naturally but mimic random weighting requirement
  const sorted = [...mockAnnouncements].sort((a, b) => b.randomWeight - a.randomWeight);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <section className="relative px-4 py-8 sm:py-16 text-center rounded-3xl overflow-hidden glass-panel border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Beraber Daha Güçlüyüz.
        </h2>
        <p className="max-w-xl mx-auto text-lg text-foreground/80 leading-relaxed font-medium">
          Doğrulanmış yardım dernekleriyle doğrudan iletişim kurun.
          Destek verin, umut olun. İlanları hemen WhatsApp üzerinden detaylandırın.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6 px-2">
          <h3 className="text-xl font-bold border-l-4 border-accent pl-3 text-foreground/90 py-1">
            Öne Çıkan Kampanyalar
          </h3>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
            {sorted.length} İlan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {sorted.map((ann, idx) => (
            <div
              key={ann.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <AnnouncementCard
                announcement={ann}
                associationProps={mockAssociations[ann.associationId]}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
