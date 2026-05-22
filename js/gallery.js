/* ============================================================
   NB Nexa — Gallery Data Manager
   Reads/writes gallery items to localStorage.
   Used by: index.html (preview), gallery.html (full), admin/gallery.html (editor)
   ============================================================ */

window.NBGallery = (function () {
  var KEY = 'nbnexa-gallery-v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }

  function save(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }

  function add(item) {
    var items = load();
    item.id = Date.now() + Math.random().toString(36).slice(2);
    item.date = new Date().toISOString();
    items.unshift(item);
    save(items);
    return item;
  }

  function remove(id) {
    save(load().filter(function (i) { return i.id !== id; }));
  }

  /* Render a grid of items into a container element.
     opts.limit = max items (0 = all)
     opts.type  = 'all'|'photo'|'video'
     opts.showDelete = bool
     opts.onDelete = fn(id)
     opts.lightbox = bool  */
  function render(container, opts) {
    opts = opts || {};
    var items = load();
    if (opts.type && opts.type !== 'all') {
      items = items.filter(function (i) { return i.type === opts.type; });
    }
    if (opts.limit) items = items.slice(0, opts.limit);

    if (!items.length) {
      container.innerHTML =
        '<div class="col-span-full py-20 text-center text-on-surface-variant/50">' +
        '<span class="material-symbols-outlined text-6xl block mb-4">perm_media</span>' +
        '<p class="font-headline text-xl">No gallery items yet.</p>' +
        '<p class="text-sm mt-2">Add photos &amp; videos via the Admin panel.</p></div>';
      return;
    }

    container.innerHTML = '';
    items.forEach(function (item, idx) {
      var wrap = document.createElement('div');
      wrap.className = 'gallery-card relative rounded-2xl overflow-hidden bg-surface-container group cursor-pointer';
      wrap.setAttribute('data-gtype', item.type);
      // Make first item span 2 cols + 2 rows for masonry feel
      if (idx === 0) wrap.classList.add('col-span-2', 'row-span-2');

      var inner = '';
      if (item.type === 'video') {
        // Support YouTube/Vimeo embeds or direct mp4
        if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
          var vid = item.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/');
          inner = '<iframe src="' + vid + '" class="w-full h-full object-cover border-0" allowfullscreen loading="lazy"></iframe>';
        } else if (item.url.includes('vimeo.com')) {
          var vmatch = item.url.match(/vimeo\.com\/(\d+)/);
          var vurl = vmatch ? 'https://player.vimeo.com/video/' + vmatch[1] : item.url;
          inner = '<iframe src="' + vurl + '" class="w-full h-full border-0" allowfullscreen loading="lazy"></iframe>';
        } else {
          inner = '<video src="' + item.url + '" class="w-full h-full object-cover" controls preload="none"></video>';
        }
        inner += '<div class="absolute top-3 right-3 bg-black/60 rounded-full px-2 py-1 flex items-center gap-1 text-xs text-white pointer-events-none"><span class="material-symbols-outlined text-sm">play_circle</span>Video</div>';
      } else {
        inner = '<img src="' + item.url + '" alt="' + (item.caption || 'Gallery image') + '" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/>';
      }

      // Overlay
      inner += '<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>';
      if (item.caption) {
        inner += '<div class="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"><p class="text-white font-bold text-sm">' + item.caption + '</p></div>';
      }

      if (opts.showDelete) {
        inner += '<button data-del="' + item.id + '" class="absolute top-3 left-3 bg-red-600/80 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20"><span class="material-symbols-outlined text-sm">delete</span></button>';
      }

      wrap.innerHTML = inner;
      wrap.style.aspectRatio = idx === 0 ? '1/1' : '1/1';

      if (opts.showDelete) {
        var delBtn = wrap.querySelector('[data-del]');
        if (delBtn) {
          delBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            remove(item.id);
            if (opts.onDelete) opts.onDelete(item.id);
          });
        }
      }

      container.appendChild(wrap);
    });
  }

  /* Render preview (homepage — replaces placeholder tiles if items exist) */
  function renderPreview() {
    var grid = document.getElementById('gallery-preview-grid');
    if (!grid) return;
    var items = load();
    if (!items.length) return; // keep placeholders
    // Remove placeholders
    grid.querySelectorAll('.gallery-item-ph').forEach(function (el) { el.remove(); });
    render(grid, { limit: 6 });
  }

  // Auto-render preview on page load
  document.addEventListener('DOMContentLoaded', renderPreview);

  return { load: load, save: save, add: add, remove: remove, render: render, renderPreview: renderPreview };
})();
