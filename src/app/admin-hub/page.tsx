import { mockAnnouncements } from '@/utils/dummyData';
import { deleteAnnouncement } from '@/actions/announcement';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import React from 'react';

export default function AdminDashboard() {
    const announcements = mockAnnouncements;

    return (
        <div className="max-w-6xl mx-auto w-full p-6 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Tüm İlanlar</h2>
                <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg shadow-md transition-all">
                    <PlusCircle className="w-5 h-5" />
                    <span>Yeni İlan</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold text-sm">
                                <th className="p-4">Tip</th>
                                <th className="p-4">Başlık</th>
                                <th className="p-4">Durum</th>
                                <th className="p-4">Oluşturulma</th>
                                <th className="p-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map((ann) => (
                                <tr key={ann.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 font-mono text-xs text-slate-400">{ann.id.split('-')[1]}</td>
                                    <td className="p-4 font-medium max-w-[200px] truncate" title={ann.title}>{ann.title}</td>
                                    <td className="p-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 rounded-full text-xs font-bold inline-block">
                                            {ann.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">
                                        {new Date(ann.createdAt).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors bg-slate-100 dark:bg-slate-800 rounded-md">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <form action={async () => {
                                                "use server";
                                                await deleteAnnouncement(ann.id);
                                            }}>
                                                <button type="submit" className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-800 rounded-md">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {announcements.length === 0 && (
                        <div className="p-8 text-center text-slate-500">Kayıtlı ilan bulunmuyor.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
