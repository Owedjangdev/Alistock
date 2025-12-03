"use client";
import Wrapper from "@/components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { readTransactions, getTransactionStats } from "../action";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import { ArrowUpRight, ArrowDownRight, Package, TrendingUp, TrendingDown, BarChart3, Heart } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  quantity: number;
  createdAt: string;
  productName: string;
  categoryName: string;
  productUnit: string;
  recipientName?: string;
  recipientInfo?: string;
}

interface TransactionStats {
  totalTransactions: number;
  addTransactions: number;
  removeTransactions: number;
  totalQuantityAdded: number;
  totalQuantityRemoved: number;
  giveTransactions: number;
  totalQuantityGiven: number;
}

const Page = () => {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats | null | { error: any }>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");

  const fetchData = async () => {
    if (email) {
      try {
        setLoading(true);
        const [transactionsData, statsData] = await Promise.all([
          readTransactions(email),
          getTransactionStats(email)
        ]);
        
        if (transactionsData) setTransactions(transactionsData);
        if (statsData && !('error' in statsData)) setStats(statsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (email) {
      fetchData();
    }
  }, [email]);

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === "ALL") return true;
    return transaction.type === filterType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    if (type === "ADD") {
      return <ArrowUpRight className="w-4 h-4 text-success" />;
    } else if (type === "GIVE") {
      return <Heart className="w-4 h-4 text-red-500" />;
    }
    return <ArrowDownRight className="w-4 h-4 text-error" />;
  };

  const getTypeBadge = (type: string) => {
    if (type === "ADD") {
      return <span className="badge badge-success badge-sm">Ajout</span>;
    } else if (type === "GIVE") {
      return <span className="badge badge-error badge-sm bg-red-500">Don</span>;
    }
    return <span className="badge badge-error badge-sm">Retrait</span>;
  };

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="text-gray-600 mt-2">Historique des mouvements de stock</p>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <span className="font-semibold">Analytics</span>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && !('error' in stats) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Transactions</p>
                    <p className="text-2xl font-bold">{stats.totalTransactions}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ajouts</p>
                    <p className="text-2xl font-bold text-success">{stats.addTransactions}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-success" />
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Retraits</p>
                    <p className="text-2xl font-bold text-error">{stats.removeTransactions}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-error" />
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Dons</p>
                    <p className="text-2xl font-bold text-red-500">{stats.giveTransactions}</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Net Stock</p>
                    <p className="text-2xl font-bold text-primary">
                      {stats.totalQuantityAdded - stats.totalQuantityRemoved - stats.totalQuantityGiven}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            className={`btn btn-sm ${filterType === "ALL" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilterType("ALL")}
          >
            Toutes ({transactions.length})
          </button>
          <button
            className={`btn btn-sm ${filterType === "ADD" ? "btn-success" : "btn-outline"}`}
            onClick={() => setFilterType("ADD")}
          >
            Ajouts ({transactions.filter(t => t.type === "ADD").length})
          </button>
          <button
            className={`btn btn-sm ${filterType === "REMOVE" ? "btn-error" : "btn-outline"}`}
            onClick={() => setFilterType("REMOVE")}
          >
            Retraits ({transactions.filter(t => t.type === "REMOVE").length})
          </button>
          <button
            className={`btn btn-sm ${filterType === "GIVE" ? "btn-error bg-red-500" : "btn-outline"}`}
            onClick={() => setFilterType("GIVE")}
          >
            Dons ({transactions.filter(t => t.type === "GIVE").length})
          </button>
        </div>

        {/* Transactions Table */}
        {filteredTransactions.length === 0 ? (
          <div className="h-64">
            <EmptyState
              IconComponent="PackageSearch"
              message={
                filterType === "ALL" 
                  ? "Aucune transaction trouvée. Les mouvements de stock apparaîtront ici."
                  : `Aucune transaction de type ${filterType === "ADD" ? "ajout" : "retrait"} trouvée.`
              }
            />
          </div>
        ) : (
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Type</th>
                      <th>Produit</th>
                      <th>Catégorie</th>
                      <th>Quantité</th>
                      <th>Bénéficiaire</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={transaction.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(transaction.type)}
                            {getTypeBadge(transaction.type)}
                          </div>
                        </td>
                        <td className="font-semibold">{transaction.productName}</td>
                        <td>
                          <span className="badge badge-outline badge-sm">
                            {transaction.categoryName}
                          </span>
                        </td>
                        <td>
                          <span className={`font-semibold ${transaction.type === "ADD" ? "text-success" : transaction.type === "GIVE" ? "text-red-500" : "text-error"}`}>
                            {transaction.type === "ADD" ? "+" : transaction.type === "GIVE" ? "🎁" : "-"}{transaction.quantity} {transaction.productUnit}
                          </span>
                        </td>
                        <td>
                          {transaction.type === "GIVE" && transaction.recipientName ? (
                            <div className="text-sm">
                              <div className="font-semibold">{transaction.recipientName}</div>
                              {transaction.recipientInfo && (
                                <div className="text-xs text-gray-500">{transaction.recipientInfo}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="text-sm text-gray-600">
                          {formatDate(transaction.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Page;
