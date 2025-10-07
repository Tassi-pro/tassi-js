import { TassiObject } from "./TassiObject";
import { Requestor } from "./Requestor";
import { InvalidRequestError } from "./TassiError";
import { Util } from "./Util";

const pluralize = (word: string): string => {
  if (word.endsWith("y")) {
    return word.slice(0, -1) + "ies";
  }
  if (word.endsWith("s")) {
    return word + "es";
  }
  return word + "s";
};

export abstract class Resource extends TassiObject {
  private static requestor: Requestor | null = null;

  static setRequestor(req: Requestor): void {
    this.requestor = req;
  }

  static getRequestor(): Requestor {
    if (this.requestor === null) {
      this.requestor = new Requestor();
    }
    return this.requestor;
  }

  static className(): string {
    return this.name.toLowerCase();
  }

  static classPath(): string {
    const base = this.className();
    const plural = pluralize(base);
    return `/${plural}`;
  }

  static resourcePath(id: string | number | null): string {
    if (id === null || id === undefined) {
      const klass = this.className();
      throw new InvalidRequestError(
        `Could not determine which URL to request: ${klass} instance has invalid ID: ${id}`
      );
    }

    const base = this.classPath();
    return `${base}/${id}`;
  }

  instanceUrl(): string {
    return (this.constructor as typeof Resource).resourcePath(this.id!);
  }

  protected static validateParams(params: any): void {
    if (params !== null && params !== undefined && typeof params !== "object") {
      throw new InvalidRequestError(
        "You must pass an object as the first argument to Tassi API method calls."
      );
    }
  }

  protected static async staticRequest(
    method: string,
    url: string,
    params: Record<string, any> | null = null,
    headers: Record<string, string> | null = null
  ): Promise<{ data: any; options: Record<string, any> }> {
    return this.getRequestor().request(method, url, params, headers);
  }

  protected static async _retrieve(
    id: string | number,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    const url = this.resourcePath(id);
    const className = this.className();

    const response = await this.staticRequest("get", url, null, headers);
    const data = response.data;
    const options = response.options;

    const objData = data[className] || data;

    return Util.arrayToTassiObject(objData, options);
  }

  protected static async _all(
    params: Record<string, any> | null = null,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    this.validateParams(params);
    const path = this.classPath();

    const response = await this.staticRequest("get", path, params, headers);
    return Util.arrayToTassiObject(response.data, response.options);
  }

  protected static async _create(
    params: Record<string, any>,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    this.validateParams(params);
    const url = this.classPath();
    const className = this.className();

    const response = await this.staticRequest("post", url, params, headers);
    const data = response.data;
    const options = response.options;

    const objData = data[className] || data;

    return Util.arrayToTassiObject(objData, options);
  }

  protected static async _update(
    id: string | number,
    params: Record<string, any>,
    headers: Record<string, string> | null = null
  ): Promise<any> {
    this.validateParams(params);
    const url = this.resourcePath(id);
    const className = this.className();

    const response = await this.staticRequest("put", url, params, headers);
    const data = response.data;
    const options = response.options;

    const objData = data[className] || data;

    return Util.arrayToTassiObject(objData, options);
  }

  protected async _delete(
    headers: Record<string, string> | null = null
  ): Promise<this> {
    const url = this.instanceUrl();
    await (this.constructor as typeof Resource).staticRequest(
      "delete",
      url,
      {},
      headers
    );
    return this;
  }
}
