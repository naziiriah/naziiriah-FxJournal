export interface HomeTrade {
  id: number;
  date: string;
  symbol: string;
  type: 'Long' | 'Short';
  entry: number;
  exit: number;
  size: number;
}


export interface Stats {
  totalTrades: number;
  winRate: number;
  netPnl: number;
  avgR: number;
}

export interface FormState {
  symbol: string;
  type: 'Long' | 'Short';
  entry: string;
  exit: string;
  size: string;
}

export interface StatCardProps {
  label: string;
  value: string;
}

export interface User {
    id:string;
    email: string;
    password: string;
    username: string;
    createdAt: Date;
}

export interface LoginType {
    email: string;
    password: string;
}

export interface RegisterType {
    email: string;
    password: string;
    username: string;
}


export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface Bias {
  id: string;
  title: string;
  currencyPair: string;
  description?: string;
  beforeImageUrl?: string;
  afterImageUrl?: string;
  createdAt: string;
}

export interface BiasType {
  title: string;
  currencyPair: string;
  description?: string;
  beforeImageUrl?: string;
  userID?: string;
}

export interface BiasState {
  items: Bias[];
  loading: boolean;
  error: string | null;
}

export interface RuleType {
  createdAt: string | number | Date;
  id: string;
  title: string;
  expression?: string;
}


// --- Trade Type ---
export interface Trade {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profitLoss: number;
  strategy?: string;
  session?: "London" | "New York" | "Asia";
  dailyBias?: string;
  tradeDirection: "Buy" | "Sell";
  result: string;
  risk?: string;
  reward?: string;
  entryTimeframe?: string;
  entryStructure?: string;
  entrySetup?: string;
  notes?: string;
  error: boolean;
  errorReason?: string;
  screenshotUrl?: string;
  createdAt: string;
  tags?: { id: string; name: string }[];
}

// --- Slice State ---
export interface TradeState {
  trades: Trade[];
  selectedTrade: Trade | null;
  loading: boolean;
  error: string | null;
}

export interface Rule {
  id: string;
  title: string; // Will be hashed in service layer
  expression: string;
  createdAt: Date;
}