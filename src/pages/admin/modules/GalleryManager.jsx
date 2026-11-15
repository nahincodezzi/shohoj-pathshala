import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TenantRepository } from '../../../services/tenantStorage';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import FileUpload from '../../../components/ui/FileUpload';
import { useToast } from '../../../components/ui/ToastContext';
import { Image, Plus, Trash2, Edit2, Film, Play, ExternalLink } from 'lucide-react';

export default function GalleryManager() {
  const { school, supportMode } = useOutletContext();
  const { showToast } = useToast();

  const [activeSubTab, setActiveSubTab] = useState('photos'); // 'photos', 'videos'

  // Photos state
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [deletePhotoId, setDeletePhotoId] = useState(null);
  const galleryItems = TenantRepository.getGallery(school.id);

  const [photoForm, setPhotoForm] = useState({
    title: '',
    category: 'campus',
    image: '',
    description: ''
  });

  // Videos state
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [deleteVideoId, setDeleteVideoId] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const videoItems = TenantRepository.getVideos(school.id);

  const [videoForm, setVideoForm] = useState({
    title: '',
    category: 'campus',
    embed_url: '',
    duration: '০৩:৪৫',
    description: ''
  });

  const categoryMap = {
    campus: 'ক্যাম্পাস ও প্রাঙ্গণ',
    sports: 'খেলাধুলা ও বার্ষিক ক্রীড়া',
    academic: 'ল্যাব ও বিজ্ঞান মেলা',
    cultural: 'সাংস্কৃতিক ও জাতীয় দিবস'
  };

  // Open Photo Modals
  const openAddPhoto = () => {
    setEditingPhoto(null);
    setPhotoForm({
      title: '',
      category: 'campus',
      image: '',
      description: ''
    });
    setPhotoModalOpen(true);
  };

  const openEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setPhotoForm({
      title: photo.title,
      category: photo.category,
      image: photo.image,
      description: photo.description || ''
    });
    setPhotoModalOpen(true);
  };

  // Submit Photo (Add / Edit)
  const handlePhotoSubmit = (e) => {
    e.preventDefault();
    if (!photoForm.image) {
      showToast('ছবির ফাইল আপলোড করা আবশ্যক', 'error');
      return;
    }
    try {
      if (editingPhoto) {
        TenantRepository.updateGalleryItem(school.id, editingPhoto.id, photoForm);
        showToast('ছবি সফলভাবে হালনাগাদ করা হয়েছে!');
      } else {
        TenantRepository.createGalleryItem(school.id, photoForm);
        showToast('ছবি সফলভাবে ফটো অ্যালবামে যুক্ত হয়েছে!');
      }
      setPhotoModalOpen(false);
      setEditingPhoto(null);
    } catch (err) {
      showToast(err.message || 'ছবি সংরক্ষণে ত্রুটি হয়েছে', 'error');
    }
  };

  const handleDeletePhoto = (id) => {
    TenantRepository.deleteGalleryItem(school.id, id);
    showToast('ছবি মুছে ফেলা হয়েছে।');
    setDeletePhotoId(null);
  };

  // Open Video Modals
  const openAddVideo = () => {
    setEditingVideo(null);
    setVideoForm({
      title: '',
      category: 'campus',
      embed_url: '',
      duration: '০৩:৪৫',
      description: ''
    });
    setVideoModalOpen(true);
  };

  const openEditVideo = (video) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      category: video.category,
      embed_url: video.embed_url,
      duration: video.duration || '০৩:৪৫',
      description: video.description || ''
    });
    setVideoModalOpen(true);
  };

  // Submit Video (Add / Edit)
  const handleVideoSubmit = (e) => {
    e.preventDefault();
    if (!videoForm.embed_url) {
      showToast('ভিডিও আপলোড অথবা ভিডিও লিংক প্রদান আবশ্যক', 'error');
      return;
    }
    try {
      if (editingVideo) {
        TenantRepository.updateVideoItem(school.id, editingVideo.id, videoForm);
        showToast('ভিডিও সফলভাবে হালনাগাদ করা হয়েছে!');
      } else {
        TenantRepository.createVideoItem(school.id, videoForm);
        showToast('ভিডিও সফলভাবে গ্যালারিতে যুক্ত হয়েছে!');
      }
      setVideoModalOpen(false);
      setEditingVideo(null);
    } catch (err) {
      showToast(err.message || 'ভিডিও সংরক্ষণে ত্রুটি হয়েছে', 'error');
    }
  };

  const handleDeleteVideo = (id) => {
    TenantRepository.deleteVideoItem(school.id, id);
    showToast('ভিডিও মুছে ফেলা হয়েছে।');
    setDeleteVideoId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-text">মিডিয়া ও গ্যালারি ব্যবস্থাপনা</h2>
          <p className="text-xs text-muted">ফটোগ্রাফি অ্যালবাম এবং ভিডিও কর্নার কনটেন্ট আপলোড ও সম্পূর্ণ নিয়ন্ত্রণ</p>
        </div>

        {!supportMode && (
          <div className="flex items-center gap-2">
            {activeSubTab === 'photos' ? (
              <Button variant="primary" size="md" icon={Plus} onClick={openAddPhoto}>
                নতুন ছবি যুক্ত করুন
              </Button>
            ) : (
              <Button variant="primary" size="md" icon={Plus} onClick={openAddVideo}>
                নতুন ভিডিও যুক্ত করুন
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Segmented Sub Tabs */}
      <div className="flex items-center gap-2 p-1 bg-surface-2 rounded-xl border border-border max-w-sm">
        <button
          type="button"
          onClick={() => setActiveSubTab('photos')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'photos'
              ? 'bg-surface text-primary shadow-xs'
              : 'text-muted hover:text-text'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>ফটো অ্যালবাম ({galleryItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('videos')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'videos'
              ? 'bg-surface text-primary shadow-xs'
              : 'text-muted hover:text-text'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>ভিডিও কর্নার ({videoItems.length})</span>
        </button>
      </div>

      {/* ==================== SUB-TAB 1: PHOTOS ==================== */}
      {activeSubTab === 'photos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
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
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/80">
                    <button
                      type="button"
                      onClick={() => openEditPhoto(item)}
                      className="p-1.5 rounded-lg text-primary hover:bg-primary-soft transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>সম্পাদনা</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletePhotoId(item.id)}
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
      )}

      {/* ==================== SUB-TAB 2: VIDEOS ==================== */}
      {activeSubTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {videoItems.map((v) => (
            <Card key={v.id} surface="surface" className="overflow-hidden flex flex-col justify-between p-0">
              <div 
                className="relative aspect-video overflow-hidden bg-black group cursor-pointer flex items-center justify-center"
                onClick={() => setPreviewVideo(v)}
              >
                {v.embed_url?.startsWith('data:video') ? (
                  <video src={v.embed_url} className="w-full h-full object-cover opacity-80" />
                ) : v.thumbnail ? (
                  <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
                    <Film className="w-12 h-12" />
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/90 text-on-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>

                {/* Duration Badge */}
                {v.duration && (
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white backdrop-blur-xs">
                    {v.duration}
                  </span>
                )}

                {/* Category Badge */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                  {categoryMap[v.category] || v.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-text line-clamp-1">{v.title}</h4>
                  <p className="text-xs text-muted line-clamp-2 mt-1">{v.description}</p>
                </div>

                {!supportMode && (
                  <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/80">
                    <button
                      type="button"
                      onClick={() => openEditVideo(v)}
                      className="p-1.5 rounded-lg text-primary hover:bg-primary-soft transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>সম্পাদনা</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteVideoId(v.id)}
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
      )}

      {/* ================= MODAL: ADD / EDIT PHOTO ================= */}
      {photoModalOpen && (
        <Modal
          isOpen={photoModalOpen}
          onClose={() => setPhotoModalOpen(false)}
          title={editingPhoto ? 'ছবি সম্পাদনা করুন' : 'নতুন ছবি যুক্ত করুন'}
          subtitle="ফটো ফাইল আপলোড করুন ও অ্যালবামের তথ্য দিন"
        >
          <form onSubmit={handlePhotoSubmit} className="space-y-4">
            <Input
              label="ছবির শিরোনাম"
              placeholder="e.g. বার্ষিক বিজ্ঞান মেলা ও প্রজেক্ট প্রদর্শনী"
              value={photoForm.title}
              onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
              required
            />
            <Select
              label="অ্যালবাম ক্যাটাগরি"
              value={photoForm.category}
              onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
              options={[
                { value: 'campus', label: 'ক্যাম্পাস ও প্রাঙ্গণ' },
                { value: 'sports', label: 'খেলাধুলা ও বার্ষিক ক্রীড়া' },
                { value: 'academic', label: 'ল্যাব ও বিজ্ঞান মেলা' },
                { value: 'cultural', label: 'সাংস্কৃতিক ও জাতীয় দিবস' }
              ]}
            />

            <FileUpload
              label="ছবি ফাইল আপলোড করুন"
              helperText="JPG, PNG ফরম্যাট। স্বয়ংক্রিয়ভাবে অপ্টিমাইজ হবে (১৬:৯ অনুপাত)"
              type="image"
              aspectRatio="video"
              value={photoForm.image}
              onChange={(val) => setPhotoForm({ ...photoForm, image: val })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">সংক্ষিপ্ত বিবরণ:</label>
              <textarea
                rows={2}
                value={photoForm.description}
                onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                placeholder="ছবি সম্পর্কে ১-২ লাইনের বিবরণ..."
                className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setPhotoModalOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" variant="primary">
                {editingPhoto ? 'হালনাগাদ করুন' : 'ফটো যুক্ত করুন'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: ADD / EDIT VIDEO ================= */}
      {videoModalOpen && (
        <Modal
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          title={editingVideo ? 'ভিডিও সম্পাদনা করুন' : 'নতুন ভিডিও যুক্ত করুন'}
          subtitle="ভিডিও ফাইল আপলোড করুন অথবা ইউটিউব ভিডিও লিঙ্ক দিন"
        >
          <form onSubmit={handleVideoSubmit} className="space-y-4">
            <Input
              label="ভিডিও শিরোনাম"
              placeholder="e.g. বার্ষিক সাংস্কৃতিক অনুষ্ঠান ও পুরস্কার বিতরণী"
              value={videoForm.title}
              onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="ভিডিও ক্যাটাগরি"
                value={videoForm.category}
                onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                options={[
                  { value: 'campus', label: 'ক্যাম্পাস ও প্রাঙ্গণ' },
                  { value: 'sports', label: 'খেলাধুলা ও বার্ষিক ক্রীড়া' },
                  { value: 'academic', label: 'ল্যাব ও বিজ্ঞান মেলা' },
                  { value: 'cultural', label: 'সাংস্কৃতিক ও জাতীয় দিবস' }
                ]}
              />
              <Input
                label="ভিডিওর ব্যাপ্তি (Duration)"
                placeholder="e.g. ০৪:২০"
                value={videoForm.duration}
                onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
              />
            </div>

            <FileUpload
              label="ভিডিও ক্লিপ আপলোড করুন (MP4/WebM)"
              helperText="ভিডিও ফাইল আপলোড করুন (সর্বোচ্চ ১০ মেগাবাইট)"
              type="video"
              accept="video/mp4,video/webm"
              value={videoForm.embed_url}
              onChange={(val) => setVideoForm({ ...videoForm, embed_url: val })}
            />

            <Input
              label="অথবা ইউটিউব ভিডিও লিঙ্ক (YouTube Embed/URL)"
              placeholder="e.g. https://www.youtube.com/embed/..."
              value={videoForm.embed_url?.startsWith('data:') ? '' : videoForm.embed_url}
              onChange={(e) => setVideoForm({ ...videoForm, embed_url: e.target.value })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text">ভিডিও বিবরণ:</label>
              <textarea
                rows={2}
                value={videoForm.description}
                onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                placeholder="ভিডিও সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                className="w-full rounded-[10px] bg-surface-2 border border-border text-text p-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setVideoModalOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" variant="primary">
                {editingVideo ? 'হালনাগাদ করুন' : 'ভিডিও যুক্ত করুন'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: PLAY VIDEO ================= */}
      {previewVideo && (
        <Modal
          isOpen={!!previewVideo}
          onClose={() => setPreviewVideo(null)}
          title={previewVideo.title}
          subtitle={`ক্যাটাগরি: ${categoryMap[previewVideo.category] || previewVideo.category} • ব্যাপ্তি: ${previewVideo.duration}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {previewVideo.embed_url?.startsWith('data:video') ? (
                <video src={previewVideo.embed_url} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <iframe
                  src={previewVideo.embed_url}
                  title={previewVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            {previewVideo.description && (
              <p className="text-xs text-muted leading-relaxed">
                {previewVideo.description}
              </p>
            )}
            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="secondary" size="sm" onClick={() => setPreviewVideo(null)}>
                বন্ধ করুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: DELETE PHOTO CONFIRM ================= */}
      {deletePhotoId && (
        <Modal
          isOpen={!!deletePhotoId}
          onClose={() => setDeletePhotoId(null)}
          title="ছবি মুছে ফেলা নিশ্চিতকরণ"
          subtitle="আপনি কি নিশ্চিতভাবে এই ছবিটি গ্যালারি থেকে অপসারণ করতে চান?"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setDeletePhotoId(null)}>
                বাতিল
              </Button>
              <Button variant="dangerSolid" onClick={() => handleDeletePhoto(deletePhotoId)}>
                হ্যাঁ, মুছে ফেলুন
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: DELETE VIDEO CONFIRM ================= */}
      {deleteVideoId && (
        <Modal
          isOpen={!!deleteVideoId}
          onClose={() => setDeleteVideoId(null)}
          title="ভিডিও মুছে ফেলা নিশ্চিতকরণ"
          subtitle="আপনি কি নিশ্চিতভাবে এই ভিডিওটি অপসারণ করতে চান?"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="secondary" onClick={() => setDeleteVideoId(null)}>
                বাতিল
              </Button>
              <Button variant="dangerSolid" onClick={() => handleDeleteVideo(deleteVideoId)}>
                হ্যাঁ, মুছে ফেলুন
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
