/* =========================================
   MEET SHOP - MAIN JAVASCRIPT
========================================= */


/* =========================================
   PRODUCTS
========================================= */

const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        category: "Fashion",
        price: 799,
        icon: "👕",
        description: "Comfortable everyday cotton t-shirt."
    },

    {
        id: 2,
        name: "Premium Hoodie",
        category: "Fashion",
        price: 1499,
        icon: "🧥",
        description: "Soft and stylish hoodie for everyday wear."
    },

    {
        id: 3,
        name: "Smart Laptop",
        category: "Electronics",
        price: 54999,
        icon: "💻",
        description: "Powerful laptop for work, study and entertainment."
    },

    {
        id: 4,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        icon: "🎧",
        description: "Comfortable wireless headphones with clear sound."
    },

    {
        id: 5,
        name: "Running Shoes",
        category: "Shoes",
        price: 2199,
        icon: "👟",
        description: "Comfortable running shoes for everyday activities."
    },

    {
        id: 6,
        name: "Casual Sneakers",
        category: "Shoes",
        price: 1799,
        icon: "👟",
        description: "Modern casual sneakers with comfortable design."
    },

    {
        id: 7,
        name: "Classic Watch",
        category: "Accessories",
        price: 1299,
        icon: "⌚",
        description: "Elegant watch for everyday and formal occasions."
    },

    {
        id: 8,
        name: "Leather Wallet",
        category: "Accessories",
        price: 699,
        icon: "👝",
        description: "Compact wallet with a clean and classic design."
    }
];


/* =========================================
   LOCAL STORAGE
========================================= */

