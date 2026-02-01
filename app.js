// ============================================
// NYSHOE - E-COMMERCE JAVASCRIPT
// ============================================

// ---- SHOE PRODUCTS DATA ----
var products = [
  { id: 1, name: "Air Runner Pro", emoji: "👟", price: 129, desc: "Lightweight running shoes with breathable mesh." },
  { id: 2, name: "Classic Sneakers", emoji: "👟", price: 89, desc: "Timeless white sneakers for everyday wear." },
  { id: 3, name: "Sport Trainers", emoji: "👟", price: 110, desc: "High-performance training shoes with grip." },
  { id: 4, name: "Urban Walk", emoji: "👞", price: 95, desc: "Comfortable walking shoes for city life." },
  { id: 5, name: "Trail Hikers", emoji: "🥾", price: 145, desc: "Durable hiking boots for rough terrain." },
  { id: 6, name: "Canvas Low-Tops", emoji: "👟", price: 65, desc: "Casual canvas shoes in multiple colors." },
  { id: 7, name: "Speed Racers", emoji: "👟", price: 159, desc: "Professional racing shoes with carbon plate." },
  { id: 8, name: "Skate Kicks", emoji: "🛹", price: 79, desc: "Durable skateboarding shoes with padding." },
  { id: 9, name: "Office Loafers", emoji: "👞", price: 99, desc: "Elegant leather loafers for formal wear." },
  { id: 10, name: "Beach Sandals", emoji: "🩴", price: 45, desc: "Waterproof sandals perfect for summer." },
  { id: 11, name: "Winter Boots", emoji: "🥾", price: 135, desc: "Insulated boots for cold weather comfort." },
  { id: 12, name: "Gym Flex", emoji: "👟", price: 105, desc: "Flexible gym shoes for cross-training." }
];

// ---- CART STATE (IN-MEMORY) ----
var cart = [];

// ---- TOAST NOTIFICATION ----
function showToast(message) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function() {
    toast.classList.remove("show");
  }, 2500);
}

// ---- CART FUNCTIONS ----
function addToCart(productId) {
  var product = products.find(function(p) { return p.id === productId; });
  if (!product) return;

  var existingItem = cart.find(function(item) { return item.id === productId; });
  
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      emoji: product.emoji,
      price: product.price,
      qty: 1
    });
  }
  
  updateCartBadge();
  showToast("✓ " + product.name + " added to cart!");
}

function removeFromCart(productId) {
  cart = cart.filter(function(item) { return item.id !== productId; });
  updateCartBadge();
  renderCart();
  showToast("Item removed from cart");
}

function updateQuantity(productId, change) {
  var item = cart.find(function(i) { return i.id === productId; });
  if (!item) return;
  
  item.qty += change;
  
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  
  updateCartBadge();
  renderCart();
}

function getCartTotal() {
  return cart.reduce(function(total, item) {
    return total + (item.price * item.qty);
  }, 0);
}

function getCartCount() {
  return cart.reduce(function(count, item) {
    return count + item.qty;
  }, 0);
}

function updateCartBadge() {
  var badge = document.getElementById("cartBadge");
  if (!badge) return;
  
  var count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? "inline" : "none";
}

// ---- RENDER PRODUCTS (index.html) ----
function renderProducts() {
  var grid = document.getElementById("productsGrid");
  if (!grid) return;
  
  var html = products.map(function(product) {
    return '<div class="product-card">' +
      '<div class="product-img">' + product.emoji + '</div>' +
      '<div class="product-body">' +
        '<h3>' + product.name + '</h3>' +
        '<p>' + product.desc + '</p>' +
        '<div class="product-price">$' + product.price + '</div>' +
        '<button class="btn btn-full" onclick="addToCart(' + product.id + ')">Add to Cart</button>' +
      '</div>' +
    '</div>';
  }).join("");
  
  grid.innerHTML = html;
}

