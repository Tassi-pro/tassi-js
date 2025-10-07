import { Tassi } from "../src/Tassi";
import { Marketplace } from "../src/Marketplace";
import { Requestor } from "../src/Requestor";
import { ApiConnectionError } from "../src/TassiError";

jest.mock("axios");

describe("Marketplace", () => {
  let mockRequestor: jest.Mocked<Requestor>;

  beforeEach(() => {
    Tassi.setApiKey("test_api_key");
    Tassi.setEnvironment("sandbox");

    mockRequestor = {
      request: jest.fn(),
    } as any;

    Marketplace.setRequestor(mockRequestor);
  });

  describe("retrieve", () => {
    it("should retrieve a marketplace", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Market1",
          api_name: "market1",
          website: "market1.com",
          is_active: true,
          api_configuration: {},
          country_code: "BJ",
          phone_number: "0162000000",
          email: "abc@gmail.com",
          customers_count: 0,
          packages_count: 4,
        },
        options: { environment: "sandbox" },
      };

      mockRequestor.request.mockResolvedValue(mockResponse);

      const marketplace = await Marketplace.retrieve(1);

      expect(mockRequestor.request).toHaveBeenCalledWith(
        "get",
        "/marketplaces/1",
        null,
        null
      );
      expect(marketplace.id).toBe(1);
      expect(marketplace.name).toBe("Market1");
      expect(marketplace.api_name).toBe("market1");
      expect(marketplace.is_active).toBe(true);
      expect(marketplace.country_code).toBe("BJ");
      expect(marketplace.packages_count).toBe(4);
    });
  });

  describe("update", () => {
    it("should update a marketplace", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "Market1",
          api_name: "market1",
          website: "market-app.com",
          is_active: true,
          api_configuration: {},
          country_code: "BJ",
          phone_number: "0162000000",
          email: "abc@gmail.com",
          customers_count: 0,
          packages_count: 4,
        },
        options: { environment: "sandbox" },
      };

      mockRequestor.request.mockResolvedValue(mockResponse);

      const marketplace = await Marketplace.update(1, {
        website: "market-app.com",
      });

      expect(mockRequestor.request).toHaveBeenCalledWith(
        "put",
        "/marketplaces/1",
        { website: "market-app.com" },
        null
      );
      expect(marketplace.website).toBe("market-app.com");
    });

    it("should throw validation error with invalid email", async () => {
      mockRequestor.request.mockRejectedValue(
        new ApiConnectionError("Request error: Invalid email format", 400)
      );

      await expect(
        Marketplace.update(1, { email: "invalid-email" })
      ).rejects.toThrow(ApiConnectionError);
    });
  });

  describe("getWalletHistory", () => {
    it("should get wallet history", async () => {
      const mockResponse = {
        data: {
          wallet_movements: [
            {
              id: 7,
              action: "Credit",
              description: "Test credit",
              amount: "1.0",
              created_at: "2025-09-27T12:43:59Z",
              wallet_id: 1,
            },
            {
              id: 6,
              action: "Credit",
              description: "Test credit",
              amount: "1.0",
              created_at: "2025-09-27T12:43:57Z",
              wallet_id: 1,
            },
            {
              id: 5,
              action: "Debit",
              description: "Test debit",
              amount: "1.0",
              created_at: "2025-09-27T12:43:46Z",
              wallet_id: 1,
            },
          ],
        },
        options: { environment: "sandbox" },
      };

      mockRequestor.request.mockResolvedValue(mockResponse);

      const marketplace = new Marketplace(1);
      const result = await marketplace.getWalletHistory();

      expect(mockRequestor.request).toHaveBeenCalledWith(
        "get",
        "/marketplaces/1/wallet_history",
        {},
        null
      );
      expect(result.wallet_movements).toBeDefined();
      expect(Array.isArray(result.wallet_movements)).toBe(true);
      expect(result.wallet_movements.length).toBe(3);
      expect(result.wallet_movements[0].action).toBe("Credit");
      expect(result.wallet_movements[2].action).toBe("Debit");
    });

    it("should handle empty wallet history", async () => {
      const mockResponse = {
        data: {
          wallet_movements: [],
        },
        options: { environment: "sandbox" },
      };

      mockRequestor.request.mockResolvedValue(mockResponse);

      const marketplace = new Marketplace(1);
      const result = await marketplace.getWalletHistory();

      expect(result.wallet_movements).toBeDefined();
      expect(Array.isArray(result.wallet_movements)).toBe(true);
      expect(result.wallet_movements.length).toBe(0);
    });
  });

  describe("marketplace status management", () => {
    it("should deactivate and reactivate marketplace", async () => {
      const deactivateResponse = {
        data: { id: 1, is_active: false },
        options: { environment: "sandbox" },
      };

      const activateResponse = {
        data: { id: 1, is_active: true },
        options: { environment: "sandbox" },
      };

      mockRequestor.request
        .mockResolvedValueOnce(deactivateResponse)
        .mockResolvedValueOnce(activateResponse);

      const deactivated = await Marketplace.update(1, { is_active: false });
      expect(deactivated.is_active).toBe(false);

      const activated = await Marketplace.update(1, { is_active: true });
      expect(activated.is_active).toBe(true);
    });
  });
});
