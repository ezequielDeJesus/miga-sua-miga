export function renderBottomNav() {
  const currentPath = window.location.pathname;

  const navItems = [
    { name: 'Moodboard', icon: 'auto_awesome', path: '/pages/moodboard.html' },
    { name: 'Home', icon: 'home', path: '/' },
    { name: 'Provador', icon: 'apparel', path: '/pages/provador.html' },
    { name: 'Chat', icon: 'forum', path: '/pages/chat.html' },
    { name: 'Decorador', icon: 'architecture', path: '/pages/decorador.html' },
    { name: 'Catálogo', icon: 'menu_book', path: '/pages/catalogo.html' }
  ];

  return `
    <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-black/5 px-2 pb-6 pt-3 z-50">
      <div class="max-w-md mx-auto flex justify-around items-end relative">
        ${navItems.map((item, index) => {
    const isActive = (item.path === '/' && (currentPath === '/' || currentPath === '/index.html')) ||
      (item.path !== '/' && currentPath.includes(item.path.split('/').pop()));

    // Home is the special FAB style in the middle (position 2 in 1-6 sequence)
    if (index === 1) { // Home is #2
      return `
                <div class="relative -top-8 flex flex-col items-center">
                  <a href="/" class="bg-[#225373] text-white size-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white active:scale-95 transition-transform">
                     <span class="material-symbols-outlined text-3xl font-bold">home</span>
                  </a>
                  <span class="text-[7px] font-black uppercase tracking-tighter mt-1 ${isActive ? 'text-[#225373]' : 'text-[#5f5f5f] opacity-40'}">Home</span>
                </div>
                `;
    }

    return `
            <a href="${item.path}" class="flex flex-col items-center gap-1 w-12 pb-1 transition-all ${isActive ? 'text-[#225373] scale-110' : 'text-[#5f5f5f] opacity-60'}">
              <span class="material-symbols-outlined text-xl ${isActive ? 'fill-1' : ''}">${item.icon}</span>
              <span class="text-[7px] font-black uppercase tracking-tighter">${item.name}</span>
            </a>
            `;
  }).join('')}
      </div>
    </nav>
  `;
}
