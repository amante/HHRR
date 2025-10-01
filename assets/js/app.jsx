/* MoMa HR — v1 (GitHub Pages-ready)
 * Credenciales demo:
 *   Empresa: empresa@demo.com / 123456
 *   Usuario: usuario@demo.com / 123456
*/
const { useEffect, useMemo, useState } = React;

// ---- Storage ---------------------------------------------------------------
const STORAGE_KEYS = {
  users: "momaHR_users",
  company: "momaHR_company",
  tasks: "momaHR_tasks",
  session: "momaHR_session",
};

function seedIfEmpty() {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || "null");
  if (!users) {
    const demoUsers = [
      { id: "u1", email: "empresa@demo.com", password: "123456", role: "Empresa", name: "Demo Company Admin" },
      { id: "u2", email: "usuario@demo.com", password: "123456", role: "Usuario", name: "Demo Consulta" },
    ];
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(demoUsers));
  }
  const company = JSON.parse(localStorage.getItem(STORAGE_KEYS.company) || "null");
  if (!company) {
    const demoCompany = {
      id: "c1",
      name: "MoMa Technologies S.A.",
      rut: "76.123.456-7",
      industry: "Tecnología",
      address: "Av. Innovación 123, Santiago, CL",
      phone: "+56 2 1234 5678",
      website: "https://moma.example",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.company, JSON.stringify(demoCompany));
  }
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks) || "null");
  if (!tasks) {
    const today = new Date();
    const addDays = (d) => new Date(today.getTime() + d * 86400000);
    const demoTasks = [
      { id: cryptoRandomId(), title: "Publicar oferta: Desarrollador Full Stack", description: "Crear la requisición, publicar en portales y LinkedIn.", priority: "Alta", status: "Nueva", dueDate: addDays(3).toISOString(), createdAt: today.toISOString(), createdBy: "u1" },
      { id: cryptoRandomId(), title: "Actualizar políticas de home office", description: "Revisión legal y comunicación interna.", priority: "Media", status: "En Progreso", dueDate: addDays(10).toISOString(), createdAt: today.toISOString(), createdBy: "u1" },
      { id: cryptoRandomId(), title: "Onboarding de 3 QA Analysts", description: "Coordinar inducción y accesos.", priority: "Alta", status: "Completada", dueDate: addDays(-2).toISOString(), createdAt: today.toISOString(), createdBy: "u1" },
    ];
    localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(demoTasks));
  }
}

function cryptoRandomId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const loadUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || "[]");
const loadCompany = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.company) || "null");
const saveCompany = (company) => localStorage.setItem(STORAGE_KEYS.company, JSON.stringify({ ...company, updatedAt: new Date().toISOString() }));
const loadTasks = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.tasks) || "[]");
const saveTasks = (tasks) => localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
const loadSession = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || "null");
const saveSession = (session) => localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
const clearSession = () => localStorage.removeItem(STORAGE_KEYS.session);

