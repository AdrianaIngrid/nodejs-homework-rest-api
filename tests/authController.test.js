const jwt = require("jsonwebtoken");
const { loginUserController } = require("../controllers/authController");
const { checkUserDB } = require("../services/index");
jest.mock("../services/index.js");
jest.mock("jsonwebtoken");
describe("loginUserController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: { email: "test@example.com", password: "password123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("ar trebui să returneze status 201 și un token valid", async () => {
    
    const user = { email: "test@example.com" };
    checkUserDB.mockResolvedValue(user);

   
    const mockToken = "mockedJwtToken";
    jwt.sign.mockReturnValue(mockToken);

    await loginUserController(req, res, next);

    
    expect(res.status).toHaveBeenCalledWith(201);

    
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "succes",
        code: 201,
        data: {
          email: user.email,
          token: mockToken,
        },
      })
    );
  });

  it("ar trebui să returneze status 404 și un mesaj de eroare dacă utilizatorul nu este găsit", async () => {
    
    checkUserDB.mockRejectedValue(new Error("User not found"));

    await loginUserController(req, res, next);

   
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 404,
      error: "User not found",
    });
  });
});