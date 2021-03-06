const mongoose = require("mongoose");
require("../models/Product");
const Product = mongoose.model("products");
require("../models/Group");
const Group = mongoose.model("groups");
require("../models/Subgroup");
const Subgroup = mongoose.model("subgroups");
require("../models/Client");
const Client = mongoose.model("customers");
require("../models/Location");
const Location = mongoose.model("leases");
require("../models/Sublease");
const Sublease = mongoose.model("subleases");
require("../models/Status");
const Status = mongoose.model("status");
require("../models/Type");
const Type = mongoose.model("types");
require("../models/Unity");
const Unity = mongoose.model("unitys");
require("../models/Interval");
const Interval = mongoose.model("breaks");
require("../models/Provider");
const Provider = mongoose.model("providers");
require("../models/Collaborator");
const Collaborator = mongoose.model("collaborators");

//VIZUALIZANDO PRODUTOS PARA FAZER PEDIDO
exports.getReceivement = async (req, res) => {
  try {
    const filtros = [];
    let { search, page } = req.query;
    if (search) {
      const pattern = new RegExp(`.*${search}.*`);
      filtros.push({
        qrcode: {
          $regex: pattern,
        },
      });
      filtros.push({
        description: {
          $regex: pattern,
        },
      });
      filtros.push({
        user: {
          $regex: pattern,
        },
      });
      filtros.push({
        tags: {
          $regex: pattern,
        },
      });
    }

    page = page || 1;

    const quant = await Product.find(
      filtros.length > 0
        ? {
            $or: filtros,
          }
        : {}
    ).estimatedDocumentCount();

    var products = await Product.find(
      filtros.length > 0
        ? {
            $or: filtros,
          }
        : {}
    )
      .sort({
        editionDate: "desc",
      })
      .limit(3)
      .skip(page && Number(page) > 1 ? Number(page - 1) * 3 : 0)
      .populate("group")
      .populate("subgroup")
      .populate("client")
      .populate("local")
      .populate("sublease")
      .populate("physicalStatus")
      .populate("kindOfEquipment")
      .populate("kindOfEquipment")
      .populate("unity")
      .populate("frequency")
      .populate("provider")
      .populate("userLaunch")
      .populate("userEdition");

    res.render("products/productreceivement", {
      products: products.map((products) => products.toJSON()),
      prev: Number(page) > 1,
      next: Number(page) * 3 < quant,
      page,
    });
  } catch (err) {
    req.flash("error_msg", "Ops, Houve um erro interno!");
    res.redirect("/products/products");
  }
};

//RECEBENDO PRODUTOS
exports.postReceivement = async (req, res) => {
  var erros = [];
  if (
    !req.body.fullDescription ||
    typeof req.body.fullDescription == undefined ||
    req.body.fullDescription == null
  ) {
    erros.push({
      texto: "Descricão Inválida",
    });
  }

  if (req.body.fullDescription.length < 2) {
    erros.push({
      texto: "Descrição do produto muito pequena!",
    });
  }
  if (erros.length > 0) {
    res.render("products/addproducts", {
      erros: erros,
    });
  } else {
    try {
      const products = new Product({
        qrcode: req.body.qrcode,

        image: req.body.image,

        fullDescription: req.body.fullDescription,

        group: req.body.group,

        subgroup: req.body.subgroup,

        //client: req.body.client,

        physicalStatus: req.body.physicalStatus,

        kindOfEquipment: req.body.kindOfEquipment,

        inputAmount: req.body.inputAmount,

        active: "stock",
      });
      await products.save();
      req.flash("success_msg", "Produto solicitado, enviado para pedido!");
      res.redirect("/products/receivement");
    } catch (err) {
      req.flash(
        "error_msg",
        "Ops, Houve um erro ao salvar o Produto, tente novamente!"
      );
      res.redirect("/products");
    }
  }
};
