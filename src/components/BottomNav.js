export function renderBottomNav() {
  const currentPath = window.location.pathname;

  if (!window.toggleMoreMenu) {
    window.toggleMoreMenu = function (show) {
      const overlay = document.getElementById('more-menu-overlay');
      const content = document.getElementById('more-menu-content');
      if (show) {
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        setTimeout(() => {
          overlay.classList.remove('opacity-0');
          content.classList.remove('translate-y-full');
        }, 10);
      } else {
        overlay.classList.add('opacity-0');
        content.classList.add('translate-y-full');
        setTimeout(() => {
          overlay.classList.add('hidden');
          overlay.classList.remove('flex');
        }, 300);
      }
    };
  }

  // A sequência exata pedida, mas com o botão "Mais" no final para limpar
  const navItems = [
    { name: 'Moodboard', icon: 'auto_awesome', path: '/pages/moodboard.html' },
    { name: 'Home', icon: 'home', path: '/' }, // Índice 1
    { name: 'Provador', icon: 'apparel', path: '/pages/provador.html' },
    { name: 'Chat', icon: 'forum', path: '/pages/chat.html' },
    { name: 'Mais', icon: 'more_horiz', action: 'window.toggleMoreMenu(true)' } // O menu de três pontinhos
  ];

  // Itens dentro do menu "Mais"
  const moreItems = [
    { name: 'Decorador', icon: 'architecture', path: '/pages/decorador.html' },
    { name: 'Catálogo', icon: 'menu_book', path: '/pages/catalogo.html' },
    { name: 'Alquimia', icon: 'local_bar', path: '/pages/alquimia.html' },
    { name: 'Tendências', icon: 'auto_awesome_mosaic', path: '/pages/tendencias.html' },
    { name: 'Help Noiva', icon: 'support_agent', path: '/pages/help-noiva.html' }
  ];

  // O overlay do menu "Mais" escondido
  const renderMoreMenu = `
    <div id="more-menu-overlay" class="fixed inset-0 bg-black/50 z-[100] hidden flex-col justify-end pb-24 px-4 transition-opacity duration-300 opacity-0" onclick="window.toggleMoreMenu(false)">
       <div id="more-menu-content" class="bg-white w-full max-w-sm mx-auto rounded-[30px] p-6 shadow-2xl transform translate-y-full transition-transform duration-300 relative" onclick="event.stopPropagation()">
          <div class="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-6"></div>
          <h3 class="font-black text-[10px] tracking-widest text-[#225373] uppercase opacity-60 mb-6 text-center">Mais Opções</h3>
          <div class="grid grid-cols-4 gap-4">
             ${moreItems.map(item => {
    const isActive = currentPath.includes(item.path.split('/').pop());
    return `
                <a href="${item.path}" class="flex flex-col items-center gap-2 group">
                   <div class="size-14 rounded-2xl ${isActive ? 'bg-[#225373] text-white shadow-md' : 'bg-[#225373]/5 text-[#225373]'} flex items-center justify-center group-active:scale-95 transition-transform">
                      <span class="material-symbols-outlined text-2xl">${item.icon}</span>
                   </div>
                   <span class="text-[8px] font-black uppercase tracking-tight ${isActive ? 'text-[#225373]' : 'text-[#5f5f5f] opacity-80'} text-center">${item.name}</span>
                </a>
                `;
  }).join('')}
          </div>
       </div>
    </div>
  `;

  return `
    ${renderMoreMenu}
    <nav class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-black/5 px-2 pb-6 pt-3 z-[90]">
      <div class="max-w-md mx-auto flex justify-between items-end relative px-4">
        ${navItems.map((item, index) => {

    // Calcula qual está ativo
    const isActive = item.path ? ((item.path === '/' && (currentPath === '/' || currentPath === '/index.html')) ||
      (item.path !== '/' && currentPath.includes(item.path.split('/').pop()))) : false;

    // Home é o FAB gigante (índice 1 no array atual)
    if (index === 1) {
      return `
                <div class="relative -top-8 flex flex-col items-center group">
                  <a href="/" class="bg-[#225373] text-white size-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white active:scale-95 transition-transform group-hover:scale-105">
                     <span class="material-symbols-outlined text-3xl font-bold">home</span>
                  </a>
                  <span class="text-[7px] font-black uppercase tracking-tighter mt-1 ${isActive ? 'text-[#225373] opacity-100' : 'text-[#5f5f5f] opacity-40'} transition-all">Home</span>
                </div>
                `;
    }

    // Botões que disparam ações (como o Mais)
    if (item.action) {
      return `
              <button onclick="${item.action}" class="flex flex-col items-center gap-1 w-12 pb-1 transition-all text-[#5f5f5f] opacity-60 hover:opacity-100 hover:scale-110">
                <span class="material-symbols-outlined text-xl">${item.icon}</span>
                <span class="text-[7px] font-black uppercase tracking-tighter">${item.name}</span>
              </button>
      `;
    }

    // Links normais
    return `
            <a href="${item.path}" class="flex flex-col items-center gap-1 w-12 pb-1 transition-all ${isActive ? 'text-[#225373] scale-110 opacity-100' : 'text-[#5f5f5f] opacity-60 hover:opacity-100 hover:scale-110'}">
              <span class="material-symbols-outlined text-xl ${isActive ? 'fill-1' : ''}">${item.icon}</span>
              <span class="text-[7px] font-black uppercase tracking-tighter">${item.name}</span>
            </a>
            `;
  }).join('')}
      </div>
    </nav>
  `;
}