function getCart() {
    return JSON.parse(localStorage.getItem("meetShopCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("meetShopCart", JSON.stringify(cart));
}

function getWishlist() {
    return JSON.parse(localStorage.getItem("meetShopWishlist")) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem("meetShopWishlist", JSON.stringify(wishlist));
}


/* =========================================
   FORMAT PRICE
========================================= */

function formatPrice(price) {
    return "₹" + price.toLocaleString("en-IN");
}


/* =========================================
   UPDATE HEADER COUNTS
========================================= */

function updateCounts() {

    const cart = getCart();
    const wishlist = getWishlist();

    const cartCount = document.querySelectorAll("#cartCount");
    const wishlistCount = document.querySelectorAll("#wishlistCount");

    let totalCartItems = 0;

    cart.forEach(item => {
        totalCartItems += item.quantity;
    });

    cartCount.forEach(element => {
        element.textContent = totalCartItems;
    });

    wishlistCount.forEach(element => {
        element.textContent = wishlist.length;
    });
}


/* =========================================
   PRODUCT CARD
========================================= */

function productCard(product) {

    const wishlist = getWishlist();

    const isWishlisted = wishlist.includes(product.id);

    return `
        <div class="product-card">

            <a href="product-details.html?id=${product.id}">
                <div class="product-image">
                    ${product.icon}
                </div>
            </a>

            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-bottom">

                    <span class="price">
                        ${formatPrice(product.price)}
                    </span>

                    <div class="product-actions">

                        <button
                            class="icon-btn"
                            onclick="toggleWishlist(${product.id})"
                            title="Wishlist"
                        >
                            ${isWishlisted ? "♥" : "♡"}
                        </button>

                        <button
                            class="icon-btn"
                            onclick="addToCart(${product.id})"
                            title="Add to cart"
                        >
                            🛒
                        </button>

                    </div>

                </div>

            </div>
        </div>
    `;
}


/* =========================================
   SHOW HOME PRODUCTS
========================================= */

function showHomeProducts() {

    const container = document.getElementById("homeProducts");

    if (!container) {
        return;
    }

    const featuredProducts = products.slice(0, 4);

    container.innerHTML = featuredProducts
        .map(product => productCard(product))
        .join("");
}


/* =========================================
   SHOW SHOP PRODUCTS
========================================= */

function showShopProducts() {

    const container = document.getElementById("shopProducts");

    if (!container) {
        return;
    }

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortProducts = document.getElementById("sortProducts");

    let filteredProducts = [...products];

    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get("category");

    if (urlCategory) {
        categoryFilter.value = urlCategory;
    }

    function filterProducts() {

        const search = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const sort = sortProducts.value;

        filteredProducts = products.filter(product => {

            const matchesSearch =
                product.name.toLowerCase().includes(search) ||
                product.category.toLowerCase().includes(search);

            const matchesCategory =
                category === "All" ||
                product.category === category;

            return matchesSearch && matchesCategory;
        });


        if (sort === "low") {
            filteredProducts.sort((a, b) => a.price - b.price);
        }

        if (sort === "high") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        if (sort === "name") {
            filteredProducts.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        }


        if (filteredProducts.length === 0) {

            container.innerHTML = `
                <div class="empty-state" style="grid-column:1/-1;">
                    <h2>No Products Found</h2>
                    <p>Try another search or category.</p>
                </div>
            `;

            return;
        }


        container.innerHTML = filteredProducts
            .map(product => productCard(product))
            .join("");
    }


    searchInput.addEventListener("input", filterProducts);
    categoryFilter.addEventListener("change", filterProducts);
    sortProducts.addEventListener("change", filterProducts);

    filterProducts();
}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(productId) {

    const cart = getCart();

    const existingProduct = cart.find(
        item => item.id === productId
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCounts();

    alert("Product added to cart!");
}


/* =========================================
   REMOVE FROM CART
========================================= */

function removeFromCart(productId) {

    let cart = getCart();

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart(cart);

    updateCounts();

    showCart();
}


/* =========================================
   CHANGE CART QUANTITY
========================================= */

function changeQuantity(productId, change) {

    const cart = getCart();

    const item = cart.find(
        item => item.id === productId
    );

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        const newCart = cart.filter(
            item => item.id !== productId
        );

        saveCart(newCart);

    } else {

        saveCart(cart);
    }

    updateCounts();
    showCart();
}


/* =========================================
   SHOW CART
========================================= */

function showCart() {

    const container = document.getElementById("cartContainer");

    if (!container) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <div style="font-size:60px;">
                    🛒
                </div>

                <h2>Your Cart Is Empty</h2>

                <p>
                    You haven't added any products yet.
                </p>

                <a href="shop.html" class="btn">
                    Continue Shopping
                </a>

            </div>
        `;

        return;
    }


    let subtotal = 0;

    let cartHTML = `
        <div class="cart-layout">

            <div class="cart-items">
    `;


    cart.forEach(item => {

        const product = products.find(
            product => product.id === item.id
        );

        if (!product) {
            return;
        }

        const itemTotal =
            product.price * item.quantity;

        subtotal += itemTotal;


        cartHTML += `
            <div class="cart-item">

                <div class="cart-item-image">
                    ${product.icon}
                </div>

                <div>

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h3>${product.name}</h3>

                    <p>
                        ${formatPrice(product.price)}
                    </p>

                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity(${product.id}, -1)"
                        >
                            −
                        </button>

                        <strong>${item.quantity}</strong>

                        <button
                            onclick="changeQuantity(${product.id}, 1)"
                        >
                            +
                        </button>

                    </div>

                </div>

                <div>

                    <strong>
                        ${formatPrice(itemTotal)}
                    </strong>

                    <br>

                    <button
                        class="icon-btn"
                        onclick="removeFromCart(${product.id})"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;
    });


    const shipping = subtotal >= 2000 ? 0 : 99;

    const total = subtotal + shipping;


    cartHTML += `
            </div>

            <div class="summary-card">

                <h2>Order Summary</h2>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>${formatPrice(subtotal)}</strong>
                </div>

                <div class="summary-row">
                    <span>Shipping</span>
                    <strong>
                        ${shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </strong>
                </div>

                <div class="summary-row summary-total">
                    <span>Total</span>
                    <strong>${formatPrice(total)}</strong>
                </div>

                <a
                    href="checkout.html"
                    class="btn full-btn"
                >
                    Proceed to Checkout
                </a>

            </div>

        </div>
    `;


    container.innerHTML = cartHTML;
}


/* =========================================
   WISHLIST
========================================= */

function toggleWishlist(productId) {

    let wishlist = getWishlist();

    if (wishlist.includes(productId)) {

        wishlist = wishlist.filter(
            id => id !== productId
        );

        alert("Removed from wishlist.");

    } else {

        wishlist.push(productId);

        alert("Added to wishlist!");
    }

    saveWishlist(wishlist);

    updateCounts();

    showHomeProducts();
    showShopProducts();
    showWishlist();
}


/* =========================================
   SHOW WISHLIST
========================================= */

