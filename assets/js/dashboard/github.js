import { pythonURI, fetchOptions } from './config.js';

export default async function initGithub() {
  try {
    const profileUrl = `${pythonURI}/api/analytics/github/user/profile_links`;
    const res = await fetch(profileUrl, fetchOptions);
    if (!res.ok) return;
    const data = await res.json();
    if (data) {
      document.getElementById('username').textContent = data.login || 'Unknown';
      const avatar = document.getElementById('avatar');
      if (avatar && data.avatar_url) avatar.src = data.avatar_url;
      document.getElementById('profile-url').textContent = data.html_url || '';
      document.getElementById('repos-url').textContent = data.repos_url || '';
    }
  } catch (e) {
    console.error('initGithub error', e);
  }
}
