export default function initHub() {
  const root = document.getElementById('dashboard-root');
  if (!root) return;

  root.innerHTML = `
<div class="w-full">
  <div class="space-y-4 sm:space-y-6">
    <div class="text-sm font-medium text-center border-b text-neutral-400 border-neutral-700 relative">
      <ul class="flex flex-wrap -mb-px relative" id="tab-bar">
        <li class="me-2">
          <a href="#" id="tab-preferences" class="tab-btn inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-neutral-300 hover:text-neutral-300 active text-blue-500 border-blue-500" aria-current="page">Preferences</a>
        </li>
        <li class="me-2">
          <a href="#" id="tab-github" class="tab-btn inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-neutral-300 hover:text-neutral-300">GitHub Analytics</a>
        </li>
        <li class="me-2">
          <a href="#" id="tab-grade" class="tab-btn inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-neutral-300 hover:text-neutral-300">Grade Predictor</a>
        </li>
      </ul>
      <div id="tab-underline" style="position:absolute;bottom:0;left:0;height:2px;width:0;background:#2563eb;transition:all 0.3s cubic-bezier(.4,0,.2,1);border-radius:2px;"></div>
    </div>

    <div id="tab-content-container" class="relative min-h-[400px]">
      <!-- Queue tab content -->
      <div id="tab-content-wait" class="tab-content hidden px-6 py-4 text-neutral-200">
        <div class="mt-6 flex flex-col items-center justify-center min-h-[220px] text-center">
          <p class="text-sm text-neutral-400 mb-3">Sign Up and Queue's</p>
          <div class="flex flex-wrap gap-3 justify-center">
            <a id="btn-hallpass" href="/hallpass_queue/" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium">Hallpass</a>
            <a id="btn-team-teach" href="/student/TeamTeachToolkit/signup" class="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium">Team Teach Sign Up</a>
            <a id="btn-assign-submit" href="/student/submissions/" class="px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-700 text-neutral-900 font-medium">Submit Assignment</a>
          </div>
        </div>
      </div>

      <!-- github analytics tab content -->
      <div id="tab-content-github" class="tab-content hidden px-6 py-4 text-neutral-200">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 sm:grid-rows-4 lg:grid-rows-2 gap-4 sm:gap-6 text-neutral-200">
          <div class="row-span-2 col-start-1 flex flex-col border shadow-2xs rounded-xl bg-neutral-800 border-neutral-700">
            <div class="p-4 md:p-5 flex justify-center items-center">
              <img src="" alt="User Avatar" id="avatar" class="w-32 h-32 rounded-xl object-cover" />
            </div>
          </div>
          <div class="row-span-2 col-start-2 flex flex-col border shadow-2xs rounded-xl bg-neutral-800 border-neutral-700 p-5">
            <p class="text-xs uppercase text-neutral-500 mb-2">GitHub Info (Trimester)</p>
            <h3 id="username" class="text-2xl font-medium mb-2">Loading...</h3>
            <p id="profile-url" class="text-sm mb-1">Profile URL: Loading...</p>
            <p id="repos-url" class="text-sm mb-1">Repos URL: Loading...</p>
            <p id="public-repos" class="text-sm mb-1">Public Repos: Loading...</p>
            <p id="public-gists" class="text-sm mb-1">Public Gists: Loading...</p>
            <p id="followers" class="text-sm mb-1">Followers: Loading...</p>
            <p id="following" class="text-sm mb-1">Following: Loading...</p>
          </div>

          <div class="col-start-3 flex flex-col border shadow-2xs rounded-xl bg-neutral-800 border-neutral-700 p-5">
            <p class="text-xs uppercase text-neutral-500 mb-2 flex items-center gap-1">Commits <a href="#" class="info-link" id="commits-info" title="Click for details"><i class="fas fa-info-circle info-icon"></i></a></p>
            <h3 id="commits-count" class="text-2xl font-medium">Loading...</h3>
          </div>

          <div class="col-start-4 flex flex-col border shadow-2xs rounded-xl bg-neutral-800 border-neutral-700 p-5">
            <p class="text-xs uppercase text-neutral-500 mb-2 flex items-center gap-1">Issues <a href="#" class="info-link" id="issues-info" title="Click for details"><i class="fas fa-info-circle info-icon"></i></a></p>
            <h3 id="issues-count" class="text-2xl font-medium">Loading...</h3>
          </div>

          <div class="col-start-3 row-start-2 flex flex-col border shadow-2xs rounded-xl bg-neutral-800 border-neutral-700 p-5">
            <p class="text-xs uppercase text-neutral-500 mb-2 flex items-center gap-1">Pull Requests <a href="#" class="info-link" id="prs-info" title="Click for details"><i class="fas fa-info-circle info-icon"></i></a></p>
            <h3 id="prs-count" class="text-2xl font-medium">Loading...</h3>
          </div>

          <div class="col-start-4 row-start-2 flex flex-col border shadow-2xs rounded-xl bg-neutral-800 border-neutral-700 p-5">
            <p class="text-xs uppercase text-neutral-500 mb-2">Lines Changed</p>
            <h3 id="lines-changed" class="text-2xl font-medium">Loading...</h3>
          </div>
        </div>
        <div id="commitCardsContainer" class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
      </div>

      <!-- grade predictor tab content -->
      <div id="tab-content-grade" class="tab-content hidden px-6 py-4 text-neutral-200">
        <h2 class="text-xl font-semibold mb-4">Grade Predictor</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6 flex flex-col">
            <h3 class="text-lg font-semibold mb-2 text-blue-300">Technical analytics</h3>
            <p class="mb-4 text-neutral-400 text-sm">Predict your grade based on your GitHub activity (commits, PRs, issues, code changes, etc).</p>
            <div class="mb-4">
              <p class="text-neutral-400 text-xs mb-2"><strong>How is this grade calculated?</strong><br>The technical grade uses a weighted formula based on your GitHub stats:</p>
              <pre class="bg-neutral-900 text-neutral-200 p-3 rounded text-xs overflow-x-auto mb-2" style="font-family: 'Source Code Pro', monospace;">score += commits * 2
score += additions * 0.15
score += deletions * 0.1
score += prs * 3
score += issues * 1.5
score += repos * 1.2
score += gists * 0.5</pre>
            </div>
            <button id="predictTechGradeBtn" class="mb-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition text-white font-semibold">Predict Grade</button>
            <p id="techGradeResult" class="text-xl font-semibold"></p>
          </div>

          <div class="bg-neutral-800 border border-neutral-700 rounded-xl p-6 flex flex-col">
            <h3 class="text-lg font-semibold mb-2 text-green-300">Evaluation matrix</h3>
            <p class="mb-4 text-neutral-400 text-sm">Adjust each slider to reflect your self-assessment or teacher's assessment for each skill (1 = lowest, 5 = highest).</p>
            <form id="smart-grade-form" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label for="slider-attendance" class="block text-sm text-neutral-300 mb-1">Attendance</label>
                <input type="range" id="slider-attendance" name="attendance" min="1" max="5" value="4" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-attendance">4</span></span>
              </div>
              <div>
                <label for="slider-work_habits" class="block text-sm text-neutral-300 mb-1">Work Habits</label>
                <input type="range" id="slider-work_habits" name="work_habits" min="1" max="5" value="5" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-work_habits">5</span></span>
              </div>
              <div>
                <label for="slider-behavior" class="block text-sm text-neutral-300 mb-1">Behavior</label>
                <input type="range" id="slider-behavior" name="behavior" min="1" max="5" value="4" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-behavior">4</span></span>
              </div>
              <div>
                <label for="slider-timeliness" class="block text-sm text-neutral-300 mb-1">Timeliness</label>
                <input type="range" id="slider-timeliness" name="timeliness" min="1" max="5" value="5" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-timeliness">5</span></span>
              </div>
              <div>
                <label for="slider-tech_sense" class="block text-sm text-neutral-300 mb-1">Tech Sense</label>
                <input type="range" id="slider-tech_sense" name="tech_sense" min="1" max="5" value="4" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-tech_sense">4</span></span>
              </div>
              <div>
                <label for="slider-tech_talk" class="block text-sm text-neutral-300 mb-1">Tech Talk</label>
                <input type="range" id="slider-tech_talk" name="tech_talk" min="1" max="5" value="4" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-tech_talk">4</span></span>
              </div>
              <div>
                <label for="slider-tech_growth" class="block text-sm text-neutral-300 mb-1">Tech Growth</label>
                <input type="range" id="slider-tech_growth" name="tech_growth" min="1" max="5" value="5" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-tech_growth">5</span></span>
              </div>
              <div>
                <label for="slider-advocacy" class="block text-sm text-neutral-300 mb-1">Advocacy</label>
                <input type="range" id="slider-advocacy" name="advocacy" min="1" max="5" value="4" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-advocacy">4</span></span>
              </div>
              <div>
                <label for="slider-communication" class="block text-sm text-neutral-300 mb-1">Communication</label>
                <input type="range" id="slider-communication" name="communication" min="1" max="5" value="5" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-communication">5</span></span>
              </div>
              <div>
                <label for="slider-integrity" class="block text-sm text-neutral-300 mb-1">Integrity</label>
                <input type="range" id="slider-integrity" name="integrity" min="1" max="5" value="5" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-integrity">5</span></span>
              </div>
              <div>
                <label for="slider-organization" class="block text-sm text-neutral-300 mb-1">Organization</label>
                <input type="range" id="slider-organization" name="organization" min="1" max="5" value="4" class="w-full" />
                <span class="text-xs text-neutral-400">Value: <span id="val-organization">4</span></span>
              </div>
            </form>
            <button id="smartPredictBtn" class="px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition text-white font-semibold">Smart Predict Grade</button>
            <p id="userGrade" class="text-xl font-semibold mt-4"></p>
          </div>
        </div>
      </div>

      <!-- admin search tab content -->
      <div id="tab-content-admin-search" class="tab-content hidden px-6 py-4 text-neutral-200">
        <h2 class="text-xl font-semibold mb-4">Admin: Search & Evaluate Users</h2>
        <div id="admin-people-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <p class="col-span-full text-neutral-400" id="admin-people-loading">Loading users...</p>
        </div>
        <div id="admin-eval-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 hidden">
          <div class="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-lg relative">
            <button id="admin-eval-modal-close" class="absolute top-3 right-3 text-neutral-400 hover:text-white text-2xl">&times;</button>
            <h3 id="admin-eval-modal-title" class="text-lg font-semibold mb-4"></h3>
            <form id="admin-eval-form" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"></form>
            <button id="admin-eval-update-btn" class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">Update</button>
            <p id="admin-eval-status" class="text-sm mt-3"></p>
          </div>
        </div>
      </div>

      <div id="tab-content-your-feedback" class="tab-content hidden px-6 py-4 text-neutral-200">
        <h2 class="text-xl font-semibold mb-4">Your Feedback</h2>
        <div id="user-feedback-table-container"><p class="text-neutral-400">Loading your feedback history...</p></div>
      </div>

      <!-- Preferences tab content -->
      <div id="tab-content-preferences" class="tab-content block px-6 py-4 text-neutral-200 max-w-5xl mx-auto">
        <h2 class="text-xl font-semibold mb-2">Preferences</h2>
        <p class="text-neutral-400 mb-6">Customize how the site looks. Changes apply across the site and are saved locally.</p>

        <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium">🌐 Language Translation</h3>
            <div class="flex gap-2">
              <button type="button" id="clear-translation-btn" class="px-3 py-1 text-sm rounded bg-orange-600 hover:bg-orange-700 text-white">Reset to English</button>
              <button type="button" class="save-section-btn px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white" data-section="language">Save</button>
            </div>
          </div>
          <p class="text-sm text-neutral-400 mb-4">Translate the entire site into your preferred language. This setting is saved and applies across all pages.</p>
          <div class="flex flex-col gap-4">
            <div>
              <label class="text-sm text-neutral-400">Site Language</label>
              <select id="pref-language" class="w-full bg-neutral-700 text-white rounded px-2 py-2 mt-1">
                <option value="">Default (English - No Translation)</option>
                <option value="es">🇪🇸 Spanish (Español)</option>
                <option value="fr">🇫🇷 French (Français)</option>
                <option value="de">🇩🇪 German (Deutsch)</option>
                <option value="it">🇮🇹 Italian (Italiano)</option>
                <option value="pt">🇵🇹 Portuguese (Português)</option>
                <option value="ru">🇷🇺 Russian (Русский)</option>
                <option value="zh-CN">🇨🇳 Chinese Simplified (简体中文)</option>
                <option value="zh-TW">🇹🇼 Chinese Traditional (繁體中文)</option>
                <option value="ja">🇯🇵 Japanese (日本語)</option>
                <option value="ko">🇰🇷 Korean (한국어)</option>
                <option value="ar">🇸🇦 Arabic (العربية)</option>
                <option value="hi">🇮🇳 Hindi (हिन्दी)</option>
                <option value="vi">🇻🇳 Vietnamese (Tiếng Việt)</option>
                <option value="th">🇹🇭 Thai (ไทย)</option>
                <option value="nl">🇳🇱 Dutch (Nederlands)</option>
                <option value="pl">🇵🇱 Polish (Polski)</option>
                <option value="tr">🇹🇷 Turkish (Türkçe)</option>
                <option value="uk">🇺🇦 Ukrainian (Українська)</option>
                <option value="he">🇮🇱 Hebrew (עברית)</option>
              </select>
            </div>
            <p class="text-xs text-neutral-500">Translation powered by Google Translate. Click "Reset to English" if translation gets stuck.</p>
          </div>
        </div>

        <div class="mt-6 p-4 rounded-lg bg-neutral-800 border border-neutral-700">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium">Text-to-Speech</h3>
            <div class="flex gap-2">
              <button type="button" id="tts-test-btn" class="px-3 py-1 text-sm rounded bg-purple-600 hover:bg-purple-700 text-white">Test Voice</button>
              <button type="button" class="save-section-btn px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white" data-section="tts">Save</button>
            </div>
          </div>
          <p class="text-sm text-neutral-400 mb-4">Configure text-to-speech settings. Select text on any page and use the TTS button in the sidebar to hear it read aloud.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-neutral-400">Voice</label>
              <select id="pref-tts-voice" class="w-full bg-neutral-700 text-white rounded px-2 py-2 mt-1"><option value="">Loading voices...</option></select>
            </div>
            <div>
              <label class="text-sm text-neutral-400">Speed: <span id="tts-rate-label">1.0</span>x</label>
              <input type="range" id="pref-tts-rate" min="0.5" max="2" step="0.1" value="1" class="w-full mt-1" />
            </div>
            <div>
              <label class="text-sm text-neutral-400">Pitch: <span id="tts-pitch-label">1.0</span></label>
              <input type="range" id="pref-tts-pitch" min="0.5" max="2" step="0.1" value="1" class="w-full mt-1" />
            </div>
            <div>
              <label class="text-sm text-neutral-400">Volume: <span id="tts-volume-label">100</span>%</label>
              <input type="range" id="pref-tts-volume" min="0" max="1" step="0.1" value="1" class="w-full mt-1" />
            </div>
          </div>
          <div class="mt-4">
            <label class="text-sm text-neutral-400">Test Text</label>
            <input type="text" id="tts-test-text" class="w-full bg-neutral-700 text-white rounded px-3 py-2 mt-1" value="Hello! This is a test of the text-to-speech feature." placeholder="Enter text to test..." />
          </div>
          <p class="text-xs text-neutral-500 mt-3">Uses your browser's built-in speech synthesis. Available voices depend on your operating system.</p>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-medium">Text</h3>
              <button type="button" class="save-section-btn px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white" data-section="text">Save</button>
            </div>
            <div class="flex flex-col gap-4">
              <div>
                <label class="text-sm text-neutral-400">Font size: <span id="font-size-label">14</span>px</label>
                <input type="range" id="pref-font-size" min="12" max="22" value="14" class="w-full mt-1" />
              </div>

              <div>
                <label class="text-sm text-neutral-400">Font family</label>
                <select id="pref-font-family" class="w-full bg-neutral-700 text-white rounded px-2 py-1 mt-1">
                  <option value="Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial">Inter / System</option>
                  <option value="Roboto, system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial">Roboto</option>
                  <option value="'Open Sans', Arial, sans-serif">Open Sans</option>
                  <option value="Lato, Arial, sans-serif">Lato</option>
                  <option value="Montserrat, Arial, sans-serif">Montserrat</option>
                  <option value="Georgia, 'Times New Roman', Times, serif">Georgia (Serif)</option>
                  <option value="'Source Code Pro', monospace">Source Code Pro</option>
                </select>
              </div>

              <div>
                <label class="text-sm text-neutral-400">Text color</label>
                <input type="color" id="pref-text-color" value="#e6eef8" class="w-full h-8 mt-1 rounded" />
              </div>
            </div>
          </div>

          <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-medium">Colors</h3>
              <button type="button" class="save-section-btn px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white" data-section="colors">Save</button>
            </div>
            <div class="flex flex-col gap-4">
              <div>
                <label class="text-sm text-neutral-400">Background color</label>
                <input type="color" id="pref-bg-color" value="#0b1220" class="w-full h-8 mt-1 rounded" />
              </div>
              
              <div>
                <label class="text-sm text-neutral-400">Accent color</label>
                <input type="color" id="pref-accent-color" value="#3b82f6" class="w-full h-8 mt-1 rounded" />
              </div>
              
              <div>
                <label class="text-sm text-neutral-400">Selection highlight color</label>
                <input type="color" id="pref-selection-color" value="#3b82f6" class="w-full h-8 mt-1 rounded" />
              </div>
              
              <div>
                <label class="text-sm text-neutral-400">Button style</label>
                <select id="pref-button-style" class="w-full bg-neutral-700 text-white rounded px-2 py-2 mt-1">
                  <option value="rounded">Rounded (Default)</option>
                  <option value="square">Square</option>
                  <option value="pill">Pill</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 rounded-lg bg-neutral-800 border border-neutral-700">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex gap-3">
              <button id="save-preferences" type="button" class="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-medium">Save All</button>
              <button id="restore-styles" type="button" class="px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white font-medium">Reset</button>
            </div>
            <p id="preferences-status" class="text-sm text-neutral-400"></p>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700">
            <h3 class="font-medium mb-3">Preset Themes</h3>
            <div class="grid grid-cols-2 gap-2" id="preset-themes"></div>
          </div>

          <div class="p-4 rounded-lg bg-neutral-800 border border-neutral-700">
            <h3 class="font-medium mb-3">Custom Themes</h3>
            <div class="flex gap-2 mb-3">
              <input id="new-theme-name" class="flex-1 bg-neutral-700 text-white rounded px-2 py-1" placeholder="Theme name" />
              <button id="save-theme-btn" class="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white">Save</button>
            </div>
            <div id="custom-themes" class="grid grid-cols-1 gap-2"></div>
          </div>
        </div>

        <div class="mt-6 p-4 rounded-lg bg-neutral-800 border border-neutral-700" id="ask-ai-panel">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium">Ask AI: Generate a Theme</h3>
            <div class="flex gap-2">
            <button id="ask-ai-toggle" type="button" class="px-3 py-1 text-sm rounded bg-indigo-600 hover:bg-indigo-700 text-white">Ask AI</button>
            </div>
          </div>

          <div id="ask-ai-dropdown" class="hidden mt-3">
            <label class="text-sm text-neutral-400 block">Describe the style you want (e.g. "modern, playful, cool blues")</label>
            <textarea id="ask-ai-prompt" class="w-full mt-2 bg-neutral-700 text-white rounded px-3 py-2" rows="4" placeholder="Describe colors, tones, fonts, mood, and any words like 'modern', 'playful', 'professional', etc."></textarea>

            <div class="flex gap-2 mt-3">
            <button id="ask-ai-send" class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white">Get Suggestions</button>
            <button id="ask-ai-clear" class="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white">Clear</button>
            </div>

            <div id="ask-ai-status" class="text-sm text-neutral-400 mt-2"></div>

            <div id="ask-ai-response" class="mt-4 p-3 bg-neutral-900 border border-neutral-700 rounded text-sm text-neutral-200 whitespace-pre-wrap"></div>

            <div class="mt-3 flex gap-2 items-center">
            <button id="ask-ai-apply" class="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white">Apply to Form</button>
            <a id="ask-ai-open" href="#" target="_blank" class="text-sm text-blue-400 underline hidden ml-2">Open full response</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
`;
}
