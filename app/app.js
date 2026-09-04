const STORE = 'mare-demo-v1';

const seed = {
  role: null,
  view: 'home',
  user: { name: 'Marina Alves', school: 'ATHÉNÁ', modality: 'Canoa havaiana' },
  water: [
    { id: 1, place: 'Praia de Iracema', point: 'Ponte dos Ingleses', status: 'propria', source: 'Dado demonstrativo', sampled: '2026-09-02', published: '2026-09-03' },
    { id: 2, place: 'Meireles', point: 'Espigão da Rui Barbosa', status: 'atencao', source: 'Dado demonstrativo', sampled: '2026-09-01', published: '2026-09-03' },
    { id: 3, place: 'Mucuripe', point: 'Proximidades do porto', status: 'sem-dado', source: 'Sem boletim demonstrativo', sampled: '', published: '' }
  ],
  activities: [
    { id: 101, date: '2026-09-01', place: 'Praia de Iracema', modality: 'Canoa havaiana', duration: 70, sea: 'Calmo', safety: 5, trash: true, trashType: 'Plástico', trashAmount: 'Pouco', comment: 'Remada tranquila. Encontrei embalagens perto do espigão.', privacy: 'comunidade', createdBy: 'Marina Alves', moderated: true },
    { id: 102, date: '2026-08-27', place: 'Meireles', modality: 'Stand-up paddle', duration: 55, sea: 'Moderado', safety: 4, trash: false, trashType: '', trashAmount: '', comment: 'Vento aumentando no retorno.', privacy: 'comunidade', createdBy: 'Marina Alves', moderated: true }
  ],
  notices: [
    { id: 1, title: 'Atenção às condições do vento', body: 'Confira a orientação da escola antes de sair para o mar.', date: '2026-09-04', active: true }
  ],
  students: [
    { id: 1, name: 'Marina Alves', school: 'ATHÉNÁ', modality: 'Canoa havaiana', activities: 2 },
    { id: 2, name: 'Pedro Lima', school: 'ATHÉNÁ', modality: 'Caiaque', activities: 5 },
    { id: 3, name: 'Ana Beatriz', school: 'ATHÉNÁ', modality: 'Stand-up paddle', activities: 3 }
  ]
};

const clone = value => JSON.parse(JSON.stringify(value));
let state = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE));
    return saved ? { ...clone(seed), ...saved } : clone(seed);
  } catch {
    return clone(seed);
  }
}

