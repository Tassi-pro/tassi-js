export class TassiObject {
  id?: string | number;
  [key: string]: any;

  constructor(id?: string | number) {
    if (id !== undefined) {
      this.id = id;
    }
  }

  refreshFrom(values: Record<string, any>, options: Record<string, any>): void {
    Object.assign(this, values);
  }

  serializeParameters(): Record<string, any> {
    const params: Record<string, any> = {};

    for (const [key, value] of Object.entries(this)) {
      if (key !== "id" && typeof value !== "function") {
        params[key] = value;
      }
    }

    return params;
  }

  toString(): string {
    const idStr = this.id !== undefined ? ` id=${this.id}` : "";
    return `<${this.constructor.name}${idStr}>`;
  }
}
