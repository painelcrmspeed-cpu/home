"use client";
import { useCallback, useEffect, useState } from "react";
import { getSb } from "../../lib/supabase";

const STATUS: Record<string, string> = { aberto: "Aberto", em_andamento: "Em andamento", aguardando_cliente: "Aguardando você", concluido: "Concluído", cancelado: "Cancelado" };
const TYPES: Record<string, string> = { texto: "Trocar texto", imagem: "Trocar imagem ou foto", preco: "Preço ou horário", pagina: "Nova página ou seção", funcionalidade: "Funcionalidade nova", erro: "Algo quebrou", outro: "Outro" };
const LIMITS: Record<string, number> = { essencial: 2, profissional: 5, dinamico: 10 };
const when = (d?: string) => (d ? new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "-");
const day = (d?: string) => (d ? new Date(d + "T12:00:00").toLocaleDateString("pt-BR") : "-");
const usedIn = (site: any, tickets: any[]) => {
  const n = new Date();
  return tickets.filter((t) => { const c = new Date(t.created_at); return t.site_id === site.id && t.counts_toward_limit && t.status !== "cancelado" && c.getMonth() === n.getMonth() && c.getFullYear() === n.getFullYear(); }).length;
};

export default function Portal() {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const missing = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (missing) return;
    const sb = getSb();
    sb.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setReady(true); });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [missing]);

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    getSb().from("profiles").select("*").eq("id", user.id).single().then(({ data }) => setProfile(data));
  }, [user]);

  if (missing) return <p>Configuração pendente: faltam NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY na Vercel.</p>;
  if (!ready || (user && !profile)) return <p>Carregando...</p>;
  if (!user) return <Login />;
  return (
    <>
      <header>
        <div><h1>Área do cliente</h1><p>{profile.name ?? user.email}{profile.role === "admin" ? " (administrador)" : ""}</p></div>
        <button className="ghost" onClick={() => getSb().auth.signOut()}>Sair</button>
      </header>
      {profile.role === "admin" ? <Admin me={user.id} /> : <Client me={user.id} />}
    </>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  async function go(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const { error } = await getSb().auth.signInWithPassword({ email, password });
    if (error) setErr("E-mail ou senha incorretos.");
  }
  return (
    <form className="contact" onSubmit={go} style={{ maxWidth: 420, margin: "3rem auto" }}>
      <h1 style={{ fontSize: "1.6rem" }}>Entrar na área do cliente</h1>
      <label>E-mail<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
      <label>Senha<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
      {err && <p className="form-err" role="alert">{err}</p>}
      <button className="cta">Entrar</button>
      <small>Ainda não tem acesso? Fale comigo pelo WhatsApp.</small>
    </form>
  );
}

function Thread({ t, me, admin, reload }: { t: any; me: string; admin: boolean; reload: () => void }) {
  const [ev, setEv] = useState<any[]>([]);
  const [body, setBody] = useState("");
  const [internal, setInternal] = useState(false);
  const load = useCallback(async () => {
    const { data } = await getSb().from("ticket_events").select("*").eq("ticket_id", t.id).order("created_at");
    setEv(data ?? []);
  }, [t.id]);
  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    await getSb().from("ticket_events").insert({ ticket_id: t.id, author_id: me, kind: admin ? "registro" : "comentario", body: body.trim(), internal: admin && internal });
    setBody(""); setInternal(false); load();
  }
  async function setStatus(s: string) {
    const sb = getSb();
    await sb.from("tickets").update({ status: s, done_at: s === "concluido" ? new Date().toISOString() : null }).eq("id", t.id);
    await sb.from("ticket_events").insert({ ticket_id: t.id, author_id: me, kind: "status", body: `Status: ${STATUS[s]}` });
    reload(); load();
  }
  async function toggleCount(v: boolean) {
    await getSb().from("tickets").update({ counts_toward_limit: v }).eq("id", t.id);
    reload();
  }
  return (
    <div style={{ padding: ".6rem 0 1rem" }}>
      <p style={{ margin: "0 0 .6rem", whiteSpace: "pre-wrap" }}>{t.description}</p>
      {admin && (
        <div className="inline contact" style={{ padding: 0, background: "none" }}>
          <select value={t.status} onChange={(e) => setStatus(e.target.value)}>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <label><input type="checkbox" checked={t.counts_toward_limit} onChange={(e) => toggleCount(e.target.checked)} /> Conta no limite do mês</label>
        </div>
      )}
      {ev.map((x) => (
        <div key={x.id} className={`ev ${x.internal ? "int" : ""}`}><small>{when(x.created_at)} · {x.kind}{x.internal ? " · nota interna" : ""}</small>{x.body}</div>
      ))}
      <form className="contact" onSubmit={add} style={{ padding: 0, background: "none", marginTop: ".6rem" }}>
        <textarea rows={2} value={body} onChange={(e) => setBody(e.target.value)} placeholder={admin ? "Registre o que foi feito e como" : "Escreva um comentário"} maxLength={1500} />
        <div className="inline">
          {admin && <label><input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} /> Nota interna (o cliente não vê)</label>}
          <button className="cta" style={{ padding: ".6rem 1.2rem" }}>{admin ? "Registrar" : "Enviar"}</button>
        </div>
      </form>
    </div>
  );
}

