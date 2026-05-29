import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

const savedTheme = localStorage.getItem('atrito-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(<App />);
