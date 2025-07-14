import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h1>🛍️ Saree Products</h1>
      {products.length === 0 ? (
        <p>Loading...</p>
      ) : (
        products.map(p => (
          <div key={p._id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc' }}>
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
