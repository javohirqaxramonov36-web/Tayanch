// Umumiy turlar (tashqi bog'liqliksiz: handler va testlar Supabase kutubxonasini yuklamaydi).

/** supabase-js rpc() natijasining kerakli qismi. */
export type RpcNatija = { data: unknown; error: { message: string; code?: string } | null };
