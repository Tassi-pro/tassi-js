import { Tassi } from "../src/Tassi";
import { Shipment } from "../src/Shipment";
import { Requestor } from "../src/Requestor";
import { ApiConnectionError } from "../src/TassiError";

jest.mock("axios");

describe("Shipment", () => {
  let mockRequestor: jest.Mocked<Requestor>;

  beforeEach(() => {
    Tassi.setApiKey("test_api_key");
    Tassi.setEnvironment("sandbox");

    mockRequestor = {
      request: jest.fn(),
    } as any;

    Shipment.setRequestor(mockRequestor);
  });

  describe("create", () => {
    it("should create a shipment with complete payload", async () => {
      const payload = {
        marketplace_id: "1",
        customer_id: "",
        customer: {
          first_name: "Doe",
          last_name: "Jane",
          email: "doe@gmail.com",
          address: "Rue 123, Houéyiho, Cotonou",
          city: "Cotonou",
          country_code: "BJ",
        },
        pickup_point_id: "",
        pickup_point: {
          name: "Point Relais Houéyiho",
          address: "Carrefour Houéyiho, Cotonou",
          city: "Cotonou",
          postal_code: "22901",
          latitude: 6.3703,
          longitude: 2.3912,
          phone: "+22961020304",
          email: "pickup.houeyiho@example.com",
          is_active: true,
        },
        package: {
          description: "Colis test contenant accessoires électroniques",
          weight: 5,
          dimensions: "10x10x10",
          declared_value: "100",
          currency: "USD",
          insurance: false,
        },
        route: {
          origin: "Cotonou",
          destination: "Porto-Novo",
          stops: [
            {
              city: "Sèmè-Kpodji",
              address: "Avenue de l'Inter, Sèmè-Kpodji",
              latitude: 6.3512,
              longitude: 2.4987,
            },
          ],
        },
      };

      const mockResponse = {
        data: {
          shipment: {
            id: 1,
            marketplace_id: 1,
            package_id: 1,
            status: "created",
          },
        },
        options: { environment: "sandbox" },
      };

      mockRequestor.request.mockResolvedValue(mockResponse);

      const shipment = await Shipment.create(payload);

      expect(mockRequestor.request).toHaveBeenCalledWith(
        "post",
        "/shipments",
        payload,
        null
      );
      expect(shipment.id).toBeDefined();
      expect(shipment.status).toBe("created");
    });

    it("should throw error with validation error", async () => {
      const invalidPayload = {
        marketplace_id: "1",
        customer: {
          first_name: "Doe",
        },
      };

      mockRequestor.request.mockRejectedValue(
        new ApiConnectionError(
          "Request error: Missing required customer fields",
          400
        )
      );

      await expect(Shipment.create(invalidPayload)).rejects.toThrow(
        ApiConnectionError
      );
    });

    it("should throw error with invalid package weight", async () => {
      const payload = {
        marketplace_id: "1",
        customer: {
          first_name: "Test",
          last_name: "User",
          email: "test@example.com",
        },
        package: {
          description: "Test package",
          weight: -5,
          dimensions: "invalid",
        },
      };

      mockRequestor.request.mockRejectedValue(
        new ApiConnectionError(
          "Request error: Invalid package weight or dimensions",
          400
        )
      );

      await expect(Shipment.create(payload)).rejects.toThrow(
        ApiConnectionError
      );
    });
  });
});
