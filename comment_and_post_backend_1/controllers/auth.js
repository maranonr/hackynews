const authRouter = require("express").Router();
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authorize } = require("../authenticateToken");
const User = require("../models/user");
const { jwtSecret } = require("../utils/secret");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  "646647642939-dpvcpj052v57m7kt671jsb6bgnvr7br4.apps.googleusercontent.com"
);

authRouter.post("/signup", async (req, res) => {
  req.validateSchema({
    type: "object",
    additionalProperties: false,
    required: ["email", "password", "name"],
    properties: {
      firstName: { type: "string" },
      lastName: { type: "string" },
      name: { type: "string" },
      address: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      img: { type: "string" },
    },
  });
  const foundUser = await User.findOne({ email: req.body.email });
  if (foundUser)
    return res.status(400).json({ message: "email already exists!" });
  req.body.password = Bcrypt.hashSync(req.body.password, 10);
  const user = new User(req.body);
  const result = await user.save();
  const response = result.toJSON();
  delete response.password;
  res.json(response);
});

authRouter.post("/login", async (req, res) => {
  req.validateSchema({
    type: "object",
    additionalProperties: false,
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
    },
  });
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) return res.status(400).json({ message: "email not found!" });
  const valid = await Bcrypt.compare(req.body.password, foundUser.password);
  console.log("valid", valid);
  if (!valid)
    return res.status(400).json({ message: "password is incorrect!" });
  const user = foundUser.toJSON();
  delete user.img;
  delete user.password;
  const token = jwt.sign(user, jwtSecret, { expiresIn: "24h" });
  res.json({ token, user });
});

authRouter.post("/googlelogin", async (req, resp) => {
  const { tokenId } = await req.body;
  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "646647642939-dpvcpj052v57m7kt671jsb6bgnvr7br4.apps.googleusercontent.com",
    })
    .then(async (res) => {
      const { email_verified, name, email, picture } = res.payload;
      if (email_verified) {
        await User.findOne({ email }).exec(async (err, user) => {
          if (err) {
            return resp.status(400).json({ message: "An error occured!" });
          } else {
            if (user) {
              const foundUser = user.toJSON();
              delete user.password;
              delete user.img;
              const token = jwt.sign(foundUser, jwtSecret, { expiresIn: "24h" });
              resp.json({ token, user });
            } else {
              let password = email + jwtSecret;
              let newUser = new User({
                name,
                password,
                email,
                img: picture,
              });
              const result = await newUser.save();
              const response = result.toJSON();
              delete response.password;
              delete response.img;
              const token = jwt.sign(response, jwtSecret, { expiresIn: "24h" });
              resp.json({ token, user: response });
            }
          }
        });
      }
    });
});

authRouter.get("/single", authorize, async (req, res) => {
  const foundUser = await User.findById(req.user.id);
  const user = foundUser.toJSON();
  delete user.password;
  return res.json(user);
});

module.exports = authRouter;
