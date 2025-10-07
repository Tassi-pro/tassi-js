import { Tassi } from "../src/Tassi";
import { Package } from "../src/Package";
import { Requestor } from "../src/Requestor";
import { InvalidRequestError } from "../src/TassiError";

jest.mock("axios");

describe("Package", () => {
  let mockRequestor: jest.Mocked<Requestor>;

  beforeEach(() => {
    Tassi.setApiKey("test_api_key");
    Tassi.setEnvironment("sandbox");

    mockRequestor = {
      request: jest.fn(),
    } as any;

    Package.setRequestor(mockRequestor);
  });

  describe("all", () => {
    it("should list all packages", async () => {
      const mockResponse = {
        data: {
          packages: [
            {
              id: 4,
              tracking_number: "tassi_TRK_CFE667F2DB8E9578",
              status: "in_transit",
              description: "Colis test contenant accessoires électroniques",
              weight: "5.0",
              dimensions: "10x10x10",
              declared_value: "100.0",
              currency: "USD",
              insurance: false,
              signature_required: true,
            },
          ],
          meta: {
            current_page: 1,
            total_count: 4,
          },
        },
        options: { environment: "sandbox" },
      };

      mockRequestor.request.mockResolvedValue(mockResponse);

      const result = await Package.all();

      expect(mockRequestor.request).toHaveBeenCalledWith(
        "get",
        "/packages",
        null,
        null
      );
      expect(result.packages).toBeDefined();
      expect(Array.isArray(result.packages)).toBe(true);
      expect(result.packages.length).toBeGreaterThan(0);
      expect(result.packages[0].tracking_number).toBe(
        "tassi_TRK_CFE667F2DB8E9578"
      );
      expect(result.packages[0].status).toBe("in_transit");
      expect(result.packages[0].insurance).toBe(false);
      expect(result.packages[0].signature_required).toBe(true);
    });
  });

  describe("retrieve", () => {
    it("should retrieve a package", async () => {
      const mockResponse = {
        data: {
          package: {
            id: 4,
            tracking_number: "tassi_TRK_CFE667F2DB8E9578",
            status: "in_transit",
            description: "Colis test contenant accessoires électroniques",
            weight: "5.0",
            dimensions: "10x10x10",
            declared_value: "100.0",
            currency: "USD",
            insurance: false,
            signature_required: true,
          },
        },
        options: { environment: "sandbox" },
      };

      mockRequestor.request.mockResolvedValue(mockResponse);

      const pkg = await Package.retrieve(4);

      expect(mockRequestor.request).toHaveBeenCalledWith(
        "get",
        "/packages/4",
        null,
        null
      );
      expect(pkg.id).toBe(4);
      expect(pkg.tracking_number).toBe("tassi_TRK_CFE667F2DB8E9578");
      expect(pkg.status).toBe("in_transit");
      expect(pkg.weight).toBe("5.0");
      expect(pkg.insurance).toBe(false);
      expect(pkg.signature_required).toBe(true);
    });

    it("should throw error with invalid id", async () => {
      await expect(Package.retrieve(null as any)).rejects.toThrow(
        InvalidRequestError
      );
    });
  });

  describe("update", () => {
    it("should update a package", async () => {
      const mockResponse = {
        data: {
          package: {
            id: 4,
            tracking_number: "tassi_TRK_CFE667F2DB8E9578",
            status: "in_transit",
            description: "Colis test contenant accessoires de coifure",
            weight: "15.0",
            dimensions: "10x10x10",
            declared_value: "100.0",
            currency: "USD",
          },
        },
        options: { environment: "sandbox" },
      };

      mockRequestor.request.mockResolvedValue(mockResponse);

      const pkg = await Package.update(4, {
        description: "Colis test contenant accessoires de coifure",
        weight: "15.0",
      });

      expect(mockRequestor.request).toHaveBeenCalledWith(
        "put",
        "/packages/4",
        {
          description: "Colis test contenant accessoires de coifure",
          weight: "15.0",
        },
        null
      );
      expect(pkg.description).toBe(
        "Colis test contenant accessoires de coifure"
      );
      expect(pkg.weight).toBe("15.0");
    });
  });

  describe("track", () => {
    it("should track a package", async () => {
      const mockResponse = {
        data: {},
        options: { environment: "sandbox" },
      };

      mockRequestor.request.mockResolvedValue(mockResponse);

      const pkg = new Package(4);
      const result = await pkg.track();

      expect(mockRequestor.request).toHaveBeenCalledWith(
        "get",
        "/packages/4/track",
        {},
        null
      );
      expect(result).toBeDefined();
    });
  });

  describe("getShippingLabel", () => {
    it("should get shipping label", async () => {
      const mockResponse = {
        data: {
          shipping_label: {
            id: 1,
            label_type: "shipping_label",
            format: "pdf",
            size: "a4",
            file_url: null,
            checksum:
              "f36a40debd30d81fdabf9285bcf5b573c828c21a0b839f7c85be62bdf7f2a9d1",
            version: 1,
            package_id: 1,
            filename: "tassi_TRK_99F75AD8447EA4C0_v1.pdf",
          },
        },
        options: { environment: "sandbox" },
      };

      mockRequestor.request.mockResolvedValue(mockResponse);

      const pkg = new Package(1);
      const result = await pkg.getShippingLabel(1);

      expect(mockRequestor.request).toHaveBeenCalledWith(
        "get",
        "/packages/1/shipping_labels/1",
        {},
        null
      );
      expect(result.shipping_label).toBeDefined();
      expect(result.shipping_label.label_type).toBe("shipping_label");
      expect(result.shipping_label.format).toBe("pdf");
      expect(result.shipping_label.version).toBe(1);
      expect(result.shipping_label.filename).toBe(
        "tassi_TRK_99F75AD8447EA4C0_v1.pdf"
      );
    });
  });
});
