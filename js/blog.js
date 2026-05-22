/* ============================================================
   NB Nexa — Blog Data Manager
   Reads/writes blog posts to localStorage.
   ============================================================ */

window.NBBlog = (function () {
  var KEY = 'nbnexa-blog-v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }

  function save(posts) {
    try { localStorage.setItem(KEY, JSON.stringify(posts)); } catch (e) {}
  }

  function get(id) {
    return load().find(function (p) { return p.id === id; }) || null;
  }

  function upsert(post) {
    var posts = load();
    var existing = posts.findIndex(function (p) { return p.id === post.id; });
    post.updatedAt = new Date().toISOString();
    if (existing >= 0) { posts[existing] = post; }
    else { post.id = 'post_' + Date.now(); post.createdAt = post.updatedAt; posts.unshift(post); }
    save(posts);
    return post;
  }

  function remove(id) { save(load().filter(function (p) { return p.id !== id; })); }

  return { load: load, save: save, get: get, upsert: upsert, remove: remove };
})();