// ---- UI components ----------------------------------------------------------
function Navbar({ user, onLogout }) {
  return (
    <div className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-black text-white flex items-center justify-center font-bold">M</div>
          <div className="text-xl font-semibold">MoMa HR</div>
          <span className="ml-3 text-xs px-2 py-1 rounded-full bg-gray-100 border">v1</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:inline text-gray-500">Sesión:</span>
          <span className="font-medium">{user?.email}</span>
          <span className="px-2 py-0.5 rounded-full text-xs border bg-gray-50">{user?.role}</span>
          <button onClick={onLogout} className="ml-2 px-3 py-1.5 rounded-xl border hover:bg-gray-50">Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, subtitle, action }) {
  return (
    <div className="text-center py-16 border rounded-3xl bg-white">
      <div className="text-5xl">🗂️</div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      {subtitle && <p className="mt-1 text-gray-500 max-w-md mx-auto">{subtitle}</p>}
      {action}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="p-4 rounded-2xl border bg-white">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function Card({ title, children, right }) {
  return (
    <div className="border rounded-3xl bg-white">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        {right}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ---- Login ------------------------------------------------------------------
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Empresa");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const users = loadUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) { setError("Credenciales inválidas"); return; }
    if (found.role !== role) { setError(`El usuario no tiene el perfil ${role}`); return; }
    const session = { userId: found.id, email: found.email, role: found.role, name: found.name };
    saveSession(session);
    onLogin(session);
  };

  const fillDemo = (r) => {
    setRole(r);
    if (r === "Empresa") { setEmail("empresa@demo.com"); setPassword("123456"); }
    else { setEmail("usuario@demo.com"); setPassword("123456"); }
  };

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
            <div className="mt-1 grid grid-cols-2 gap-2">
              {[
                { k: "Empresa", emoji: "🏢" },
                { k: "Usuario", emoji: "👤" },
              ].map((opt) => (
                <button
                  key={opt.k}
                  type="button"
                  onClick={() => setRole(opt.k)}
                  className={`px-3 py-2 rounded-xl border ${role === opt.k ? "bg-gray-900 text-white" : "bg-gray-50 hover:bg-white"}`}
                >
                  <span className="mr-2">{opt.emoji}</span>
                  {opt.k}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@empresa.com"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Contraseña</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••"
              required
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" className="w-full py-2 rounded-xl bg-black text-white hover:opacity-90">Ingresar</button>
          <div className="text-center text-sm text-gray-500">
            <span>¿Probar rápido?</span>
            <div className="mt-2 flex gap-2 justify-center">
              <button type="button" onClick={() => fillDemo("Empresa")} className="px-2 py-1 rounded-lg border">Empresa demo</button>
              <button type="button" onClick={() => fillDemo("Usuario")} className="px-2 py-1 rounded-lg border">Usuario demo</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Empresa: Información de empresa ---------------------------------------
function CompanyInfo({ canEdit }) {
  const [company, setCompany] = useState(loadCompany());
  const [editing, setEditing] = useState(false);

  useEffect(() => { setCompany(loadCompany()); }, []);

  const [form, setForm] = useState(company || {});
  useEffect(() => setForm(company || {}), [company]);

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSave = () => {
    if (!canEdit) return;
    const next = { ...company, ...form };
    saveCompany(next);
    setCompany(next);
    setEditing(false);
  };

  if (!company && !editing) {
    return (
      <EmptyState
        title="Sin información de empresa"
        subtitle="Agrega los datos básicos para comenzar."
        action={
          canEdit ? (
            <button onClick={() => setEditing(true)} className="mt-4 px-3 py-2 rounded-xl border">Agregar</button>
          ) : null
        }
      />
    );
  }

  return (
    <Card
      title="Información de la empresa"
      right={
        canEdit ? (
          <div className="flex items-center gap-2">
            {!editing && (
              <button onClick={() => setEditing(true)} className="px-3 py-1.5 rounded-xl border">Editar</button>
            )}
            {editing && (
              <>
                <button onClick={onSave} className="px-3 py-1.5 rounded-xl bg-black text-white">Guardar</button>
                <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-xl border">Cancelar</button>
              </>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-500">Solo lectura</span>
        )
      }
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          ["name", "Nombre"],
          ["rut", "RUT / ID"],
          ["industry", "Industria"],
          ["address", "Dirección"],
          ["phone", "Teléfono"],
          ["website", "Sitio web"],
        ].map(([k, label]) => (
          <div key={k}>
            <div className="text-xs text-gray-500">{label}</div>
            {editing ? (
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border"
                value={form?.[k] || ""}
                onChange={(e) => onChange(k, e.target.value)}
              />
            ) : (
              <div className="mt-1 font-medium">{company?.[k] || <span className="text-gray-400">—</span>}</div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-gray-400">
        <span>Creada: {company?.createdAt ? formatDate(company.createdAt) : "—"}</span>
        <span className="ml-3">Actualizada: {company?.updatedAt ? formatDate(company.updatedAt) : "—"}</span>
      </div>
    </Card>
  );
}

// ---- Empresa: Tareas solicitadas -------------------------------------------
const STATUS = ["Nueva", "En Progreso", "Completada"];
const PRIORITY = ["Baja", "Media", "Alta"];

function TasksManager({ canEdit }) {
  const [tasks, setTasks] = useState(loadTasks());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [priorityFilter, setPriorityFilter] = useState("Todas");

  useEffect(() => { setTasks(loadTasks()); }, []);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "Todos" || t.status === statusFilter;
      const matchPrio = priorityFilter === "Todas" || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPrio;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const stats = useMemo(() => ({
    total: tasks.length,
    nuevas: tasks.filter((t) => t.status === "Nueva").length,
    progreso: tasks.filter((t) => t.status === "En Progreso").length,
    completas: tasks.filter((t) => t.status === "Completada").length,
    vencidas: tasks.filter((t) => isOverdue(t.dueDate) && t.status !== "Completada").length,
  }), [tasks]);

  const addTask = (task) => {
    const next = [{ ...task, id: cryptoRandomId(), createdAt: new Date().toISOString() }, ...tasks];
    setTasks(next);
    saveTasks(next);
  };

  const updateTask = (id, patch) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
    setTasks(next);
    saveTasks(next);
  };

  const removeTask = (id) => {
    const next = tasks.filter((t) => t.id !== id);
    setTasks(next);
    saveTasks(next);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Stat label="Tareas" value={stats.total} />
        <Stat label="Nuevas" value={stats.nuevas} />
        <Stat label="En progreso" value={stats.progreso} />
        <Stat label="Completadas" value={stats.completas} />
        <Stat label="Vencidas" value={stats.vencidas} />
      </div>

      <Card
        title="Tareas solicitadas"
        right={
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="px-3 py-2 rounded-xl border w-40"
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border">
              {["Todos", ...STATUS].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 rounded-xl border">
              {["Todas", ...PRIORITY].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        }
      >
        {canEdit && <TaskComposer onAdd={addTask} />}
        {filtered.length === 0 ? (
          <EmptyState
            title="No hay tareas para mostrar"
            subtitle={canEdit ? "Crea tu primera tarea con el formulario superior." : "Vuelve a intentar cambiando los filtros."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 pr-4">Título</th>
                  <th className="py-2 pr-4">Prioridad</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 pr-4">Vence</th>
                  <th className="py-2 pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50/60">
                    <td className="py-2 pr-4">
                      <div className="font-medium">{t.title}</div>
                      <div className="text-gray-500 text-xs max-w-lg">{t.description}</div>
                    </td>
                    <td className="py-2 pr-4">
                      <Badge tone={t.priority === "Alta" ? "red" : t.priority === "Media" ? "amber" : "gray"}>{t.priority}</Badge>
                    </td>
                    <td className="py-2 pr-4">
                      {canEdit ? (
                        <select
                          value={t.status}
                          onChange={(e) => updateTask(t.id, { status: e.target.value })}
                          className="px-2 py-1 rounded-lg border bg-white"
                        >
                          {STATUS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <Badge tone={t.status === "Completada" ? "green" : t.status === "En Progreso" ? "blue" : "gray"}>{t.status}</Badge>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      <span className={isOverdue(t.dueDate) && t.status !== "Completada" ? "text-red-600 font-medium" : ""}>
                        {formatDate(t.dueDate)}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <button
                            onClick={() => updateTask(t.id, { status: nextStatus(t.status) })}
                            className="px-2 py-1 rounded-lg border"
                            title="Avanzar estado"
                          >➡️</button>
                        )}
                        {canEdit && (
                          <button
                            onClick={() => removeTask(t.id)}
                            className="px-2 py-1 rounded-lg border"
                            title="Eliminar"
                          >🗑️</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function nextStatus(s) {
  const idx = STATUS.indexOf(s);
  const next = (idx + 1) % STATUS.length;
  return STATUS[next];
}

function TaskComposer({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Media");
  const [dueDate, setDueDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), priority, status: "Nueva", dueDate: new Date(dueDate).toISOString() });
    setTitle("");
    setDescription("");
    setPriority("Media");
  };

  return (
    <form onSubmit={submit} className="mb-4 grid sm:grid-cols-5 gap-2">
      <input
        className="px-3 py-2 rounded-xl border sm:col-span-1"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        required
      />
      <input
        className="px-3 py-2 rounded-xl border sm:col-span-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="px-3 py-2 rounded-xl border">
        {PRIORITY.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="px-3 py-2 rounded-xl border"
      />
      <div className="sm:col-span-5">
        <button type="submit" className="mt-1 px-3 py-2 rounded-xl bg-black text-white">Agregar tarea</button>
      </div>
    </form>
  );
}

function Badge({ tone = "gray", children }) {
  const toneMap = {
    gray: "bg-gray-100 text-gray-800 border-gray-200",
    red: "bg-red-100 text-red-800 border-red-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    green: "bg-green-100 text-green-800 border-green-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full border ${toneMap[tone]}`}>{children}</span>
  );
}

// ---- Usuario: Consulta inmediata -------------------------------------------
function ConsultaUsuario() {
  const [tasks, setTasks] = useState(loadTasks());
  const [q, setQ] = useState("");
  const [quick, setQuick] = useState("todas");

  useEffect(() => setTasks(loadTasks()), []);

  const filtered = useMemo(() => {
    let base = tasks;
    if (quick === "hoy") base = tasks.filter((t) => isToday(t.dueDate));
    else if (quick === "vencidas") base = tasks.filter((t) => isOverdue(t.dueDate) && t.status !== "Completada");
    else if (quick === "abiertas") base = tasks.filter((t) => t.status !== "Completada");
    if (!q) return base;
    return base.filter((t) => (t.title + " " + t.description).toLowerCase().includes(q.toLowerCase()));
  }, [tasks, q, quick]);

  return (
    <div className="space-y-4">
      <Card title="Consulta inmediata">
        <div className="grid sm:grid-cols-3 gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar tarea..." className="px-3 py-2 rounded-xl border" />
          <div className="flex gap-2">
            {[
              ["todas", "Todas"],
              ["abiertas", "Abiertas"],
              ["hoy", "Vencen hoy"],
              ["vencidas", "Vencidas"],
            ].map(([k, label]) => (
              <button key={k} onClick={() => setQuick(k)} className={`px-3 py-2 rounded-xl border ${quick === k ? "bg-gray-900 text-white" : "bg-white"}`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          {filtered.length === 0 ? (
            <EmptyState title="Sin resultados" subtitle="Prueba con otro término o filtro." />
          ) : (
            <ul className="space-y-2">
              {filtered.map((t) => (
                <li key={t.id} className="p-3 border rounded-2xl bg-white">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{t.title}</div>
                    <div className="flex items-center gap-2">
                      <Badge tone={t.status === "Completada" ? "green" : t.status === "En Progreso" ? "blue" : "gray"}>{t.status}</Badge>
                      <Badge tone={isOverdue(t.dueDate) && t.status !== "Completada" ? "red" : "gray"}>{formatDate(t.dueDate)}</Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{t.description}</div>
                  <div className="text-xs text-gray-400 mt-1">Prioridad: {t.priority}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}

// ---- Pages ------------------------------------------------------------------
function EmpresaPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-semibold">Panel Empresa</h2>
      <CompanyInfo canEdit={true} />
      <TasksManager canEdit={true} />
    </div>
  );
}
function UsuarioPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <h2 className="text-2xl font-semibold">Panel Usuario (consulta)</h2>
      <CompanyInfo canEdit={false} />
      <ConsultaUsuario />
    </div>
  );
}

// ---- App root ---------------------------------------------------------------
function App() {
  const [session, setSession] = useState(loadSession());
  useEffect(() => { seedIfEmpty(); const s = loadSession(); if (s) setSession(s); }, []);
  if (!session) return <Login onLogin={(s) => setSession(s)} />;
  const logout = () => { clearSession(); setSession(null); };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar user={session} onLogout={logout} />
      {session.role === "Empresa" ? <EmpresaPage /> : <UsuarioPage />}
      <Footer />
    </div>
  );
}
function Footer() {
  return <div className="py-10 text-center text-xs text-gray-400">© {new Date().getFullYear()} MoMa HR — Demo</div>;
}

// ---- Helpers ----------------------------------------------------------------
function formatDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    const parts = new Intl.DateTimeFormat(undefined, { day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(d);
    const dd = parts.find((p) => p.type === "day")?.value;
    const mm = parts.find((p) => p.type === "month")?.value;
    const yyyy = parts.find((p) => p.type === "year")?.value;
    return `${dd}/${mm}/${yyyy}`;
  } catch (e) { return iso; }
}
function isOverdue(iso) {
  if (!iso) return false;
  const end = new Date(iso); const today = new Date();
  end.setHours(23, 59, 59, 999); return end < today;
}
function isToday(iso) {
  const d = new Date(iso); const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
