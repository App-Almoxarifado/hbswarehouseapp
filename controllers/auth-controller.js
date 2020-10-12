
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const authConfig = require('../config/auth.json');
require("../models/User");
const User = mongoose.model("users");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}

exports.get = async (req, res) => {
  try {
    res.render("auth/register", {});
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/");
  }
};
//CADASTRANDO UM USUÁRIO
exports.register = async (req, res) => {
  const { email } = req.body;
  
  try {
    if (await User.findOne({ email }))
    req.flash("error_msg","Este email ja está registrado");
  
    const user = await User.create(req.body);

    user.password = undefined;

    req.flash("success_msg", "Usuario criado com sucesso!");
    res.redirect("/", {user,token: generateToken({ id: user.id })});
    console.log(user,token)
  } catch (err) {
    req.flash("error_msg"," Houve um erro ao salvar o usuário, tente novamente!");
    res.redirect("/");
    console.log(err);
  }
};

//ROTA DE AUTENTICAÇÃO
  exports.authenticate = async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email }).select('+password').lean();
  
    if (!user)
      return res.status(400).send({ error: 'User not found' });
  
    if (!await bcrypt.compare(password, user.password))
      return res.status(400).send({ error: 'Invalid password' });
  
    user.password = undefined;
  
    res.render("index", {user,token: generateToken({ id: user.id })});
    console.log(user)
  };
