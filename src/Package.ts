import { Resource } from "./Resource";
import { Util } from "./Util";

export class Package extends Resource {
  static async retrieve(
    id: string | number,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    return this._retrieve(id, headers);
  }

  static async all(
    params: Record<string, any> | null = null,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    return this._all(params, headers);
  }

  static async update(
    id: string | number,
    params: Record<string, any> | null = null,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    return this._update(id, params || {}, headers);
  }

  async track(headers: Record<string, string> | null = null): Promise<any> {
    const url = `${this.instanceUrl()}/track`;

    const response = await (this.constructor as typeof Resource).staticRequest(
      "get",
      url,
      {},
      headers
    );
    return Util.arrayToTassiObject(response.data, response.options);
  }

  async getShippingLabel(
    labelId: string | number,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    const url = `${this.instanceUrl()}/shipping_labels/${labelId}`;

    const response = await (this.constructor as typeof Resource).staticRequest(
      "get",
      url,
      {},
      headers
    );
    return Util.arrayToTassiObject(response.data, response.options);
  }
}
