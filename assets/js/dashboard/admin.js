import { javaURI, fetchOptions } from './config.js';

export default async function initAdmin() {
  const peopleList = document.getElementById('admin-people-list');
  const loadingEl = document.getElementById('admin-people-loading');
  const modal = document.getElementById('admin-eval-modal');
  const modalTitle = document.getElementById('admin-eval-modal-title');
  const modalClose = document.getElementById('admin-eval-modal-close');
  const evalForm = document.getElementById('admin-eval-form');
  const updateBtn = document.getElementById('admin-eval-update-btn');
  const statusEl = document.getElementById('admin-eval-status');
  if (!peopleList) return;

  const sliderFields = [
    { key: "attendance", label: "Attendance" },
    { key: "work_habits", label: "Work Habits" },
    { key: "behavior", label: "Behavior" },
    { key: "timeliness", label: "Timeliness" },
    { key: "tech_sense", label: "Tech Sense" },
    { key: "tech_talk", label: "Tech Talk" },
    { key: "tech_growth", label: "Tech Growth" },
    { key: "advocacy", label: "Advocacy" },
    { key: "communication", label: "Communication" },
    { key: "integrity", label: "Integrity" },
    { key: "organization", label: "Organization" }
  ];

  let people = [];
  let currentPerson = null;
  let hasExistingEval = false;

  async function fetchPeople() {
    if (loadingEl) loadingEl.textContent = 'Loading users...';
    try {
      const response = await fetch(`${javaURI}/api/people`, fetchOptions);
      if (!response.ok) throw new Error('Failed to fetch people');
      const data = await response.json();
      people = data.map(person => ({ id: person.id, name: person.name, email: person.email, uid: person.uid, sid: person.sid }));
      peopleList.innerHTML = '';
      people.forEach(person => {
        const card = document.createElement('div');
        card.className = 'cursor-pointer border border-neutral-700 bg-neutral-800 rounded-xl p-5 shadow hover:border-blue-500 transition';
        card.innerHTML = `
          <div class="font-semibold text-lg mb-1">${person.name || 'No Name'}</div>
          <div class="text-sm text-neutral-400 mb-1">UID: <span class="font-mono">${person.uid}</span></div>
          <div class="text-xs text-neutral-500">ID: ${person.id}</div>
        `;
        card.addEventListener('click', () => openEvalModal(person));
        peopleList.appendChild(card);
      });
    } catch (e) {
      console.error(e);
      peopleList.innerHTML = '<p class="col-span-full text-red-500">Error loading users.</p>';
    }
  }

  async function openEvalModal(person) {
    currentPerson = person;
    hasExistingEval = false;
    if (modalTitle) modalTitle.innerHTML = `Evaluate: ${person.name} <span class="text-sm text-neutral-400 font-normal">(UID: ${person.uid})</span>`;

    let evalData = null;
    try {
      const res = await fetch(`${javaURI}/api/admin-evaluation/get/${person.id}`, fetchOptions);
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json === 'object' && json.evaluation) {
          evalData = json.evaluation;
          hasExistingEval = true;
        }
      }
    } catch (e) { evalData = null; }

    let studentEvalData = null;
    try {
      const res = await fetch(`${javaURI}/api/student-evaluation/get/${person.id}`, fetchOptions);
      if (res.ok) {
        const json = await res.json();
        studentEvalData = json.evaluation || json;
      }
    } catch (e) { console.error('Error fetching student eval', e); }

    if (!studentEvalData && modalTitle) {
      modalTitle.innerHTML += `<br><span class="text-xs text-yellow-500 font-normal">Student has not self-evaluated yet.</span>`;
    } else if (modalTitle) {
      modalTitle.innerHTML += `<br><span class="text-xs text-green-400 font-normal">Student self-evaluation loaded.</span>`;
    }

    const apiToSliderKey = {
      attendance: 'attendance',
      workHabits: 'work_habits',
      behavior: 'behavior',
      timeliness: 'timeliness',
      techSense: 'tech_sense',
      techTalk: 'tech_talk',
      techGrowth: 'tech_growth',
      advocacy: 'advocacy',
      communication: 'communication',
      integrity: 'integrity',
      organization: 'organization'
    };

    if (evalForm) {
      evalForm.innerHTML = sliderFields.map(f => {
        let val = 4;
        if (evalData) {
          const apiKey = Object.keys(apiToSliderKey).find(k => apiToSliderKey[k] === f.key);
          if (apiKey && typeof evalData[apiKey] !== 'undefined' && evalData[apiKey] !== null) val = evalData[apiKey];
        }

        let studentVal = 'N/A';
        if (studentEvalData) {
          const apiKey = Object.keys(apiToSliderKey).find(k => apiToSliderKey[k] === f.key);
          if (apiKey && typeof studentEvalData[apiKey] !== 'undefined' && studentEvalData[apiKey] !== null) studentVal = studentEvalData[apiKey];
          else if (typeof studentEvalData[f.key] !== 'undefined' && studentEvalData[f.key] !== null) studentVal = studentEvalData[f.key];
        }

        return `
          <div class="bg-neutral-800/50 p-3 rounded border border-neutral-700">
            <div class="flex justify-between items-center mb-2">
              <label for="admin-slider-${f.key}" class="text-sm text-neutral-300 font-medium">${f.label}</label>
              <span class="text-xs text-neutral-400">Student: <span class="${studentVal !== 'N/A' ? 'text-blue-300 font-bold' : 'text-neutral-500'}">${studentVal}</span></span>
            </div>
            <input type="range" id="admin-slider-${f.key}" name="${f.key}" min="1" max="5" value="${val}" class="w-full accent-blue-600" />
            <div class="text-right mt-1">
              <span class="text-xs text-neutral-400">Admin: <span id="admin-val-${f.key}" class="font-bold text-white">${val}</span></span>
            </div>
          </div>
        `;
      }).join('');

      sliderFields.forEach(f => {
        const slider = document.getElementById(`admin-slider-${f.key}`);
        const label = document.getElementById(`admin-val-${f.key}`);
        if (slider && label) {
          slider.addEventListener('input', () => { label.textContent = slider.value; });
        }
      });
    }

    if (statusEl) statusEl.textContent = '';
    if (modal) modal.classList.remove('hidden');
  }

  function closeEvalModal() {
    if (modal) modal.classList.add('hidden');
    currentPerson = null;
  }

  if (modalClose) modalClose.onclick = closeEvalModal;
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeEvalModal(); });

  if (updateBtn) updateBtn.onclick = async () => {
    if (!currentPerson) return;
    updateBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Updating...';
    const body = { user_id: currentPerson.id };
    sliderFields.forEach(f => {
      const el = document.getElementById(`admin-slider-${f.key}`);
      body[f.key] = el ? Number(el.value) : 0;
    });
    try {
      let res;
      if (hasExistingEval) {
        res = await fetch(`${javaURI}/api/admin-evaluation/update/${currentPerson.id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } else {
        res = await fetch(`${javaURI}/api/admin-evaluation/post`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }
      if (!res.ok) throw new Error('Failed to update');
      if (statusEl) statusEl.textContent = '✅ Updated successfully!';
      hasExistingEval = true;
    } catch (e) {
      if (statusEl) statusEl.textContent = '❌ Error updating.';
    }
    updateBtn.disabled = false;
  };

  await fetchPeople();
  return Promise.resolve();
}
