import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  History,
  Gift,
  Users
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  bookingId?: string;
  reference?: string;
}

const WalletPage = () => {
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState({
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
    transactions: [] as Transaction[]
  });

  useEffect(() => {
    // TODO: Fetch wallet data from API
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Mock data for now
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "credit",
        amount: 100,
        description: "Welcome bonus",
        date: "2025-01-01",
        reference: "WELCOME_BONUS"
      },
      {
        id: "2",
        type: "credit",
        amount: 50,
        description: "Referral bonus - Sarah joined",
        date: "2025-01-02",
        reference: "REFERRAL"
      },
      {
        id: "3",
        type: "debit",
        amount: 200,
        description: "Booking with Priya Sharma",
        date: "2025-01-03",
        bookingId: "BK001"
      },
      {
        id: "4",
        type: "credit",
        amount: 150,
        description: "Completed adventure bonus",
        date: "2025-01-04",
        bookingId: "BK001"
      },
      {
        id: "5",
        type: "credit",
        amount: 75,
        description: "Review bonus",
        date: "2025-01-05",
        bookingId: "BK001"
      }
    ];

    const balance = mockTransactions.reduce((acc, transaction) => {
      return transaction.type === "credit" ? acc + transaction.amount : acc - transaction.amount;
    }, 0);

    const totalEarned = mockTransactions
      .filter(t => t.type === "credit")
      .reduce((acc, t) => acc + t.amount, 0);

    const totalSpent = mockTransactions
      .filter(t => t.type === "debit")
      .reduce((acc, t) => acc + t.amount, 0);

    setWalletData({
      balance,
      totalEarned,
      totalSpent,
      transactions: mockTransactions
    });
  }, [navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Wallet - Saath Ghoomo</title>
        <meta name="description" content="Manage your Saath Coins and view transaction history" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Saath Coins Wallet</h1>
              <p className="text-muted-foreground text-lg">Manage your coins and track your earnings</p>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-amber-600">Current Balance</p>
                      <p className="text-3xl font-bold text-amber-900">{walletData.balance}</p>
                      <p className="text-sm text-amber-700">Saath Coins</p>
                    </div>
                    <Wallet className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Earned</p>
                      <p className="text-3xl font-bold text-green-900">{walletData.totalEarned}</p>
                      <p className="text-sm text-green-700">Saath Coins</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Total Spent</p>
                      <p className="text-3xl font-bold text-red-900">{walletData.totalSpent}</p>
                      <p className="text-sm text-red-700">Saath Coins</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Transaction History */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Transaction History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="all" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="credit">Earned</TabsTrigger>
                        <TabsTrigger value="debit">Spent</TabsTrigger>
                      </TabsList>

                      <TabsContent value="all" className="space-y-4">
                        {walletData.transactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-full ${
                                transaction.type === 'credit' 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-red-100 text-red-600'
                              }`}>
                                {transaction.type === 'credit' ? (
                                  <ArrowUpRight className="h-4 w-4" />
                                ) : (
                                  <ArrowDownRight className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(transaction.date)}
                                  {transaction.bookingId && ` • Booking: ${transaction.bookingId}`}
                                </p>
                              </div>
                            </div>
                            <div className={`font-semibold ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : '-'}{transaction.amount} coins
                            </div>
                          </div>
                        ))}
                      </TabsContent>

                      <TabsContent value="credit" className="space-y-4">
                        {walletData.transactions
                          .filter(t => t.type === 'credit')
                          .map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-green-100 text-green-600">
                                  <ArrowUpRight className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                                </div>
                              </div>
                              <div className="font-semibold text-green-600">+{transaction.amount} coins</div>
                            </div>
                          ))}
                      </TabsContent>

                      <TabsContent value="debit" className="space-y-4">
                        {walletData.transactions
                          .filter(t => t.type === 'debit')
                          .map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-red-100 text-red-600">
                                  <ArrowDownRight className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-medium">{transaction.description}</p>
                                  <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                                </div>
                              </div>
                              <div className="font-semibold text-red-600">-{transaction.amount} coins</div>
                            </div>
                          ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Earn Coins */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Earn More Coins
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-medium">Refer Friends</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Invite friends and earn 50 coins per successful referral
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Refer Now
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="font-medium">Complete Adventures</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Earn 150 coins for every completed booking
                      </p>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/bookings')}>
                        Find Companions
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Gift className="h-5 w-5 text-primary" />
                        <span className="font-medium">Leave Reviews</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Get 75 coins for reviewing your adventures
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Write Reviews
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-semibold">+325 coins</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pending</span>
                      <span className="font-semibold">0 coins</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Next Reward</span>
                      <span className="font-semibold">175 coins</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default WalletPage;
