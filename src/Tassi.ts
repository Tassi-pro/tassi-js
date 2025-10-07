export class Tassi {
  static readonly VERSION = "1.0.0";
  private static apiKey: string | null = null;
  private static apiBase: string | null = null;
  private static environment: "sandbox" | "live" = "sandbox";
  private static verifySslCerts = true;

  static getApiKey(): string | null {
    return this.apiKey;
  }

  static setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  static getApiBase(): string | null {
    return this.apiBase;
  }

  static setApiBase(apiBase: string): void {
    this.apiBase = apiBase;
  }

  static getEnvironment(): "sandbox" | "live" {
    return this.environment;
  }

  static setEnvironment(environment: "sandbox" | "live"): void {
    this.environment = environment;
  }

  static getVerifySslCerts(): boolean {
    return this.verifySslCerts;
  }

  static setVerifySslCerts(verify: boolean): void {
    this.verifySslCerts = verify;
  }
}
