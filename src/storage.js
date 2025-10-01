import { uid } from './utils.js'

const KEYS = {
  users: 'momaHR_users',
  companies: 'momaHR_companies',
  tasks: 'momaHR_tasks',
  agents: 'momaHR_agents',
  session: 'momaHR_session',
  legacyCompany: 'momaHR_company',
  filters: 'momaHR_filters',
  view: 'momaHR_view'
}

export function ensureSeedAndMigrate() {
  // Users
  let users = JSON.parse(localStorage.getItem(KEYS.users) || 'null') || []
  let changed = false
  if (users.length === 0) {
    users = [
      { id: 'admin1', email: 'admin@demo.com', password: '123456', role: 'Admin', name: 'MoMa Administrator' },
      { id: 'u1', email: 'empresa@demo.com', password: '123456', role: 'Empresa', name: 'Demo Company Admin', companyId: 'c1' },
      { id: 'u2', email: 'usuario@demo.com', password: '123456', role: 'Usuario', name: 'Demo Consulta', companyId: 'c1' },
    ]
    changed = true
  } else if (!users.some(u => u.role === 'Admin')) {
    users = [{ id: 'admin1', email: 'admin@demo.com', password: '123456', role: 'Admin', name: 'MoMa Administrator' }, ...users]
    changed = true
  }
  if (changed) localStorage.setItem(KEYS.users, JSON.stringify(users))

  // Agents
  let agents = JSON.parse(localStorage.getItem(KEYS.agents) || 'null')
  if (!agents) {
    agents = [
      { id: 'a1', name: 'Ana Pérez' },
      { id: 'a2', name: 'Carlos Núñez' },
      { id: 'a3', name: 'Sofía Ríos' },
    ]
    localStorage.setItem(KEYS.agents, JSON.stringify(agents))
  }

  // Companies
  let companies = JSON.parse(localStorage.getItem(KEYS.companies) || 'null')
  const legacy = JSON.parse(localStorage.getItem(KEYS.legacyCompany) || 'null')
  if (!companies) {
    if (legacy) {
      companies = [{ ...legacy, id: legacy.id || 'c1' }]
    } else {
      const now = new Date().toISOString()
      companies = [{
        id: 'c1',
        name: 'MoMa Technologies S.A.',
        rut: '76.123.456-7',
        industry: 'Tecnología',
        address: 'Av. Innovación 123, Santiago, CL',
        phone: '+56 2 1234 5678',
        website: 'https://moma.example',
        createdAt: now, updatedAt: now
      }]
    }
    localStorage.setItem(KEYS.companies, JSON.stringify(companies))
    if (legacy) localStorage.removeItem(KEYS.legacyCompany)
  }

  // Tasks
  let tasks = JSON.parse(localStorage.getItem(KEYS.tasks) || 'null')
  if (!tasks) {
    const today = new Date()
    const addDays = d => new Date(today.getTime() + d*86400000).toISOString()
    tasks = [
      { id: uid(), companyId: 'c1', title: 'Publicar oferta: Desarrollador Full Stack', description: 'Crear la requisición, publicar en portales y LinkedIn.', priority: 'Alta', status: 'Nueva', dueDate: addDays(3), createdAt: today.toISOString(), createdBy: 'u1', assignedTo: null, comments: [] },
      { id: uid(), companyId: 'c1', title: 'Actualizar políticas de home office', description: 'Revisión legal y comunicación interna.', priority: 'Media', status: 'En Progreso', dueDate: addDays(10), createdAt: today.toISOString(), createdBy: 'u1', assignedTo: 'a2', comments: [] },
      { id: uid(), companyId: 'c1', title: 'Onboarding de 3 QA Analysts', description: 'Coordinación de inducción y accesos.', priority: 'Alta', status: 'Completada', dueDate: addDays(-2), createdAt: today.toISOString(), createdBy: 'u1', assignedTo: 'a1', comments: [] },
    ]
    localStorage.setItem(KEYS.tasks, JSON.stringify(tasks))
  } else {
    let fixed = false
    const companies = JSON.parse(localStorage.getItem(KEYS.companies) || '[]')
    const defaultCompanyId = companies[0]?.id || 'c1'
    tasks.forEach(t => {
      if (!t.companyId) { t.companyId = defaultCompanyId; fixed = true }
      if (!('assignedTo' in t)) { t.assignedTo = null; fixed = true }
      if (!('comments' in t)) { t.comments = []; fixed = true }
    })
    if (fixed) localStorage.setItem(KEYS.tasks, JSON.stringify(tasks))
  }

  if (!localStorage.getItem(KEYS.filters)) localStorage.setItem(KEYS.filters, JSON.stringify({}))
  if (!localStorage.getItem(KEYS.view)) localStorage.setItem(KEYS.view, JSON.stringify({admin: 'kanban', empresa: 'tabla'}))
}

export const Storage = {
  KEYS,
  loadUsers: () => JSON.parse(localStorage.getItem(KEYS.users) || '[]'),
  loadCompanies: () => JSON.parse(localStorage.getItem(KEYS.companies) || '[]'),
  saveCompanies: (x) => localStorage.setItem(KEYS.companies, JSON.stringify(x)),
  loadAgents: () => JSON.parse(localStorage.getItem(KEYS.agents) || '[]'),
  saveAgents: (x) => localStorage.setItem(KEYS.agents, JSON.stringify(x)),
  loadTasks: () => JSON.parse(localStorage.getItem(KEYS.tasks) || '[]'),
  saveTasks: (x) => localStorage.setItem(KEYS.tasks, JSON.stringify(x)),
  loadSession: () => JSON.parse(localStorage.getItem(KEYS.session) || 'null'),
  saveSession: (s) => localStorage.setItem(KEYS.session, JSON.stringify(s)),
  clearSession: () => localStorage.removeItem(KEYS.session),
  resetDemo: () => { Object.values(KEYS).forEach(k => localStorage.removeItem(k)); ensureSeedAndMigrate() },
  loadFilters: () => JSON.parse(localStorage.getItem(KEYS.filters) || '{}'),
  saveFilters: (f) => localStorage.setItem(KEYS.filters, JSON.stringify(f)),
  loadView: () => JSON.parse(localStorage.getItem(KEYS.view) || '{}'),
  saveView: (v) => localStorage.setItem(KEYS.view, JSON.stringify(v)),
}
