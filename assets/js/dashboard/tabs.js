export function initTabs() {
  const tabs = Array.from(document.querySelectorAll('.tab-btn'));
  const tabContents = Array.from(document.querySelectorAll('.tab-content'));
  const underline = document.getElementById('tab-underline');

  function setUnderline(el) {
    if (!el || !underline) return;
    const rect = el.getBoundingClientRect();
    const parentRect = el.parentElement?.parentElement?.getBoundingClientRect();
    if (!parentRect) return;
    underline.style.width = `${rect.width}px`;
    underline.style.left = `${rect.left - parentRect.left}px`;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active', 'text-blue-500', 'border-blue-500'));
      tabContents.forEach(c => { c.classList.add('hidden'); c.classList.remove('block'); });
      const targetId = `tab-content-${tab.id.replace('tab-', '')}`;
      const target = document.getElementById(targetId);
      target?.classList.remove('hidden');
      target?.classList.add('block');
      tab.classList.add('active', 'text-blue-500', 'border-blue-500');
      setUnderline(tab);
    });
  });

  const active = tabs.find(t => t.classList.contains('active'));
  setUnderline(active || tabs[0] || null);
}
