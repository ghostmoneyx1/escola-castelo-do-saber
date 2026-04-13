"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/shared/status-badge";
import { PageHeader } from "@/components/shared/page-header";
import {
  Users,
  ClipboardList,
  BookOpen,
  FileText,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function KPICard({ title, value, subtitle, icon: Icon, loading }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
          <Icon className="h-[18px] w-[18px] text-muted-foreground" />
        </div>
        {subtitle && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="h-3 w-3" />
            {subtitle}
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-muted rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-foreground font-heading tracking-tight">{value}</p>
      )}
      <p className="text-xs text-muted-foreground mt-1 font-medium">{title}</p>
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name) {
  const colors = [
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-violet-600",
    "bg-cyan-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-foreground text-white rounded-lg px-3 py-2 shadow-lg">
        <p className="text-[11px] opacity-70 mb-0.5">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-semibold">
            {prefix}{typeof entry.value === 'number' && prefix === 'R$ '
              ? entry.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function FinanceMiniCard({ icon: Icon, label, value, colorClass, loading }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-border rounded-xl p-4">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
        {loading ? (
          <div className="h-5 w-20 bg-muted rounded animate-pulse mt-0.5" />
        ) : (
          <p className="text-sm font-bold text-foreground font-heading">
            R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeEnrollments: 0,
    totalGrades: 0,
    totalDocuments: 0,
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [enrollmentTrend, setEnrollmentTrend] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [financeSummary, setFinanceSummary] = useState({ received: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient();

      const [studentsRes, enrollmentsRes, gradesRes, documentsRes, recentRes, paymentsRes] =
        await Promise.all([
          supabase.from("students").select("id, created_at", { count: "exact" }),
          supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .eq("status", "Ativa"),
          supabase.from("grades").select("*", { count: "exact", head: true }),
          supabase.from("documents").select("*", { count: "exact", head: true }),
          supabase
            .from("students")
            .select("id, name, status, classes(name)")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase.from("payments").select("status, amount, reference_month, reference_year"),
        ]);

      setStats({
        totalStudents: studentsRes.count || 0,
        activeEnrollments: enrollmentsRes.count || 0,
        totalGrades: gradesRes.count || 0,
        totalDocuments: documentsRes.count || 0,
      });

      setRecentStudents(recentRes.data || []);

      const students = studentsRes.data || [];
      const now = new Date();
      const trend = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const count = students.filter((s) => {
          const created = new Date(s.created_at);
          return created <= new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }).length;
        trend.push({ month: MONTHS_SHORT[d.getMonth()], alunos: count });
      }
      setEnrollmentTrend(trend);

      const payments = paymentsRes.data || [];
      const rev = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthRev = payments
          .filter((p) => p.status === "Pago" && p.reference_month === d.getMonth() + 1 && p.reference_year === d.getFullYear())
          .reduce((acc, p) => acc + Number(p.amount), 0);
        rev.push({ month: MONTHS_SHORT[d.getMonth()], receita: monthRev });
      }
      setRevenueTrend(rev);

      setFinanceSummary({
        received: payments.filter((p) => p.status === "Pago").reduce((a, p) => a + Number(p.amount), 0),
        pending: payments.filter((p) => p.status === "Pendente").reduce((a, p) => a + Number(p.amount), 0),
        overdue: payments.filter((p) => p.status === "Atrasado").reduce((a, p) => a + Number(p.amount), 0),
      });

      setLoading(false);
    }

    loadDashboard();
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral da sua escola"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard
          title="Total de Alunos"
          value={stats.totalStudents}
          subtitle="cadastrados"
          icon={Users}
          loading={loading}
        />
        <KPICard
          title="Matrículas Ativas"
          value={stats.activeEnrollments}
          subtitle="no ano atual"
          icon={ClipboardList}
          loading={loading}
        />
        <KPICard
          title="Notas Lançadas"
          value={stats.totalGrades}
          subtitle="registros"
          icon={BookOpen}
          loading={loading}
        />
        <KPICard
          title="Documentos Gerados"
          value={stats.totalDocuments}
          subtitle="emitidos"
          icon={FileText}
          loading={loading}
        />
      </div>

      {/* Finance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <FinanceMiniCard
          icon={CheckCircle}
          label="Recebido"
          value={financeSummary.received}
          colorClass="bg-emerald-50 text-emerald-600"
          loading={loading}
        />
        <FinanceMiniCard
          icon={Clock}
          label="Pendente"
          value={financeSummary.pending}
          colorClass="bg-amber-50 text-amber-600"
          loading={loading}
        />
        <FinanceMiniCard
          icon={AlertTriangle}
          label="Atrasado"
          value={financeSummary.overdue}
          colorClass="bg-red-50 text-red-600"
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground font-heading">Evolução de Alunos</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 6 meses</p>
            </div>
          </div>
          {loading ? (
            <div className="h-[200px] bg-muted rounded-lg animate-pulse" />
          ) : (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={enrollmentTrend}>
                  <defs>
                    <linearGradient id="dashEnrollGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e40af" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="#1e40af" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="alunos" stroke="#1e40af" strokeWidth={2} fill="url(#dashEnrollGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground font-heading">Receita Mensal</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 6 meses</p>
            </div>
          </div>
          {loading ? (
            <div className="h-[200px] bg-muted rounded-lg animate-pulse" />
          ) : (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => v > 0 ? `${(v / 1000).toFixed(0)}k` : "0"} />
                  <Tooltip content={<CustomTooltip prefix="R$ " />} />
                  <Bar dataKey="receita" fill="#d97706" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Students */}
        <div className="bg-white border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground font-heading">
              Últimos Alunos Cadastrados
            </h3>
          </div>
          <div className="p-2">
            {loading ? (
              <div className="space-y-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-muted animate-pulse shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-28 bg-muted rounded animate-pulse" />
                      <div className="h-2.5 w-16 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentStudents.length === 0 ? (
              <div className="py-10 text-center">
                <Users className="h-5 w-5 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum aluno cadastrado ainda
                </p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg ${getAvatarColor(student.name)} flex items-center justify-center shrink-0`}
                      >
                        <span className="text-white text-[11px] font-semibold">
                          {getInitials(student.name)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {student.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.classes?.name || "Sem turma"}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={student.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground font-heading">
              Atividade Recente
            </h3>
          </div>
          <div className="p-5">
            <div className="py-10 text-center">
              <Clock className="h-5 w-5 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                As atividades aparecerão aqui conforme você usar o sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
