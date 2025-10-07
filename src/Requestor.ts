import axios, { AxiosInstance, AxiosError } from "axios";
import { Tassi } from "./Tassi";
import { ApiConnectionError } from "./TassiError";

export class Requestor {
  private static readonly SANDBOX_BASE = "https://tassi-api.exanora.com";
  private static readonly LIVE_BASE = "https://tassi-api.exanora.com";

  private client: AxiosInstance;

  constructor() {
    this.client = axios.create();
  }

  async request(
    method: string,
    path: string,
    params: Record<string, any> | null = null,
    headers: Record<string, string> | null = null
  ): Promise<{ data: any; options: Record<string, any> }> {
    const url = this.url(path);
    const requestHeaders = { ...this.defaultHeaders(), ...(headers || {}) };

    try {
      const config: any = {
        method: method.toLowerCase(),
        url,
        headers: requestHeaders,
        httpsAgent: Tassi.getVerifySslCerts()
          ? undefined
          : { rejectUnauthorized: false },
      };

      if (["get", "head", "delete"].includes(method.toLowerCase())) {
        if (params) {
          config.params = params;
        }
      } else {
        if (params) {
          config.data = params;
        }
      }

      const response = await this.client.request(config);

      return {
        data: response.data || {},
        options: {
          environment: Tassi.getEnvironment(),
        },
      };
    } catch (error) {
      this.handleRequestException(error as AxiosError);
      throw error; // TypeScript needs this
    }
  }

  private baseUrl(): string {
    const apiBase = Tassi.getApiBase();
    const environment = Tassi.getEnvironment();

    if (apiBase) {
      return apiBase;
    }

    if (environment === "live") {
      return Requestor.LIVE_BASE;
    }

    return Requestor.SANDBOX_BASE;
  }

  private url(path = ""): string {
    return `${this.baseUrl()}${path}`;
  }

  private defaultHeaders(): Record<string, string> {
    const apiKey = Tassi.getApiKey();

    return {
      "X-Version": Tassi.VERSION,
      "X-Source": "Tassi JSLib",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  private handleRequestException(error: AxiosError): never {
    const message = `Request error: ${error.message}`;
    const httpStatus = error.response?.status || null;
    const httpRequest = error.config || null;
    const httpResponse = error.response || null;

    throw new ApiConnectionError(
      message,
      httpStatus,
      httpRequest,
      httpResponse
    );
  }
}
