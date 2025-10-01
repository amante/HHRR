import React, { useEffect, useMemo, useState } from 'react'
import { ensureSeedAndMigrate, Storage } from './storage.js'
import { STATUS, PRIORITY, uid, fmtDate, isOverdue, todayISO, downloadCSV } from './utils.js'

function Navbar({ user, onLogout }) {
  return (
    <div className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-black text-white flex items-center justify-center font-bold">M</div>
          <div className="text-xl font-semibold">MoMa HR</div>
          <span className="ml-3 text-xs px-2 py-1 rounded-full bg-gray-100 border">v1.4</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:inline text-gray-500">Sesión:</span>
          <span className="font-medium">{user?.email}</span>
          <span className="px-2 py-0.5 rounded-full text-xs border bg-gray-50">{user?.role}</span>
          <button onClick={onLogout} className="ml-2 px-3 py-1.5 rounded-xl border hover:bg-gray-50">Cerrar sesión</button>
        </div>
      </div>
    </div>
  )
}

function Card({ title, right, children }) {
  return (
    <div className="border rounded-3xl bg-white">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-2xl border bg-white">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  )
}
function Badge({ tone='gray', children }) {
  const toneMap = {
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    violet: 'bg-violet-100 text-violet-800 border-violet-200',
  }
  return <span className={'inline-flex items-center px-2 py-1 text-xs rounded-full border ' + toneMap[tone]}>{children}</span>
}

function Login({ onLogin, defaultRole='Empresa' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(defaultRole)
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const users = Storage.loadUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) { setError('Credenciales inválidas'); return }
    if (found.role !== role) { setError('El usuario no tiene el perfil ' + role); return }
    const session = { userId: found.id, email: found.email, role: found.role, name: found.name, companyId: found.companyId || null }
    Storage.saveSession(session); onLogin(session)
  }
  const fillDemo = (r) => {
    setRole(r)
    if (r === 'Empresa') { setEmail('empresa@demo.com'); setPassword('123456') }
    else if (r === 'Usuario') { setEmail('usuario@demo.com'); setPassword('123456') }
    else { setEmail('admin@demo.com'); setPassword('123456') }
  }
  const doReset = () => { Storage.resetDemo(); setEmail(''); setPassword(''); setError('') }

  return (
    <div className="min-h-[80vh] grid place-items-center px-4">
      <div className="w-full max-w-md border rounded-3xl bg-white p-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center font-bold">M</div>
          <h1 className="mt-3 text-2xl font-semibold">MoMa HR</h1>
          <p className="text-gray-500">Acceso al sistema</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Perfil</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {['Empresa','Usuario','Admin'].map(k => (
                <button key={k} type="button" onClick={() => setRole(k)} className={'px-3 py-2 rounded-xl border ' + (role===k ? 'bg-gray-900 text-white' : 'bg-gray-50 hover:bg-white')}>
                  <span className="mr-2">{k==='Empresa'?'🏢':k==='Usuario'?'👤':'🛡️'}</span>{k}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input className="mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="nombre@empresa.com" required />
          </div>
          <div>
            <label className="text-sm text-gray-600">Contraseña</label>
            <input className="mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="•••••••" required />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" className="w-full py-2 rounded-xl bg-black text-white hover:opacity-90">Ingresar</button>
          <div className="text-center text-sm text-gray-500">
            <span>¿Probar rápido?</span>
            <div className="mt-2 flex gap-2 justify-center flex-wrap">
              <button type="button" onClick={() => fillDemo('Empresa')} className="px-2 py-1 rounded-lg border">Empresa demo</button>
              <button type="button" onClick={() => fillDemo('Usuario')} className="px-2 py-1 rounded-lg border">Usuario demo</button>
              <button type="button" onClick={() => fillDemo('Admin')}   className="px-2 py-1 rounded-lg border">Admin demo</button>
            </div>
            <div className="mt-4">
              <button type="button" onClick={doReset} className="text-xs underline">Restablecer demo</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function CompanyInfo({ canEdit, company }) {
  const [companies, setCompanies] = useState(Storage.loadCompanies())
  const [editing, setEditing] = useState(false)
  const current = companies.find(c => c.id === company?.id) || companies[0]
  const [form, setForm] = useState(current || {})
  useEffect(() => setForm(current || {}), [current?.id])

  const onSave = () => {
    if (!canEdit) return
    const next = companies.map(c => c.id === current.id ? ({ ...current, ...form, updatedAt: new Date().toISOString() }) : c)
    setCompanies(next); Storage.saveCompanies(next); setEditing(false)
  }

  return (
    <Card title="Información de la empresa" right={canEdit ? (!editing ? <button onClick={()=>setEditing(true)} className="px-3 py-1.5 rounded-xl border">Editar</button> :
      <div className="flex items-center gap-2">
        <button onClick={onSave} className="px-3 py-1.5 rounded-xl bg-black text-white">Guardar</button>
        <button onClick={()=>setEditing(false)} className="px-3 py-1.5 rounded-xl border">Cancelar</button>
      </div>) : <span className="text-xs text-gray-500">Solo lectura</span>}>
      <div className="grid sm:grid-cols-2 gap-4">
        {[['name','Nombre'],['rut','RUT / ID'],['industry','Industria'],['address','Dirección'],['phone','Teléfono'],['website','Sitio web']].map(([k,label]) => (
          <div key={k}>
            <div className="text-xs text-gray-500">{label}</div>
            {editing
              ? <input className="mt-1 w-full px-3 py-2 rounded-xl border" value={form?.[k] || ''} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
              : <div className="mt-1 font-medium">{current?.[k] || <span className="text-gray-400">—</span>}</div>}
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-400">
        <span>Creada: {current?.createdAt ? fmtDate(current.createdAt) : '—'}</span>
        <span className="ml-3">Actualizada: {current?.updatedAt ? fmtDate(current.updatedAt) : '—'}</span>
      </div>
    </Card>
  )
}

function TaskComposer({ onAdd, companyId }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Media')
  const [dueDate, setDueDate] = useState(todayISO())

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ id: uid(), companyId, title: title.trim(), description: description.trim(), priority, status: 'Nueva', dueDate: new Date(dueDate).toISOString(), createdAt: new Date().toISOString(), createdBy: 'u1', assignedTo: null, comments: [] })
    setTitle(''); setDescription(''); setPriority('Media')
  }

  return (
    <form onSubmit={submit} className="mb-4 grid sm:grid-cols-5 gap-2">
      <input className="px-3 py-2 rounded-xl border sm:col-span-1" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" required />
      <input className="px-3 py-2 rounded-xl border sm:col-span-2" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Descripción" />
      <select value={priority} onChange={e=>setPriority(e.target.value)} className="px-3 py-2 rounded-xl border">{PRIORITY.map(p => <option key={p} value={p}>{p}</option>)}</select>
      <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="px-3 py-2 rounded-xl border" />
      <div className="sm:col-span-5"><button type="submit" className="mt-1 px-3 py-2 rounded-xl bg-black text-white">Agregar tarea</button></div>
    </form>
  )
}

function TaskDetail({ open, onClose, task, onUpdate }) {
  const agents = Storage.loadAgents()
  const [comment, setComment] = useState('')
  const [link, setLink] = useState('')

  if (!open) return null
  const saveAssign = (assignedTo) => onUpdate({ ...task, assignedTo })
  const addComment = () => {
    if (!comment.trim() && !link.trim()) return
    const c = { id: uid(), author: 'Admin', text: comment.trim(), timestamp: new Date().toISOString(), attachments: link ? [{ label: link, url: link }] : [] }
    onUpdate({ ...task, comments: [c, ...(task.comments || [])] })
    setComment(''); setLink('')
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center z-40">
      <div className="bg-white w-full sm:w-[720px] max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Detalle de tarea</h3>
          <button onClick={onClose} className="px-2 py-1 rounded-lg border">Cerrar</button>
        </div>
        <div className="p-5 overflow-auto space-y-4">
          <div className="text-xl font-semibold">{task.title}</div>
          <div className="text-gray-600">{task.description || '—'}</div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge tone={task.priority==='Alta'?'red':task.priority==='Media'?'amber':'gray'}>{task.priority}</Badge>
            <Badge tone={task.status==='Completada'?'green':task.status==='En Progreso'?'blue':'gray'}>{task.status}</Badge>
            <Badge tone={isOverdue(task.dueDate) && task.status!=='Completada' ? 'red' : 'gray'}>Vence: {fmtDate(task.dueDate)}</Badge>
          </div>
          <div className="border rounded-2xl p-4">
            <div className="text-sm text-gray-500 mb-1">Asignar a agente</div>
            <select className="px-3 py-2 rounded-xl border" value={task.assignedTo || ''} onChange={e=>saveAssign(e.target.value || null)}>
              <option value="">Sin asignar</option>
              {Storage.loadAgents().map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="border rounded-2xl p-4">
            <div className="font-medium mb-2">Comentarios</div>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input className="flex-1 px-3 py-2 rounded-xl border" placeholder="Escribe un comentario..." value={comment} onChange={e=>setComment(e.target.value)} />
                <input className="flex-1 px-3 py-2 rounded-xl border" placeholder="Adjuntar por URL (opcional)" value={link} onChange={e=>setLink(e.target.value)} />
                <button onClick={addComment} className="px-3 py-2 rounded-xl bg-black text-white">Añadir</button>
              </div>
              {(task.comments || []).length ? (
                <ul className="divide-y">
                  {task.comments.map(c => (
                    <li key={c.id} className="py-2">
                      <div className="text-sm"><span className="font-medium">{c.author}</span> · <span className="text-gray-500">{fmtDate(c.timestamp)}</span></div>
                      <div className="text-sm">{c.text}</div>
                      {c.attachments?.length ? (
                        <div className="text-xs mt-1">
                          Adjuntos: {c.attachments.map((a, i) => <a key={i} className="underline text-blue-600 mr-2" href={a.url} target="_blank" rel="noreferrer">{a.label}</a>)}
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : <div className="text-sm text-gray-500">Sin comentarios.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AgentsManager() {
  const [agents, setAgents] = useState(Storage.loadAgents())
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  useEffect(() => setAgents(Storage.loadAgents()), [])

  const existsName = (n, exceptId=null) => agents.some(a => a.name.trim().toLowerCase() === n.trim().toLowerCase() && a.id !== exceptId)

  const add = () => {
    const n = name.trim()
    if (!n) return
    if (existsName(n)) { alert('Ya existe un agente con ese nombre'); return }
    const next = [...agents, { id: uid(), name: n }]
    setAgents(next); Storage.saveAgents(next); setName('')
  }
  const saveEdit = (id) => {
    const n = editName.trim()
    if (!n) { setEditingId(null); return }
    if (existsName(n, id)) { alert('Ya existe un agente con ese nombre'); return }
    const next = agents.map(a => a.id === id ? { ...a, name: n } : a)
    setAgents(next); Storage.saveAgents(next); setEditingId(null); setEditName('')
  }
  const remove = (id) => {
    const tasks = Storage.loadTasks()
    const affected = tasks.filter(t => t.assignedTo === id).length
    let reassignTo = ''
    if (affected > 0) {
      const names = agents.filter(a => a.id !== id).map(a => a.name).join(', ')
      const msg = `Este agente tiene ${affected} tareas asignadas. Escribe el NOMBRE exacto de otro agente para reasignar, o deja vacío para dejar sin asignación.\nAgentes disponibles: ${names}`
      reassignTo = prompt(msg) || ''
    }
    let targetId = null
    if (reassignTo.trim()) {
      const found = agents.find(a => a.name.trim().toLowerCase() === reassignTo.trim().toLowerCase())
      if (!found) { alert('No se encontró ese agente. Se dejarán sin asignación.'); }
      else targetId = found.id
    }
    const nextAgents = agents.filter(a => a.id !== id)
    Storage.saveAgents(nextAgents)
    setAgents(nextAgents)
    if (affected > 0) {
      const nextTasks = tasks.map(t => t.assignedTo === id ? ({ ...t, assignedTo: targetId }) : t)
      Storage.saveTasks(nextTasks)
      alert(`Listo. ${affected} tareas fueron ${targetId ? 'reasignadas' : 'dejadas sin asignación'}.`)
    }
  }

  return (
    <Card title="Agentes internos (CRUD)"
      right={
        <div className="flex gap-2">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre del agente" className="px-3 py-2 rounded-xl border" />
          <button onClick={add} className="px-3 py-2 rounded-xl bg-black text-white">Añadir</button>
        </div>
      }>
      <div className="space-y-2">
        {agents.map(a => (
          <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-xl border">
            {editingId === a.id ? (
              <div className="flex-1 mr-2">
                <input className="w-full px-3 py-2 rounded-xl border" value={editName} onChange={e=>setEditName(e.target.value)}
                  onKeyDown={e=>{
                    if (e.key==='Enter') saveEdit(a.id)
                    if (e.key==='Escape') { setEditingId(null); setEditName('') }
                  }} />
              </div>
            ) : (
              <div className="font-medium">{a.name}</div>
            )}
            <div className="flex items-center gap-2">
              {editingId === a.id
                ? <button onClick={()=>saveEdit(a.id)} className="px-3 py-1.5 rounded-xl border">Guardar</button>
                : <button onClick={()=>{setEditingId(a.id); setEditName(a.name)}} className="px-3 py-1.5 rounded-xl border">Editar</button>}
              <button onClick={()=>remove(a.id)} className="px-3 py-1.5 rounded-xl border">Eliminar</button>
            </div>
          </div>
        ))}
        {agents.length === 0 && <div className="text-sm text-gray-500">No hay agentes registrados.</div>}
      </div>
    </Card>
  )
}

/* ---------- KANBAN BOARD ---------- */
function KanbanBoard({ canEdit, companyId=null, forAdmin=false }) {
  const [tasks, setTasks] = useState(Storage.loadTasks())
  const companies = Storage.loadCompanies()
  const agents = Storage.loadAgents()

  // filters persistence (reuse admin/company keys)
  const key = (forAdmin ? 'admin' : (companyId || 'company'))
  const persisted = Storage.loadFilters()[key] || {}
  const [search, setSearch] = useState(persisted.search || '')
  const [priorityFilter, setPriorityFilter] = useState(persisted.priority || 'Todas')
  const [companyFilter, setCompanyFilter] = useState(persisted.company || 'Todas')
  const [fromCreated, setFromCreated] = useState(persisted.fromCreated || '')
  const [toCreated, setToCreated] = useState(persisted.toCreated || '')
  const [fromDue, setFromDue] = useState(persisted.fromDue || '')
  const [toDue, setToDue] = useState(persisted.toDue || '')
  const [onlyOverdue, setOnlyOverdue] = useState(!!persisted.onlyOverdue)

  useEffect(()=>{ setTasks(Storage.loadTasks()) }, [])

  useEffect(() => {
    const all = Storage.loadFilters()
    all[key] = { ...(all[key]||{}), search, priority: priorityFilter, company: companyFilter, fromCreated, toCreated, fromDue, toDue, onlyOverdue }
    Storage.saveFilters(all)
  }, [search, priorityFilter, companyFilter, fromCreated, toCreated, fromDue, toDue, onlyOverdue])

  const inRange = (iso, from, to) => {
    if (!iso) return false
    const d = new Date(iso).toISOString().slice(0,10)
    if (from && d < from) return false
    if (to && d > to) return false
    return true
  }

  const filtered = useMemo(() => {
    let arr = tasks
    if (companyId) arr = arr.filter(t => t.companyId === companyId)
    if (forAdmin && companyFilter !== 'Todas') arr = arr.filter(t => t.companyId === companyFilter)
    if (priorityFilter !== 'Todas') arr = arr.filter(t => t.priority === priorityFilter)
    if (search) {
      const s = search.toLowerCase()
      arr = arr.filter(t => (t.title + ' ' + t.description).toLowerCase().includes(s))
    }
    if (fromCreated || toCreated) arr = arr.filter(t => inRange(t.createdAt, fromCreated, toCreated))
    if (fromDue || toDue) arr = arr.filter(t => inRange(t.dueDate, fromDue, toDue))
    if (onlyOverdue) arr = arr.filter(t => isOverdue(t.dueDate) && t.status !== 'Completada')
    return arr
  }, [tasks, companyId, companyFilter, priorityFilter, search, fromCreated, toCreated, fromDue, toDue, onlyOverdue, forAdmin])

  const updateTask = (id, patch) => {
    const next = tasks.map(t => t.id === id ? { ...t, ...patch } : t)
    setTasks(next); Storage.saveTasks(next)
  }
  const duplicateTask = (t) => {
    const copy = { ...t, id: uid(), title: t.title + ' (copia)', status: 'Nueva', createdAt: new Date().toISOString() }
    const next = [copy, ...tasks]; setTasks(next); Storage.saveTasks(next)
  }

  // detail modal
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailTask, setDetailTask] = useState(null)
  const openDetail = (t) => { setDetailTask(t); setDetailOpen(true) }
  const closeDetail = () => setDetailOpen(false)
  const updateDetail = (t) => { updateTask(t.id, t); setDetailTask(t) }

  const columns = ['Nueva', 'En Progreso', 'Completada']
  const byCol = Object.fromEntries(columns.map(c => [c, filtered.filter(t => t.status === c)]))

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDrop = (e, status) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    const task = tasks.find(t => t.id === id)
    if (!task) return
    if (task.status === status) return
    updateTask(id, { status })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <Stat label="Total" value={filtered.length} />
        <Stat label="Pendientes" value={filtered.filter(t=>t.status!=='Completada').length} />
        <Stat label="Vencidas" value={filtered.filter(t=>isOverdue(t.dueDate) && t.status!=='Completada').length} />
      </div>

      <Card title="Filtros"
        right={<button onClick={()=>{setFromCreated('');setToCreated('');setFromDue('');setToDue('');setOnlyOverdue(false);setSearch('');setPriorityFilter('Todas');setCompanyFilter('Todas')}} className="px-3 py-2 rounded-xl border">Limpiar</button>}>
        <div className="grid gap-2 sm:grid-cols-6">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="px-3 py-2 rounded-xl border sm:col-span-2" />
          <select value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)} className="px-3 py-2 rounded-xl border">
            {['Todas', ...PRIORITY].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {forAdmin && (
            <select value={companyFilter} onChange={e=>setCompanyFilter(e.target.value)} className="px-3 py-2 rounded-xl border">
              <option value="Todas">Todas las empresas</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <label className="text-sm text-gray-600 inline-flex items-center gap-2">
            <input type="checkbox" checked={onlyOverdue} onChange={e=>setOnlyOverdue(e.target.checked)} />
            Solo vencidas
          </label>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-6">
          <div className="sm:col-span-3 flex items-center gap-2">
            <span className="text-sm text-gray-600 w-28">Creada de</span>
            <input type="date" value={fromCreated} onChange={e=>setFromCreated(e.target.value)} className="px-3 py-2 rounded-xl border" />
            <span>a</span>
            <input type="date" value={toCreated} onChange={e=>setToCreated(e.target.value)} className="px-3 py-2 rounded-xl border" />
          </div>
          <div className="sm:col-span-3 flex items-center gap-2">
            <span className="text-sm text-gray-600 w-28">Vence de</span>
            <input type="date" value={fromDue} onChange={e=>setFromDue(e.target.value)} className="px-3 py-2 rounded-xl border" />
            <span>a</span>
            <input type="date" value={toDue} onChange={e=>setToDue(e.target.value)} className="px-3 py-2 rounded-xl border" />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {columns.map(col => (
          <div key={col}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>onDrop(e, col)}
            className="rounded-3xl border bg-white flex flex-col min-h-[300px]">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="font-semibold">{col}</div>
              <Badge tone={col==='Completada'?'green':col==='En Progreso'?'blue':'gray'}>{byCol[col].length}</Badge>
            </div>
            <div className="p-3 space-y-3">
              {byCol[col].map(t => (
                <div key={t.id}
                  draggable={canEdit}
                  onDragStart={e=>onDragStart(e, t.id)}
                  className={"rounded-2xl border p-3 bg-white hover:shadow-sm " + (isOverdue(t.dueDate) && t.status!=='Completada' ? 'border-red-300' : 'border-gray-200')}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-gray-600">{t.description || '—'}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span title="Prioridad"><Badge tone={t.priority==='Alta'?'red':t.priority==='Media'?'amber':'gray'}>{t.priority[0]}</Badge></span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span>Vence: <b className={isOverdue(t.dueDate) && t.status!=='Completada' ? 'text-red-600' : ''}>{fmtDate(t.dueDate)}</b></span>
                    <span>Creada: {fmtDate(t.createdAt)}</span>
                    {forAdmin && <span className="truncate">Empresa: {companies.find(c=>c.id===t.companyId)?.name || '—'}</span>}
                    <span className="truncate">Agente: {agents.find(a=>a.id===t.assignedTo)?.name || '—'}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={()=>duplicateTask(t)} className="px-2 py-1 rounded-lg border" title="Duplicar">📄</button>
                    <button onClick={()=>openDetail(t)} className="px-2 py-1 rounded-lg border" title="Detalle">📝</button>
                  </div>
                </div>
              ))}
              {byCol[col].length === 0 && (
                <div className="text-sm text-gray-400 py-6 text-center">Suelta aquí para mover a “{col}”.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <TaskDetail open={detailOpen} onClose={closeDetail} task={detailTask || {}} onUpdate={updateDetail} />
    </div>
  )
}

/* ---------- TABLE (from v1.3) ---------- */
function TasksTable({ canEdit, companyId, showCompanyColumn=false, forAdmin=false }) {
  const [tasks, setTasks] = useState(Storage.loadTasks())
  const companies = Storage.loadCompanies()
  const agents = Storage.loadAgents()

  const persisted = Storage.loadFilters()
  const initialKey = (showCompanyColumn ? 'admin' : (companyId || 'company'))
  const initialFilters = persisted[initialKey] || {}
  const [search, setSearch] = useState(initialFilters.search || '')
  const [statusFilter, setStatusFilter] = useState(initialFilters.status || 'Todos')
  const [priorityFilter, setPriorityFilter] = useState(initialFilters.priority || 'Todas')
  const [companyFilter, setCompanyFilter] = useState(initialFilters.company || 'Todas')
  const [fromCreated, setFromCreated] = useState(initialFilters.fromCreated || '')
  const [toCreated, setToCreated] = useState(initialFilters.toCreated || '')
  const [fromDue, setFromDue] = useState(initialFilters.fromDue || '')
  const [toDue, setToDue] = useState(initialFilters.toDue || '')
  const [onlyOverdue, setOnlyOverdue] = useState(!!initialFilters.onlyOverdue)

  useEffect(() => {
    const f = { search, status: statusFilter, priority: priorityFilter, company: companyFilter, fromCreated, toCreated, fromDue, toDue, onlyOverdue }
    const all = Storage.loadFilters()
    all[initialKey] = f; Storage.saveFilters(all)
  }, [search, statusFilter, priorityFilter, companyFilter, fromCreated, toCreated, fromDue, toDue, onlyOverdue])

  // pagination
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [selected, setSelected] = useState(new Set())

  useEffect(()=>{ setTasks(Storage.loadTasks()) }, [])

  const inRange = (iso, from, to) => {
    if (!iso) return false
    const d = new Date(iso).toISOString().slice(0,10)
    if (from && d < from) return false
    if (to && d > to) return false
    return true
  }

  const filtered = useMemo(() => {
    let arr = tasks
    if (companyId) arr = arr.filter(t => t.companyId === companyId)
    if (showCompanyColumn && companyFilter !== 'Todas') arr = arr.filter(t => t.companyId === companyFilter)
    if (statusFilter !== 'Todos') arr = arr.filter(t => t.status === statusFilter)
    if (priorityFilter !== 'Todas') arr = arr.filter(t => t.priority === priorityFilter)
    if (search) {
      const s = search.toLowerCase()
      arr = arr.filter(t => (t.title + ' ' + t.description).toLowerCase().includes(s))
    }
    if (fromCreated || toCreated) {
      arr = arr.filter(t => inRange(t.createdAt, fromCreated, toCreated))
    }
    if (fromDue || toDue) {
      arr = arr.filter(t => inRange(t.dueDate, fromDue, toDue))
    }
    if (onlyOverdue) {
      arr = arr.filter(t => isOverdue(t.dueDate) && t.status !== 'Completada')
    }
    return arr
  }, [tasks, companyId, search, statusFilter, priorityFilter, companyFilter, showCompanyColumn, fromCreated, toCreated, fromDue, toDue, onlyOverdue])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize)

  const stats = useMemo(() => ({
    total: filtered.length,
    pendientes: filtered.filter(t => t.status !== 'Completada').length,
    vencidas: filtered.filter(t => isOverdue(t.dueDate) && t.status !== 'Completada').length,
  }), [filtered])

  const addTask = (task) => {
    const next = [task, ...tasks]; setTasks(next); Storage.saveTasks(next)
  }
  const updateTask = (id, patch) => {
    const next = tasks.map(t => t.id === id ? { ...t, ...patch } : t); setTasks(next); Storage.saveTasks(next)
  }
  const replaceTask = (task) => {
    const next = tasks.map(t => t.id === task.id ? task : t); setTasks(next); Storage.saveTasks(next)
  }
  const removeTask = (id) => {
    const next = tasks.filter(t => t.id !== id); setTasks(next); Storage.saveTasks(next)
  }
  const duplicateTask = (t) => {
    const copy = { ...t, id: uid(), title: t.title + ' (copia)', status: 'Nueva', createdAt: new Date().toISOString() }
    addTask(copy)
  }
  const doBulk = (action) => {
    if (selected.size === 0 && action.type !== 'duplicate') return
    const ids = new Set(selected)
    let changed = false
    let next = tasks
    if (action.type === 'duplicate') {
      const toDup = tasks.filter(t => selected.has(t.id))
      const copies = toDup.map(t => ({ ...t, id: uid(), title: t.title + ' (copia)', status: 'Nueva', createdAt: new Date().toISOString() }))
      next = [...copies, ...tasks]
      changed = copies.length > 0
    } else {
      next = tasks.map(t => {
        if (!ids.has(t.id)) return t
        changed = true
        if (action.type === 'status') return { ...t, status: action.value }
        if (action.type === 'priority') return { ...t, priority: action.value }
        if (action.type === 'assign') return { ...t, assignedTo: action.value || null }
        return t
      })
    }
    if (changed) { setTasks(next); Storage.saveTasks(next); setSelected(new Set()) }
  }
  const exportCSV = () => {
    const rows = filtered.map(t => ({
      id: t.id, titulo: t.title, descripcion: t.description,
      prioridad: t.priority, estado: t.status, vence: t.dueDate,
      creada: t.createdAt,
      empresa: companies.find(c => c.id === t.companyId)?.name || '',
      asignado: agents.find(a => a.id === t.assignedTo)?.name || ''
    }))
    if (rows.length === 0) return
    downloadCSV('tareas.csv', rows)
  }

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailTask, setDetailTask] = useState(null)
  const openDetail = (t) => { setDetailTask(t); setDetailOpen(true) }
  const closeDetail = () => setDetailOpen(false)
  const updateDetail = (t) => { replaceTask(t); setDetailTask(t) }

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const startEdit = (t) => { setEditingId(t.id); setEditTitle(t.title); setEditDesc(t.description || '') }
  const cancelEdit = () => { setEditingId(null); setEditTitle(''); setEditDesc('') }
  const saveEdit = (t) => {
    const title = editTitle.trim()
    const description = editDesc
    if (!title) { cancelEdit(); return }
    updateTask(t.id, { title, description })
    cancelEdit()
  }

  const [selectedAll, setSelectedAll] = useState(false)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <Stat label="Total" value={stats.total} />
        <Stat label="Pendientes" value={stats.pendientes} />
        <Stat label="Vencidas" value={stats.vencidas} />
      </div>

      <Card
        title={showCompanyColumn ? 'Solicitudes de Empresas' : 'Tareas solicitadas'}
        right={
          <div className="flex gap-2 flex-wrap items-center">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="px-3 py-2 rounded-xl border w-40" />
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border">
              {['Todos', ...STATUS].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={priorityFilter} onChange={e=>setPriorityFilter(e.target.value)} className="px-3 py-2 rounded-xl border">
              {['Todas', ...PRIORITY].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {showCompanyColumn && (
              <select value={companyFilter} onChange={e=>setCompanyFilter(e.target.value)} className="px-3 py-2 rounded-xl border">
                <option value="Todas">Todas las empresas</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <button onClick={exportCSV} className="px-3 py-2 rounded-xl border">Exportar CSV</button>
          </div>
        }
      >
        {/* Advanced filters */}
        <div className="mb-3 grid gap-2 sm:grid-cols-6">
          <div className="sm:col-span-3 flex items-center gap-2">
            <label className="text-sm text-gray-600 w-28">Creada de</label>
            <input type="date" value={fromCreated} onChange={e=>setFromCreated(e.target.value)} className="px-3 py-2 rounded-xl border" />
            <span>a</span>
            <input type="date" value={toCreated} onChange={e=>setToCreated(e.target.value)} className="px-3 py-2 rounded-xl border" />
          </div>
          <div className="sm:col-span-3 flex items-center gap-2">
            <label className="text-sm text-gray-600 w-28">Vence de</label>
            <input type="date" value={fromDue} onChange={e=>setFromDue(e.target.value)} className="px-3 py-2 rounded-xl border" />
            <span>a</span>
            <input type="date" value={toDue} onChange={e=>setToDue(e.target.value)} className="px-3 py-2 rounded-xl border" />
          </div>
          <div className="sm:col-span-6 flex items-center gap-3">
            <label className="text-sm text-gray-600">
              <input type="checkbox" className="mr-2" checked={onlyOverdue} onChange={e=>setOnlyOverdue(e.target.checked)} />
              Solo vencidas (no completadas)
            </label>
            <button onClick={()=>{setFromCreated(''); setToCreated(''); setFromDue(''); setToDue(''); setOnlyOverdue(false)}} className="px-3 py-1.5 rounded-xl border">Limpiar filtros fecha</button>
          </div>
        </div>

        {canEdit && !showCompanyColumn && <TaskComposer onAdd={(task)=>{const next=[task,...tasks]; setTasks(next); Storage.saveTasks(next)}} companyId={companyId || companies[0]?.id} />}

        {/* Bulk actions toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-sm text-gray-600">Seleccionadas: {selected.size}</span>
          <button onClick={()=>setSelected(new Set(pageItems.map(t=>t.id)))} className="px-2 py-1 rounded-lg border">Sel. página</button>
          <button onClick={()=>setSelected(new Set(filtered.map(t=>t.id)))} className="px-2 py-1 rounded-lg border">Sel. todo (filtro)</button>
          <button onClick={()=>setSelected(new Set())} className="px-2 py-1 rounded-lg border">Limpiar</button>
          <span className="text-sm text-gray-600 ml-2">Cambiar a:</span>
          <select onChange={e=>{ if(e.target.value) { doBulk({type:'status', value:e.target.value}); e.target.value=''} }} className="px-2 py-1 rounded-lg border">
            <option value="">Estado…</option>
            {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select onChange={e=>{ if(e.target.value) { doBulk({type:'priority', value:e.target.value}); e.target.value=''} }} className="px-2 py-1 rounded-lg border">
            <option value="">Prioridad…</option>
            {PRIORITY.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select onChange={e=>{ doBulk({type:'assign', value:e.target.value}) }} className="px-2 py-1 rounded-lg border">
            <option value="">Asignar a…</option>
            <option value="">(Sin asignar)</option>
            {Storage.loadAgents().map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <button onClick={()=>doBulk({type:'duplicate'})} className="px-2 py-1 rounded-lg border">Duplicar seleccionadas</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-2"><input type="checkbox" onChange={e=>{
                  const chk = e.target.checked
                  setSelectedAll(chk)
                  if (chk) setSelected(new Set(pageItems.map(t=>t.id)))
                  else setSelected(new Set())
                }} checked={selectedAll}/></th>
                <th className="py-2 pr-4">Título</th>
                {showCompanyColumn && <th className="py-2 pr-4">Empresa</th>}
                <th className="py-2 pr-4">Prioridad</th>
                <th className="py-2 pr-4">Estado</th>
                <th className="py-2 pr-4">Asignado</th>
                <th className="py-2 pr-4">Creada</th>
                <th className="py-2 pr-4">Vence</th>
                <th className="py-2 pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50/60">
                  <td className="py-2 pr-2"><input type="checkbox" checked={selected.has(t.id)} onChange={()=>{
                    setSelected(prev => { const n=new Set(prev); n.has(t.id)?n.delete(t.id):n.add(t.id); return n })
                  }} /></td>
                  <td className="py-2 pr-4">
                    {editingId === t.id ? (
                      <div className="space-y-1">
                        <input className="w-full px-2 py-1 rounded-lg border" value={editTitle} onChange={e=>setEditTitle(e.target.value)}
                          onKeyDown={e=>{ if (e.key==='Enter') saveEdit(t); if (e.key==='Escape') cancelEdit() }} />
                        <input className="w-full px-2 py-1 rounded-lg border text-xs" value={editDesc} onChange={e=>setEditDesc(e.target.value)}
                          onKeyDown={e=>{ if (e.key==='Enter') saveEdit(t); if (e.key==='Escape') cancelEdit() }} placeholder="Descripción (opcional)" />
                        <div className="flex gap-2">
                          <button onClick={()=>saveEdit(t)} className="px-2 py-1 rounded-lg border">Guardar</button>
                          <button onClick={cancelEdit} className="px-2 py-1 rounded-lg border">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div onDoubleClick={()=>canEdit && startEdit(t)}>
                        <div className="font-medium">{t.title}</div>
                        <div className="text-gray-500 text-xs max-w-lg">{t.description}</div>
                      </div>
                    )}
                  </td>
                  {showCompanyColumn && (
                    <td className="py-2 pr-4">
                      <span className="text-xs">{companies.find(c => c.id === t.companyId)?.name || '—'}</span>
                    </td>
                  )}
                  <td className="py-2 pr-4"><Badge tone={t.priority==='Alta'?'red':t.priority==='Media'?'amber':'gray'}>{t.priority}</Badge></td>
                  <td className="py-2 pr-4">
                    {canEdit ? (
                      <select value={t.status} onChange={e=>updateTask(t.id, { status: e.target.value })} className="px-2 py-1 rounded-lg border bg-white">
                        {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <Badge tone={t.status==='Completada'?'green':t.status==='En Progreso'?'blue':'gray'}>{t.status}</Badge>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    {canEdit ? (
                      <select value={t.assignedTo || ''} onChange={e=>updateTask(t.id, { assignedTo: e.target.value || null })} className="px-2 py-1 rounded-lg border bg-white">
                        <option value="">Sin asignar</option>
                        {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    ) : (
                      <span className="text-xs">{agents.find(a => a.id === t.assignedTo)?.name || '—'}</span>
                    )}
                  </td>
                  <td className="py-2 pr-4">{fmtDate(t.createdAt)}</td>
                  <td className="py-2 pr-4">
                    <span className={isOverdue(t.dueDate) && t.status !== 'Completada' ? 'text-red-600 font-medium' : ''}>
                      {fmtDate(t.dueDate)}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <button onClick={()=>duplicateTask(t)} className="px-2 py-1 rounded-lg border" title="Duplicar">📄</button>
                      <button onClick={()=>updateTask(t.id, { status: STATUS[(STATUS.indexOf(t.status)+1)%STATUS.length] })} className="px-2 py-1 rounded-lg border" title="Avanzar estado">➡️</button>
                      <button onClick={()=>openDetail(t)} className="px-2 py-1 rounded-lg border" title="Detalle">📝</button>
                      {canEdit && !showCompanyColumn && <button onClick={()=>removeTask(t.id)} className="px-2 py-1 rounded-lg border" title="Eliminar">🗑️</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">Página {page} de {totalPages}</div>
          <div className="flex gap-2">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1} className="px-3 py-1.5 rounded-xl border disabled:opacity-50">Anterior</button>
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages} className="px-3 py-1.5 rounded-xl border disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </Card>

      <TaskDetail open={detailOpen} onClose={closeDetail} task={detailTask || {}} onUpdate={updateDetail} />
    </div>
  )
}

function EmpresaPage({ session }) {
  const companies = Storage.loadCompanies()
  const company = companies.find(c => c.id === session.companyId) || companies[0]
  const view = Storage.loadView()
  const [mode, setMode] = useState(view.empresa || 'tabla')
  useEffect(()=>{
    const v = Storage.loadView(); v.empresa = mode; Storage.saveView(v)
  }, [mode])
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Panel Empresa</h2>
        <div className="border rounded-xl p-1 text-sm">
          <button onClick={()=>setMode('tabla')} className={'px-3 py-1.5 rounded-lg ' + (mode==='tabla'?'bg-black text-white':'')}>Tabla</button>
          <button onClick={()=>setMode('kanban')} className={'px-3 py-1.5 rounded-lg ' + (mode==='kanban'?'bg-black text-white':'')}>Kanban</button>
        </div>
      </div>
      <CompanyInfo canEdit={true} company={company} />
      {mode==='kanban'
        ? <KanbanBoard canEdit={true} companyId={company?.id} />
        : <TasksTable canEdit={true} companyId={company?.id} />}
    </div>
  )
}
function UsuarioPage({ session }) {
  const companies = Storage.loadCompanies()
  const company = companies.find(c => c.id === session.companyId) || companies[0]
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-semibold">Panel Usuario (consulta)</h2>
      <CompanyInfo canEdit={false} company={company} />
      <TasksTable canEdit={false} companyId={company?.id} />
    </div>
  )
}
function AdminSummary() {
  const [tasks, setTasks] = useState(Storage.loadTasks())
  const companies = Storage.loadCompanies()
  useEffect(()=>{ setTasks(Storage.loadTasks()) }, [])
  const pending = tasks.filter(t => t.status !== 'Completada')
  const byPrio = PRIORITY.map(p => ({ p, n: pending.filter(t => t.priority===p).length }))
  const byCompany = companies.map(c => ({ c: c.name, n: pending.filter(t => t.companyId===c.id).length }))
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="p-4 rounded-2xl border bg-white">
        <div className="text-xs uppercase tracking-wide text-gray-500">Pendientes</div>
        <div className="text-3xl font-semibold mt-1">{pending.length}</div>
        <div className="mt-2 text-sm text-gray-500">Tareas con estado distinto de <b>Completada</b>.</div>
      </div>
      <div className="p-4 rounded-2xl border bg-white">
        <div className="text-xs uppercase tracking-wide text-gray-500">Por prioridad</div>
        <ul className="mt-2 text-sm">{byPrio.map(x => <li key={x.p} className="flex justify-between"><span>{x.p}</span><span className="font-medium">{x.n}</span></li>)}</ul>
      </div>
      <div className="p-4 rounded-2xl border bg-white sm:col-span-2">
        <div className="text-xs uppercase tracking-wide text-gray-500">Pendientes por empresa</div>
        <div className="mt-2 grid sm:grid-cols-2 gap-2">
          {byCompany.map(x => (
            <div key={x.c} className="flex items-center justify-between px-3 py-2 rounded-xl border">
              <span>{x.c}</span><Badge tone={x.n>0?'violet':'gray'}>{x.n}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
function AdminPage() {
  const view = Storage.loadView()
  const [mode, setMode] = useState(view.admin || 'kanban')
  useEffect(()=>{
    const v = Storage.loadView(); v.admin = mode; Storage.saveView(v)
  }, [mode])
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Panel Administrador</h2>
        <div className="border rounded-xl p-1 text-sm">
          <button onClick={()=>setMode('tabla')} className={'px-3 py-1.5 rounded-lg ' + (mode==='tabla'?'bg-black text-white':'')}>Tabla</button>
          <button onClick={()=>setMode('kanban')} className={'px-3 py-1.5 rounded-lg ' + (mode==='kanban'?'bg-black text-white':'')}>Kanban</button>
        </div>
      </div>
      <Card title="Resumen"><AdminSummary /></Card>
      <AgentsManager />
      {mode==='kanban'
        ? <KanbanBoard canEdit={true} forAdmin={true} />
        : <TasksTable canEdit={true} showCompanyColumn={true} forAdmin={true} />}
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(Storage.loadSession())
  useEffect(() => { ensureSeedAndMigrate(); const s = Storage.loadSession(); if (s) setSession(s) }, [])
  if (!session) return <Login onLogin={setSession} />
  const logout = () => { Storage.clearSession(); setSession(null) }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar user={session} onLogout={logout} />
      {session.role === 'Admin'   ? <AdminPage /> : null}
      {session.role === 'Empresa' ? <EmpresaPage session={session} /> : null}
      {session.role === 'Usuario' ? <UsuarioPage session={session} /> : null}
      <div className="py-10 text-center text-xs text-gray-400">© {new Date().getFullYear()} MoMa HR — Demo</div>
    </div>
  )
}
