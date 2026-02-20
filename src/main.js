import './styles/main.css';
import { renderBottomNav } from './components/BottomNav';
import { renderHeader } from './components/AppHeader';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.querySelector('#app-shell');
    if (appContainer) {
        // Inject common components if the container exists
        const headerPlaceholder = document.querySelector('#header-placeholder');
        const navPlaceholder = document.querySelector('#nav-placeholder');

        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = renderHeader(headerPlaceholder.dataset.title);
        }

        if (navPlaceholder) {
            navPlaceholder.innerHTML = renderBottomNav();
        }
    }
});
