import initHub from './hub.js';
import { initTabs } from './tabs.js';
import initGithub from './github.js';
import initPreferences from './preferences.js';
import initAdmin from './admin.js';
import initAI from './ai.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    initHub();
    // Give browser a tick to parse injected HTML
    requestAnimationFrame(async () => {
      initTabs();
      await Promise.all([
        initGithub(),
        initPreferences(),
        initAdmin(),
        initAI()
      ]);
    });
  } catch (e) {
    console.error('Dashboard init error', e);
  }
});
