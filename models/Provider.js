const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();


const Provider = new Schema({
  //QRCODE
  qrcode: {
    type: String,
    lowercase: true,
    required: false,
  },
  //IMAGEM
  image: {
    type: String,
    require: true,
  },
  //IMAGEM
  key: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  clientCode: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  socialReason: {
    type: String,
    required: true,
  },
  cpfCnpj: {
    type: String,
    required: true,
  },
  ie: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cep: {
    type: String,
    required: true,
  },
  logradouro: {
    type: String,
    required: true,
  },
  bairro: {
    type: String,
    required: true,
  },
  complemento: {
    type: String,
    required: true,
  },
  cidade: {
    type: String,
    required: true,
  },
  uf: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  //DATA DE LANÇAMENTO
  releaseDateOf: {
    type: String,
    //default: Date.now()
  },
  //USUARIO LANÇAMENTO
  userLaunch: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
    //required: true
  },
  //EMAIL LANÇAMENTO
  emailLaunch: {
    type: String,
    //default: Date.now()
  },
  //DATA DE EDIÇÃO
  editionDate: {
    type: String,
    //default: Date.now()
  },
  //USUARIO DE EDIÇÃO
  userEdtion: {
    type: Schema.Types.ObjectId,
    ref: "collaborators",
    index: true
    //required: true
  },
  //EMAIL DE EDIÇÃO
  emailEdtion: {
    type: String,
    //required: true,
  },
  active: {
    type: Boolean,
    default: "true",
  },
});

Provider.pre("save", function () {
  if (!this.image) {
    this.image = `${process.env.APP_URL}/files/${this.key}`;
  }
});

Provider.pre("remove", function () {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: this.key
      })
      .promise()
      .then(response => {
        console.log(response.status);
      })
      .catch(response => {
        console.log(response.status);
      });
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "tmp", "uploads", this.key)
    );
  }
});


mongoose.model("providers", Provider);