function save() {
  localStorage.setItem(STORE, JSON.stringify(state));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function dateBr(value) {
  if (!value) return 'Não informado';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function statusInfo(status) {
  return {
    propria: { label: 'Própria', css: 'good', detail: 'Classificação demonstrativa favorável' },
    impropria: { label: 'Imprópria', css: 'bad', detail: 'Classificação demonstrativa desfavorável' },
    atencao: { label: 'Atenção', css: 'warn', detail: 'Consulte o boletim e as orientações locais' },
    'sem-dado': { label: 'Sem dado recente', css: 'warn', detail: 'Não há classificação demonstrativa atual' }
  }[status] || { label: 'Sem informação', css: 'warn', detail: '' };
}

const studentNav = [
  ['home', '⌂', 'Início'], ['register', '＋', 'Registrar atividade'], ['history', '◷', 'Minhas experiências'],
  ['explore', '⌖', 'Explorar o litoral'], ['profile', '○', 'Meu perfil']
];
const adminNav = [
  ['dashboard', '⌂', 'Visão geral'], ['records', '≡', 'Registros'], ['water', '≈', 'Balneabilidade'],
  ['notices', '!', 'Avisos'], ['students', '♙', 'Alunos']
];

function render() {
  document.getElementById('app').innerHTML = state.role ? shell() : login();
  bindForms();
}

function login() {
  return `<main class="login">
    <section class="login-card">
      <div class="brand"><img src="assets/icon.svg" alt=""><div><strong>Mar(é)</strong><small>Conexão com o oceano</small></div></div>
      <div class="login-copy">
        <span class="eyebrow">Protótipo funcional · v0.1.0</span>
        <h1>O oceano começa pela forma como nos relacionamos com ele.</h1>
        <p>Consulte informações, registre sua experiência no mar e contribua para a construção de conhecimento coletivo sobre o litoral.</p>
      </div>
      <div class="role-grid">
        <button class="role-card" data-role="student"><span class="role-icon">🌊</span><strong>Entrar como aluno</strong><span>Registrar remadas, observações ambientais e acompanhar sua jornada.</span></button>
        <button class="role-card" data-role="admin"><span class="role-icon">⚓</span><strong>Entrar como administrador</strong><span>Acompanhar registros, avisos, alunos e referências de balneabilidade.</span></button>
      </div>
      <div class="demo-note"><strong>Ambiente de demonstração:</strong> os dados de balneabilidade são fictícios e não servem para decisão real de banho.</div>
    </section>
  </main>`;
}

function shell() {
  const admin = state.role === 'admin';
  const nav = admin ? adminNav : studentNav;
  const valid = nav.some(([id]) => id === state.view);
  if (!valid) state.view = admin ? 'dashboard' : 'home';
  const title = nav.find(([id]) => id === state.view)?.[2] || 'Mar(é)';
  return `<div class="shell">
    <aside class="sidebar" id="sidebar">
      <div class="brand"><img src="assets/icon.svg" alt=""><div><strong>Mar(é)</strong><small>Conexão com o oceano</small></div></div>
      <div class="nav-label">${admin ? 'Gestão da plataforma' : 'Minha jornada'}</div>
      <nav class="nav">${nav.map(([id, icon, label]) => `<button data-view="${id}" class="${state.view === id ? 'active' : ''}"><span class="ico">${icon}</span>${label}</button>`).join('')}</nav>
      <div class="side-user"><div class="avatar">${admin ? 'A' : 'M'}</div><div><strong>${admin ? 'Administrador' : escapeHtml(state.user.name)}</strong><small>${admin ? 'ATHÉNÁ · Piloto' : escapeHtml(state.user.school)}</small></div><button class="logout" data-action="logout" title="Sair">↪</button></div>
    </aside>
    <main class="main">
      <header class="topbar"><button class="mobile-menu" data-action="menu" aria-label="Abrir menu">☰</button><div class="topbar-title"><h2>${title}</h2><small>${admin ? 'Ambiente administrativo' : 'Sua conexão com o oceano'}</small></div><span class="status-online">Protótipo local</span></header>
      <div class="content">${admin ? adminView() : studentView()}</div>
    </main>
  </div>`;
}

function noticeBanner() {
  const item = state.notices.find(n => n.active);
  return item ? `<div class="notice"><span>!</span><div><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.body)}</div></div>` : '';
}

function studentView() {
  return ({ home: studentHome, register: registerView, history: historyView, explore: exploreView, profile: profileView }[state.view] || studentHome)();
}

function studentHome() {
  const totalMinutes = state.activities.reduce((sum, item) => sum + Number(item.duration || 0), 0);
  const places = new Set(state.activities.map(item => item.place)).size;
  const primary = state.water[0];
  const status = statusInfo(primary.status);
  return `${noticeBanner()}
    <div class="hero-row"><div><span class="eyebrow">Olá, ${escapeHtml(state.user.name.split(' ')[0])}</span><h1>Como está o mar hoje?</h1><p>Informação antes da atividade. Observação depois da experiência.</p></div><button class="btn btn-primary" data-view="register">＋ Registrar atividade</button></div>
    <div class="stats">
      <div class="card stat"><div class="stat-icon">≈</div><strong>${state.activities.length}</strong><span>experiências registradas</span><small>Construindo sua memória do mar</small></div>
      <div class="card stat"><div class="stat-icon">◷</div><strong>${Math.round(totalMinutes / 60)} h</strong><span>de atividades</span><small>${totalMinutes} minutos vividos</small></div>
      <div class="card stat"><div class="stat-icon">⌖</div><strong>${places}</strong><span>localidades visitadas</span><small>Conhecimento do litoral</small></div>
    </div>
    <div class="grid-main">
      <section class="card water-card"><div class="water-top"><span class="eyebrow" style="color:#bfeef2">Referência de balneabilidade</span><span class="pill ${status.css}">${status.label}</span></div><h2>${escapeHtml(primary.place)}</h2><p>${escapeHtml(primary.point)} · ${status.detail}</p><div class="water-meta"><span>Fonte: ${escapeHtml(primary.source)}</span><span>Coleta: ${dateBr(primary.sampled)}</span><span>Publicação: ${dateBr(primary.published)}</span></div></section>
      <div class="aside-stack">
        <section class="card cta"><span class="role-icon">🛶</span><h3>Voltou do mar?</h3><p>Conte como foi sua atividade e se encontrou algum resíduo durante o percurso.</p><button class="btn btn-primary" data-view="register">Registrar agora</button></section>
        <section class="card info-card"><span class="eyebrow">Conhecimento coletivo</span><h3 style="margin-top:10px">${state.activities.filter(a => a.trash).length} relato(s) com lixo</h3><p>Relatos comunitários ajudam a observar o território, mas não alteram a classificação oficial da praia.</p></section>
      </div>
    </div>
    <section class="card compare"><div><span class="pill good">Dado oficial</span><h3>Balneabilidade</h3><p>Deve apresentar fonte, ponto monitorado, data de coleta e publicação.</p></div><div><span class="pill warn">Observação comunitária</span><h3>Percepção no mar</h3><p>Relatos de lixo, odor, aparência da água, vento e segurança percebida.</p></div></section>
    <div class="section-head"><div><h2>Experiências recentes</h2><p>Seus últimos registros</p></div><button class="link-btn" data-view="history">Ver histórico</button></div>
    ${activityList(state.activities.slice().reverse().slice(0, 3))}`;
}

function registerView() {
  const today = new Date().toISOString().slice(0, 10);
  return `<div class="hero-row"><div><span class="eyebrow">Diário do oceano</span><h1>Registrar atividade</h1><p>Leva menos de dois minutos e ajuda a compreender o litoral.</p></div></div>
    <div class="page-grid">
      <form id="activity-form" class="card form-card">
        <div class="form-grid">
          <div class="field"><label for="date">Data</label><input id="date" name="date" type="date" value="${today}" required></div>
          <div class="field"><label for="place">Localidade</label><select id="place" name="place" required>${state.water.map(item => `<option>${escapeHtml(item.place)}</option>`).join('')}</select></div>
          <div class="field"><label for="modality">Modalidade</label><select id="modality" name="modality"><option>Canoa havaiana</option><option>Stand-up paddle</option><option>Caiaque</option><option>Natação</option><option>Vela</option><option>Outra</option></select></div>
          <div class="field"><label for="duration">Duração em minutos</label><input id="duration" name="duration" type="number" min="1" max="720" value="60" required></div>
          <div class="field"><label for="sea">Como estava o mar?</label><select id="sea" name="sea"><option>Calmo</option><option>Moderado</option><option>Agitado</option><option>Muito agitado</option></select></div>
          <div class="field"><label for="safety">Segurança percebida</label><select id="safety" name="safety"><option value="5">5 — Muito seguro</option><option value="4">4 — Seguro</option><option value="3">3 — Regular</option><option value="2">2 — Inseguro</option><option value="1">1 — Muito inseguro</option></select></div>
          <div class="field full"><label>Encontrou lixo?</label><div class="check-row"><label class="check"><input type="radio" name="trash" value="yes"> Sim</label><label class="check"><input type="radio" name="trash" value="no" checked> Não</label></div></div>
          <div id="trash-fields" class="field full hidden"><div class="form-grid"><div class="field"><label for="trashType">Tipo principal</label><select id="trashType" name="trashType"><option>Plástico</option><option>Vidro</option><option>Metal</option><option>Material de pesca</option><option>Orgânico</option><option>Outro</option></select></div><div class="field"><label for="trashAmount">Quantidade aproximada</label><select id="trashAmount" name="trashAmount"><option>Pouco</option><option>Moderado</option><option>Muito</option></select></div></div></div>
          <div class="field full"><label for="comment">Conte como foi</label><textarea id="comment" name="comment" maxlength="600" placeholder="Condições, aprendizados, ocorrências e outras observações..."></textarea></div>
          <div class="field full"><label for="privacy">Compartilhamento</label><select id="privacy" name="privacy"><option value="comunidade">Compartilhar observação com a comunidade</option><option value="escola">Compartilhar apenas com a escola</option><option value="privado">Manter no meu histórico privado</option></select></div>
        </div>
        <div class="form-actions"><button type="button" class="btn btn-secondary" data-view="home">Cancelar</button><button class="btn btn-primary" type="submit">Salvar experiência</button></div>
      </form>
      <aside class="card guide"><span class="eyebrow">Boas práticas</span><h3>Seu relato importa</h3><ul><li>Registre apenas o que percebeu diretamente.</li><li>Evite identificar terceiros nos comentários.</li><li>Uma observação não substitui um boletim oficial.</li><li>Em emergência, acione os canais públicos adequados.</li></ul></aside>
    </div>`;
}

function activityList(items, admin = false) {
  if (!items.length) return '<div class="card empty">Nenhuma experiência registrada.</div>';
  return `<div class="list">${items.map(item => `<article class="list-item"><div class="list-icon">${item.trash ? '♻' : '≈'}</div><div><strong>${escapeHtml(item.modality)} · ${escapeHtml(item.place)}</strong><small>${dateBr(item.date)} · ${item.duration} min · Mar ${escapeHtml(item.sea)}${admin ? ` · ${escapeHtml(item.createdBy)}` : ''}</small></div><div class="right">${item.trash ? `<span class="pill warn">Lixo: ${escapeHtml(item.trashType)}</span>` : '<span class="pill good">Sem lixo relatado</span>'}</div></article>`).join('')}</div>`;
}

function historyView() {
  return `<div class="hero-row"><div><span class="eyebrow">Memória do mar</span><h1>Minhas experiências</h1><p>Acompanhe sua relação com diferentes pontos do litoral.</p></div><button class="btn btn-primary" data-view="register">＋ Novo registro</button></div>${activityList(state.activities.slice().reverse())}`;
}

function exploreView() {
  return `<div class="hero-row"><div><span class="eyebrow">Mapa inicial</span><h1>Explorar o litoral</h1><p>Referências demonstrativas e observações feitas pela comunidade.</p></div></div><div class="notice"><span>i</span><div><strong>Dados fictícios:</strong> esta tela valida a experiência do produto e ainda não consulta uma fonte oficial.</div></div><div class="location-grid">${state.water.map(item => { const s = statusInfo(item.status); const reports = state.activities.filter(a => a.place === item.place).length; return `<section class="card location"><span class="pill ${s.css}">${s.label}</span><h3>${escapeHtml(item.place)}</h3><p>${escapeHtml(item.point)}</p><p><strong>${reports}</strong> observação(ões) comunitária(s)</p><button class="btn btn-secondary" data-place="${escapeHtml(item.place)}">Registrar neste local</button></section>`; }).join('')}</div>`;
}

function profileView() {
  return `<div class="hero-row"><div><span class="eyebrow">Identidade oceânica</span><h1>Meu perfil</h1><p>Informações utilizadas na experiência piloto.</p></div></div><form id="profile-form" class="card form-card" style="max-width:760px"><div class="form-grid"><div class="field full"><label>Nome</label><input name="name" value="${escapeHtml(state.user.name)}" required></div><div class="field"><label>Escola</label><input name="school" value="${escapeHtml(state.user.school)}" required></div><div class="field"><label>Modalidade principal</label><input name="modality" value="${escapeHtml(state.user.modality)}"></div></div><div class="form-actions"><button class="btn btn-primary">Salvar perfil</button></div></form>`;
}

function adminView() {
  return ({ dashboard: adminDashboard, records: recordsView, water: waterView, notices: noticesView, students: studentsView }[state.view] || adminDashboard)();
}

function adminDashboard() {
  const trash = state.activities.filter(item => item.trash).length;
  const shared = state.activities.filter(item => item.privacy !== 'privado').length;
  return `<div class="hero-row"><div><span class="eyebrow">Laboratório vivo · ATHÉNÁ</span><h1>Visão geral</h1><p>Acompanhe a adesão ao piloto e as observações produzidas.</p></div></div>
    <div class="stats"><div class="card stat"><div class="stat-icon">♙</div><strong>${state.students.length}</strong><span>alunos no piloto</span><small>Base demonstrativa</small></div><div class="card stat"><div class="stat-icon">≈</div><strong>${state.activities.length}</strong><span>atividades registradas</span><small>${shared} compartilhadas</small></div><div class="card stat"><div class="stat-icon">♻</div><strong>${trash}</strong><span>relatos com resíduos</span><small>Para acompanhamento</small></div></div>
    <div class="admin-layout"><section><div class="section-head"><div><h2>Registros recentes</h2><p>Atividades enviadas pelos alunos</p></div><button class="link-btn" data-view="records">Ver todos</button></div>${activityList(state.activities.slice().reverse().slice(0,5), true)}</section><aside class="card guide"><span class="eyebrow">Adesão demonstrativa</span><h3>Registros por aluno</h3>${state.students.map(s => `<p style="margin:14px 0 6px"><strong>${escapeHtml(s.name)}</strong> · ${s.activities}</p><div class="progress"><i style="width:${Math.min(s.activities * 16, 100)}%"></i></div>`).join('')}</aside></div>`;
}

function recordsView() {
  return `<div class="hero-row"><div><span class="eyebrow">Produção participativa</span><h1>Registros</h1><p>Observações da comunidade separadas dos dados oficiais.</p></div></div><section class="card admin-table"><table><thead><tr><th>Aluno</th><th>Data</th><th>Local</th><th>Atividade</th><th>Lixo</th><th>Visibilidade</th><th>Moderação</th></tr></thead><tbody>${state.activities.slice().reverse().map(item => `<tr><td>${escapeHtml(item.createdBy)}</td><td>${dateBr(item.date)}</td><td>${escapeHtml(item.place)}</td><td>${escapeHtml(item.modality)}</td><td>${item.trash ? escapeHtml(item.trashType) : 'Não'}</td><td>${escapeHtml(item.privacy)}</td><td><button class="btn btn-secondary" data-moderate="${item.id}">${item.moderated ? 'Aprovado' : 'Revisar'}</button></td></tr>`).join('')}</tbody></table></section>`;
}

function waterView() {
  return `<div class="hero-row"><div><span class="eyebrow">Referência oficial</span><h1>Balneabilidade</h1><p>Cadastro demonstrativo; integração oficial ainda não implementada.</p></div></div><div class="notice"><span>!</span><div><strong>Regra de confiança:</strong> relatos de alunos nunca alteram automaticamente a classificação oficial.</div></div><section class="card admin-table"><table><thead><tr><th>Localidade</th><th>Ponto</th><th>Status</th><th>Fonte</th><th>Coleta</th><th>Ação</th></tr></thead><tbody>${state.water.map(item => { const s = statusInfo(item.status); return `<tr><td><strong>${escapeHtml(item.place)}</strong></td><td>${escapeHtml(item.point)}</td><td><span class="pill ${s.css}">${s.label}</span></td><td>${escapeHtml(item.source)}</td><td>${dateBr(item.sampled)}</td><td><button class="btn btn-secondary" data-edit-water="${item.id}">Atualizar</button></td></tr>`; }).join('')}</tbody></table></section>`;
}

function noticesView() {
  return `<div class="hero-row"><div><span class="eyebrow">Comunicação da escola</span><h1>Avisos</h1><p>Publique orientações para os participantes do piloto.</p></div></div><div class="page-grid"><form id="notice-form" class="card form-card"><div class="field"><label>Título</label><input name="title" required maxlength="80"></div><div class="field" style="margin-top:15px"><label>Mensagem</label><textarea name="body" required maxlength="300"></textarea></div><div class="form-actions"><button class="btn btn-primary">Publicar aviso</button></div></form><div>${state.notices.slice().reverse().map(item => `<article class="card info-card" style="margin-bottom:12px"><span class="pill ${item.active ? 'good' : 'warn'}">${item.active ? 'Ativo' : 'Arquivado'}</span><h3 style="margin-top:14px">${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p><button class="link-btn" data-toggle-notice="${item.id}">${item.active ? 'Arquivar' : 'Ativar'}</button></article>`).join('')}</div></div>`;
}

function studentsView() {
  return `<div class="hero-row"><div><span class="eyebrow">Comunidade piloto</span><h1>Alunos</h1><p>Participantes vinculados à ATHÉNÁ.</p></div></div><section class="card admin-table"><table><thead><tr><th>Nome</th><th>Escola</th><th>Modalidade</th><th>Atividades</th></tr></thead><tbody>${state.students.map(item => `<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.school)}</td><td>${escapeHtml(item.modality)}</td><td>${item.activities}</td></tr>`).join('')}</tbody></table></section>`;
}

function bindForms() {
  const activityForm = document.getElementById('activity-form');
  if (activityForm) activityForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(activityForm));
    const foundTrash = data.trash === 'yes';
    state.activities.push({ id: Date.now(), date: data.date, place: data.place, modality: data.modality, duration: Number(data.duration), sea: data.sea, safety: Number(data.safety), trash: foundTrash, trashType: foundTrash ? data.trashType : '', trashAmount: foundTrash ? data.trashAmount : '', comment: data.comment.trim(), privacy: data.privacy, createdBy: state.user.name, moderated: false });
    const student = state.students.find(item => item.name === state.user.name);
    if (student) student.activities += 1;
    state.view = 'history'; save(); render(); toast('Experiência salva com sucesso.');
  });

  const profileForm = document.getElementById('profile-form');
  if (profileForm) profileForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(profileForm));
    state.user = { name: data.name.trim(), school: data.school.trim(), modality: data.modality.trim() };
    save(); render(); toast('Perfil atualizado.');
  });

  const noticeForm = document.getElementById('notice-form');
  if (noticeForm) noticeForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(noticeForm));
    state.notices.push({ id: Date.now(), title: data.title.trim(), body: data.body.trim(), date: new Date().toISOString().slice(0,10), active: true });
    save(); render(); toast('Aviso publicado.');
  });

  document.querySelectorAll('input[name="trash"]').forEach(input => input.addEventListener('change', () => {
    document.getElementById('trash-fields')?.classList.toggle('hidden', input.value !== 'yes' || !input.checked);
  }));
}

