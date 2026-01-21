// LOAD CART FROM STORAGE
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// UPDATE CART COUNT ON PAGE LOAD
document.addEventListener("DOMContentLoaded", updateCartCount);

/* ADD TO CART */
function addToCart(name, price) {
  let product = cart.find(item => item.name === name);

  if (product) {
    product.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart();
}

/* REMOVE FROM CART */
function removeFromCart(name) {
  let product = cart.find(item => item.name === name);

  if (product) {
    product.qty -= 1;
    if (product.qty === 0) {
      cart = cart.filter(item => item.name !== name);
    }
  }

  saveCart();
  loadCart();
}

/* SAVE CART */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

/* UPDATE CART COUNT (FIXED) */
function updateCartCount() {
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  let cartCountEl = document.getElementById("cart-count");

  if (cartCountEl) {
    cartCountEl.innerText = count;
  }
}

/* SEARCH PRODUCTS */
function searchProducts() {
  let input = document.getElementById("searchInput").value.toLowerCase();
  let products = document.getElementsByClassName("product-card");

  for (let product of products) {
    let name = product.querySelector("h3").innerText.toLowerCase();
    product.style.display = name.includes(input) ? "block" : "none";
  }
}

/* CART PAGE LOAD */
if (window.location.pathname.includes("cart.html")) {
  document.addEventListener("DOMContentLoaded", loadCart);
}

function loadCart() {
  let table = document.getElementById("cart-table");
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th>Product</th>
      <th>Price (₹)</th>
      <th>Qty</th>
      <th>Total (₹)</th>
      <th>Action</th>
    </tr>
  `;

  let total = 0;

  cart.forEach(item => {
    let row = table.insertRow();
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.qty}</td>
      <td>${item.price * item.qty}</td>
      <td>
        <button class="action-btn" onclick="removeFromCart('${item.name}')">−</button>
      </td>
    `;
    total += item.price * item.qty;
  });

  document.getElementById("grand-total").innerText =
    "Grand Total: ₹" + total;
}

/* CHECKOUT PAGE */
if (window.location.pathname.includes("checkout.html")) {
  document.addEventListener("DOMContentLoaded", loadCheckout);
}

function loadCheckout() {
  let summary = document.getElementById("summary");
  let finalTotal = 0;

  cart.forEach(item => {
    let div = document.createElement("div");
    div.innerText = `${item.name} x ${item.qty} = ₹${item.price * item.qty}`;
    summary.appendChild(div);
    finalTotal += item.price * item.qty;
  });

  document.getElementById("final-total").innerText =
    "Total: ₹" + finalTotal;
}

function placeOrder() {
  let name = document.getElementById("name").value;
  let address = document.getElementById("address").value;
  let phone = document.getElementById("phone").value;

  let paymentMethod = document.querySelector('input[name="payment"]:checked');

  if (!name || !address || !phone) {
    alert("Please fill all shipping details");
    return;
  }

  if (!paymentMethod) {
    alert("Please select a payment method");
    return;
  }

  // Create order object
  let order = {
    id: "ZENVY" + Date.now(),
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    payment: paymentMethod.value,
    date: new Date().toLocaleString()
  };

  // Save order history
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Clear cart
  localStorage.removeItem("cart");
  cart = [];

  window.location.href = "success.html";
}



/* AUTH LOGIC */

function showSignup() {
  document.getElementById("form-title").innerText = "Sign Up";
  document.querySelector("button").innerText = "Sign Up";
  document.querySelector("button").setAttribute("onclick", "signup()");
  document.getElementById("toggle-text").innerHTML =
    'Already have an account? <span onclick="showLogin()">Login</span>';
}

function showLogin() {
  document.getElementById("form-title").innerText = "Login";
  document.querySelector("button").innerText = "Login";
  document.querySelector("button").setAttribute("onclick", "login()");
  document.getElementById("toggle-text").innerHTML =
    'Don’t have an account? <span onclick="showSignup()">Sign up</span>';
}

function signup() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please fill all fields");
    return;
  }

  localStorage.setItem("zenvyUser", JSON.stringify({ username, password }));
  alert("Signup successful! Please login.");
  showLogin();
}

