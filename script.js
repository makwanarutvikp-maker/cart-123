// ========================================
// Hostel Kart - FINAL SCRIPT (BUG FIXED + SAFE)
// ========================================

// 👇 GLOBAL WHATSAPP NUMBER
const WHATSAPP_NUMBER = "919723226231";


// ========================================
// CART HELPERS (CLEAN + SAFE)
// ========================================
function getCart() {
    return JSON.parse(localStorage.getItem('hostelKartCart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('hostelKartCart', JSON.stringify(cart));
}


// Global product state
let allProducts = [];


// ========================================
// LOAD PRODUCTS (FIXED + NORMALIZED DATA)
// ========================================
async function loadProducts() {
    try {
        const response = await fetch('products.json');

        const rawData = await response.json();

        // ✅ FIX: normalize keys so "NA issue" never happens
        allProducts = rawData.map(p => ({
            name: p.name || p.Name || "NA",
            price: p.price || 0,
            image: p.image || "https://via.placeholder.com/100",
            description: p.description || "",
            filename: p.filename || "#"
        }));

        renderProducts();

    } catch (error) {
        console.error('Error loading products:', error);

        const container = document.getElementById('products-container');
        if (container) {
            container.innerHTML =
                '<p style="text-align:center;color:#999;">Error loading products</p>';
        }
    }
}


// ========================================
// RENDER PRODUCTS (SAFE + FIXED BUTTON)
// ========================================
function renderProducts(productsToShow = allProducts) {

    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';

    const fragment = document.createDocumentFragment();

    productsToShow.forEach(product => {

        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        productDiv.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-info">
                <h3>${product.name || "NA"}</h3>

                <div class="price">
                    ₹${Number(product.price || 0).toLocaleString()}
                </div>

                <p>${product.description || ''}</p>

                <div class="button-group">
                    <a href="${product.filename}">View</a>
                    <button class="add-btn">Add to Cart</button>
                </div>
            </div>
        `;

        // ✅ FIX: safe event listener (no onclick bug)
        productDiv.querySelector('.add-btn').addEventListener('click', () => {
            addToCart(product.name, product.price);
        });

        fragment.appendChild(productDiv);
    });

    container.appendChild(fragment);
}


// ========================================
// SEARCH FILTER (IMPROVED)
// ========================================
function filterProducts() {

    const search =
        document.querySelector('.search')?.value.toLowerCase() || '';

    const filtered =
        allProducts.filter(product =>
            (product.name + product.description)
                .toLowerCase()
                .includes(search)
        );

    renderProducts(filtered);
}


// ========================================
// ADD TO CART (FIXED + SAFE)
// ========================================
function addToCart(name, price, qty = 1) {

    const cart = getCart();

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += Number(qty);
    } else {
        cart.push({
            name: name || "NA",
            price: Number(price) || 0,
            quantity: Number(qty),
            image: allProducts.find(p => p.name === name)?.image || ""
        });
    }

    saveCart(cart);
    updateCartCount();

    showToast(`Added ${name}`, 'success');
}


// ========================================
// CART COUNT
// ========================================
function updateCartCount() {

    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;

    const cart = getCart();

    const totalItems =
        cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    cartCount.textContent = totalItems;
}


// ========================================
// TOAST
// ========================================
function showToast(message, type = 'success') {

    const toast = document.createElement('div');

    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 12px 18px;
        border-radius: 8px;
        z-index: 9999;
        font-size: 14px;
    `;

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2500);
}


// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', function () {

    loadProducts();
    updateCartCount();

    const search = document.querySelector('.search');

    if (search) {
        search.addEventListener('input', filterProducts);
    }

});