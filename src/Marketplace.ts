import { Resource } from "./Resource";
import { Util } from "./Util";

export class Marketplace extends Resource {
  static async retrieve(
    id: string | number,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    return this._retrieve(id, headers);
  }

  static async update(
    id: string | number,
    params: Record<string, any> | null = null,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    return this._update(id, params || {}, headers);
  }

  async getWalletHistory(
    params: Record<string, any> | null = null,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    const url = `${this.instanceUrl()}/wallet_history`;

    const response = await (this.constructor as typeof Resource).staticRequest(
      "get",
      url,
      params || {},
      headers
    );
    return Util.arrayToTassiObject(response.data, response.options);
  }
}