document.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.dataset.role) { state.role = target.dataset.role === 'admin' ? 'admin' : 'student'; state.view = state.role === 'admin' ? 'dashboard' : 'home'; save(); render(); return; }
  if (target.dataset.view) { state.view = target.dataset.view; save(); render(); document.getElementById('sidebar')?.classList.remove('open'); return; }
  if (target.dataset.action === 'logout') { state.role = null; state.view = 'home'; save(); render(); return; }
  if (target.dataset.action === 'menu') { document.getElementById('sidebar')?.classList.toggle('open'); return; }
  if (target.dataset.place) { state.view = 'register'; save(); render(); const select = document.getElementById('place'); if (select) select.value = target.dataset.place; return; }
  if (target.dataset.moderate) { const item = state.activities.find(a => a.id === Number(target.dataset.moderate)); if (item) item.moderated = !item.moderated; save(); render(); toast('Situação de moderação atualizada.'); return; }
  if (target.dataset.toggleNotice) { const item = state.notices.find(n => n.id === Number(target.dataset.toggleNotice)); if (item) item.active = !item.active; save(); render(); toast('Aviso atualizado.'); return; }
  if (target.dataset.editWater) {
    const item = state.water.find(w => w.id === Number(target.dataset.editWater));
    if (!item) return;
    const next = prompt('Novo status: propria, atencao, impropria ou sem-dado', item.status);
    if (['propria','atencao','impropria','sem-dado'].includes(next)) { item.status = next; item.published = new Date().toISOString().slice(0,10); save(); render(); toast('Referência demonstrativa atualizada.'); }
  }
});

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}

render();
