import { Resource } from "./Resource";

export class Shipment extends Resource {
  static async create(
    params: Record<string, any> | null = null,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    return this._create(params || {}, headers);
  }
}
