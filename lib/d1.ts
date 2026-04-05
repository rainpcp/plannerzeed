interface QueryResult<T = any> {
  rows: T[];
}

class D1Client {
  private accountId: string;
  private databaseId: string;
  private apiToken: string;

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '';
    this.databaseId = process.env.CLOUDFLARE_DATABASE_ID || '';
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN || '';
  }

  async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    if (!this.accountId || !this.databaseId || !this.apiToken) {
      console.warn("Cloudflare D1 credentials missing. Please set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, and CLOUDFLARE_API_TOKEN in your .env file.");
      return { rows: [] };
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql,
        params: params || []
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`D1 Query Error: ${response.status} ${text}`);
    }

    const data = await response.json();
    if (data.success && data.result && data.result.length > 0) {
      return { rows: data.result[0].results as T[] };
    }
    
    return { rows: [] };
  }
}

const pool = new D1Client();
export default pool;
