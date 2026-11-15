import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePublicSchool } from './hooks/usePublicSchool';
import { useSchoolPrefs } from './hooks/useSchoolPrefs';
import { useNavItems } from './hooks/useNavItems';
import SchoolMeta from './seo/SchoolMeta';
import SchoolNotFound from './pages/SchoolNotFound';
import SchoolClosed from './pages/SchoolClosed';
import SchoolHome from './SchoolHome';

/**
 * SchoolGate Component (Section 1.3 & 10)
 * Tenant Resolution & Access Controller:
 * 1. Checks slug against reserved list & tenant database
 * 2. If not found -> SchoolNotFound (404)
 * 3. If closed (disabled) -> SchoolClosed
 * 4. If live / limited -> Injects SEO metadata & renders SchoolHome
 */
export default function SchoolGate({
  activeTab = 'home',
  onNavigate,
  onOpenNotice,
  onOpenLightbox,
  onOpenVideo,
  onOpenTrackingModal,
  onOpenUniform,
  onQuickResultSearch,
  onDirectApply,
  children
}) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    availability,
    school,
    plan,
    features,
    sections,
    sliders,
    notices,
    facilities,
    gallery,
    videos,
    teachers,
    students,
    settings,
    uniform,
    stats,
    urgentNotice
  } = usePublicSchool(slug);

  const {
    mode,
    theme,
    lang,
    fontSize,
    toggleMode,
    toggleLang,
    setFontSize
  } = useSchoolPrefs(slug, school?.theme);

  const handleNavigate = useCallback((target) => {
    if (onNavigate) {
      onNavigate(target);
    } else {
      // Default in-page anchor scrolling or tab navigation
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [onNavigate]);

  const { navItems, bottomTabs } = useNavItems({
    features,
    sections,
    lang,
    onNavigate: handleNavigate
  });

  // 1. Not Found Check
  if (availability === 'not_found' || !school) {
    return <SchoolNotFound slug={slug} lang={lang} />;
  }

  // 2. Closed / Suspended Check
  if (availability === 'closed') {
    return <SchoolClosed school={school} lang={lang} />;
  }

  // 3. Live or Limited: Render School Meta + Content
  return (
    <>
      <SchoolMeta school={school} lang={lang} />
      
      {/* If children (e.g. subpages like admission form, results, etc.) are passed and activeTab !== 'home', render them */}
      {activeTab === 'home' ? (
        <SchoolHome
          school={school}
          features={features}
          sections={sections}
          sliders={sliders}
          notices={notices}
          facilities={facilities}
          gallery={gallery}
          videos={videos}
          teachers={teachers}
          students={students}
          uniform={uniform}
          urgentNotice={urgentNotice}
          stats={stats}
          navItems={navItems}
          bottomTabs={bottomTabs}
          mode={mode}
          theme={theme}
          lang={lang}
          fontSize={fontSize}
          onToggleMode={toggleMode}
          onToggleLang={toggleLang}
          onSetFontSize={setFontSize}
          onNavigate={handleNavigate}
          onOpenNotice={onOpenNotice}
          onOpenLightbox={onOpenLightbox}
          onOpenVideo={onOpenVideo}
          onOpenTrackingModal={onOpenTrackingModal}
          onOpenUniform={onOpenUniform}
          onQuickResultSearch={onQuickResultSearch}
          onDirectApply={onDirectApply}
        />
      ) : (
        children
      )}
    </>
  );
}
