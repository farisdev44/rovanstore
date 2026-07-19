fetch('products.json')
.then(response => response.json())
.then(data => {

    const cart = JSON.parse(localStorage.getItem('cart')) || []

    const swiper_items_sale = document.getElementById("swiper_items_sale")
    const swiper_men = document.getElementById("swiper_men")
    const swiper_women = document.getElementById("swiper_women")
    const swiper_kids = document.getElementById("swiper_kids")

    // Helper: get category badge class
    function getCatBadge(cat) {
        if (cat === 'women') return 'women';
        if (cat === 'kids') return 'kids';
        return '';
    }

    // Helper: get category label
    function getCatLabel(cat) {
        if (cat === 'men') return 'رجالي';
        if (cat === 'women') return 'حريمي';
        if (cat === 'kids') return 'أطفال';
        return cat;
    }

    // ===== HOT DEALS (products with old_price) =====
    if(swiper_items_sale){
        data.forEach(product => {
            if(product.old_price){
                const isInCart = cart.some(cartItem => cartItem.id === product.id)
                const percent_disc = Math.floor((product.old_price - product.price) / product.old_price * 100)
                const catBadgeClass = getCatBadge(product.catetory);
                const catLabel = getCatLabel(product.catetory);

                swiper_items_sale.innerHTML += `
                    <div class="swiper-slide product">
                        <span class="sale_present">%${percent_disc}</span>
                        <span class="cat-badge ${catBadgeClass}">${catLabel}</span>
                        <div class="img_product">
                            <a href="product.html?id=${product.id}"><img src="${product.images ? product.images[0] : product.img}" alt="${product.name}"></a>
                        </div>
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <p class="name_product"><a href="product.html?id=${product.id}">${product.name}</a></p>
                        <div class="price">
                            <p><span>${product.price} جنيه</span></p>
                            <p class="old_price">${product.old_price} جنيه</p>
                        </div>
                        <div class="icons">
                            <span class="btn_add_cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
                                <i class="fa-solid fa-cart-shopping"></i> ${isInCart ? 'في السلة' : 'أضف للسلة'}
                            </span>
                            <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                        </div>
                    </div>
                `
            }
        })
    }

    // ===== MEN =====
    if(swiper_men){
        data.forEach(product => {
            if(product.catetory == "men"){
                const isInCart = cart.some(cartItem => cartItem.id === product.id)
                const old_price_Pargrahp = product.old_price ? `<p class="old_price">${product.old_price} جنيه</p>` : "";
                const percent_disc_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";

                swiper_men.innerHTML += `
                    <div class="swiper-slide product">
                        ${percent_disc_div}
                        <span class="cat-badge">رجالي</span>
                        <div class="img_product">
                            <a href="product.html?id=${product.id}"><img src="${product.images ? product.images[0] : product.img}" alt="${product.name}"></a>
                        </div>
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <p class="name_product"><a href="product.html?id=${product.id}">${product.name}</a></p>
                        <div class="price">
                            <p><span>${product.price} جنيه</span></p>
                            ${old_price_Pargrahp}
                        </div>
                        <div class="icons">
                            <span class="btn_add_cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
                                <i class="fa-solid fa-cart-shopping"></i> ${isInCart ? 'في السلة' : 'أضف للسلة'}
                            </span>
                            <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                        </div>
                    </div>
                `
            }
        })
    }

    // ===== WOMEN =====
    if(swiper_women){
        data.forEach(product => {
            if(product.catetory == "women"){
                const isInCart = cart.some(cartItem => cartItem.id === product.id)
                const old_price_Pargrahp = product.old_price ? `<p class="old_price">${product.old_price} جنيه</p>` : "";
                const percent_disc_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";

                swiper_women.innerHTML += `
                    <div class="swiper-slide product">
                        ${percent_disc_div}
                        <span class="cat-badge women">حريمي</span>
                        <div class="img_product">
                            <a href="product.html?id=${product.id}"><img src="${product.images ? product.images[0] : product.img}" alt="${product.name}"></a>
                        </div>
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <p class="name_product"><a href="product.html?id=${product.id}">${product.name}</a></p>
                        <div class="price">
                            <p><span>${product.price} جنيه</span></p>
                            ${old_price_Pargrahp}
                        </div>
                        <div class="icons">
                            <span class="btn_add_cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
                                <i class="fa-solid fa-cart-shopping"></i> ${isInCart ? 'في السلة' : 'أضف للسلة'}
                            </span>
                            <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                        </div>
                    </div>
                `
            }
        })
    }

    // ===== KIDS =====
    if(swiper_kids){
        data.forEach(product => {
            if(product.catetory == "kids"){
                const isInCart = cart.some(cartItem => cartItem.id === product.id)
                const old_price_Pargrahp = product.old_price ? `<p class="old_price">${product.old_price} جنيه</p>` : "";
                const percent_disc_div = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : "";

                swiper_kids.innerHTML += `
                    <div class="swiper-slide product">
                        ${percent_disc_div}
                        <span class="cat-badge kids">أطفال</span>
                        <div class="img_product">
                            <a href="product.html?id=${product.id}"><img src="${product.images ? product.images[0] : product.img}" alt="${product.name}"></a>
                        </div>
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <p class="name_product"><a href="product.html?id=${product.id}">${product.name}</a></p>
                        <div class="price">
                            <p><span>${product.price} جنيه</span></p>
                            ${old_price_Pargrahp}
                        </div>
                        <div class="icons">
                            <span class="btn_add_cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
                                <i class="fa-solid fa-cart-shopping"></i> ${isInCart ? 'في السلة' : 'أضف للسلة'}
                            </span>
                            <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                        </div>
                    </div>
                `
            }
        })
    }

    // ===== ATTACH ADD TO CART EVENTS AFTER RENDERING =====
    attachAddToCartEvents(data);
})


// ===== ADD TO CART EVENT HANDLER =====
function attachAddToCartEvents(productsData) {
    const addToCartButtons = document.querySelectorAll(".btn_add_cart")

    addToCartButtons.forEach(button => {
        button.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();

            const productId = this.getAttribute('data-id')
            const selectedProduct = productsData.find(product => product.id == productId)

            if(selectedProduct && typeof addToCart === 'function'){
                addToCart(selectedProduct)

                const allMatchingButtons = document.querySelectorAll(`.btn_add_cart[data-id="${productId}"]`)
                allMatchingButtons.forEach(btn => {
                    btn.classList.add("active")
                    btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> في السلة`
                })
            }
        })
    })
}