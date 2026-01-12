// Shared runtime config
export const pythonURI = (window as any).__PYTHON_URI__ || '';
export const javaURI = (window as any).__JAVA_URI__ || '';

export const fetchOptions: RequestInit = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
};

// DELETED: Replaced by /assets/js/dashboard/config.js
