"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Users,
  GraduationCap,
  DollarSign,
  BookOpen,
  Loader2,
  TrendingUp,
  TrendingDown,
  Bus,
  AlertTriangle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const MONTHS_SHORT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function StatCard({ icon: Icon, label, value, color, iconBg }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 bg-muted/20 hover:bg-muted/40 transition-colors rounded-xl border border-border/50">
      <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground text-center">{label}</p>
    </div>
  );
}

function FinanceCard({ title, value, subtitle, color, bgGradient, textColor, icon: Icon }) {
  return (
    <div className={`${bgGradient} rounded-2xl p-6 relative overflow-hidden`}>
      <div className="relative z-10">
        <p className={`text-xs font-bold uppercase tracking-wider ${textColor} opacity-80`}>{title}</p>
        <p className={`text-3xl font-bold ${textColor} mt-2`}>
          R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </p>
        {subtitle && (
          <p className={`text-xs ${textColor} opacity-70 mt-2 flex items-center gap-1`}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="absolute right-4 bottom-4 opacity-10">
        <Icon className={`h-20 w-20 ${textColor}`} />
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, prefix = "" }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl px-4 py-3 border border-border">
        <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
            {prefix}{typeof entry.value === 'number' && prefix === 'R$ '
              ? entry.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
              : entry.value}
            {entry.name !== "value" && ` ${entry.name}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function RelatoriosPage() {
  const [timeFilter, setTimeFilter] = useState("Todo o período");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const loadReport = useCallback(async function () {
    setLoading(true);
    const supabase = createClient();

    const [studentsRes, classesRes, paymentsRes, enrollmentsRes] = await Promise.all([
      supabase.from("students").select("class_id, status, enrollment_type, uses_transport, created_at"),
      supabase.from("classes").select("*, units(name)").eq("is_active", true).order("grade"),
      supabase.from("payments").select("student_id, status, amount, reference_month, reference_year, created_at"),
      supabase.from("enrollments").select("status, created_at").eq("year", new Date().getFullYear()),
    ]);

    const allStudents = studentsRes.data || [];
    const allPayments = paymentsRes.data || [];
    const allEnrollments = enrollmentsRes.data || [];
    const classes = classesRes.data || [];

    // Formatar Filtro de Tempo
    const now = new Date();
    let startDate = new Date(0);
    let isAllTime = true;
    if (timeFilter === "30d") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      isAllTime = false;
    } else if (timeFilter === "6m") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      isAllTime = false;
    } else if (timeFilter === "1y") {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      isAllTime = false;
    }

    const inPeriod = (dateStr) => new Date(dateStr) >= startDate;

    // Aplicando filtro (apenas para estatísticas de fluxo, turmas ativas mostram estrutura real)
    const students = isAllTime ? allStudents : allStudents.filter(s => inPeriod(s.created_at));
    const payments = isAllTime ? allPayments : allPayments.filter(p => inPeriod(p.created_at));
    const enrollments = isAllTime ? allEnrollments : allEnrollments.filter(e => inPeriod(e.created_at));

    // Tendência Histórica (Sempre em 6 meses visuais para perspectiva)
    const enrollmentTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStudents = allStudents.filter((s) => {
        const created = new Date(s.created_at);
        return created <= new Date(d.getFullYear(), d.getMonth() + 1, 0);
      }).length;
      enrollmentTrend.push({
        month: MONTHS_SHORT[d.getMonth()],
        alunos: monthStudents,
      });
    }

    const revenueTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthRevenue = allPayments
        .filter((p) => p.status === "Pago" && p.reference_month === d.getMonth() + 1 && p.reference_year === d.getFullYear())
        .reduce((acc, p) => acc + Number(p.amount), 0);
      revenueTrend.push({
        month: MONTHS_SHORT[d.getMonth()],
        receita: monthRevenue,
      });
    }

    // Detalhamento de Turmas
    const studentsByClass = {};
    const activeAllStudents = allStudents.filter((s) => s.status === "Ativo");
    activeAllStudents.forEach((s) => {
      if (!s.class_id) return;
      if (!studentsByClass[s.class_id]) studentsByClass[s.class_id] = [];
      studentsByClass[s.class_id].push(s);
    });

    const classesData = classes.map((c) => ({
      ...c,
      students: studentsByClass[c.id] || [],
      totalStudents: (studentsByClass[c.id] || []).length,
      particular: (studentsByClass[c.id] || []).filter((s) => s.enrollment_type === "Particular").length,
      projeto: (studentsByClass[c.id] || []).filter((s) => s.enrollment_type === "Projeto").length,
      transport: (studentsByClass[c.id] || []).filter((s) => s.uses_transport).length,
    }));

    // Métricas
    const particularCount = students.filter((s) => s.enrollment_type === "Particular").length;
    const bolsistaCount = students.filter((s) => s.enrollment_type === "Bolsista").length;
    const otherCount = students.length - particularCount - bolsistaCount;
    const typeDistribution = [
      { name: "Particular", value: particularCount, color: "#2563eb" },
      { name: "Bolsista", value: bolsistaCount, color: "#f59e0b" },
    ];
    if (otherCount > 0) typeDistribution.push({ name: "Outros", value: otherCount, color: "#94a3b8" });

    const inactiveCount = students.filter((s) => s.status === "Inativo" || s.status === "Transferido").length;
    const evasionRate = students.length > 0 ? Math.round((inactiveCount / students.length) * 100) : 0;

    const overduePayments = payments.filter((p) => p.status === "Atrasado");
    const overdueStudentIds = new Set(overduePayments.map((p) => p.student_id));

    setData({
      totalStudents: students.length,
      activeStudents: students.filter((s) => s.status === "Ativo").length,
      evasionRate,
      totalClasses: classes.length,
      activeEnrollments: enrollments.filter((e) => e.status === "Ativa").length,
      particularStudents: particularCount,
      bolsistaStudents: bolsistaCount,
      transportStudents: students.filter((s) => s.uses_transport).length,
      totalRevenue: payments.filter((p) => p.status === "Pago").reduce((a, p) => a + Number(p.amount), 0),
      pendingRevenue: payments.filter((p) => p.status === "Pendente").reduce((a, p) => a + Number(p.amount), 0),
      overdueRevenue: overduePayments.reduce((a, p) => a + Number(p.amount), 0),
      overdueCount: overdueStudentIds.size,
      enrollmentTrend,
      revenueTrend,
      typeDistribution,
      classes: classesData,
    });

    setLoading(false);
  }, [timeFilter]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão Consolidada"
        subtitle="Relatórios acadêmicos e financeiros interativos"
      >
        <Select
          value={timeFilter}
          onValueChange={setTimeFilter}
        >
          <SelectTrigger className="bg-white border-border py-3 px-4 h-auto min-w-[200px] text-sm font-semibold">
            <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="6m">Últimos 6 meses</SelectItem>
            <SelectItem value="1y">Último ano</SelectItem>
            <SelectItem value="Todo o período">Todo o período</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* KPI Strip */}
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard icon={Users} label="Total Alunos" value={data.totalStudents} color="text-blue-600" iconBg="bg-blue-50" />
              <StatCard icon={TrendingDown} label="Evasão" value={`${data.evasionRate}%`} color="text-red-500" iconBg="bg-red-50" />
              <StatCard icon={GraduationCap} label="Turmas" value={data.totalClasses} color="text-amber-500" iconBg="bg-amber-50" />
              <StatCard icon={BookOpen} label="Matrículas" value={data.activeEnrollments} color="text-emerald-500" iconBg="bg-emerald-50" />
              <StatCard icon={Bus} label="Transporte" value={data.transportStudents} color="text-violet-500" iconBg="bg-violet-50" />
              <StatCard icon={Users} label="Projeto (%)" value={`${data.projetoStudents > 0 && data.totalStudents > 0 ? Math.round((data.projetoStudents / data.totalStudents) * 100) : 0}%`} color="text-indigo-500" iconBg="bg-indigo-50" />
            </div>
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FinanceCard
              title="Recebido"
              value={data.totalRevenue}
              subtitle={
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  em relação ao mês anterior
                </span>
              }
              bgGradient="bg-gradient-to-br from-emerald-50 to-emerald-100/50"
              textColor="text-emerald-700"
              icon={DollarSign}
            />
            <FinanceCard
              title="Pendente"
              value={data.pendingRevenue}
              subtitle="Aguardando liquidação bancária"
              bgGradient="bg-gradient-to-br from-amber-50 to-amber-100/50"
              textColor="text-amber-700"
              icon={DollarSign}
            />
            <FinanceCard
              title="Atrasado"
              value={data.overdueRevenue}
              subtitle={data.overdueCount > 0 ? `${data.overdueCount} aluno${data.overdueCount > 1 ? 's' : ''} com mais de 30 dias` : null}
              bgGradient="bg-gradient-to-br from-red-50 to-red-100/50"
              textColor="text-red-700"
              icon={AlertTriangle}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Trend Chart */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">Evolução de Matrículas</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Últimos 6 meses</p>
                </div>
                {data.enrollmentTrend.length >= 2 && (
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    {data.enrollmentTrend[data.enrollmentTrend.length - 1].alunos > 0 && data.enrollmentTrend[0].alunos > 0
                      ? `+${Math.round(((data.enrollmentTrend[data.enrollmentTrend.length - 1].alunos - data.enrollmentTrend[0].alunos) / data.enrollmentTrend[0].alunos) * 100)}%`
                      : "+0%"
                    }
                  </div>
                )}
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.enrollmentTrend}>
                    <defs>
                      <linearGradient id="enrollGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="alunos" stroke="#2563eb" strokeWidth={2.5} fill="url(#enrollGradient)" name="Alunos" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">Fluxo de Receita</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Últimos 6 meses (R$ mil)</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <DollarSign className="h-3 w-3" />
                  R$ {(data.totalRevenue / 1000).toFixed(1)}k
                </div>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip prefix="R$ " />} />
                    <Line type="monotone" dataKey="receita" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }} name="Receita" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Row: Pie + Class Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Type Distribution Pie */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h3 className="font-heading text-base font-bold text-foreground mb-6">Tipo de Matrícula</h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.typeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {data.typeDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => <span className="text-xs font-medium text-muted-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Class Bar Chart */}
            <div className="bg-white rounded-2xl border border-border p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">Alunos por Turma</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Distribuição nas turmas ativas</p>
                </div>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.classes.map((c) => ({
                    name: c.name || c.grade,
                    alunos: (data.classes.find((cl) => cl.id === c.id)?.students || []).length || 0,
                  })).slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="alunos" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={32} name="Alunos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white border border-border rounded-xl overflow-hidden mt-6">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-foreground">Detalhamento por Turma</h3>
              <Button variant="outline" size="sm">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Exportar PDF
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 whitespace-nowrap">Turma</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 whitespace-nowrap">Série</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 whitespace-nowrap">Unidade</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-center whitespace-nowrap">Total</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-center whitespace-nowrap">Particular</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-center whitespace-nowrap">Projeto</TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-5 py-3 text-center whitespace-nowrap">Transporte</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.classes.map((cls) => (
                    <TableRow key={cls.id} className="hover:bg-muted/30 transition-colors border-b border-border">
                      <TableCell className="px-5 py-3.5 text-sm font-semibold text-foreground whitespace-nowrap">{cls.name}</TableCell>
                      <TableCell className="px-5 py-3.5 whitespace-nowrap">
                        <span className="text-xs font-bold uppercase bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">{cls.grade}</span>
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-sm font-medium text-muted-foreground whitespace-nowrap">{cls.units?.name || "—"}</TableCell>
                      <TableCell className="px-5 py-3.5 text-center text-sm font-bold text-foreground whitespace-nowrap">{cls.totalStudents}</TableCell>
                      <TableCell className="px-5 py-3.5 text-center text-sm font-medium text-muted-foreground whitespace-nowrap">{cls.particular}</TableCell>
                      <TableCell className="px-5 py-3.5 text-center text-sm font-medium text-muted-foreground whitespace-nowrap">{cls.projeto}</TableCell>
                      <TableCell className="px-5 py-3.5 text-center text-sm font-medium text-muted-foreground whitespace-nowrap">{cls.transport}</TableCell>
                    </TableRow>
                  ))}
                  {data.classes.length > 0 && (
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-t-2 border-gray-200">
                      <TableCell className="px-5 py-3.5 text-sm font-bold text-foreground whitespace-nowrap" colSpan={3}>Total Geral Ativo</TableCell>
                      <TableCell className="px-5 py-3.5 text-center text-sm font-bold text-foreground whitespace-nowrap">{data.classes.reduce((a, c) => a + c.totalStudents, 0)}</TableCell>
                      <TableCell className="px-5 py-3.5 text-center text-sm font-bold text-muted-foreground whitespace-nowrap">{data.classes.reduce((a, c) => a + c.particular, 0)}</TableCell>
                      <TableCell className="px-5 py-3.5 text-center text-sm font-bold text-muted-foreground whitespace-nowrap">{data.classes.reduce((a, c) => a + c.projeto, 0)}</TableCell>
                      <TableCell className="px-5 py-3.5 text-center text-sm font-bold text-muted-foreground whitespace-nowrap">{data.classes.reduce((a, c) => a + c.transport, 0)}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
