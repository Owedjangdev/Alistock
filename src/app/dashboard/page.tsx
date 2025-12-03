"use client";
import Wrapper from "@/components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { readProducts, readTransactions, getTransactionStats, getGiveStats } from "../action";
import { Package, TrendingUp, TrendingDown, Heart, Boxes, AlertTriangle, CalendarDays, Activity, PieChart } from "lucide-react";
import { Product } from "../../../type";

type DailyPoint = { date: string; add: number; remove: number; give: number };

const Page = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [loading, setLoading] = useState(true);
   const [products, setProducts] = useState<Product[]>([]);
   const [transactions, setTransactions] = useState<Array<{ id: string; type: string; quantity: number; createdAt: string; productName: string; categoryName?: string; productUnit: string }>>([]);
   const [txnStats, setTxnStats] = useState<{ totalTransactions: number; addTransactions: number; removeTransactions: number; totalQuantityAdded: number; totalQuantityRemoved: number; giveTransactions: number; totalQuantityGiven: number } | null | { error: any }>(null);
   const [giveStats, setGiveStats] = useState<{ totalGiveTransactions: number; totalQuantityGiven: number; uniqueRecipients: number } | null | { error: any }>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>(""); // "ADD" | "REMOVE" | "GIVE" | ""
  const [page, setPage] = useState<number>(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchAll = async () => {
      if (!email) return;
      try {
        setLoading(true);
        const [p, t, ts, gs] = await Promise.all([
          readProducts(email),
          readTransactions(email),
          getTransactionStats(email),
          getGiveStats(email)
        ]);
        if (p) setProducts(p);
         if (t) setTransactions(t);
         if (ts && !('error' in ts)) setTxnStats(ts);
         if (gs && !('error' in gs)) setGiveStats(gs);
      } catch {
        // noop; handled by UI states
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [email]);

  const kpis = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((s, p) => s + (p.quantity || 0), 0);
    const lowStock = products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 5).length;
    return { totalProducts, totalStock, lowStock };
  }, [products]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { if (p.categoryName) set.add(p.categoryName); });
    return Array.from(set.values()).sort();
  }, [products]);

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];
    if (categoryFilter) {
      list = list.filter((t) => (t.categoryName || "") === categoryFilter);
    }
    if (typeFilter) {
      list = list.filter((t) => t.type === typeFilter);
    }
    if (startDate) {
      const s = new Date(startDate);
      list = list.filter((t) => new Date(t.createdAt) >= s);
    }
    if (endDate) {
      const e = new Date(endDate);
      // inclure la fin de journée
      e.setHours(23, 59, 59, 999);
      list = list.filter((t) => new Date(t.createdAt) <= e);
    }
    return list;
  }, [transactions, categoryFilter, startDate, endDate, typeFilter]);

  const recentTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredTransactions.length / pageSize)), [filteredTransactions.length]);

  const dailySeries: DailyPoint[] = useMemo(() => {
    const map = new Map<string, DailyPoint>();
    for (const tx of filteredTransactions) {
      const d = new Date(tx.createdAt);
      const key = d.toISOString().slice(0, 10);
      const entry = map.get(key) || { date: key, add: 0, remove: 0, give: 0 };
      if (tx.type === "ADD") entry.add += tx.quantity;
      else if (tx.type === "REMOVE") entry.remove += tx.quantity;
      else if (tx.type === "GIVE") entry.give += tx.quantity;
      map.set(key, entry);
    }
    const out = Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
    return out.slice(-14); // last 14 days
  }, [filteredTransactions]);

  const maxY = useMemo(() => {
    const maxVal = dailySeries.reduce((m, p) => Math.max(m, p.add, p.remove, p.give), 0);
    return Math.max(1, maxVal);
  }, [dailySeries]);

  const localTxnSummary = useMemo(() => {
    const addTransactions = filteredTransactions.filter((t) => t.type === "ADD").length;
    const removeTransactions = filteredTransactions.filter((t) => t.type === "REMOVE").length;
    const giveTransactions = filteredTransactions.filter((t) => t.type === "GIVE").length;
    const totalQuantityAdded = filteredTransactions.filter((t) => t.type === "ADD").reduce((s, t) => s + t.quantity, 0);
    const totalQuantityRemoved = filteredTransactions.filter((t) => t.type === "REMOVE").reduce((s, t) => s + t.quantity, 0);
    const totalQuantityGiven = filteredTransactions.filter((t) => t.type === "GIVE").reduce((s, t) => s + t.quantity, 0);
    return { addTransactions, removeTransactions, giveTransactions, totalQuantityAdded, totalQuantityRemoved, totalQuantityGiven };
  }, [filteredTransactions]);

  const exportCsv = () => {
    const rows = [
      ["id", "type", "productName", "categoryName", "quantity", "createdAt"],
      ...filteredTransactions.map((t: any) => [t.id, t.type, t.productName, t.categoryName, String(t.quantity), new Date(t.createdAt).toISOString()]),
    ];
    const csv = rows.map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_export_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryDistribution = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      const key = p.categoryName || "Sans catégorie";
      map.set(key, (map.get(key) || 0) + (p.quantity || 0));
    }
    const list = Array.from(map.entries()).map(([name, qty]) => ({ name, qty }));
    const total = list.reduce((s, x) => s + x.qty, 0) || 1;
    return { list, total };
  }, [products]);

  const topDonatedProducts = useMemo(() => {
    const map = new Map<string, { name: string; qty: number }>();
    for (const t of filteredTransactions) {
      if (t.type !== "GIVE") continue;
      const key = t.productName;
      map.set(key, { name: key, qty: (map.get(key)?.qty || 0) + t.quantity });
    }
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [filteredTransactions]);

  const veryLowStock = useMemo(() => {
    return products.filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) <= 2)
      .sort((a, b) => (a.quantity || 0) - (b.quantity || 0))
      .slice(0, 6);
  }, [products]);

  if (loading) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Mise à jour: {new Date().toLocaleString("fr-FR")}
          </div>
        </div>

        {/* Filtres */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
            <div>
              <div className="text-xs mb-1">Catégorie</div>
              <select className="select select-bordered w-full" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="">Toutes</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs mb-1">Type</div>
              <select className="select select-bordered w-full" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">Tous</option>
                <option value="ADD">Ajouts</option>
                <option value="REMOVE">Retraits</option>
                <option value="GIVE">Dons</option>
              </select>
            </div>
            <div>
              <div className="text-xs mb-1">Date début</div>
              <input type="date" className="input input-bordered w-full" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <div className="text-xs mb-1">Date fin</div>
              <input type="date" className="input input-bordered w-full" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <button className="btn btn-outline w-full" onClick={() => { setStartDate(""); setEndDate(""); setCategoryFilter(""); setTypeFilter(""); setPage(1); }}>Réinitialiser</button>
            </div>
            <div className="flex items-end">
              <button className="btn btn-primary w-full" onClick={exportCsv}>Exporter CSV</button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Produits</p>
                  <p className="text-2xl font-bold">{kpis.totalProducts}</p>
                </div>
                <Boxes className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock total</p>
                  <p className="text-2xl font-bold text-success">{kpis.totalStock}</p>
                </div>
                <Package className="w-8 h-8 text-success" />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Stock faible (&lt; 5)</p>
                  <p className="text-2xl font-bold text-warning">{kpis.lowStock}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dons</p>
                  <p className="text-2xl font-bold text-red-500">{(giveStats && !('error' in giveStats)) ? giveStats.totalGiveTransactions : 0}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Mouvements (14 jours)</h3>
                <div className="text-xs text-gray-500 flex gap-3">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-success inline-block rounded"/> Ajouts</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-error inline-block rounded"/> Retraits</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 inline-block rounded"/> Dons</span>
                </div>
              </div>
              <svg viewBox="0 0 320 140" className="w-full">
                <g transform="translate(30,10)">
                  <line x1="0" y1="120" x2="260" y2="120" stroke="#e5e7eb" />
                  {/* Add bars per day */}
                  {dailySeries.map((pt, i) => {
                    const x = i * (260 / Math.max(1, dailySeries.length));
                    const addH = (pt.add / maxY) * 100;
                    const removeH = (pt.remove / maxY) * 100;
                    const giveH = (pt.give / maxY) * 100;
                    const barW = 6;
                    return (
                      <g key={pt.date}>
                        <rect x={x + 0} y={120 - addH} width={barW} height={addH} fill="#16a34a" rx="2" />
                        <rect x={x + 8} y={120 - removeH} width={barW} height={removeH} fill="#ef4444" rx="2" />
                        <rect x={x + 16} y={120 - giveH} width={barW} height={giveH} fill="#dc2626" rx="2" />
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Résumé Transactions</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border">
                  <div className="text-xs text-gray-500 mb-1">Ajouts</div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <div className="text-xl font-bold text-success">{localTxnSummary.addTransactions}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Qté: {localTxnSummary.totalQuantityAdded}</div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-xs text-gray-500 mb-1">Retraits</div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-error" />
                    <div className="text-xl font-bold text-error">{localTxnSummary.removeTransactions}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Qté: {localTxnSummary.totalQuantityRemoved}</div>
                </div>
                <div className="p-3 rounded-lg border">
                  <div className="text-xs text-gray-500 mb-1">Dons</div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <div className="text-xl font-bold text-red-500">{localTxnSummary.giveTransactions}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Qté: {localTxnSummary.totalQuantityGiven}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extra charts and lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Category distribution */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold flex items-center gap-2"><PieChart className="w-5 h-5"/>Répartition par catégories</h3>
              </div>
              {categoryDistribution.list.length === 0 ? (
                <div className="text-sm text-gray-500">Aucune donnée</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <svg viewBox="0 0 120 120" className="w-full">
                    {(() => {
                      let cumulative = 0;
                      const cx = 60, cy = 60, r = 50;
                      const colors = ["#0ea5e9", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];
                      return categoryDistribution.list.map((c, i) => {
                        const fraction = (c.qty / categoryDistribution.total);
                        const start = cumulative * 2 * Math.PI;
                        const end = (cumulative + fraction) * 2 * Math.PI;
                        cumulative += fraction;
                        const x1 = cx + r * Math.cos(start);
                        const y1 = cy + r * Math.sin(start);
                        const x2 = cx + r * Math.cos(end);
                        const y2 = cy + r * Math.sin(end);
                        const largeArc = end - start > Math.PI ? 1 : 0;
                        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                        return <path key={c.name} d={d} fill={colors[i % colors.length]} opacity={0.9} />
                      });
                    })()}
                  </svg>
                  <div className="space-y-2">
                    {categoryDistribution.list.map((c, i) => (
                      <div key={c.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 inline-block rounded" style={{ backgroundColor: ["#0ea5e9","#16a34a","#f59e0b","#ef4444","#8b5cf6","#14b8a6"][i % 6] }} />
                          <span className="font-medium">{c.name}</span>
                        </div>
                        <span className="text-gray-600">{c.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top donated products */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <h3 className="font-bold mb-2">Top produits donnés</h3>
              {topDonatedProducts.length === 0 ? (
                <div className="text-sm text-gray-500">Pas encore de dons</div>
              ) : (
                <div className="space-y-2">
                  {topDonatedProducts.map((p, idx) => (
                    <div key={p.name} className="flex items-center justify-between text-sm p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-sm">#{idx + 1}</span>
                        <span className="font-medium">{p.name}</span>
                      </div>
                      <span className="text-gray-600">{p.qty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Very low stock alerts */}
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <h3 className="font-bold mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-error"/>Stock très bas (≤ 2)</h3>
              {veryLowStock.length === 0 ? (
                <div className="text-sm text-gray-500">Aucun produit en stock critique</div>
              ) : (
                <div className="space-y-2">
                  {veryLowStock.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm p-2 rounded border">
                      <div className="font-medium truncate max-w-[60%]">{p.name}</div>
                      <div>
                        <span className="text-error font-semibold">{p.quantity}</span>
                        <span className="text-gray-500 ml-1">{p.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-4">
            <h3 className="font-bold mb-3">Activité récente</h3>
            {recentTransactions.length === 0 ? (
              <div className="text-sm text-gray-500">Aucune transaction récente</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Type</th>
                      <th>Produit</th>
                      <th>Catégorie</th>
                      <th>Quantité</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((t: any, idx: number) => (
                      <tr key={t.id}>
                        <td>{idx + 1}</td>
                        <td>{t.type}</td>
                        <td className="font-semibold">{t.productName}</td>
                        <td><span className="badge badge-outline badge-sm">{t.categoryName}</span></td>
                        <td>{t.quantity}</td>
                        <td className="text-sm text-gray-600">{new Date(t.createdAt).toLocaleString("fr-FR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs text-gray-500">Page {page} / {totalPages} — {filteredTransactions.length} éléments</div>
                  <div className="join">
                    <button className="btn btn-sm join-item" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Précédent</button>
                    <button className="btn btn-sm join-item" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Suivant</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Page;


