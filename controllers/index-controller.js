

  exports.getIndex = async (req, res) => {
    try {
      res.render("index", {user:req.user});
    } catch (err) {
      req.flash("error_msg", "Ops, Houve um erro interno!");
      res.redirect("/");
    }
  };