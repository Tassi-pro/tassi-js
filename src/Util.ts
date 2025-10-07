import { TassiObject } from "./TassiObject";

export class Util {
  static arrayToTassiObject(data: any, options: Record<string, any>): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.convertToTassiObject(item, options));
    }

    return this.convertToTassiObject(data, options);
  }

  private static convertToTassiObject(
    data: any,
    options: Record<string, any>
  ): any {
    if (typeof data !== "object" || data === null) {
      return data;
    }

    const obj = new TassiObject();
    obj.refreshFrom(data, options);

    for (const [key, value] of Object.entries(data)) {
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        obj[key] = this.convertToTassiObject(value, options);
      } else if (Array.isArray(value)) {
        obj[key] = value.map((item) =>
          typeof item === "object" && item !== null
            ? this.convertToTassiObject(item, options)
            : item
        );
      } else {
        obj[key] = value;
      }
    }

    return obj;
  }
}
