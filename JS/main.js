// ====== STATE / ONLINE INDICATOR ======
let state = document.querySelector('.state');

window.onload = function(){
    if(window.navigator.onLine){
        onLine()
    }else{
        offLine()
    }
}
window.addEventListener("online", function(){ onLine(); });
window.addEventListener("offline", function(){ offLine(); });

function onLine(){ if(state) state.style.background = 'green'; }
function offLine(){ if(state) state.style.background = 'red'; }

// ====== CATEGORY NAV ======
let category_nav_list = document.querySelector(".category_nav_list");
function Open_Categ_list(){ if(category_nav_list) category_nav_list.classList.toggle("active"); }

// ====== MOBILE MENU ======
let nav_links = document.querySelector(".nav_links");
function open_Menu(){ if(nav_links) nav_links.classList.toggle("active"); }

// ====== CART SIDEBAR ======
var cartSidebar = document.querySelector('.cart');
function open_close_cart(){ if(cartSidebar) cartSidebar.classList.toggle("active"); }

// ====== CART FUNCTIONS (shared across ALL pages) ======

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);
    if (!existing) {
        cart.push({...product, quantity: 1});
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    updateCart();
}

function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const cartItemsContainer = document.getElementById("cart_items");
    if(cartItemsContainer){
        cartItemsContainer.innerHTML = "";
        let total_Price = 0;
        let total_count = 0;

        cart.forEach((item, index) => {
            let total_Price_item = item.price * item.quantity;
            total_Price += total_Price_item;
            total_count += item.quantity;

            // Build variant info (color + size)
            let variantInfo = '';
            if(item.selectedColor || item.selectedSize) {
                variantInfo = '<div style="font-size:12px; color:#666; margin-top:4px;">';
                if(item.selectedColor) variantInfo += '<span style="margin-left:10px;">🎨 ' + item.selectedColor + '</span>';
                if(item.selectedSize) variantInfo += '<span>📏 ' + item.selectedSize + '</span>';
                variantInfo += '</div>';
            }

            cartItemsContainer.innerHTML += `
                <div class="item_cart">
                    <img src="${item.images ? item.images[0] : item.img}" alt="">
                    <div class="content">
                        <h4>${item.name}</h4>
                        ${variantInfo}
                        <p class="price_cart">${total_Price_item} جنيه</p>
                        <div class="quantity_control">
                            <button class="decrease_quantity" data-index="${index}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="Increase_quantity" data-index="${index}">+</button>
                        </div>
                    </div>
                    <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;
        });

        const price_cart_total = document.querySelector('.price_cart_toral');
        const Count_item_cart = document.querySelector('.Count_item_cart');
        const count_item_header = document.querySelector('.count_item_header');

        if(price_cart_total) price_cart_total.innerHTML = `${total_Price} جنيه`;
        if(Count_item_cart) Count_item_cart.innerHTML = total_count;
        if(count_item_header) count_item_header.innerHTML = total_count;

        attachCartListeners();
    }

    updateCheckoutPage(cart);
}

function updateCheckoutPage(cart) {
    const checkout_items = document.getElementById("checkout_items");
    const items_input = document.getElementById("items");
    const total_Price_input = document.getElementById("total_Price");
    const count_Items_input = document.getElementById("count_Items");

    if(!checkout_items) return;

    checkout_items.innerHTML = "";
    if(items_input) items_input.value = "";
    if(total_Price_input) total_Price_input.value = "";
    if(count_Items_input) count_Items_input.value = "";

    let total_Price = 0;
    let total_count = 0;

    if(cart.length === 0){
        checkout_items.innerHTML = '<p style="text-align:center; padding:40px; color:#999;">السلة فارغة. <a href="index.html" style="color:#4364f7;">تسوق الآن</a></p>';
    }

    cart.forEach((item, index) => {
        let total_Price_item = item.price * item.quantity;
        total_Price += total_Price_item;
        total_count += item.quantity;

        // Build variant info for display
        let variantDisplay = '';
        let variantText = '';
        if(item.selectedColor || item.selectedSize) {
            variantDisplay = '<div style="font-size:13px; color:#666; margin-top:4px;">';
            if(item.selectedColor) {
                variantDisplay += '<span style="margin-left:12px;"><i class="fa-solid fa-palette" style="color:#4364f7;"></i> ' + item.selectedColor + '</span>';
                variantText += ' لون:' + item.selectedColor;
            }
            if(item.selectedSize) {
                variantDisplay += '<span><i class="fa-solid fa-ruler" style="color:#4364f7;"></i> ' + item.selectedSize + '</span>';
                variantText += ' مقاس:' + item.selectedSize;
            }
            variantDisplay += '</div>';
        }

        if(items_input){
            items_input.value += item.name + variantText + " --- " + "السعر: " + total_Price_item + " --- " + "الكمية: " + item.quantity + "\n";
        }

        checkout_items.innerHTML += `
            <div class="item_cart">
                <div class="image_name">
                    <img src="${item.images ? item.images[0] : item.img}" alt="">
                    <div class="content">
                        <h4>${item.name}</h4>
                        ${variantDisplay}
                        <p class="price_cart">${total_Price_item} جنيه</p>
                        <div class="quantity_control">
                            <button class="decrease_quantity" data-index="${index}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="Increase_quantity" data-index="${index}">+</button>
                        </div>
                    </div>
                </div>
                <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
    });

    if(total_Price_input) total_Price_input.value = total_Price + 80;
    if(count_Items_input) count_Items_input.value = total_count;

    const subtotal_checkout = document.querySelector(".subtotal_checkout");
    const total_checkout = document.querySelector(".total_checkout");

    if(subtotal_checkout) subtotal_checkout.innerHTML = `${total_Price} جنيه`;
    if(total_checkout) total_checkout.innerHTML = `${total_Price + 80} جنيه`;

    attachCartListeners();
}

function attachCartListeners() {
    document.querySelectorAll(".Increase_quantity").forEach(button => {
        button.onclick = function(){
            const itemIndex = this.getAttribute("data-index");
            increaseQuantity(itemIndex);
        };
    });

    document.querySelectorAll(".decrease_quantity").forEach(button => {
        button.onclick = function(){
            const itemIndex = this.getAttribute("data-index");
            decreaseQuantity(itemIndex);
        };
    });

    document.querySelectorAll('.delete_item').forEach(button => {
        button.onclick = function(){
            const itemIndex = this.getAttribute('data-index');
            removeFromCart(itemIndex);
        };
    });
}

function increaseQuantity(index){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if(cart[index]){
        cart[index].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

function decreaseQuantity(index){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if(cart[index] && cart[index].quantity > 1){
        cart[index].quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const removedProduct = cart.splice(index, 1)[0];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();

    if(removedProduct){
        updateButtonsState(removedProduct.id);
    }
}

function updateButtonsState(productId) {
    const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`);
    allMatchingButtons.forEach(button =>{
        button.classList.remove('active');
        button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> أضف للسلة`;
    });
}

let bigImage = document.getElementById('big-img');
if(bigImage){
    function myProduct(item){ bigImage.src = item; }
}

let btnbuyNowF = document.querySelector('.buyNow');
let divcretAcBuyF = document.querySelector('.creatacountfast');
if(btnbuyNowF && divcretAcBuyF){
    btnbuyNowF.onclick = () => { divcretAcBuyF.classList.toggle('active'); };
}

updateCart();