'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { PriceFilter } from '@/components/cells';
import { CloseIcon } from '@/icons';

export const ProductSidebar = () => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();

  const [filterModal, setFilterModal] = useState(false);

  const isCTGPage = pathname.includes('caregivers-training-ctg');
  const urlScheme = searchParams.get('scheme');
  const activeScheme = urlScheme || (isCTGPage ? 'ctg' : 'all');

  // Active brands
  const brandParam = searchParams.get('brand') || '';
  const activeBrands = brandParam.split(',').filter(Boolean);

  // Active skills (for CTG)
  const skillParam = searchParams.get('skill') || '';
  const activeSkills = skillParam.split(',').filter(Boolean);

  // CTG Specific Skills (Exact from Vertis live site)
  const ctgSkills = [
    { name: 'Identifying and Understanding Conditions (Disability)', count: 13 },
    { name: 'Managing Challenging Behaviours', count: 10 },
    { name: 'Supporting Home Personal Care', count: 14 },
    { name: 'Safe Lifting and Kinetic Transfer', count: 8 },
    { name: 'Acquiring Basic / Specific Health Literacy', count: 53 },
    { name: 'Making Informed Decisions', count: 9 },
    { name: 'Managing Relationships And Communication', count: 7 },
    { name: 'Managing Your Caregiving Role', count: 3 },
  ];

  // CTG Training Providers (from OrderCloud real catalog)
  const ctgProviders = [
    { name: 'Autism Resource Centre (Singapore)', badge: 'Accredited', count: 4 },
    { name: 'Academy of Human Development Pte Ltd', badge: 'WSQ Approved', count: 2 },
    { name: 'Jaga-Me Pte Ltd', badge: 'Accredited', count: 2 },
    { name: 'DAS Academy Ltd', badge: 'Special Needs', count: 2 },
    { name: "St Luke's Eldercare Ltd", badge: 'Healthcare', count: 2 },
    { name: 'Cerebral Palsy Alliance Singapore', badge: 'Accredited', count: 1 },
    { name: 'WhiteAngel Caregivers Consultancy', badge: 'Specialist', count: 1 },
    { name: 'Home Nursing Foundation', badge: 'Verified Partner', count: 2 },
    { name: 'Econ Careskill Training Centre', badge: 'Accredited Partner', count: 2 },
    { name: 'The Salvation Army Peacehaven', badge: 'Accredited Partner', count: 3 },
  ];

  // General SMF Brands
  const smfBrands = [
    { name: 'TENA Singapore', count: 3, badge: 'Official Mall' },
    { name: 'Abbott Nutrition SG', count: 2, badge: 'Official Mall' },
    { name: 'Omron Healthcare SG', count: 3, badge: 'Official Mall' },
    { name: 'Urgo Medical SG', count: 2, badge: 'Genuine' },
    { name: 'Betadine SG', count: 1, badge: 'Genuine' },
    { name: 'ErgoGrip Aids', count: 1, badge: 'Verified' },
    { name: 'MediShield SG', count: 1, badge: 'Genuine' },
    { name: 'Hartmann Singapore', count: 1, badge: 'Genuine' },
  ];

  const subsidySchemes = [
    { id: 'all', label: 'All Catalogues (SMF & CTG)', count: 33 },
    { id: 'smf', label: 'SMF Consumables (Seniors)', count: 12 },
    { id: 'ctg', label: 'CTG Caregivers Training Courses', count: 21 },
  ];

  const handleSchemeSelect = (schemeId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    if (schemeId === 'all') {
      params.delete('scheme');
      if (isCTGPage) {
        router.push(`/categories?${params.toString()}`, { scroll: false });
        return;
      }
    } else if (schemeId === 'ctg') {
      params.delete('scheme');
      if (!isCTGPage) {
        router.push(`/categories/caregivers-training-ctg?${params.toString()}`, { scroll: false });
        return;
      }
    } else if (schemeId === 'smf') {
      params.set('scheme', 'smf');
      if (isCTGPage) {
        router.push(`/categories?${params.toString()}`, { scroll: false });
        return;
      }
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSkillToggle = (skillName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    let updatedSkills: string[];
    if (activeSkills.includes(skillName)) {
      updatedSkills = activeSkills.filter((s) => s !== skillName);
    } else {
      updatedSkills = [...activeSkills, skillName];
    }

    if (updatedSkills.length > 0) {
      params.set('skill', updatedSkills.join(','));
    } else {
      params.delete('skill');
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleBrandToggle = (brandName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    let updatedBrands: string[];
    if (activeBrands.includes(brandName)) {
      updatedBrands = activeBrands.filter((b) => b !== brandName);
    } else {
      updatedBrands = [...activeBrands, brandName];
    }

    if (updatedBrands.length > 0) {
      params.set('brand', updatedBrands.join(','));
    } else {
      params.delete('brand');
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = Boolean(
    brandParam ||
    skillParam ||
    searchParams.get('min_price') ||
    searchParams.get('max_price') ||
    searchParams.get('query') ||
    (urlScheme && urlScheme !== 'all')
  );

  return (
    <aside className="relative w-full" data-testid="sidebar">
      {/* Mobile toggle button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setFilterModal(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 shadow-2xs"
        >
          <span>⚙️ Filter Options</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#e05626]"></span>
          )}
        </button>
      </div>

      <div
        className={`w-full bg-white rounded-xl border border-gray-200 p-4 space-y-6 ${
          filterModal
            ? 'fixed inset-0 z-50 p-6 overflow-y-auto bg-white'
            : 'hidden md:block'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-gray-900 uppercase tracking-tight flex items-center gap-1.5">
              <span>{isCTGPage ? '🎯' : '⚙️'}</span>
              <span>{isCTGPage ? 'Refine By' : 'Filter Options'}</span>
            </h3>
            {hasActiveFilters && (
              <span className="text-[10px] bg-orange-100 text-[#e05626] font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-[#e05626] hover:underline cursor-pointer"
            >
              Reset All
            </button>
          )}
          {filterModal && (
            <button
              onClick={() => setFilterModal(false)}
              className="p-1.5 text-gray-500 hover:text-gray-900 ml-auto"
            >
              <CloseIcon size={20} />
            </button>
          )}
        </div>

        {/* CTG MODE: Skills & Target Audience */}
        {isCTGPage ? (
          <>
            {/* 1. Target Audience */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2.5 flex items-center justify-between">
                <span>I Am Caring For...</span>
                <span className="text-gray-400 font-normal text-[10px]">−</span>
              </h4>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs cursor-pointer hover:text-[#e05626]">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded accent-[#e05626]" />
                    <span className="text-gray-700">Seniors</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">(101)</span>
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer hover:text-[#e05626]">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded accent-[#e05626]" />
                    <span className="text-gray-700">Persons With Disabilities</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">(54)</span>
                </label>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 2. I Need This Skill */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2.5 flex items-center justify-between">
                <span>I Need This Skill</span>
                <span className="text-gray-400 font-normal text-[10px]">−</span>
              </h4>
              <div className="space-y-2">
                {ctgSkills.map((s) => {
                  const isChecked = activeSkills.includes(s.name);
                  return (
                    <label
                      key={s.name}
                      className="flex items-start justify-between text-xs cursor-pointer group"
                    >
                      <div className="flex items-start gap-2 min-w-0 pr-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSkillToggle(s.name)}
                          className="rounded accent-[#e05626] mt-0.5 shrink-0"
                        />
                        <span
                          className={`text-[11px] leading-tight ${
                            isChecked ? 'font-bold text-[#e05626]' : 'text-gray-700 group-hover:text-[#e05626]'
                          }`}
                        >
                          {s.name}
                        </span>
                      </div>
                      <span className="text-gray-400 text-[10px] shrink-0">({s.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 3. Course Fee */}
            <div>
              <PriceFilter />
            </div>

            <hr className="border-gray-100" />

            {/* 4. Training Providers */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2.5 flex items-center justify-between">
                <span>Training Providers</span>
                <span className="text-gray-400 font-normal text-[10px]">−</span>
              </h4>
              <div className="space-y-2">
                {ctgProviders.map((b) => {
                  const isChecked = activeBrands.includes(b.name);
                  return (
                    <label
                      key={b.name}
                      className="flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBrandToggle(b.name)}
                          className="rounded accent-[#e05626] shrink-0"
                        />
                        <span
                          className={`truncate text-xs ${
                            isChecked ? 'font-bold text-[#e05626]' : 'text-gray-700 group-hover:text-[#e05626]'
                          }`}
                        >
                          {b.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded shrink-0">
                        {b.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* GENERAL SMF / ALL CATALOGUES MODE */
          <>
            {/* 1. Subsidy Scheme Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
                <span>🇸🇬</span>
                <span>Subsidy Scheme</span>
              </h4>
              <div className="space-y-2">
                {subsidySchemes.map((scheme) => (
                  <label
                    key={scheme.id}
                    className="flex items-center justify-between text-xs cursor-pointer hover:text-[#e05626] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="subsidy_scheme"
                        checked={activeScheme === scheme.id}
                        onChange={() => handleSchemeSelect(scheme.id)}
                        className="accent-[#e05626] cursor-pointer"
                      />
                      <span
                        className={
                          activeScheme === scheme.id
                            ? 'font-bold text-[#e05626]'
                            : 'text-gray-700'
                        }
                      >
                        {scheme.label}
                      </span>
                    </div>
                    <span className="text-gray-400 text-[11px]">({scheme.count})</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* 2. Price Range (S$) */}
            <div>
              <PriceFilter />
            </div>

            <hr className="border-gray-100" />

            {/* 3. Official Healthcare Brands */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <span>🏢</span>
                  <span>Official Brands</span>
                </h4>
                {activeBrands.length > 0 && (
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete('brand');
                      params.delete('page');
                      router.push(`${pathname}?${params.toString()}`, { scroll: false });
                    }}
                    className="text-[11px] text-gray-400 hover:text-[#e05626]"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {smfBrands.map((b) => {
                  const isChecked = activeBrands.includes(b.name);
                  return (
                    <label
                      key={b.name}
                      className="flex items-center justify-between text-xs cursor-pointer group select-none"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBrandToggle(b.name)}
                          className="rounded accent-[#e05626] cursor-pointer w-4 h-4"
                        />
                        <span
                          className={`truncate text-xs ${
                            isChecked
                              ? 'font-bold text-[#e05626]'
                              : 'text-gray-800 font-medium group-hover:text-[#e05626]'
                          }`}
                        >
                          {b.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isChecked
                              ? 'bg-[#e05626] text-white'
                              : 'text-red-600 bg-red-50'
                          }`}
                        >
                          {b.badge}
                        </span>
                        <span className="text-gray-400 text-[11px]">({b.count})</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <hr className="border-gray-100" />

        {/* Singapore Delivery Guarantee */}
        <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 text-xs">
          <p className="font-bold text-[#b45309] mb-1">🇸🇬 Singapore Delivery</p>
          <p className="text-gray-600 text-[11px] leading-relaxed">
            All orders fulfilled from Singapore warehouses. Free delivery for orders above S$50.
          </p>
        </div>

        {filterModal && (
          <button
            onClick={() => setFilterModal(false)}
            className="w-full py-3 bg-[#e05626] text-white rounded-lg font-bold text-sm shadow-sm cursor-pointer"
          >
            Apply Filters
          </button>
        )}
      </div>
    </aside>
  );
};
