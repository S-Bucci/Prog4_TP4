const caracteresPeligrosos = [";", "'", "--", "`", '"', "\\"];

const contieneCaracterPeligroso = (texto) => {
  return caracteresPeligrosos.some(char => texto.includes(char));
};

const validarCaracteresPeligrosos = (req, res, next) => {
  const { category, search } = req.query;
  
  // Si contiene caracteres peligrosos, devolver 200 con array vacío
  if ((category && contieneCaracterPeligroso(category)) || 
      (search && contieneCaracterPeligroso(search))) {
    return res.status(200).json([]); //Devuelve 200 con []
  }
  
  next();
};

module.exports = { 
  validarCaracteresPeligrosos,
  contieneCaracterPeligroso,
  caracteresPeligrosos
};