function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let user = JSON.parse(localStorage.getItem("zenvyUser"));

  if (!user || user.username !== username || user.password !== password) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem("loggedInUser", username);
  alert("Login successful!");
  window.location.href = "index.html";
}
/* SHOW LOGGED IN USER */
document.addEventListener("DOMContentLoaded", () => {
  let user = localStorage.getItem("loggedInUser");
  let userNameEl = document.getElementById("user-name");
  let loginLink = document.getElementById("login-link");

  if (user && userNameEl && loginLink) {
    userNameEl.innerText = "👤 " + user;
    loginLink.style.display = "none";
  }
});

function logout(event) {
  if (event) event.preventDefault();
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

/* CLEAR CART */
function clearCart() {
  if (cart.length === 0) {
    alert("Cart is already empty");
    return;
  }

  let confirmClear = confirm("Are you sure you want to clear the cart?");
  if (!confirmClear) return;

  cart = [];
  localStorage.removeItem("cart");

  updateCartCount();
  loadCart();

  alert("🗑️ Cart cleared successfully");
}
/* SHOW LOGGED IN USER */
document.addEventListener("DOMContentLoaded", () => {
  let user = localStorage.getItem("loggedInUser");
  let userNameEl = document.getElementById("user-name");
  let loginLink = document.getElementById("login-link");

  if (user && userNameEl && loginLink) {
    userNameEl.innerText = "👤 " + user;
    loginLink.style.display = "none";
  }
});

function logout() {
  localStorage.removeItem("loggedInUser");
  alert("Logged out successfully");
  window.location.reload();
}
/* ORDER HISTORY PAGE */
if (window.location.pathname.includes("orders.html")) {
  document.addEventListener("DOMContentLoaded", loadOrders);
}

function loadOrders() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let container = document.getElementById("orders-list");

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders placed yet.</p>";
    return;
  }

  orders.reverse().forEach(order => {
    let div = document.createElement("div");
    div.className = "order-card";

    let itemsList = order.items
      .map(item => `${item.name} × ${item.qty}`)
      .join("<br>");

    div.innerHTML = `
      <h3>Order ID: ${order.id}</h3>
      <p><b>Date:</b> ${order.date}</p>
      <p><b>Items:</b><br>${itemsList}</p>
      <p><b>Payment:</b> ${order.payment}</p>
      <p><b>Total:</b> ₹${order.total}</p>
    `;

    container.appendChild(div);
  });
}
/* PRODUCT DETAILS PAGE LOGIC */

function openProduct(name, price, img, desc) {
  let product = { name, price, img, desc };
  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "product.html";
}

if (window.location.pathname.includes("product.html")) {
  document.addEventListener("DOMContentLoaded", loadProduct);
}

function loadProduct() {
  let product = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!product) return;

  document.getElementById("product-img").src = product.img;
  document.getElementById("product-name").innerText = product.name;
  document.getElementById("product-price").innerText = "₹" + product.price;
  document.getElementById("product-desc").innerText = product.desc;

  document.getElementById("detail-cart-btn").onclick = function () {
    addToCart(product.name, product.price);
    alert("Added to cart");
  };
}
// SHOW LOGGED IN USER NAME IN NAVBAR
document.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const userNameEl = document.getElementById("user-name");
  const loginLink = document.getElementById("login-link");

  if (loggedInUser && userNameEl) {
    userNameEl.textContent = "👤 " + loggedInUser;
    userNameEl.style.fontWeight = "600";
    userNameEl.style.color = "#7b1fa2";
  }

  if (loggedInUser && loginLink) {
    loginLink.style.display = "none";
  }
});
// SHOW LOGGED-IN USER NAME IN NAVBAR
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");
  const nameSpan = document.getElementById("navbar-username");
  const loginLink = document.getElementById("login-link");

  if (username && nameSpan) {
    nameSpan.textContent = "👤 " + username;
  }

  if (username && loginLink) {
    loginLink.style.display = "none";
  }
});
// SHOW USERNAME & HANDLE LOGOUT
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("loggedInUser");

  const nameSpan = document.getElementById("navbar-username");
  const loginLink = document.getElementById("login-link");
  const logoutLink = document.getElementById("logout-link");

  if (username) {
    if (nameSpan) nameSpan.textContent = "👤 " + username;
    if (loginLink) loginLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "inline";
  }
});

// LOGOUT FUNCTION
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.reload();
}

