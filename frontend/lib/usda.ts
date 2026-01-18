const USDA_API_URL = process.env.USDA_API_URL ?? "";
const USDA_API_KEY = process.env.USDA_API_KEY ?? "";

export class UsdaClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = USDA_API_URL;
    this.apiKey = USDA_API_KEY;
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    const searchParams = new URLSearchParams({
      api_key: this.apiKey,
      ...params,
    });

    const url = `${this.baseUrl}${endpoint}?${searchParams}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`USDA API error: ${response.statusText}`);
    }

    return response.json();
  }

  async listFoods(params: { pageSize?: string; pageNumber?: string } = {}) {
    return this.request("/foods/list", {
      pageSize: params.pageSize ?? "25",
      pageNumber: params.pageNumber ?? "1",
    });
  }

  async searchFoods(
    query: string,
    params: { pageSize?: string; pageNumber?: string } = {},
  ) {
    return this.request("/foods/search", {
      query,
      pageSize: params.pageSize ?? "25",
      pageNumber: params.pageNumber ?? "1",
    });
  }
}

export const usda = new UsdaClient();
