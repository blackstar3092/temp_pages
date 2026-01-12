export default async function initAI() {
  const toggle = document.getElementById('ask-ai-toggle');
  const dropdown = document.getElementById('ask-ai-dropdown');
  if (!toggle || !dropdown) return;
  toggle.addEventListener('click', () => dropdown.classList.toggle('hidden'));

  const send = document.getElementById('ask-ai-send');
  const clear = document.getElementById('ask-ai-clear');
  const resp = document.getElementById('ask-ai-response');
  const status = document.getElementById('ask-ai-status');
  if (clear) clear.addEventListener('click', () => { if (resp) resp.textContent = ''; if (status) status.textContent = ''; });
  if (send) send.addEventListener('click', async () => {
    if (status) status.textContent = 'Generating...';
    // placeholder - integrate real AI call here
    await new Promise(r => setTimeout(r, 700));
    if (resp) resp.textContent = 'Suggested theme:\n- Background: #0b1220\n- Accent: #3b82f6\n- Font: Inter';
    if (status) status.textContent = 'Done';
  });
}
