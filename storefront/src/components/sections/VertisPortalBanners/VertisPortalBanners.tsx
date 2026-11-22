import LocalizedClientLink from "@/components/molecules/LocalizedLink/LocalizedLink"

export const VertisPortalBanners = () => {
  return (
    <div className="w-full space-y-6 my-6">
      {/* 1. Organizational User Banner (Exact copy of Vertis Healthcare) */}
      <div className="w-full bg-[#fef8ee] border border-[#fde68a] rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🏢</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#b45309] bg-amber-100 px-2.5 py-0.5 rounded-full">
              Healthcare Providers & Agencies
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            Are you an Organizational User?
          </h3>
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            If you are from a healthcare provider, social service agency, or community organisation, you can sign in through the Corporate Portal to manage applications, access resources, and support senior care.
          </p>
        </div>
        <div className="shrink-0">
          <a
            href="https://healthcare.vertis.digital/home"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#e05626] hover:bg-[#c8461b] text-white font-bold px-6 py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-sm md:text-base cursor-pointer"
          >
            <span>🏢</span>
            <span>Go to Corporate Portal</span>
          </a>
        </div>
      </div>

      {/* 2. Senior & Caregiver Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Senior */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👴👵</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e05626] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                Seniors' Mobility & Enabling Fund
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Are you a senior?
            </h4>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              If you need help with daily activities, you can find out if you are eligible for subsidies under the Seniors' Mobility and Enabling Fund (SMF), administered by Agency for Integrated Care (AIC).
            </p>
            <a
              href="https://www.aic.sg"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#e05626] hover:underline inline-flex items-center gap-1 mb-6"
            >
              Learn More about AIC Subsidies ↗
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
            <LocalizedClientLink
              href="/user"
              className="inline-flex items-center gap-1.5 bg-[#e05626] hover:bg-[#c8461b] text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-md transition-colors shadow-xs"
            >
              <span>➔</span>
              <span>Sign In</span>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/user/register"
              className="inline-flex items-center gap-1.5 bg-[#fef8ee] hover:bg-amber-100 text-[#b45309] border border-amber-300 text-xs md:text-sm font-semibold px-4 py-2.5 rounded-md transition-colors"
            >
              <span>👤</span>
              <span>Register</span>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/categories"
              className="text-xs md:text-sm text-gray-600 hover:text-gray-900 font-medium underline ml-auto"
            >
              Browse Consumables →
            </LocalizedClientLink>
          </div>
        </div>

        {/* Card Caregiver */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🤝</span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Caregivers Training Grant (CTG)
              </span>
            </div>
            <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Are you a caregiver?
            </h4>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              If you care for a senior or someone with a disability, explore approved care courses, training grants (CTG), and subsidized consumable packages designed to ease your caregiving journey.
            </p>
            <LocalizedClientLink
              href="/categories/caregivers-training-ctg"
              className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1 mb-6"
            >
              Explore CTG Caregivers Catalogue ↗
            </LocalizedClientLink>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
            <LocalizedClientLink
              href="/categories/caregivers-training-ctg"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-md transition-colors shadow-xs"
            >
              <span>📚</span>
              <span>View Training Catalogue</span>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/categories/caregivers-training-ctg"
              className="text-xs md:text-sm text-gray-600 hover:text-gray-900 font-medium underline ml-auto"
            >
              CTG Approved Courses →
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}
