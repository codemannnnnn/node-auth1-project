const bcryptjs = require("bcryptjs");
const router = require("express").Router();

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  //validate body to make sure there is a username and password

  const { username, password } = req.body;

  //hash the password
  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcryptjs.hashSync(password, rounds);
  Users.add({ username, password: hash })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => res.send(err));
});

router.post("/login", (req, res) => {
  //validate body to make sure there is a username and password

  const { username, password } = req.body;

  // verify user password

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
        req.session.user = { id: user.id, username: user.username };
        res
          .status(200)
          .json({ welcome: "to inside of your app", session: req.session });
      } else {
        res.status(401).json({ message: "you cannot pass" });
      }
    })
    .catch((err) => res.send(err));
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        res
          .status(500)
          .json({ message: "could not log you out, please try again." });
      } else {
        res.statue(204).end();
      }
    });
  } else {
    res.status(204).end();
  }
});

module.exports = router;
