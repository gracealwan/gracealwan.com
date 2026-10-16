import './styles/tokens.css';
import './styles/fonts.css';
import './styles/base.css';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Missing #root element in index.html');

createRoot(rootElement).render(<App />);
