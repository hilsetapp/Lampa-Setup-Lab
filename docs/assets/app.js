(() => {
  const catalog = Array.isArray(window.LAMPA_CATALOG) ? window.LAMPA_CATALOG : [];
  const results = document.querySelector('#plugin-results');
  if (!results) return;

  const search = document.querySelector('#plugin-search');
  const platform = document.querySelector('#platform-filter');
  const category = document.querySelector('#category-filter');
  const level = document.querySelector('#level-filter');
  const count = document.querySelector('#result-count');
  const labels = {
    author_reported: 'Заявлено автором',
    url_checked: 'Ссылка проверена',
    loaded_in_lampa: 'Запущено в Lampa',
    device_tested: 'Проверено на устройстве'
  };

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);

  if (category) {
    [...new Set(catalog.map(item => item.category).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'ru'))
      .forEach(value => category.insertAdjacentHTML('beforeend', `<option value="${esc(value)}">${esc(value)}</option>`));
  }

  function card(item) {
    const platforms = (item.platform_labels || []).map(x => `<span class="tag">${esc(x)}</span>`).join('');
    const proof = item.verification || {};
    const checked = proof.checked_at ? `Проверено: ${esc(proof.checked_at)}` : 'Дата независимой проверки не указана';
    return `<article class="card">
      <div class="card-top"><span class="tag">${esc(item.category)}</span><span class="status ${esc(proof.level)}">${esc(labels[proof.level] || 'Статус не указан')}</span></div>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.summary)}</p>
      <div class="card-meta">${platforms}</div>
      <div class="card-note">${esc(proof.note || checked)}</div>
      <div class="card-actions">
        <a class="button" href="${esc(item.plugin_url)}" target="_blank" rel="noopener noreferrer">Открыть ссылку плагина</a>
        <a class="button secondary" href="${esc(item.evidence_url)}" target="_blank" rel="noopener noreferrer">Источник сведений</a>
        <button class="copy-btn" type="button" data-copy="${esc(item.plugin_url)}">Копировать адрес</button>
      </div>
    </article>`;
  }

  function render() {
    const q = (search?.value || '').trim().toLocaleLowerCase('ru');
    const selectedPlatform = platform?.value || '';
    const selectedCategory = category?.value || '';
    const selectedLevel = level?.value || '';
    const filtered = catalog.filter(item => {
      const haystack = [item.name, item.summary, item.details, item.category, ...(item.platform_labels || [])].join(' ').toLocaleLowerCase('ru');
      const matchesQuery = !q || haystack.includes(q);
      const matchesPlatform = !selectedPlatform || (item.platforms || []).includes(selectedPlatform);
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesLevel = !selectedLevel || item.verification?.level === selectedLevel;
      return matchesQuery && matchesPlatform && matchesCategory && matchesLevel;
    });
    results.innerHTML = filtered.length ? filtered.map(card).join('') : '<div class="empty">Ничего не нашлось. Попробуй другой запрос или сними один из фильтров.</div>';
    if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? 'расширение' : 'расширений'}`;
    results.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
        button.textContent = 'Скопировано';
      } catch {
        window.prompt('Скопируй адрес плагина:', value);
      }
      window.setTimeout(() => { button.textContent = 'Копировать адрес'; }, 1800);
    }));
  }

  [search, platform, category, level].filter(Boolean).forEach(el => el.addEventListener('input', render));
  [platform, category, level].filter(Boolean).forEach(el => el.addEventListener('change', render));
  document.querySelectorAll('[data-search]').forEach(link => link.addEventListener('click', () => {
    const term = link.dataset.search || '';
    if (search) { search.value = term; render(); document.querySelector('#catalog')?.scrollIntoView(); }
  }));
  render();
})();
