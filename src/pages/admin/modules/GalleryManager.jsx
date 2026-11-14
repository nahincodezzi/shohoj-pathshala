import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/ToastContext';
import { Image, Plus, Trash2, ExternalLink } from 'lucide-react';

export default function GalleryManager() {
  const { school, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const galleryItems = TenantRepository.getGallery(school.id);

  const [form, setForm] = useState({
    title: '',
    category: 'campus',
    image: '',
    description: ''
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    try {
      TenantRepository.createGalleryItem(school.id, form);
      showToast('ছবি সফলভাবে গ্যালারিতে যুক্ত হয়েছে!');
      setAddModalOpen(false);
      setForm({
        title: '',
        category: 'campus',
        image: '',
        description: ''
      });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (id) => {
    TenantRepository.deleteGalleryItem(school.id, id);
    showToast('ছবি মুছে ফেলা হয়েছে।');
    setDeleteId(null);
  };

  const categoryMap = {
    campus: 'ক্যাম্পাস ও প্রাঙ্গণ',
    sports: 'খেলাধুলা ও বার্ষিক ক্রীড়া',
    academic: 'ল্যাব ও বিজ্ঞান মেলা',
    cultural: 'সাংস্কৃতিক ও জাতীয় দিবস'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">ফটো গ্যালারি ব্যবস্থাপনা</h2>
          <p className="text-xs text-muted">ওয়েবসাইটের ছবির অ্যালবাম ও স্মারক আলোকচিত্রসমূহ</p>
        </div>

        {!supportMode && (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setAddModalOpen(true)}>
            নতুন ছবি যুক্ত করুন
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {galleryItems.map((item) => (
          <Card key={item.id} surface="surface" className="overflow-hidden flex flex-col justify-between p-0">
            <div className="relative aspect-video overflow-hidden bg-surface-2 group">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                {categoryMap[item.category] || item.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 className="text-sm font-bold text-text line-clamp-1">{item.title}</h4>
                <p className="text-xs text-muted line-clamp-2 mt-1">{item.description}</p>
              </div>

              {!supportMode && (
                <div className="pt-2 flex justify-end border-t border-border/80">
                  <button
                    type="button"
                    onClick={() => setDeleteId(item.id)}
                    className="p-1.5 rounded-lg text-danger hover:bg-danger-soft transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>মুছে ফেলুন</span>
                  </button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Add Photo Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="নতুন ছবি যুক্ত করুন"
          subtitle="ছবির ইউআরএল ও বিবরণ দিন"
        >
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <Input
              label="ছবির শিরোনাম"
              placeholder="e.g. বার্ষিক বিজ্ঞান মেলা ও প্রজেক্ট প্রদর্শনী"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Select
              label="অ্যালবাম ক্যাটাগরি"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={[
                { value: 'campus', label: 'ক্যাম্পাস ও প্রাঙ্গণ' },
                { value: 'sports', label: 'খেলাধুলা ও বার্ষিক ক্রীড়া' },
                { value: 'academic', label: 'ল্যাব ও বিজ্ঞান মেলা' },
                { value: 'cultural', label: 'সাংস্কৃতিক ও জাতীয় দিবস' }
              ]}
            />
            <Input
              label="ছবির ওয়েব লিঙ্ক (Image URL)"
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">সংক্ষিপ্ত বিবরণ:</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="ছবি সম্পর্কে ১-২ লাইনের বিবরণ..."
                className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" variant="primary">
                যুক্ত করুন
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <Modal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="ছবি মুছে ফেলা নিশ্চিতকরণ"
          subtitle="আপনি কি নিশ্চিতভাবে এই ছবিটি গ্যালারি থেকে অপসারণ করতে চান?"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setDeleteId(null)}>
                বাতিল
              </Button>
              <Button variant="dangerSolid" onClick={() => handleDelete(deleteId)}>
                হ্যাঁ, মুছে ফেলুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