function showWishlist() {

    const container =
        document.getElementById("wishlistProducts");

    if (!container) {
        return;
    }

    const wishlist = getWishlist();

    const wishlistProducts = products.filter(
        product => wishlist.includes(product.id)
    );


    if (wishlistProducts.length === 0) {

        container.innerHTML = `
            <div class="empty-state"
                 style="grid-column:1/-1;">

                <div style="font-size:60px;">
                    ♡
                </div>

                <h2>Your Wishlist Is Empty</h2>

                <p>
                    Save products you like here.
                </p>

                <a href="shop.html" class="btn">
                    Explore Products
                </a>

            </div>
        `;

        return;
    }


    container.innerHTML = wishlistProducts
        .map(product => productCard(product))
        .join("");
}


/* =========================================
   PRODUCT DETAILS
========================================= */

function showProductDetails() {

    const container =
        document.getElementById("productDetails");

    if (!container) {
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const id =
        Number(params.get("id"));

    const product =
        products.find(product => product.id === id);


    if (!product) {

        container.innerHTML = `
            <div class="empty-state">
                <h2>Product Not Found</h2>
                <p>The product you're looking for doesn't exist.</p>
                <a href="shop.html" class="btn">
                    Back to Shop
                </a>
            </div>
        `;

        return;
    }


    const wishlist = getWishlist();

    const isWishlisted =
        wishlist.includes(product.id);


    container.innerHTML = `

        <div class="product-details">

            <div class="detail-image">
                ${product.icon}
            </div>

            <div class="detail-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h1>${product.name}</h1>

                <div class="detail-price">
                    ${formatPrice(product.price)}
                </div>

                <p class="detail-description">
                    ${product.description}
                    This is a demo product available on MeetShop.
                    Add it to your cart or wishlist to try the
                    shopping functionality.
                </p>

                <div class="detail-actions">

                    <button
                        class="btn"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                    <button
                        class="btn btn-light"
                        onclick="toggleWishlist(${product.id})"
                    >
                        ${isWishlisted ? "♥ Saved" : "♡ Wishlist"}
                    </button>

                </div>

            </div>

        </div>
    `;
}


/* =========================================
   CHECKOUT SUMMARY
========================================= */

function showCheckoutSummary() {

    const container =
        document.getElementById("checkoutSummary");

    if (!container) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {

        container.innerHTML = `
            <p>Your cart is empty.</p>
            <a href="shop.html" class="btn full-btn">
                Shop Products
            </a>
        `;

        return;
    }


    let subtotal = 0;

    let html = "";


    cart.forEach(item => {

        const product =
            products.find(product => product.id === item.id);

        if (!product) {
            return;
        }

        const total =
            product.price * item.quantity;

        subtotal += total;


        html += `
            <div class="summary-row">
                <span>
                    ${product.name} × ${item.quantity}
                </span>

                <strong>
                    ${formatPrice(total)}
                </strong>
            </div>
        `;
    });


    const shipping =
        subtotal >= 2000 ? 0 : 99;

    const total =
        subtotal + shipping;


    html += `

        <div class="summary-row">
            <span>Subtotal</span>
            <strong>${formatPrice(subtotal)}</strong>
        </div>

        <div class="summary-row">
            <span>Shipping</span>
            <strong>
                ${shipping === 0 ? "FREE" : formatPrice(shipping)}
            </strong>
        </div>

        <div class="summary-row summary-total">
            <span>Total</span>
            <strong>${formatPrice(total)}</strong>
        </div>
    `;


    container.innerHTML = html;
}


/* =========================================
   CHECKOUT FORM
========================================= */

function setupCheckout() {

    const form =
        document.getElementById("checkoutForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const cart = getCart();

        if (cart.length === 0) {

            alert("Your cart is empty!");

            return;
        }


        const firstName =
            document.getElementById("firstName").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        const email =
            document.getElementById("email").value.trim();


        if (!firstName || !lastName || !email) {

            alert("Please fill all required fields.");

            return;
        }


        alert(
            "Order placed successfully! Thank you for shopping with MeetShop."
        );


        localStorage.removeItem("meetShopCart");

        window.location.href = "../index.html";
    });
}


/* =========================================
   CONTACT FORM
========================================= */

function setupContactForm() {

    const form =
        document.getElementById("contactForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function(event) {

        event.preventDefault();

        alert(
            "Thank you! Your message has been submitted."
        );

        form.reset();
    });
}


/* =========================================
   START EVERYTHING
========================================= */

document.addEventListener("DOMContentLoaded", function() {

    updateCounts();

    showHomeProducts();

    showShopProducts();

    showWishlist();

    showProductDetails();

    showCart();

    showCheckoutSummary();

    setupCheckout();

    setupContactForm();

});