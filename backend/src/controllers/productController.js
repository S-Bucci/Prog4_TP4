const { db } = require('../config/database');

const getProducts = (req, res) => {
  const { category, search } = req.query;
  
  // El middleware ya ha validado los caracteres peligrosos, se pasa directamente a la consulta
  let query;
  let params;
  
  if (category && search) {
    query = 'SELECT * FROM products WHERE category = ? AND name LIKE ?';
    params = [category, '%' + search + '%'];
  } else if (category) {
    query = 'SELECT * FROM products WHERE category = ?';
    params = [category];
  } else if (search) {
    query = 'SELECT * FROM products WHERE name LIKE ?';
    params = ['%' + search + '%'];
  } else {
    query = 'SELECT * FROM products';
    params = [];
  }
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json(results);
  });
};

module.exports = {
  getProducts
};