function Client({ me }: { me: string }) {
  const [sites, setSites] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [f, setF] = useState({ site_id: "", type: "texto", urgency: "normal", title: "", description: "" });
  const load = useCallback(async () => {
    const sb = getSb();
    const s = await sb.from("sites").select("*").eq("active", true).order("name");
    const t = await sb.from("tickets").select("*, sites(name)").order("created_at", { ascending: false });
    setSites(s.data ?? []); setTickets(t.data ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const site_id = f.site_id || sites[0]?.id;
    if (!site_id) { setMsg("Você ainda não tem um site cadastrado. Fale com o suporte."); return; }
    const { error } = await getSb().from("tickets").insert({ ...f, site_id, client_id: me });
    if (error) { setMsg("Não consegui abrir o ticket: " + error.message); return; }
    setMsg("Ticket aberto! Acompanhe abaixo."); setF({ ...f, title: "", description: "" }); load();
  }

  return (
    <>
      <div className="usage">
        {sites.map((s) => {
          const limit = s.monthly_limit ?? LIMITS[s.plan];
          const used = usedIn(s, tickets);
          const free = s.free_until && new Date(s.free_until + "T23:59:59") >= new Date();
          return (
            <div key={s.id}>
              <b>{s.name}</b><br /><small>{s.url}</small>
              {free && <p style={{ margin: ".4rem 0 0" }}>Manutenção grátis até {day(s.free_until)}</p>}
              {limit ? (<><p style={{ margin: ".4rem 0 0" }}>{used} de {limit} alterações neste mês</p><div className="bar"><i style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} /></div></>) : <p style={{ margin: ".4rem 0 0" }}>Contrato personalizado</p>}
            </div>
          );
        })}
      </div>

      <form className="contact card2" onSubmit={create}>
        <h2>Pedir uma alteração</h2>
        {sites.length > 1 && <label>Site<select value={f.site_id || sites[0].id} onChange={(e) => setF({ ...f, site_id: e.target.value })}>{sites.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}
        <div className="row2">
          <label>O que precisa?<select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          <label>Urgência<select value={f.urgency} onChange={(e) => setF({ ...f, urgency: e.target.value })}><option value="normal">Normal</option><option value="urgente">Urgente</option></select></label>
        </div>
        <label>Resumo<input required maxLength={100} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
        <label>Detalhes<textarea required rows={4} maxLength={1500} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Conte o que mudar, em qual página e, se puder, envie o texto novo." /></label>
        {msg && <p role="status" style={{ margin: 0, fontWeight: 600 }}>{msg}</p>}
        <button className="cta">Abrir ticket</button>
      </form>

      <div className="card2">
        <h2>Meus tickets</h2>
        {tickets.length === 0 && <p>Nenhum ticket ainda.</p>}
        {tickets.map((t) => (
          <div key={t.id}>
            <button className="tk" onClick={() => setOpen(open === t.id ? null : t.id)}>
              <small>#{t.number}</small><b>{t.title}</b><small>{TYPES[t.type]}{t.urgency === "urgente" ? " · urgente" : ""}</small>
              <span className={`badge ${t.status}`}>{STATUS[t.status]}</span><small>{when(t.created_at)}</small>
            </button>
            {open === t.id && <Thread t={t} me={me} admin={false} reload={load} />}
          </div>
        ))}
      </div>
    </>
  );
}

function Admin({ me }: { me: string }) {
  const [tab, setTab] = useState("tickets");
  const [tickets, setTickets] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [msg, setMsg] = useState("");
  const [s, setS] = useState({ client_id: "", name: "", url: "", plan: "essencial", delivered_at: "", free_until: "", monthly_limit: "" });

  const load = useCallback(async () => {
    const sb = getSb();
    const [t, si, c, l] = await Promise.all([
      sb.from("tickets").select("*, sites(name), profiles(name)").order("created_at", { ascending: false }),
      sb.from("sites").select("*, profiles(name)").order("created_at", { ascending: false }),
      sb.from("profiles").select("id,name").eq("role", "cliente").order("name"),
      sb.from("leads").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    setTickets(t.data ?? []); setSites(si.data ?? []); setClients(c.data ?? []); setLeads(l.data ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function addSite(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const client_id = s.client_id || clients[0]?.id;
    if (!client_id) { setMsg("Crie primeiro o usuário do cliente em Authentication → Users no Supabase."); return; }
    const { error } = await getSb().from("sites").insert({
      client_id, name: s.name, url: s.url || null, plan: s.plan,
      delivered_at: s.delivered_at || null, free_until: s.free_until || null,
      monthly_limit: s.monthly_limit ? Number(s.monthly_limit) : LIMITS[s.plan] ?? null,
    });
    setMsg(error ? "Erro: " + error.message : "Site cadastrado."); if (!error) { setS({ ...s, name: "", url: "" }); load(); }
  }
  async function leadStatus(id: string, status: string) { await getSb().from("leads").update({ status }).eq("id", id); load(); }

  const list = tickets.filter((t) => !onlyOpen || !["concluido", "cancelado"].includes(t.status));
  return (
    <>
      <div className="tabs">
        {[["tickets", `Tickets (${tickets.filter((t) => !["concluido", "cancelado"].includes(t.status)).length} abertos)`], ["sites", "Sites"], ["leads", "Contatos"]].map(([k, v]) => (
          <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{v}</button>
        ))}
      </div>

      {tab === "tickets" && (
        <div className="card2">
          <label className="inline"><input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} /> Mostrar só os que estão em aberto</label>
          {list.length === 0 && <p>Nenhum ticket.</p>}
          {list.map((t) => (
            <div key={t.id}>
              <button className="tk" onClick={() => setOpen(open === t.id ? null : t.id)}>
                <small>#{t.number}</small><b>{t.title}</b><small>{t.profiles?.name} · {t.sites?.name}</small><small>{TYPES[t.type]}{t.urgency === "urgente" ? " · URGENTE" : ""}</small>
                <span className={`badge ${t.status}`}>{STATUS[t.status]}</span><small>{when(t.created_at)}</small>
              </button>
              {open === t.id && <Thread t={t} me={me} admin reload={load} />}
            </div>
          ))}
        </div>
      )}

      {tab === "sites" && (
        <>
          <form className="contact card2" onSubmit={addSite}>
            <h2>Cadastrar site de cliente</h2>
            <label>Cliente<select value={s.client_id || clients[0]?.id || ""} onChange={(e) => setS({ ...s, client_id: e.target.value })}>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
            <div className="row2">
              <label>Nome do site<input required value={s.name} onChange={(e) => setS({ ...s, name: e.target.value })} /></label>
              <label>Endereço<input value={s.url} onChange={(e) => setS({ ...s, url: e.target.value })} placeholder="https://..." /></label>
            </div>
            <div className="row2">
              <label>Pacote<select value={s.plan} onChange={(e) => setS({ ...s, plan: e.target.value })}><option value="essencial">Essencial</option><option value="profissional">Profissional</option><option value="dinamico">Dinâmico</option><option value="personalizado">Personalizado</option></select></label>
              <label>Alterações por mês (vazio = padrão do pacote)<input type="number" min={0} value={s.monthly_limit} onChange={(e) => setS({ ...s, monthly_limit: e.target.value })} /></label>
            </div>
            <div className="row2">
              <label>Data da entrega<input type="date" value={s.delivered_at} onChange={(e) => setS({ ...s, delivered_at: e.target.value })} /></label>
              <label>Manutenção grátis até<input type="date" value={s.free_until} onChange={(e) => setS({ ...s, free_until: e.target.value })} /></label>
            </div>
            {msg && <p role="status" style={{ margin: 0, fontWeight: 600 }}>{msg}</p>}
            <button className="cta">Cadastrar</button>
          </form>
          <div className="card2">
            <h2>Sites cadastrados</h2>
            {sites.map((x) => (<p key={x.id} style={{ margin: ".3rem 0" }}><b>{x.name}</b> · {x.profiles?.name} · {x.plan} · entrega {day(x.delivered_at)} · grátis até {day(x.free_until)}</p>))}
          </div>
        </>
      )}

      {tab === "leads" && (
        <div className="card2">
          <h2>Contatos recebidos</h2>
          {leads.length === 0 && <p>Nenhum contato ainda (ou falta liberar a leitura da tabela leads no Supabase).</p>}
          {leads.map((l) => (
            <div key={l.id} className="ev">
              <small>{when(l.created_at)} · {l.channel} · origem {l.source}{l.campaign ? ` / ${l.campaign}` : ""}</small>
              <b>{l.name}</b> · {l.phone || "-"} · {l.email || "-"}<br />
              Ramo: {l.ramo || l.niche || "-"} · Modelo: {l.model || "-"}
              {l.message && <><br />{l.message}</>}
              <div style={{ marginTop: ".4rem" }}>
                <select value={l.status} onChange={(e) => leadStatus(l.id, e.target.value)}>{["novo", "conversando", "proposta", "fechado", "perdido"].map((x) => <option key={x}>{x}</option>)}</select>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
