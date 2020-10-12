//CARREGANDO MODULOS
require("dotenv").config();
const compression = require("compression");
const express = require("express");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
//const moment = require("moment");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

//ROTAS

//INDEX
const indexRouter = require('./routes/index');
//USUARIOS
const authRoute = require("./routes/auth-route");
//PLANEJAMENTO
const planningRoute = require("./routes/planning-route");

const db = require("./config/db");

//Configurações
app.use(compression());
app.use("/favicon.ico", express.static("images/favicon.ico"));
app.use(cors());
app.use(cookieParser());

//SESSÕES
app.use(
    session({
      secret: "warehousemapp",
      resave: true,
      saveUninitialized: true,
    })
  );
  

  app.use(flash());
  
  //MIDDLEWARE
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
  });

//BODY PARSER - EXPRESS LIDAR LIDAR COM REQUISIÇÕES URLENCODED, FACILITAR O ENVIO DE ARQUIVOS
app.use(bodyParser.urlencoded({ extended: true }));
//BODY PARSER - EXPRESS LIDAR COM REQUISIÇÕES FORMATO JSON
app.use(bodyParser.json({}));
//LIB DE LOG
app.use(morgan("dev"));


//HANDLEBARS
app.engine(
    "handlebars",
    handlebars({
        defaultLayout: "main",
        helpers: {
            formatDate: (date) => {
                return moment(date).format("DD/MM/YYYY HH:mm:ss");
            },
        },
    })
);
// Criação de Helpers customizados
var hbs = handlebars.create({});
// verificar se valores são iguais
hbs.handlebars.registerHelper("if_eq", function (a, b, opts) {
    if (a && b && a.toString() == b.toString()) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

hbs.handlebars.registerHelper("json", (value, opts) => {
    return opts.fn(JSON.stringify(value))
});

hbs.handlebars.registerHelper("find_by_id", (list, _id, opts) => {
    const item = list.find(element => element._id === _id);
    return opts.fn(item)
});
app.set('view engine', 'handlebars');

// Moongoose
//mongoose.Promise = global.Promise;
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
//mongoose.connect("mongodb+srv://bdappalmoxarifado:ddapj060814@cluster0-p1olg.mongodb.net/warehouseapp?retryWrites=true&w=majority").then(() => {
mongoose
    .connect(db.mongoURI)
    .then(() => {
        console.log("conectado ao mongo");
    })
    .catch((err) => {
        console.log("Erro ao se conectar" + err);
    });

app.use(express.static(path.join(__dirname, "public")));



//ROTAS
app.use('/', indexRouter);
app.use("/auth", authRoute);
app.use("/planning", planningRoute);


//SERVER
const port = normalizaPort(process.env.PORT || '5000');
function normalizaPort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}
app.listen(port, function () {
    console.log(`App rodando na porta ${port}`)
})