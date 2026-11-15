import React from 'react';
import UtilityBar from './sections/UtilityBar';
import SchoolHeader from './sections/SchoolHeader';
import UrgentTicker from './sections/UrgentTicker';
import HeroSlider from './sections/HeroSlider';
import BrandPatternHero from './fallbacks/BrandPatternHero';
import StatsGlass from './sections/StatsGlass';
import QuickAccess from './sections/QuickAccess';
import HeadMessage from './sections/HeadMessage';
import Departments from './sections/Departments';
import Facilities from './sections/Facilities';
import NoticeBoard from './sections/NoticeBoard';
import GalleryBento from './sections/GalleryBento';
import DressCodeBand from './sections/DressCodeBand';
import ContactMap from './sections/ContactMap';
import SchoolFooter from './sections/SchoolFooter';
import BottomTabBar from './sections/BottomTabBar';

/**
 * SchoolHome Component (Section 0, 6 & 10)
 * Master assembly for the individual school homepage.
 * Alternating section backgrounds:
 * 1. Hero: --bg
 * 2. Stats (Overlap onto Hero)
 * 3. Quick Access: --bg-alt
 * 4. Head Message: --bg
 * 5. Departments: --bg-alt
 * 6. Facilities: --bg
 * 7. Notice Board: --bg-alt
 * 8. Gallery Bento: --bg
 * 9. Dress Code Band: Outline Gold band
 * 10. Contact & Map: --bg
 * 11. Footer: --bg-alt
 */
export default function SchoolHome({
  school,
  settings,
  headmaster,
  academicGroups = [],
  features,
  sections = {},
  sliders = [],
  notices = [],
  facilities = [],
  gallery = [],
  videos = [],
  teachers = [],
  students = [],
  uniform = null,
  urgentNotice = null,
  stats = {},
  navItems = [],
  bottomTabs = [],
  mode = 'dark',
  theme = 'emerald',
  lang = 'bn',
  fontSize = 'md',
  onToggleMode,
  onToggleLang,
  onSetFontSize,
  onNavigate,
  onOpenNotice,
  onOpenLightbox,
  onOpenVideo,
  onOpenTrackingModal,
  onOpenUniform,
  onQuickResultSearch,
  onDirectApply
}) {
  const showAdmissions = Boolean(features?.admissionForm);
  const showResults = Boolean(features?.resultSearch);
  const showTracking = Boolean(features?.admissionTrack);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors relative pb-16 xl:pb-0">
      {/* 6.1 Top Utility Bar */}
      <UtilityBar
        school={school}
        lang={lang}
        fontSize={fontSize}
        onToggleLang={onToggleLang}
        onSetFontSize={onSetFontSize}
      />

      {/* 6.2 Sticky Glass Header & Navigation */}
      <SchoolHeader
        school={school}
        navItems={navItems}
        mode={mode}
        theme={theme}
        lang={lang}
        fontSize={fontSize}
        onToggleMode={onToggleMode}
        onToggleLang={onToggleLang}
        onSetFontSize={onSetFontSize}
      />

      {/* 6.3 Urgent Notice Ticker */}
      {urgentNotice && (
        <UrgentTicker
          urgentNotice={urgentNotice}
          lang={lang}
          onNoticeClick={onOpenNotice}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 6.4 Hero Section (Slider or Fallback Theme Pattern) */}
        {sliders && sliders.length > 0 ? (
          <HeroSlider
            school={school}
            sliders={sliders}
            features={features}
            lang={lang}
            onApplyClick={() => onNavigate('admission')}
            onResultClick={() => onNavigate('results')}
          />
        ) : (
          <BrandPatternHero
            school={school}
            lang={lang}
            onApplyClick={() => onNavigate('admission')}
            onResultClick={() => onNavigate('results')}
          />
        )}

        {/* 6.5 Stats Glass Overlap */}
        {sections.stats !== false && (
          <StatsGlass
            school={school}
            stats={stats}
            studentsCount={students.length}
            teachersCount={teachers.length}
            lang={lang}
          />
        )}

        {/* 6.6 Quick Access 3-Card Band */}
        <QuickAccess
          school={school}
          features={features}
          lang={lang}
          onNavigate={onNavigate}
          onQuickResultSearch={onQuickResultSearch}
          onTrackClick={onOpenTrackingModal}
          onApplyClick={onDirectApply || (() => onNavigate('admission'))}
        />

        {/* 6.7 Headmaster / Principal Message */}
        {sections.message !== false && (
          <HeadMessage
            school={school}
            settings={settings}
            headmaster={headmaster}
            teachers={teachers}
            sections={sections}
            lang={lang}
          />
        )}

        {/* 6.8 Academic Departments */}
        {sections.departments !== false && (
          <Departments
            school={school}
            settings={settings}
            academicGroups={academicGroups}
            sections={sections}
            lang={lang}
          />
        )}

        {/* 6.9 Facilities */}
        {sections.facilities !== false && (
          <Facilities
            facilities={facilities}
            sections={sections}
            lang={lang}
          />
        )}

        {/* 6.10 Notice Board */}
        {sections.notices !== false && (
          <NoticeBoard
            notices={notices}
            sections={sections}
            lang={lang}
            onOpenNotice={onOpenNotice}
          />
        )}

        {/* 6.11 Photo & Video Gallery Bento */}
        {sections.gallery !== false && (
          <GalleryBento
            gallery={gallery}
            videos={videos}
            sections={sections}
            lang={lang}
            onOpenLightbox={onOpenLightbox}
          />
        )}

        {/* 6.12 Dress Code Strip */}
        {sections.uniform !== false && (
          <DressCodeBand
            uniform={uniform}
            sections={sections}
            lang={lang}
            onOpenUniform={onOpenUniform || (() => onNavigate('uniform'))}
          />
        )}

        {/* 6.13 Contact & Map */}
        {sections.contact !== false && (
          <ContactMap
            school={school}
            lang={lang}
          />
        )}
      </main>

      {/* 6.14 School Footer */}
      <SchoolFooter
        school={school}
        navItems={navItems}
        lang={lang}
      />

      {/* 8. Fixed Bottom Mobile Tab Bar */}
      <BottomTabBar
        tabs={bottomTabs}
        lang={lang}
      />
    </div>
  );
}
