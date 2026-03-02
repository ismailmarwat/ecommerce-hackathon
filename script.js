// ── Data ────────────────────────────────────────────────
// SS26 Women's trends inspired: fringe, statement skirts, scarf/bow tops, pleated, romantic layers, bold textures
const products = [
  { 
  id: "p1", 
  name: "CRP Elite Laptop", 
  brand: "Tech", 
  price: 899, 
  image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=2000"
},
  { 
    id: "p2", 
    name: "Petal Statement Midi Skirt",     
    brand: "Toteme Vibes",   
    price: 98,  
    image: "https://images.pexels.com/photos/1007066/pexels-photo-1007066.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  { 
    id: "p3", 
    name: "Fluid Scarf Tie Blouse",       
    brand: "Vince Style", 
    price: 79,  
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: "p4", 
    name: "Peplum Lace Top",    
    brand: "Erdem Touch",        
    price: 89,  
    image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  { 
    id: "p5", 
    name: "Bow Pussy-Bow Blouse",  
    brand: "Romantic SS26",   
    price: 69,  
    image: "https://media2.newlookassets.com/i/newlook/936463273/womens/clothing/tops/pink-pussybow-neck-blouse.jpg?strip=true&qlt=50&w=720"
  },
  { 
    id: "p6", 
    name: "Satin Slip Dress (Pastel)",  
    brand: "Slip Revival",        
    price: 95,  
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800"
  },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// ── DOM Elements ────────────────────────────────────────
const cartSidebar     = document.getElementById('cartSidebar');
const cartToggle      = document.getElementById('cartToggle');
const cartClose       = document.getElementById('cartClose');
const cartItemsEl     = document.getElementById('cartItems');
const cartTotalEl     = document.getElementById('cartTotal');
const cartCountEl     = document.getElementById('cartCount');
const cartCountHeader = document.getElementById('cartCountHeader');
const checkoutBtn     = document.getElementById('checkoutBtn');

// ── Cart Functions ──────────────────────────────────────
function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEl.textContent = totalItems;
  cartCountHeader.textContent = totalItems;

  let totalPrice = 0;
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p style="text-align:center; color:#777; padding:2rem;">Your cart is empty. Start shopping!</p>';
  }

  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-info">
        <div class="item-title">${item.name}</div>
        <div class="item-price">$${item.price.toFixed(2)}</div>
        <div class="quantity-control">
          <button class="qty-btn" onclick="changeQuantity(${index}, -1)">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
        </div>
        <div class="remove-item" onclick="removeFromCart(${index})">Remove</div>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

  cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;
}

window.changeQuantity = function(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  updateCart();
};

window.removeFromCart = function(index) {
  cart.splice(index, 1);
  updateCart();
};

// ── Auth UI ─────────────────────────────────────────────
function updateAuthUI() {
  const area = document.getElementById('authArea');
  if (currentUser) {
    area.innerHTML = `
      <span>${currentUser.name}</span>
      <button class="auth-btn logout-btn" onclick="logout()">Logout</button>
    `;
  } else {
    area.innerHTML = `<button class="auth-btn login-btn" onclick="document.getElementById('loginModal').style.display='flex'">Login</button>`;
  }
}

function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  updateAuthUI();
  alert("Logged out successfully.");
}

// ── Render Products ─────────────────────────────────────
function renderProducts() {
  const container = document.getElementById('productList');
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="card-body">
        <div class="brand">${p.brand}</div>
        <div class="name">${p.name}</div>
        <div class="price">$${p.price.toFixed(2)}</div>
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const prod = products.find(p => p.id === id);
      if (!prod) return;

      let existing = cart.find(item => item.id === id);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ ...prod, quantity: 1 });
      }

      updateCart();
      cartSidebar.classList.add('open');
      const originalText = btn.textContent;
      btn.textContent = "Added ✓";
      btn.style.background = '#16a34a';
      setTimeout(() => { 
        btn.textContent = originalText; 
        btn.style.background = ''; 
      }, 1800);
    });
  });
}

// ── Event Listeners ─────────────────────────────────────
cartToggle.addEventListener('click', () => {
  cartSidebar.classList.toggle('open');
  updateCart();
});

cartClose.addEventListener('click', () => {
  cartSidebar.classList.remove('open');
});

checkoutBtn.addEventListener('click', () => {
  if (!currentUser) {
    alert("Please login to proceed to checkout.");
    document.getElementById('loginModal').style.display = 'flex';
    cartSidebar.classList.remove('open');
    return;
  }
  alert("Checkout simulation → Redirecting to payment page (demo only)");
});

// Login / Register logic (simulation)
document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value;

  if (name && email && pass.length >= 6) {
    localStorage.setItem('currentUser', JSON.stringify({ name, email }));
    currentUser = { name, email };
    updateAuthUI();
    document.getElementById('registerModal').style.display = 'none';
    alert("Registration successful! You are now logged in.");
  } else {
    alert("Please fill all fields correctly (password min 6 chars).");
  }
});

document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;

  if (email && pass) {
    localStorage.setItem('currentUser', JSON.stringify({ name: email.split('@')[0], email }));
    currentUser = { name: email.split('@')[0], email };
    updateAuthUI();
    document.getElementById('loginModal').style.display = 'none';
    alert("Login successful!");
  } else {
    alert("Please enter email and password.");
  }
});

document.getElementById('toRegister').addEventListener('click', () => {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('registerModal').style.display = 'flex';
});

document.getElementById('toLogin').addEventListener('click', () => {
  document.getElementById('registerModal').style.display = 'none';
  document.getElementById('loginModal').style.display = 'flex';
});

// Close modal on outside click
window.addEventListener('click', e => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// ── Init ────────────────────────────────────────────────
renderProducts();
updateAuthUI();
updateCart();
