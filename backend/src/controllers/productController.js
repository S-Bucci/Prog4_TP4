const { db } = require('../config/database');

const getProducts = (req, res) => {
  const { category, search } = req.query;
  
  let query;
  let params;
  
  // Usar consultas parametrizadas/prepared statements
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
    
    // Filtrar resultados en memoria
    let filteredResults = results;
    
    if (category) {
      filteredResults = filteredResults.filter(p => p.category === category);
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredResults = filteredResults.filter(p => 
        p.name.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json(filteredResults);
  });
};

module.exports = {
  getProducts
};