// ---- RENDER CART (cart.html) ----
function renderCart() {
  var container = document.getElementById("cartItemsContainer");
  if (!container) return;
  
  // Empty cart state
  if (cart.length === 0) {
    container.innerHTML = 
      '<div class="empty-cart">' +
        '<div style="font-size:80px;margin-bottom:20px;">🛒</div>' +
        '<h2>Your Cart is Empty</h2>' +
        '<p>Looks like you haven\'t added any shoes yet.<br>Browse our collection to find your perfect pair!</p>' +
        '<a href="index.html" class="btn btn-blue">Shop Now</a>' +
      '</div>';
    
    // Hide summary
    var summary = document.getElementById("cartSummary");
    if (summary) summary.style.display = "none";
    return;
  }
  
  // Show summary
  var summary = document.getElementById("cartSummary");
  if (summary) summary.style.display = "block";
  
  // Build cart table
  var html = '<table class="cart-table">' +
    '<thead>' +
      '<tr>' +
        '<th>Product</th>' +
        '<th>Price</th>' +
        '<th>Quantity</th>' +
        '<th>Total</th>' +
        '<th></th>' +
      '</tr>' +
    '</thead>' +
    '<tbody>';
  
  cart.forEach(function(item) {
    var itemTotal = (item.price * item.qty).toFixed(2);
    html += '<tr>' +
      '<td>' +
        '<div class="cart-item-info">' +
          '<div class="item-emoji">' + item.emoji + '</div>' +
          '<div class="item-name">' +
            '<h4>' + item.name + '</h4>' +
            '<p>NyShoe Collection</p>' +
          '</div>' +
        '</div>' +
      '</td>' +
      '<td>$' + item.price + '</td>' +
      '<td>' +
        '<div class="qty-controls">' +
          '<button class="qty-btn" onclick="updateQuantity(' + item.id + ', -1)">−</button>' +
          '<span class="qty-value">' + item.qty + '</span>' +
          '<button class="qty-btn" onclick="updateQuantity(' + item.id + ', 1)">+</button>' +
        '</div>' +
      '</td>' +
      '<td><strong>$' + itemTotal + '</strong></td>' +
      '<td><button class="btn-remove" onclick="removeFromCart(' + item.id + ')" title="Remove item">✕</button></td>' +
    '</tr>';
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
  
  // Update summary
  updateCartSummary();
}

function updateCartSummary() {
  var subtotal = getCartTotal();
  var shipping = subtotal >= 200 ? 0 : 15;
  var tax = (subtotal * 0.08).toFixed(2);
  var total = (subtotal + shipping + parseFloat(tax)).toFixed(2);
  
  document.getElementById("subtotalValue").textContent = "$" + subtotal.toFixed(2);
  document.getElementById("shippingValue").textContent = shipping === 0 ? "FREE" : "$" + shipping;
  document.getElementById("taxValue").textContent = "$" + tax;
  document.getElementById("totalValue").textContent = "$" + total;
}

function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  showToast("🎉 Checkout feature coming soon!");
}

// ---- CONTACT FORM (contact.html) ----
function initContactForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;
  
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    var isValid = true;
    
    // Clear all previous errors
    var formGroups = form.querySelectorAll(".form-group");
    formGroups.forEach(function(group) {
      group.classList.remove("error");
    });
    
    // Validate Name
    var nameInput = document.getElementById("contactName");
    if (nameInput.value.trim().length < 2) {
      nameInput.closest(".form-group").classList.add("error");
      isValid = false;
    }
    
    // Validate Email
    var emailInput = document.getElementById("contactEmail");
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.closest(".form-group").classList.add("error");
      isValid = false;
    }
    
    // Validate Subject
    var subjectSelect = document.getElementById("contactSubject");
    if (!subjectSelect.value) {
      subjectSelect.closest(".form-group").classList.add("error");
      isValid = false;
    }
    
    // Validate Message
    var messageInput = document.getElementById("contactMessage");
    if (messageInput.value.trim().length < 10) {
      messageInput.closest(".form-group").classList.add("error");
      isValid = false;
    }
    
    if (!isValid) {
      showToast("⚠ Please fix the errors in the form");
      return;
    }
    
    // Success - hide form and show success message
    form.style.display = "none";
    document.getElementById("successMessage").classList.add("show");
    showToast("✓ Message sent successfully!");
  });
  
  // Clear error on input
  var inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach(function(input) {
    input.addEventListener("input", function() {
      this.closest(".form-group").classList.remove("error");
    });
  });
}

function resetContactForm() {
  var form = document.getElementById("contactForm");
  var successMsg = document.getElementById("successMessage");
  
  form.style.display = "block";
  form.reset();
  successMsg.classList.remove("show");
}

// ---- INITIALIZE ON PAGE LOAD ----
document.addEventListener("DOMContentLoaded", function() {
  // Update cart badge on all pages
  updateCartBadge();
  
  // Page-specific initializations
  if (document.getElementById("productsGrid")) {
    renderProducts();
  }
  
  if (document.getElementById("cartItemsContainer")) {
    renderCart();
  }
  
  if (document.getElementById("contactForm")) {
    initContactForm();
  }
});
