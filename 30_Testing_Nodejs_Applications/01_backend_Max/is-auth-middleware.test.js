const authMiddleware = require("./middleware/is-auth.js");
const { expect } = require("chai");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");
//------------------------------------------------------------

describe("Testing for authMiddelware function", function () {
  //-----------------------------

  it("should throw 'Not Authenticated' if no authorization header not sent", function () {
    const req = {
      get: function () {
        return null;
      },
    };
    const res = {};
    const next = () => {};

    expect(authMiddleware.bind(this, req, res, next)).to.throw(
      "Not authenticated"
    );
  });

  //-----------------------------
  it("should throw an error for only one string in authHeader", function () {
    const req = {
      get: function () {
        return "xywabc";
      },
    };
    const res = {};
    const next = () => {};

    expect(authMiddleware.bind(this, req, res, next)).to.throw(Error);
  });

  //-----------------------------
  it("should throw an error if token not verified", function () {
    const req = {
      get: function () {
        return "Bearer azerty";
      },
    };
    const res = {};
    const next = () => {};

    expect(authMiddleware.bind(this, req, res, next)).to.throw(Error);
  });

  //-----------------------------
  it("should output userId property in req object ", function () {
    // using real token

    //generating token locally
    const token = jwt.sign(
      {
        email: "test@test.com",
        userId: "27",
      },
      "somesupersecretsecret"
    );

    const req = {
      get: function () {
        return `Bearer ${token}`;
      },
    };
    const res = {};
    const next = () => {};

    authMiddleware(req, res, next);
    expect(req).to.have.property("userId");
  });

  //-----------------------------
  it.skip("should output userId property in req object ", function () {
    // using mock OR stub, create troubles here, TODO: inspect why
    const req = {
      get: function () {
        return `Bearer sometoken`;
      },
    };

    // overwriting verify() here
    jwt.verify = function () {
      return { userId: "abc" };
    };
    const res = {};
    const next = () => {};

    authMiddleware(req, res, next);
    expect(req).to.have.property("userId");
  });

  //-----------------------------
  it("should output userId property in req object ", function () {
    // using mock OR stub
    const req = {
      get: function () {
        return `Bearer dummy_token`;
      },
    };

    // overwriting verify() here with sinon
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    const res = {};
    const next = () => {};

    authMiddleware(req, res, next);
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});
