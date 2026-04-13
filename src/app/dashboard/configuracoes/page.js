"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  School,
  BookOpen,
  MapPin,
  User,
  Lock,
  Save,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  GripVertical,
  Eye,
  EyeOff,
  Check,
  X,
  Building2,
  Phone,
  Mail,
  FileText,
  Globe,
  Calendar,
  DollarSign,
  Shield,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { SHIFTS } from "@/lib/constants";

/* ─── Tab Navigation ─── */
const TABS = [
  { id: "escola", label: "Perfil da Escola", icon: School },
  { id: "disciplinas", label: "Disciplinas", icon: BookOpen },
  { id: "unidades", label: "Unidades", icon: MapPin },
  { id: "ano-letivo", label: "Ano Letivo", icon: Calendar },
  { id: "conta", label: "Minha Conta", icon: User },
];

/* ─── School Profile Tab ─── */
function SchoolProfileTab() {
  const [profile, setProfile] = useState({
    name: "Escola Castelo do Saber",
    cnpj: "",
    phone: "",
    email: "",
    address: "",
    city: "Salvador",
    state: "BA",
    cep: "",
    website: "",
    director: "",
    foundation_year: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("school_profile");
    if (saved) {
      try {
        setProfile((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch {}
    }
    setLoaded(true);
  }, []);

  async function handleSave() {
    setSaving(true);
    localStorage.setItem("school_profile", JSON.stringify(profile));
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Perfil da escola salvo com sucesso!");
  }

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      {/* School Info Card */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">Informações da Escola</h3>
            <p className="text-xs text-muted-foreground">Dados que aparecem nos documentos e relatórios</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium">Nome da Escola</Label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">CNPJ</Label>
              <Input
                value={profile.cnpj}
                onChange={(e) => setProfile((p) => ({ ...p, cnpj: e.target.value }))}
                placeholder="00.000.000/0001-00"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Diretor(a)</Label>
              <Input
                value={profile.director}
                onChange={(e) => setProfile((p) => ({ ...p, director: e.target.value }))}
                placeholder="Nome do diretor(a)"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Telefone</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                placeholder="(71) 99999-0000"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">E-mail</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                placeholder="contato@escola.com.br"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Website</Label>
              <Input
                value={profile.website}
                onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                placeholder="www.escola.com.br"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ano de Fundação</Label>
              <Input
                value={profile.foundation_year}
                onChange={(e) => setProfile((p) => ({ ...p, foundation_year: e.target.value }))}
                placeholder="2010"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">Endereço</h3>
            <p className="text-xs text-muted-foreground">Localização da sede principal</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-3 space-y-2">
              <Label className="text-sm font-medium">Endereço Completo</Label>
              <Input
                value={profile.address}
                onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                placeholder="Rua, número, bairro"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Cidade</Label>
              <Input
                value={profile.city}
                onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Estado</Label>
              <Input
                value={profile.state}
                onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">CEP</Label>
              <Input
                value={profile.cep}
                onChange={(e) => setProfile((p) => ({ ...p, cep: e.target.value }))}
                placeholder="00000-000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="p-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Descrição / Observações</Label>
            <Textarea
              value={profile.description}
              onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder="Informações adicionais sobre a escola..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}

/* ─── Subjects Tab ─── */
function SubjectsTab() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", sort_order: "", is_active: true });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadSubjects = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("subjects").select("*").order("sort_order");
    setSubjects(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  function openNew() {
    setEditing(null);
    setForm({ name: "", sort_order: String(subjects.length + 1), is_active: true });
    setDialog(true);
  }

  function openEdit(subject) {
    setEditing(subject);
    setForm({ name: subject.name, sort_order: String(subject.sort_order || ""), is_active: subject.is_active });
    setDialog(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name.trim(),
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };
    if (editing) {
      await supabase.from("subjects").update(payload).eq("id", editing.id);
      toast.success("Disciplina atualizada!");
    } else {
      await supabase.from("subjects").insert(payload);
      toast.success("Disciplina cadastrada!");
    }
    setDialog(false);
    setSaving(false);
    loadSubjects();
  }

  async function handleDelete(id) {
    const supabase = createClient();
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error) {
      toast.error("Não é possível excluir: disciplina em uso");
    } else {
      toast.success("Disciplina excluída");
    }
    setDeleteConfirm(null);
    loadSubjects();
  }

  async function toggleActive(subject) {
    const supabase = createClient();
    await supabase.from("subjects").update({ is_active: !subject.is_active }).eq("id", subject.id);
    loadSubjects();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-foreground">Disciplinas</h3>
              <p className="text-xs text-muted-foreground">{subjects.length} disciplina{subjects.length !== 1 ? "s" : ""} cadastrada{subjects.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Button onClick={openNew} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Nova Disciplina
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Nenhuma disciplina cadastrada</p>
            <Button onClick={openNew} size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Cadastrar Disciplina
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {subjects.map((subject, index) => (
              <div key={subject.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${subject.is_active ? "text-foreground" : "text-muted-foreground line-through"}`}>
                    {subject.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(subject)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors ${
                      subject.is_active
                        ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
                    }`}
                  >
                    {subject.is_active ? "Ativa" : "Inativa"}
                  </button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(subject)} className="h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(subject.id)} className="h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subject Dialog */}
      <Dialog open={dialog} onOpenChange={(v) => !saving && setDialog(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <BookOpen className="h-5 w-5 text-violet-600" />
              {editing ? "Editar Disciplina" : "Nova Disciplina"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nome da Disciplina *</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Matemática" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ordem de Exibição</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <div className="flex items-center gap-3 h-10 mt-1">
                  <Switch checked={form.is_active} onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))} />
                  <span className="text-sm font-medium text-muted-foreground">{form.is_active ? "Ativa" : "Inativa"}</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDialog(false)} disabled={saving} variant="outline">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()} size="sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Tem certeza que deseja excluir esta disciplina? Esta ação não poderá ser desfeita.</p>
          <DialogFooter>
            <Button onClick={() => setDeleteConfirm(null)} variant="outline">Cancelar</Button>
            <Button onClick={() => handleDelete(deleteConfirm)} className="bg-red-600 hover:bg-red-700 text-white" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Units Tab ─── */
function UnitsTab() {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", address: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [classesCount, setClassesCount] = useState({});

  const loadUnits = useCallback(async () => {
    const supabase = createClient();
    const [unitsRes, classesRes] = await Promise.all([
      supabase.from("units").select("*").order("name"),
      supabase.from("classes").select("unit_id").eq("is_active", true),
    ]);
    setUnits(unitsRes.data || []);
    const counts = {};
    (classesRes.data || []).forEach((c) => {
      if (c.unit_id) counts[c.unit_id] = (counts[c.unit_id] || 0) + 1;
    });
    setClassesCount(counts);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  function openNew() {
    setEditing(null);
    setForm({ name: "", address: "" });
    setDialog(true);
  }

  function openEdit(unit) {
    setEditing(unit);
    setForm({ name: unit.name, address: unit.address || "" });
    setDialog(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const payload = { name: form.name.trim(), address: form.address.trim() || null };
    if (editing) {
      await supabase.from("units").update(payload).eq("id", editing.id);
      toast.success("Unidade atualizada!");
    } else {
      await supabase.from("units").insert(payload);
      toast.success("Unidade cadastrada!");
    }
    setDialog(false);
    setSaving(false);
    loadUnits();
  }

  async function handleDelete(id) {
    const supabase = createClient();
    const { error } = await supabase.from("units").delete().eq("id", id);
    if (error) {
      toast.error("Não é possível excluir: unidade em uso");
    } else {
      toast.success("Unidade excluída");
    }
    setDeleteConfirm(null);
    loadUnits();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-foreground">Unidades Escolares</h3>
              <p className="text-xs text-muted-foreground">{units.length} unidade{units.length !== 1 ? "s" : ""} cadastrada{units.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Button onClick={openNew} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Nova Unidade
          </Button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : units.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
              <MapPin className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Nenhuma unidade cadastrada</p>
            <Button onClick={openNew} size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Cadastrar Unidade
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {units.map((unit) => (
              <div key={unit.id} className="rounded-2xl bg-muted/40 border border-border p-5 hover:border-blue-200/50 transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{unit.name}</p>
                      {unit.address && (
                        <p className="text-xs text-muted-foreground mt-0.5">{unit.address}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                          {classesCount[unit.id] || 0} turma{(classesCount[unit.id] || 0) !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(unit)} className="h-8 w-8 p-0 rounded-lg">
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(unit.id)} className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unit Dialog */}
      <Dialog open={dialog} onOpenChange={(v) => !saving && setDialog(v)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
              <MapPin className="h-5 w-5 text-emerald-600" />
              {editing ? "Editar Unidade" : "Nova Unidade"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nome da Unidade *</Label>
              <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Unidade Central" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Endereço</Label>
              <Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} placeholder="Rua, número, bairro" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDialog(false)} disabled={saving} variant="outline">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.name.trim()} size="sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Tem certeza que deseja excluir esta unidade?</p>
          <DialogFooter>
            <Button onClick={() => setDeleteConfirm(null)} variant="outline">Cancelar</Button>
            <Button onClick={() => handleDelete(deleteConfirm)} className="bg-red-600 hover:bg-red-700 text-white" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ─── Academic Year Tab ─── */
function AcademicYearTab() {
  const [config, setConfig] = useState({
    year: String(new Date().getFullYear()),
    start_date: "",
    end_date: "",
    default_payment: "500.00",
    payment_due_day: "10",
    units_count: "4",
    enable_attendance: true,
    enable_grades: true,
    enable_financeiro: true,
    enable_documents: true,
  });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("academic_config");
    if (saved) {
      try {
        setConfig((prev) => ({ ...prev, ...JSON.parse(saved) }));
      } catch {}
    }
    setLoaded(true);
  }, []);

  async function handleSave() {
    setSaving(true);
    localStorage.setItem("academic_config", JSON.stringify(config));
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast.success("Configurações do ano letivo salvas!");
  }

  if (!loaded) return null;

  return (
    <div className="space-y-6">
      {/* Year Settings */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">Período Letivo</h3>
            <p className="text-xs text-muted-foreground">Defina o ano letivo atual e suas datas</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ano Letivo</Label>
              <Input value={config.year} onChange={(e) => setConfig((p) => ({ ...p, year: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Início das Aulas</Label>
              <Input type="date" value={config.start_date} onChange={(e) => setConfig((p) => ({ ...p, start_date: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Término das Aulas</Label>
              <Input type="date" value={config.end_date} onChange={(e) => setConfig((p) => ({ ...p, end_date: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quantidade de Unidades</Label>
              <Select value={config.units_count} onValueChange={(v) => setConfig((p) => ({ ...p, units_count: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Unidades</SelectItem>
                  <SelectItem value="3">3 Unidades</SelectItem>
                  <SelectItem value="4">4 Unidades</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Defaults */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">Padrões Financeiros</h3>
            <p className="text-xs text-muted-foreground">Valores padrão para mensalidades</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Mensalidade Padrão (R$)</Label>
              <Input type="number" step="0.01" value={config.default_payment} onChange={(e) => setConfig((p) => ({ ...p, default_payment: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Dia de Vencimento</Label>
              <Input type="number" min="1" max="28" value={config.payment_due_day} onChange={(e) => setConfig((p) => ({ ...p, payment_due_day: e.target.value }))} />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Settings className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">Módulos do Sistema</h3>
            <p className="text-xs text-muted-foreground">Ative ou desative funcionalidades</p>
          </div>
        </div>
        <div className="divide-y divide-border">
          {[
            { key: "enable_grades", label: "Boletins e Notas", desc: "Lançamento de notas por unidade e disciplina", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
            { key: "enable_attendance", label: "Controle de Frequência", desc: "Registro diário de presença por turma", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-50" },
            { key: "enable_financeiro", label: "Gestão Financeira", desc: "Controle de mensalidades e pagamentos", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
            { key: "enable_documents", label: "Emissão de Documentos", desc: "Geração de históricos e atestados em PDF", icon: FileText, color: "text-violet-600", bg: "bg-violet-50" },
          ].map((feature) => (
            <div key={feature.key} className="flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${feature.bg} flex items-center justify-center`}>
                  <feature.icon className={`h-4 w-4 ${feature.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
              <Switch
                checked={config[feature.key]}
                onCheckedChange={(v) => setConfig((p) => ({ ...p, [feature.key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
}

/* ─── Account Tab ─── */
function AccountTab() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    loadUser();
  }, []);

  async function handleChangePassword() {
    setPasswordError("");
    if (passwords.new.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordError("As senhas não coincidem");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: passwords.new });
    if (error) {
      setPasswordError("Erro ao alterar senha: " + error.message);
    } else {
      toast.success("Senha alterada com sucesso!");
      setPasswords({ current: "", new: "", confirm: "" });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">Perfil do Administrador</h3>
            <p className="text-xs text-muted-foreground">Informações da sua conta</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#004ac6] to-[#2563eb] flex items-center justify-center">
              <span className="text-white text-xl font-bold">AD</span>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Administrador</p>
              <p className="text-sm text-muted-foreground">{user?.email || "—"}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">
                  <Shield className="h-2.5 w-2.5" />
                  Admin
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Criado em {user?.created_at ? new Date(user.created_at).toLocaleDateString("pt-BR") : "—"}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">E-mail</p>
              <p className="text-sm font-semibold text-foreground">{user?.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Último Login</p>
              <p className="text-sm font-semibold text-foreground">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("pt-BR") : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Lock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-foreground">Alterar Senha</h3>
            <p className="text-xs text-muted-foreground">Recomendamos trocar sua senha periodicamente</p>
          </div>
        </div>
        <div className="p-6">
          <div className="max-w-md space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nova Senha</Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                  className="pr-11"
                />
                <button type="button" onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground">
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  placeholder="Repita a nova senha"
                  className="pr-11"
                />
                <button type="button" onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground">
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {passwords.new && passwords.confirm && passwords.new === passwords.confirm && (
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                <Check className="h-3.5 w-3.5" />
                Senhas coincidem
              </div>
            )}
            {passwordError && (
              <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 font-medium ring-1 ring-red-100">
                {passwordError}
              </div>
            )}
            <Button
              onClick={handleChangePassword}
              disabled={saving || !passwords.new || !passwords.confirm}
              size="sm"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
              {saving ? "Alterando..." : "Alterar Senha"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Settings Page ─── */
export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("escola");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        subtitle="Gerencie as configurações do sistema"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-border rounded-2xl overflow-hidden lg:sticky lg:top-24">
            <nav className="p-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-50 to-blue-50/50 text-blue-700 font-bold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === tab.id ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-blue-600" : "text-muted-foreground"}`} />
                  </div>
                  <span className="flex-1 text-left">{tab.label}</span>
                  {activeTab === tab.id && (
                    <ChevronRight className="h-4 w-4 text-blue-400" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "escola" && <SchoolProfileTab />}
          {activeTab === "disciplinas" && <SubjectsTab />}
          {activeTab === "unidades" && <UnitsTab />}
          {activeTab === "ano-letivo" && <AcademicYearTab />}
          {activeTab === "conta" && <AccountTab />}
        </div>
      </div>
    </div>
  );
}
