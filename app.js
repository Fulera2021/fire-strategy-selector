/**
 * FIRE in India — Strategy Selector Interactive Engine
 * Handles Quiz Wizard, Multi-Factor Strategy Matching, Catalog Search & Filtering,
 * Accordion Toggles, and Embed Modal Code Generation.
 */

(function () {
  'use strict';

  // Ensure STRATEGIES_DATA is loaded
  const strategies = window.STRATEGIES_DATA || [];

  // Application State
  const state = {
    mode: 'quiz', // 'quiz' or 'catalog'
    quizStep: 1,
    quizAnswers: {
      capital: null,
      frequency: null,
      asset: null
    },
    catalogFilters: {
      search: '',
      capital: 'all',
      asset: 'all',
      frequency: 'all',
      pricing: 'all'
    }
  };

  // DOM Elements
  const elements = {
    // Mode switcher
    quizModeBtn: document.getElementById('quizModeBtn'),
    catalogModeBtn: document.getElementById('catalogModeBtn'),
    quizView: document.getElementById('quizView'),
    catalogView: document.getElementById('catalogView'),

    // Quiz elements
    quizForm: document.getElementById('quizForm'),
    quizStepLabel: document.getElementById('quizStepLabel'),
    quizStepPercent: document.getElementById('quizStepPercent'),
    quizProgressBar: document.getElementById('quizProgressBar'),
    quizStep1: document.getElementById('quizStep1'),
    quizStep2: document.getElementById('quizStep2'),
    quizStep3: document.getElementById('quizStep3'),
    quizPrevBtn: document.getElementById('quizPrevBtn'),
    quizNextBtn: document.getElementById('quizNextBtn'),
    quizSubmitBtn: document.getElementById('quizSubmitBtn'),
    quizSelectionPrompt: document.getElementById('quizSelectionPrompt'),
    quizResultsContainer: document.getElementById('quizResultsContainer'),
    resultsTitle: document.getElementById('resultsTitle'),
    resultsPersonaText: document.getElementById('resultsPersonaText'),
    matchedCardsGrid: document.getElementById('matchedCardsGrid'),
    retakeQuizBtn: document.getElementById('retakeQuizBtn'),
    viewAllFromResultsBtn: document.getElementById('viewAllFromResultsBtn'),

    // Catalog elements
    strategySearchInput: document.getElementById('strategySearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    catalogGrid: document.getElementById('catalogGrid'),
    catalogCountDisplay: document.getElementById('catalogCountDisplay'),
    resetAllFiltersBtn: document.getElementById('resetAllFiltersBtn'),
    catalogEmptyState: document.getElementById('catalogEmptyState'),
    emptyStateResetBtn: document.getElementById('emptyStateResetBtn'),

    // Embed modal elements
    openEmbedBtn: document.getElementById('openEmbedBtn'),
    embedModal: document.getElementById('embedModal'),
    closeEmbedModalBtn: document.getElementById('closeEmbedModalBtn'),
    dismissEmbedModalBtn: document.getElementById('dismissEmbedModalBtn'),
    embedCodeSnippet: document.getElementById('embedCodeSnippet'),
    copyEmbedCodeBtn: document.getElementById('copyEmbedCodeBtn'),
    toastNotification: document.getElementById('toastNotification')
  };

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  function init() {
    setupModeSwitcher();
    setupQuizEvents();
    setupCatalogEvents();
    setupAccordionEvents();
    setupEmbedModal();

    // Render initial catalog
    renderCatalog();
    updateQuizUI();
  }

  // =========================================================================
  // MODE SWITCHING (QUIZ vs CATALOG)
  // =========================================================================
  function switchMode(newMode) {
    state.mode = newMode;

    if (newMode === 'quiz') {
      elements.quizModeBtn.classList.add('active');
      elements.catalogModeBtn.classList.remove('active');
      elements.quizView.classList.add('active-view');
      elements.catalogView.classList.remove('active-view');
    } else {
      elements.catalogModeBtn.classList.add('active');
      elements.quizModeBtn.classList.remove('active');
      elements.catalogView.classList.add('active-view');
      elements.quizView.classList.remove('active-view');
      renderCatalog();
    }
  }

  function setupModeSwitcher() {
    elements.quizModeBtn.addEventListener('click', () => switchMode('quiz'));
    elements.catalogModeBtn.addEventListener('click', () => switchMode('catalog'));
    elements.viewAllFromResultsBtn.addEventListener('click', () => switchMode('catalog'));
  }

  // =========================================================================
  // QUIZ LOGIC & WIZARD
  // =========================================================================
  function setupQuizEvents() {
    // Tile selection handling
    document.querySelectorAll('.option-tile').forEach((tile) => {
      tile.addEventListener('click', function () {
        const radio = this.querySelector('input[type="radio"]');
        const name = radio.name;
        const val = radio.value;

        // Deselect siblings in the same step
        const parent = this.closest('.quiz-step');
        parent.querySelectorAll('.option-tile').forEach((t) => t.classList.remove('selected'));

        // Select clicked tile
        this.classList.add('selected');
        radio.checked = true;
        state.quizAnswers[name] = val;

        validateCurrentQuizStep();
      });
    });

    // Step navigation buttons
    elements.quizNextBtn.addEventListener('click', () => {
      if (state.quizStep < 3) {
        state.quizStep++;
        updateQuizUI();
      }
    });

    elements.quizPrevBtn.addEventListener('click', () => {
      if (state.quizStep > 1) {
        state.quizStep--;
        updateQuizUI();
      }
    });

    elements.quizSubmitBtn.addEventListener('click', () => {
      calculateAndShowQuizResults();
    });

    elements.retakeQuizBtn.addEventListener('click', resetQuiz);
  }

  function updateQuizUI() {
    const step = state.quizStep;

    // Update Progress
    const percent = Math.round((step / 3) * 100);
    elements.quizStepLabel.textContent = `Step ${step} of 3`;
    elements.quizStepPercent.textContent = `${percent}%`;
    elements.quizProgressBar.style.width = `${percent}%`;

    // Toggle active step
    elements.quizStep1.classList.toggle('active-step', step === 1);
    elements.quizStep2.classList.toggle('active-step', step === 2);
    elements.quizStep3.classList.toggle('active-step', step === 3);

    // Toggle Prev button visibility
    elements.quizPrevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';

    // Toggle Next vs Submit button
    if (step < 3) {
      elements.quizNextBtn.style.display = 'inline-flex';
      elements.quizSubmitBtn.style.display = 'none';
    } else {
      elements.quizNextBtn.style.display = 'none';
      elements.quizSubmitBtn.style.display = 'inline-flex';
    }

    validateCurrentQuizStep();
  }

  function validateCurrentQuizStep() {
    let isValid = false;
    let field = '';

    if (state.quizStep === 1) {
      field = 'capital';
      isValid = Boolean(state.quizAnswers.capital);
    } else if (state.quizStep === 2) {
      field = 'frequency';
      isValid = Boolean(state.quizAnswers.frequency);
    } else if (state.quizStep === 3) {
      field = 'asset';
      isValid = Boolean(state.quizAnswers.asset);
    }

    elements.quizNextBtn.disabled = !isValid;
    elements.quizSubmitBtn.disabled = !isValid;

    if (isValid) {
      elements.quizSelectionPrompt.textContent = 'Selected: Ready to proceed';
      elements.quizSelectionPrompt.style.color = 'var(--accent-emerald)';
    } else {
      elements.quizSelectionPrompt.textContent = 'Please select an option to continue';
      elements.quizSelectionPrompt.style.color = 'var(--text-muted)';
    }
  }

  function resetQuiz() {
    state.quizStep = 1;
    state.quizAnswers = { capital: null, frequency: null, asset: null };

    // Reset UI selections
    document.querySelectorAll('.option-tile').forEach((t) => t.classList.remove('selected'));
    document.querySelectorAll('.quiz-form input[type="radio"]').forEach((r) => (r.checked = false));

    elements.quizForm.style.display = 'block';
    elements.quizResultsContainer.style.display = 'none';
    updateQuizUI();
  }

  // =========================================================================
  // STRATEGY MATCHING ALGORITHM
  // =========================================================================
  function calculateAndShowQuizResults() {
    const { capital, frequency, asset } = state.quizAnswers;

    // Filter strategy matches with scoring
    const scoredStrategies = strategies.map((s) => {
      let score = 0;
      const reasons = [];

      // 1. Capital Match (Crucial constraint: weight 40 pts)
      if (s.capitalTier === capital) {
        score += 40;
        reasons.push(`Tailored for your capital budget (${s.capitalRange})`);
      } else if (
        (capital === '4 Highest') ||
        (capital === '3 High' && (s.capitalTier === '2 Medium' || s.capitalTier === '1 Low')) ||
        (capital === '2 Medium' && s.capitalTier === '1 Low')
      ) {
        // Higher capital user can easily execute lower tier strategies
        score += 25;
        reasons.push(`Easily deployable with your capital (${s.capitalRange})`);
      } else {
        // Under-capitalized for this strategy
        score -= 20;
      }

      // 2. Frequency / Screen Time Match (Weight 30 pts)
      const freqLower = (s.frequency || '').toLowerCase();
      if (frequency === 'Daily' && (freqLower.includes('daily') || freqLower.includes('1 day'))) {
        score += 30;
        reasons.push('Fits your 10–15 min daily EOD routine');
      } else if (frequency === 'Weekly' && (freqLower.includes('weekly') || freqLower.includes('7 days') || freqLower.includes('15 days'))) {
        score += 30;
        reasons.push('Executes on a comfortable weekly/weekend review');
      } else if (frequency === 'Monthly' && (freqLower.includes('monthly') || freqLower.includes('options'))) {
        score += 30;
        reasons.push('100% hands-off / zero daily screen stress');
      } else {
        score += 5;
      }

      // 3. Asset Preference Match (Weight 30 pts)
      const assetLower = (s.scriptType || '').toLowerCase();
      if (asset === 'Any') {
        score += 30;
        reasons.push(`Top-performing ${s.scriptType} system`);
      } else if (asset === 'ETFs' && (assetLower.includes('etf') || assetLower.includes('jewel') || assetLower.includes('mf'))) {
        score += 30;
        reasons.push('Diversified index & ETF compounding with zero company default risk');
      } else if (asset === 'Stocks' && assetLower.includes('stock')) {
        score += 30;
        reasons.push('High-alpha swing trades on liquid quality stocks');
      } else if (asset === 'Options' && (s.name.toLowerCase().includes('option') || s.frequency.toLowerCase().includes('option') || s.capitalTier === '4 Highest')) {
        score += 30;
        reasons.push('Generates regular monthly cash flow through option writing');
      } else {
        score += 5;
      }

      return {
        ...s,
        matchScore: score,
        matchReason: reasons.slice(0, 2).join(' • ')
      };
    });

    // Sort by match score descending
    scoredStrategies.sort((a, b) => b.matchScore - a.matchScore);

    // Select top 2 or 3
    const topMatches = scoredStrategies.slice(0, 3);

    // Determine Persona Label & Summary
    let personaHeadline = '';
    let personaDesc = '';

    if (asset === 'Options' || capital === '4 Highest') {
      personaHeadline = 'The FIRE Cash-Flow Seeker';
      personaDesc = `With ${capital} capital and a focus on regular yield, your optimal strategy revolves around systemic ETF compounding coupled with Covered Option premium collection.`;
    } else if (frequency === 'Monthly' || asset === 'ETFs') {
      personaHeadline = 'The Hands-Off Working Professional';
      personaDesc = `With a preference for low screen-time and consistent wealth accumulation, automated Buy-in-Dip ETF compounding provides steady alpha with zero stock-picking stress.`;
    } else if (asset === 'Stocks' && frequency === 'Daily') {
      personaHeadline = 'The Active Alpha Swing Trader';
      personaDesc = `With 10–15 minutes daily and high capital allocation, mechanical price breakouts (20-Day Highs, 100 SMA, and BLSH) will maximize your portfolio turnover and returns.`;
    } else {
      personaHeadline = 'The Disciplined Wealth Compounder';
      personaDesc = `Based on your capital and available time, these balanced strategies maximize your risk-adjusted returns without demanding constant screen watching.`;
    }

    // Render results
    elements.resultsTitle.textContent = personaHeadline;
    elements.resultsPersonaText.textContent = personaDesc;

    elements.matchedCardsGrid.innerHTML = '';
    topMatches.forEach((strategy, index) => {
      const cardHtml = createStrategyCardHtml(strategy, true, index + 1);
      elements.matchedCardsGrid.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Hide quiz form, reveal results
    elements.quizForm.style.display = 'none';
    elements.quizResultsContainer.style.display = 'block';

    // Scroll smoothly to results
    elements.quizResultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // =========================================================================
  // CATALOG DIRECTORY & FILTER ENGINE
  // =========================================================================
  function setupCatalogEvents() {
    // Search input
    elements.strategySearchInput.addEventListener('input', (e) => {
      state.catalogFilters.search = e.target.value.trim().toLowerCase();
      elements.clearSearchBtn.style.display = state.catalogFilters.search.length > 0 ? 'flex' : 'none';
      renderCatalog();
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      elements.strategySearchInput.value = '';
      state.catalogFilters.search = '';
      elements.clearSearchBtn.style.display = 'none';
      renderCatalog();
    });

    // Filter pill buttons
    document.querySelectorAll('.filter-pills').forEach((pillGroup) => {
      pillGroup.addEventListener('click', (e) => {
        const pill = e.target.closest('.pill');
        if (!pill) return;

        const filterType = pillGroup.dataset.filterType;
        const value = pill.dataset.value;

        // Update active UI state
        pillGroup.querySelectorAll('.pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');

        // Update filter state
        state.catalogFilters[filterType] = value;
        renderCatalog();
      });
    });

    // Reset filters
    elements.resetAllFiltersBtn.addEventListener('click', resetAllCatalogFilters);
    elements.emptyStateResetBtn.addEventListener('click', resetAllCatalogFilters);
  }

  function resetAllCatalogFilters() {
    state.catalogFilters = {
      search: '',
      capital: 'all',
      asset: 'all',
      frequency: 'all',
      pricing: 'all'
    };

    elements.strategySearchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';

    document.querySelectorAll('.filter-pills').forEach((group) => {
      group.querySelectorAll('.pill').forEach((p, idx) => {
        p.classList.toggle('active', idx === 0);
      });
    });

    renderCatalog();
  }

  function renderCatalog() {
    const { search, capital, asset, frequency, pricing } = state.catalogFilters;

    const filtered = strategies.filter((s) => {
      // 1. Text Search (matches name, basedOn, scriptType, buyRule, persona)
      if (search) {
        const corpus = `${s.name} ${s.basedOn} ${s.scriptType} ${s.buyRule} ${s.persona}`.toLowerCase();
        if (!corpus.includes(search)) return false;
      }

      // 2. Capital Filter
      if (capital !== 'all' && s.capitalTier !== capital) {
        return false;
      }

      // 3. Asset Filter
      if (asset !== 'all') {
        const st = (s.scriptType || '').toLowerCase();
        if (asset === 'ETFs' && !(st.includes('etf') || st.includes('jewel'))) return false;
        if (asset === 'Stocks' && !st.includes('stock')) return false;
        if (asset === 'MFs' && !st.includes('mf')) return false;
        if (asset === 'Options' && !(s.name.toLowerCase().includes('option') || s.frequency.toLowerCase().includes('option'))) return false;
      }

      // 4. Frequency Filter
      if (frequency !== 'all') {
        const f = (s.frequency || '').toLowerCase();
        if (frequency === 'Daily' && !(f.includes('daily') || f.includes('1 day'))) return false;
        if (frequency === 'Weekly' && !(f.includes('weekly') || f.includes('7 days') || f.includes('15 days'))) return false;
        if (frequency === 'Monthly' && !(f.includes('monthly') || f.includes('options'))) return false;
      }

      // 5. Pricing Filter
      if (pricing === 'free' && s.isPaid) return false;
      if (pricing === 'paid' && !s.isPaid) return false;

      return true;
    });

    // Update Counter Display
    elements.catalogCountDisplay.textContent = `Showing ${filtered.length} of ${strategies.length} strategies`;

    // Toggle reset filters link
    const hasActiveFilters = search || capital !== 'all' || asset !== 'all' || frequency !== 'all' || pricing !== 'all';
    elements.resetAllFiltersBtn.style.display = hasActiveFilters ? 'inline-block' : 'none';

    // Render Grid
    if (filtered.length === 0) {
      elements.catalogGrid.style.display = 'none';
      elements.catalogEmptyState.style.display = 'block';
    } else {
      elements.catalogGrid.style.display = 'grid';
      elements.catalogEmptyState.style.display = 'none';

      elements.catalogGrid.innerHTML = filtered.map((s) => createStrategyCardHtml(s, false)).join('');
    }
  }

  // =========================================================================
  // STRATEGY CARD TEMPLATE GENERATOR
  // =========================================================================
  function createStrategyCardHtml(strategy, isQuizMatch = false, rank = 1) {
    const isFree = !strategy.isPaid;
    const highlightClass = isQuizMatch ? 'strategy-card match-highlight' : 'strategy-card';

    // Free vs Paid button styling
    let sheetButtonHtml = '';
    if (isFree) {
      sheetButtonHtml = `
        <a href="${escapeHtml(strategy.sheetUrl)}" target="_blank" rel="noopener" class="btn-action-sheet-free">
          <span>📄 Free Sheet</span>
        </a>
      `;
    } else {
      sheetButtonHtml = `
        <a href="${escapeHtml(strategy.sheetUrl)}" target="_blank" rel="noopener" class="btn-action-sheet-paid">
          <span>💎 Get Strategy</span>
        </a>
      `;
    }

    return `
      <article class="${highlightClass}" data-id="${strategy.id}">
        <div>
          <!-- Top Badges Row -->
          <div class="card-top-badges">
            ${isQuizMatch ? `<span class="badge-tag badge-match">⭐ #${rank} Top Match</span>` : ''}
            <span class="badge-tag badge-capital">${escapeHtml(strategy.capitalRange)}</span>
            <span class="badge-tag badge-freq">${escapeHtml(strategy.frequency)}</span>
            <span class="badge-tag badge-asset">${escapeHtml(strategy.scriptType)}</span>
          </div>

          <!-- Strategy Title & Persona -->
          <h3 class="card-title">${escapeHtml(strategy.name)}</h3>
          <div class="card-persona-tag">
            <span>👤 ${escapeHtml(strategy.persona)}</span>
          </div>

          <!-- Description -->
          <p class="card-based-on">${escapeHtml(strategy.basedOn)}</p>

          <!-- Metrics Box -->
          <div class="card-metrics-box">
            <div class="metric-item">
              <span class="metric-label">Profit Target</span>
              <span class="metric-value">${escapeHtml(strategy.profitTarget)}</span>
            </div>
            <div class="metric-item" style="text-align: right;">
              <span class="metric-label">Booking Cycle</span>
              <span class="metric-value booking-speed">${escapeHtml(strategy.bookingFrequency)}</span>
            </div>
          </div>

          <!-- Expandable Buy / Sell Rules Accordion -->
          <div class="accordion-wrapper">
            <button type="button" class="accordion-trigger" aria-expanded="false">
              <span>View Buy & Sell Rules</span>
              <span class="chevron">▼</span>
            </button>
            <div class="accordion-body">
              <div class="rule-row">
                <span class="rule-tag tag-buy">Buy Rule</span>
                <span>${escapeHtml(strategy.buyRule)}</span>
              </div>
              <div class="rule-row">
                <span class="rule-tag tag-sell">Sell Rule</span>
                <span>${escapeHtml(strategy.sellRule)}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="card-actions-row">
          <a href="${escapeHtml(strategy.videoUrl)}" target="_blank" rel="noopener" class="btn-action-yt">
            <span>▶ Watch Tutorial</span>
          </a>
          ${sheetButtonHtml}
        </div>
      </article>
    `;
  }

  // =========================================================================
  // ACCORDION EVENT DELEGATION
  // =========================================================================
  function setupAccordionEvents() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.accordion-trigger');
      if (!trigger) return;

      const body = trigger.nextElementSibling;
      const isExpanded = trigger.classList.contains('expanded');

      if (isExpanded) {
        trigger.classList.remove('expanded');
        trigger.setAttribute('aria-expanded', 'false');
        body.classList.remove('open');
      } else {
        trigger.classList.add('expanded');
        trigger.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }
    });
  }

  // =========================================================================
  // EMBED MODAL & CODE GENERATION
  // =========================================================================
  function setupEmbedModal() {
    const currentOrigin = window.location.origin && window.location.origin !== 'null' 
      ? window.location.origin 
      : 'https://fireinindia2021.odoo.com';
    const widgetUrl = `${currentOrigin}/strategy-finder/index.html`;

    const embedHtml = `<iframe src="${widgetUrl}" width="100%" height="820" frameborder="0" style="border: none; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.4);" title="FIRE in India Strategy Selector"></iframe>`;

    elements.embedCodeSnippet.value = embedHtml;

    elements.openEmbedBtn.addEventListener('click', () => {
      elements.embedModal.style.display = 'flex';
      elements.embedModal.setAttribute('aria-hidden', 'false');
    });

    const closeModal = () => {
      elements.embedModal.style.display = 'none';
      elements.embedModal.setAttribute('aria-hidden', 'true');
    };

    elements.closeEmbedModalBtn.addEventListener('click', closeModal);
    elements.dismissEmbedModalBtn.addEventListener('click', closeModal);
    elements.embedModal.addEventListener('click', (e) => {
      if (e.target === elements.embedModal) closeModal();
    });

    // Copy embed code
    elements.copyEmbedCodeBtn.addEventListener('click', () => {
      elements.embedCodeSnippet.select();
      elements.embedCodeSnippet.setSelectionRange(0, 99999);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(elements.embedCodeSnippet.value).then(() => {
          showToast('📋 Embed code copied to clipboard!');
        });
      } else {
        document.execCommand('copy');
        showToast('📋 Embed code copied to clipboard!');
      }
    });
  }

  // =========================================================================
  // TOAST NOTIFICATION UTILITY
  // =========================================================================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
    elements.toastNotification.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // =========================================================================
  // STRING SANITIZER (XSS Prevention)
  // =========================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
