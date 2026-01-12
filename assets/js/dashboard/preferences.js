import { pythonURI } from './config.js';

export default async function initPreferences() {
  const PRESETS = window.SitePreferences?.PRESETS || {
    'Midnight': { bg: '#0b1220', text: '#e6eef8', font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", size: 14, accent: '#3b82f6' },
    'Light': { bg: '#ffffff', text: '#0f172a', font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", size: 14, accent: '#2563eb' },
    'Green': { bg: '#154734', text: '#e6f6ef', font: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial", size: 14, accent: '#10b981' },
    'Sepia': { bg: '#f4ecd8', text: '#3b2f2f', font: "Georgia, 'Times New Roman', Times, serif", size: 14, accent: '#b45309' },
    'Cyberpunk': { bg: '#0a0a0f', text: '#f0f0f0', font: "'Source Code Pro', monospace", size: 14, accent: '#f72585' },
    'Ocean': { bg: '#0c1929', text: '#e0f2fe', font: "'Open Sans', Arial, sans-serif", size: 15, accent: '#06b6d4' }
  };

  const MAX_CUSTOM = 10;
  const storageKey = 'sitePreferences';
  const themesKey = 'siteThemes';

  function applyPreferences(prefs) {
    if (window.SitePreferences && typeof window.SitePreferences.applyPreferences === 'function') {
      window.SitePreferences.applyPreferences(prefs);
    }
  }

  function loadPreferences() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const prefs = JSON.parse(raw);
      applyPreferences(prefs);
      return prefs;
    } catch (e) { console.error('loadPreferences error', e); return null; }
  }

  function savePreferences(prefs){
    try {
      localStorage.setItem(storageKey, JSON.stringify(prefs));
      applyPreferences(prefs);
      populateForm(prefs);
    } catch (e) { console.error('savePreferences error', e); }
  }

  function loadThemes(){
    try {
      const raw = localStorage.getItem(themesKey);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { console.error('loadThemes error', e); return {}; }
  }

  function saveThemes(obj){
    try { localStorage.setItem(themesKey, JSON.stringify(obj)); } catch(e){console.error('saveThemes error', e);}    
  }

  function renderPresets(){
    const container = document.getElementById('preset-themes');
    if (!container) return;
    container.innerHTML = '';
    Object.keys(PRESETS).forEach(name => {
      const p = PRESETS[name];
      const btn = document.createElement('button');
      btn.className = 'px-3 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-sm flex items-center gap-2';
      btn.innerHTML = `<span class=\"w-3 h-3 rounded-full\" style=\"background:${p.accent}\"></span> ${name}`;
      btn.addEventListener('click', () => {
        savePreferences({ ...p });
        showStatus('Applied: ' + name);
      });
      container.appendChild(btn);
    });
  }

  function renderCustomThemes(){
    const container = document.getElementById('custom-themes');
    if (!container) return;
    container.innerHTML = '';
    const themes = loadThemes();
    const keys = Object.keys(themes);
    if (!keys.length) {
      container.innerHTML = '<p class="text-neutral-500 text-sm">No custom themes yet</p>';
      return;
    }
    keys.forEach(name => {
      const theme = themes[name];
      const wrap = document.createElement('div');
      wrap.className = 'flex gap-2';
      const btn = document.createElement('button');
      btn.className = 'flex-1 px-3 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white text-sm text-left flex items-center gap-2';
      btn.innerHTML = `<span class=\"w-3 h-3 rounded-full\" style=\"background:${theme.accent || '#3b82f6'}\"></span> ${name}`;
      btn.addEventListener('click', () => { savePreferences(theme); showStatus('Applied: ' + name); });
      const del = document.createElement('button');
      del.className = 'px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs';
      del.textContent = 'X';
      del.title = 'Delete';
      del.addEventListener('click', () => { deleteTheme(name); });
      wrap.appendChild(btn);
      wrap.appendChild(del);
      container.appendChild(wrap);
    });
  }

  function saveThemeAs(name){
    if (!name) { showStatus('Enter a theme name'); return; }
    const themes = loadThemes();
    if (Object.keys(themes).length >= MAX_CUSTOM && !themes[name]) { showStatus('Max themes reached'); return; }
    themes[name] = currentFormValues();
    saveThemes(themes);
    renderCustomThemes();
    showStatus('Saved: ' + name);
    const nt = document.getElementById('new-theme-name'); if (nt) nt.value = '';
  }

  function deleteTheme(name){
    const themes = loadThemes();
    if (themes[name]) delete themes[name];
    saveThemes(themes);
    renderCustomThemes();
    showStatus('Deleted: ' + name);
  }

  function currentFormValues(){
    return {
      bg: (document.getElementById('pref-bg-color')).value,
      text: (document.getElementById('pref-text-color')).value,
      font: (document.getElementById('pref-font-family')).value,
      size: Number((document.getElementById('pref-font-size')).value),
      accent: (document.getElementById('pref-accent-color')).value,
      language: (document.getElementById('pref-language')).value,
      ttsVoice: (document.getElementById('pref-tts-voice')).value,
      ttsRate: Number((document.getElementById('pref-tts-rate')).value),
      ttsPitch: Number((document.getElementById('pref-tts-pitch')).value),
      ttsVolume: Number((document.getElementById('pref-tts-volume')).value),
      selectionColor: (document.getElementById('pref-selection-color')).value,
      buttonStyle: (document.getElementById('pref-button-style')).value
    };
  }

  function populateForm(prefs){
    if (!prefs) return;
    const d = PRESETS['Midnight'];
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    setVal('pref-bg-color', prefs.bg || d.bg);
    setVal('pref-text-color', prefs.text || d.text);
    setVal('pref-font-family', prefs.font || d.font);
    setVal('pref-font-size', prefs.size || d.size);
    const label = document.getElementById('font-size-label'); if (label) label.textContent = String(prefs.size || d.size);
    setVal('pref-accent-color', prefs.accent || d.accent);
    setVal('pref-language', prefs.language || '');

    if (prefs.ttsVoice) setVal('pref-tts-voice', prefs.ttsVoice);
    setVal('pref-tts-rate', prefs.ttsRate || 1);
    const rLab = document.getElementById('tts-rate-label'); if (rLab) rLab.textContent = String(prefs.ttsRate || 1.0);
    setVal('pref-tts-pitch', prefs.ttsPitch || 1);
    const pLab = document.getElementById('tts-pitch-label'); if (pLab) pLab.textContent = String(prefs.ttsPitch || 1.0);
    setVal('pref-tts-volume', prefs.ttsVolume || 1);
    const vLab = document.getElementById('tts-volume-label'); if (vLab) vLab.textContent = String(Math.round((prefs.ttsVolume || 1) * 100));

    setVal('pref-selection-color', prefs.selectionColor || '#3b82f6');
    setVal('pref-button-style', prefs.buttonStyle || 'rounded');
  }

  function showStatus(msg){
    const el = document.getElementById('preferences-status');
    if (!el) return;
    el.textContent = msg;
    setTimeout(()=> el.textContent = '', 2500);
  }

  function saveSectionPrefs(section){
    const current = loadPreferences() || { ...PRESETS['Midnight'] };
    const form = currentFormValues();

    if (section === 'text') {
      current.font = form.font;
      current.size = form.size;
      current.text = form.text;
    } else if (section === 'colors') {
      current.bg = form.bg;
      current.accent = form.accent;
      current.selectionColor = form.selectionColor;
      current.buttonStyle = form.buttonStyle;
    } else if (section === 'language') {
      const oldLang = current.language || '';
      const newLang = form.language;
      current.language = newLang;
      localStorage.setItem(storageKey, JSON.stringify(current));
      if (oldLang !== newLang) {
        showStatus('Language saved! Reloading...');
        setTimeout(() => window.location.reload(), 500);
        return;
      }
    } else if (section === 'tts') {
      current.ttsVoice = form.ttsVoice;
      current.ttsRate = form.ttsRate;
      current.ttsPitch = form.ttsPitch;
      current.ttsVolume = form.ttsVolume;
    }

    savePreferences(current);
    showStatus('Saved ' + section);
  }

  function populateTTSVoices() {
    const select = document.getElementById('pref-tts-voice');
    if (!select) return;
    
    const voices = speechSynthesis.getVoices();
    select.innerHTML = '';
    
    if (voices.length === 0) {
      select.innerHTML = '<option value="">No voices available</option>';
      return;
    }
    
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Default Voice';
    select.appendChild(defaultOpt);
    
    const voicesByLang = {};
    voices.forEach(voice => {
      const lang = voice.lang.split('-')[0];
      if (!voicesByLang[lang]) voicesByLang[lang] = [];
      voicesByLang[lang].push(voice);
    });
    
    const langs = Object.keys(voicesByLang).sort((a, b) => {
      if (a === 'en') return -1;
      if (b === 'en') return 1;
      return a.localeCompare(b);
    });
    
    langs.forEach(lang => {
      const group = document.createElement('optgroup');
      group.label = lang.toUpperCase();
      voicesByLang[lang].forEach(voice => {
        const opt = document.createElement('option');
        opt.value = voice.name;
        opt.textContent = `${voice.name} (${voice.lang})`;
        group.appendChild(opt);
      });
      select.appendChild(group);
    });
    
    const saved = loadPreferences();
    if (saved && saved.ttsVoice) {
      select.value = saved.ttsVoice;
    }
  }

  function testTTS() {
    if (!('speechSynthesis' in window)) { showStatus('Text-to-speech not supported'); return; }
    speechSynthesis.cancel();
    const textEl = document.getElementById('tts-test-text');
    const text = textEl ? textEl.value : 'Hello, this is a test.';
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceNameEl = document.getElementById('pref-tts-voice');
    const voiceName = voiceNameEl ? voiceNameEl.value : '';
    if (voiceName) {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.name === voiceName);
      if (voice) utterance.voice = voice;
    }
    const rateEl = document.getElementById('pref-tts-rate'); utterance.rate = rateEl ? Number(rateEl.value) || 1 : 1;
    const pitchEl = document.getElementById('pref-tts-pitch'); utterance.pitch = pitchEl ? Number(pitchEl.value) || 1 : 1;
    const volEl = document.getElementById('pref-tts-volume'); utterance.volume = volEl ? Number(volEl.value) || 1 : 1;
    speechSynthesis.speak(utterance);
  }

  // Initialization (called by main.js after DOMContentLoaded)
  renderPresets();
  renderCustomThemes();
  if ('speechSynthesis' in window) {
    populateTTSVoices();
    speechSynthesis.onvoiceschanged = populateTTSVoices;
  }

  const saved = loadPreferences();
  if (saved) populateForm(saved);
  else populateForm(PRESETS['Midnight']);

  const fontSizeEl = document.getElementById('pref-font-size'); if (fontSizeEl) fontSizeEl.addEventListener('input', function(e){ const lab = document.getElementById('font-size-label'); if (lab) lab.textContent = e.target.value; });
  const rateEl = document.getElementById('pref-tts-rate'); if (rateEl) rateEl.addEventListener('input', function(e){ const lab = document.getElementById('tts-rate-label'); if (lab) lab.textContent = e.target.value; });
  const pitchEl = document.getElementById('pref-tts-pitch'); if (pitchEl) pitchEl.addEventListener('input', function(e){ const lab = document.getElementById('tts-pitch-label'); if (lab) lab.textContent = e.target.value; });
  const volEl = document.getElementById('pref-tts-volume'); if (volEl) volEl.addEventListener('input', function(e){ const lab = document.getElementById('tts-volume-label'); if (lab) lab.textContent = Math.round(e.target.value * 100); });

  const ttsTestBtn = document.getElementById('tts-test-btn'); if (ttsTestBtn) ttsTestBtn.addEventListener('click', testTTS);

  document.querySelectorAll('.save-section-btn').forEach(btn => { btn.addEventListener('click', function() { saveSectionPrefs(this.dataset.section); }); });
  const saveAllBtn = document.getElementById('save-preferences'); if (saveAllBtn) saveAllBtn.addEventListener('click', function(){ savePreferences(currentFormValues()); showStatus('All preferences saved'); });

  const restoreBtn = document.getElementById('restore-styles'); if (restoreBtn) restoreBtn.addEventListener('click', function(){ localStorage.removeItem(storageKey); localStorage.removeItem(themesKey); if (window.SitePreferences && typeof window.SitePreferences.resetPreferences === 'function') { window.SitePreferences.resetPreferences(); } clearAllTranslationCookies(); showStatus('Reset complete'); setTimeout(() => location.reload(), 100); });

  const clearTransBtn = document.getElementById('clear-translation-btn'); if (clearTransBtn) clearTransBtn.addEventListener('click', function(){ clearAllTranslationCookies(); const current = loadPreferences() || { ...PRESETS['Midnight'] }; current.language = ''; localStorage.setItem(storageKey, JSON.stringify(current)); const langEl = document.getElementById('pref-language'); if (langEl) langEl.value = ''; showStatus('Translation cleared! Reloading...'); setTimeout(() => location.reload(), 500); });

  const saveThemeBtn = document.getElementById('save-theme-btn'); if (saveThemeBtn) saveThemeBtn.addEventListener('click', function(){ const nt = document.getElementById('new-theme-name'); saveThemeAs(nt ? nt.value.trim() : ''); });
  const newThemeEl = document.getElementById('new-theme-name'); if (newThemeEl) newThemeEl.addEventListener('keypress', function(e){ if (e.key === 'Enter') saveThemeAs(this.value.trim()); });

  ['pref-selection-color', 'pref-button-style'].forEach(id => { const el = document.getElementById(id); if (el) { const applyLivePreview = function() { const current = loadPreferences() || { ...PRESETS['Midnight'] }; const form = currentFormValues(); current.selectionColor = form.selectionColor; current.buttonStyle = form.buttonStyle; applyPreferences(current); }; el.addEventListener('change', applyLivePreview); el.addEventListener('input', applyLivePreview); } });

  function clearAllTranslationCookies() {
    const domain = window.location.hostname;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  }

  return Promise.resolve();
}
