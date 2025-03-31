const express = require("express");
const session = require("express-session");
const path = require("path");
const { text } = require("stream/consumers");
const app = express();
const port = 3000;

let views = 0;

app.use(
  session({
    secret: "r7ndD4YZk06KzzlipJMj9qZigqMlvCqR",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/static", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =================Middlewares
const logResqest = (req, res, next) => {
  console.log(
    `>${new Date().toLocaleTimeString()} , ${req.method}, ${req.originalUrl}`
  );
  req.user = { id: 5 };
  next();
};
// app.use(logResqest);
// =================FIN Middlewares

// =================Method:POST
// req.body:  permet de recuperer les données du formulaire
app.post("/form", (req, res) => {
  // ======== traiter le formulaire
  if (req.body.password === "1234") {
    res.status(200).send("connexion reussie");
  } else {
    res.redirect("/fichier/html?mdIncorrect=1");
  }
  console.log(req.body);
  res.send("Formulaire traité");
});
// =================FIN Method:POST
app.get("/", logResqest, (req, res) => {
  if (!req.session.views) {
    req.session.views = 0;
  }
  req.session.views++;
  res.send(`Hello world, vous avez visité la page ${req.session.views} fois`);
});
// route statique
// app.get("/bonjour", (req, res) => {
//   res.send("<h1>Bonjour tout le monde</h1>");
// });
// =============route dynamique
// app.get("/bonjour/:prenom/:nom", (req, res) => {
//   console.log(req.params);

//   const text = `Bonjour ${req.params.prenom} ${req.params.nom}!`;
//   res.send(text);
// });
// app.get("/articles/:id", (req, res) => {
//   console.log(req.params);
//   res.send(`Article #${req.params.id} du blog`);
// });
// =============FIN route dynamique
// =============Varibles
app.get("/bonjour", logResqest, (req, res) => {
  console.log(req.query);
  console.log(req.user);

  const text = `Bonjour ${req.query.prenom} ${req.query.nom}!`;
  res.send(text);
});
app.get("/articles/:id", (req, res) => {
  console.log(req.params);
  console.log(req.query);

  res.send(`Article #${req.params.id} du blog`);
});
// =============FINVaribles
app.get("/fichier/html", (req, res) => {
  console.log("__dirname", __dirname);
  console.log(path.join(__dirname, "/views/page.html"));

  res.sendFile(path.join(__dirname, "/views/page.html"));
});
// ================== page non connue
app.use((req, res) => {
  res.status(404).send("Erreur 404,Page non trouvé.");
});
// ================== FIN page non connue

app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});
