// ====== PRODUCT DETAIL PAGE ======

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

let currentProduct = null;
let allProducts = [];
let selectedColor = null;
let selectedSize = null;
let currentImageIndex = 0;
let productImages = [];

if (!productId) {
    window.location.href = 'index.html';
}

fetch('products.json')
.then(response => response.json())
.then(data => {
    allProducts = data;
    currentProduct = data.find(p => p.id == productId);

    if (!currentProduct) {
        window.location.href = 'index.html';
        return;
    }

    renderProduct(currentProduct);
    renderRelatedProducts(currentProduct, data);
    checkCartState(currentProduct.id);
})
.catch(err => {
    console.error('Error loading product:', err);
    window.location.href = 'index.html';
});

function renderProduct(product) {
    const mainImg = document.getElementById('main-product-img');
    const nameEl = document.getElementById('product-name');
    const priceEl = document.getElementById('product-price');
    const categoryEl = document.getElementById('product-category');
    const descEl = document.getElementById('product-desc');

    // Setup images array
    productImages = product.images || [product.img || 'img/product/default.jpg'];
    currentImageIndex = 0;

    if(mainImg) mainImg.src = productImages[0];
    if(nameEl) nameEl.textContent = product.name;
    if(priceEl) priceEl.textContent = product.price + ' جنيه';
    if(categoryEl) {
        const catMap = {men: 'رجالي', women: 'حريمي', kids: 'أطفالي'};
        categoryEl.textContent = catMap[product.catetory] || product.catetory;
    }
    if(descEl) descEl.textContent = product.description || 'منتج عالي الجودة من متجر ROVAN.';

    // Render thumbnail gallery
    renderThumbnailGallery();

    // Old price & discount
    const oldPriceEl = document.getElementById('product-old-price');
    const discountBadge = document.getElementById('discount-badge');

    if (product.old_price) {
        if(oldPriceEl) {
            oldPriceEl.textContent = product.old_price + ' جنيه';
            oldPriceEl.style.display = 'inline';
        }
        if(discountBadge) {
            const discount = Math.floor((product.old_price - product.price) / product.old_price * 100);
            discountBadge.textContent = 'خصم ' + discount + '%';
            discountBadge.style.display = 'inline-block';
        }
    } else {
        if(oldPriceEl) oldPriceEl.style.display = 'none';
        if(discountBadge) discountBadge.style.display = 'none';
    }

    // Render color options
    renderColorOptions(product.colors || []);

    // Render size options
    renderSizeOptions(product.sizes || []);

    document.title = product.name + ' - ROVAN';
}

function renderColorOptions(colors) {
    const container = document.getElementById('color-options');
    if(!container) return;

    container.innerHTML = '';
    colors.forEach((color, index) => {
        const swatch = document.createElement('span');
        swatch.className = 'color-swatch';
        swatch.textContent = color;
        swatch.setAttribute('data-color', color);
        swatch.onclick = function() {
            selectColor(color, this);
        };
        container.appendChild(swatch);
    });
}

function renderSizeOptions(sizes) {
    const container = document.getElementById('size-options');
    if(!container) return;

    container.innerHTML = '';
    sizes.forEach((size, index) => {
        const btn = document.createElement('span');
        btn.className = 'size-btn';
        btn.textContent = size;
        btn.setAttribute('data-size', size);
        btn.onclick = function() {
            selectSize(size, this);
        };
        container.appendChild(btn);
    });
}

function selectColor(color, element) {
    selectedColor = color;

    // Remove selected from all
    document.querySelectorAll('.color-swatch').forEach(el => el.classList.remove('selected'));
    // Add to clicked
    element.classList.add('selected');

    // Hide warning
    const warning = document.getElementById('color-warning');
    if(warning) warning.classList.remove('show');

    updateSelectedInfo();
}

function selectSize(size, element) {
    selectedSize = size;

    // Remove selected from all
    document.querySelectorAll('.size-btn').forEach(el => el.classList.remove('selected'));
    // Add to clicked
    element.classList.add('selected');

    // Hide warning
    const warning = document.getElementById('size-warning');
    if(warning) warning.classList.remove('show');

    updateSelectedInfo();
}

function updateSelectedInfo() {
    const infoEl = document.getElementById('selected-info');
    const detailsEl = document.getElementById('selected-details');

    if(!infoEl || !detailsEl) return;

    if(selectedColor && selectedSize) {
        detailsEl.innerHTML = `اللون: <strong>${selectedColor}</strong> | المقاس: <strong>${selectedSize}</strong>`;
        infoEl.classList.add('show');
    } else if(selectedColor) {
        detailsEl.innerHTML = `اللون: <strong>${selectedColor}</strong> | اختر المقاس`;
        infoEl.classList.add('show');
    } else if(selectedSize) {
        detailsEl.innerHTML = `المقاس: <strong>${selectedSize}</strong> | اختر اللون`;
        infoEl.classList.add('show');
    } else {
        infoEl.classList.remove('show');
    }
}

function changeQty(delta) {
    const input = document.getElementById('qty-input');
    if(!input) return;
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    input.value = val;
}

function addProductToCart() {
    if (!currentProduct) return;

    // Validate color and size selection
    const hasColors = currentProduct.colors && currentProduct.colors.length > 0;
    const hasSizes = currentProduct.sizes && currentProduct.sizes.length > 0;

    let valid = true;

    if(hasColors && !selectedColor) {
        document.getElementById('color-warning').classList.add('show');
        valid = false;
    }
    if(hasSizes && !selectedSize) {
        document.getElementById('size-warning').classList.add('show');
        valid = false;
    }

    if(!valid) {
        // Shake animation on button
        const btn = document.getElementById('add-cart-btn');
        btn.style.animation = 'shake 0.5s';
        setTimeout(() => btn.style.animation = '', 500);
        return;
    }

    const qtyInput = document.getElementById('qty-input');
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if same product with same color and size already in cart
    const existing = cart.find(item => 
        item.id === currentProduct.id && 
        item.selectedColor === selectedColor && 
        item.selectedSize === selectedSize
    );

    if (!existing) {
        cart.push({
            ...currentProduct, 
            quantity: qty,
            selectedColor: selectedColor,
            selectedSize: selectedSize
        });
        localStorage.setItem('cart', JSON.stringify(cart));

        const btn = document.getElementById('add-cart-btn');
        if(btn){
            btn.classList.add('active');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> تمت الإضافة';
        }

        if(typeof updateCart === 'function'){
            updateCart();
        }
    } else {
        // Already in cart - update quantity
        existing.quantity += qty;
        localStorage.setItem('cart', JSON.stringify(cart));

        const btn = document.getElementById('add-cart-btn');
        if(btn){
            btn.classList.add('active');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> تم تحديث الكمية';
        }

        if(typeof updateCart === 'function'){
            updateCart();
        }
    }
}

function checkCartState(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const inCart = cart.find(item => item.id == productId);

    if (inCart) {
        const btn = document.getElementById('add-cart-btn');
        const qtyInput = document.getElementById('qty-input');
        if(btn){
            btn.classList.add('active');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> في السلة';
        }
        if(qtyInput) qtyInput.value = inCart.quantity;

        // Restore selected color and size if in cart
        if(inCart.selectedColor) {
            selectedColor = inCart.selectedColor;
            document.querySelectorAll('.color-swatch').forEach(el => {
                if(el.getAttribute('data-color') === selectedColor) {
                    el.classList.add('selected');
                }
            });
        }
        if(inCart.selectedSize) {
            selectedSize = inCart.selectedSize;
            document.querySelectorAll('.size-btn').forEach(el => {
                if(el.getAttribute('data-size') === selectedSize) {
                    el.classList.add('selected');
                }
            });
        }
        updateSelectedInfo();
    }
}

// ====== GALLERY & LIGHTBOX ======

function renderThumbnailGallery() {
    const gallery = document.getElementById('thumbnail-gallery');
    if(!gallery) return;

    gallery.innerHTML = '';
    productImages.forEach((img, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumbnail' + (index === currentImageIndex ? ' active' : '');
        thumb.innerHTML = '<img src="' + img + '" alt="" onerror="this.src=\'img/logo.png\'">';
        thumb.onclick = function() {
            setMainImage(index);
        };
        gallery.appendChild(thumb);
    });
}

function setMainImage(index) {
    if(index < 0 || index >= productImages.length) return;
    currentImageIndex = index;
    const mainImg = document.getElementById('main-product-img');
    if(mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(function() {
            mainImg.src = productImages[index];
            mainImg.style.opacity = '1';
        }, 150);
    }
    renderThumbnailGallery();
}

function openLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if(lightbox && lightboxImg) {
        lightboxImg.src = productImages[currentImageIndex];
        updateLightboxCounter();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if(lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % productImages.length;
    const lightboxImg = document.getElementById('lightbox-img');
    if(lightboxImg) {
        lightboxImg.style.opacity = '0';
        setTimeout(function() {
            lightboxImg.src = productImages[currentImageIndex];
            lightboxImg.style.opacity = '1';
        }, 150);
    }
    updateLightboxCounter();
    renderThumbnailGallery();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + productImages.length) % productImages.length;
    const lightboxImg = document.getElementById('lightbox-img');
    if(lightboxImg) {
        lightboxImg.style.opacity = '0';
        setTimeout(function() {
            lightboxImg.src = productImages[currentImageIndex];
            lightboxImg.style.opacity = '1';
        }, 150);
    }
    updateLightboxCounter();
    renderThumbnailGallery();
}

function updateLightboxCounter() {
    const counter = document.getElementById('lightbox-counter');
    if(counter) {
        counter.textContent = (currentImageIndex + 1) + ' / ' + productImages.length;
    }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', function(e) {
    const lightbox = document.getElementById('lightbox');
    if(!lightbox || !lightbox.classList.contains('active')) return;

    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowRight') prevImage();
    if(e.key === 'ArrowLeft') nextImage();
});

function renderRelatedProducts(current, allData) {
    const relatedGrid = document.getElementById('related-products-grid');
    if(!relatedGrid) return;

    const related = allData
        .filter(p => p.catetory === current.catetory && p.id !== current.id)
        .slice(0, 4);

    if (related.length === 0) {
        relatedGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#999;">لا توجد منتجات مشابهة</p>';
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    relatedGrid.innerHTML = '';

    related.forEach(product => {
        const isInCart = cart.some(c => c.id === product.id);
        const oldPriceHtml = product.old_price ? `<p class="old_price">${product.old_price} جنيه</p>` : '';
        const discountBadge = product.old_price ? `<span class="sale_present">%${Math.floor((product.old_price - product.price) / product.old_price * 100)}</span>` : '';

        relatedGrid.innerHTML += `
            <div class="product" style="box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                ${discountBadge}
                <div class="img_product">
                    <a href="product.html?id=${product.id}"><img src="${product.img}" alt="${product.name}"></a>
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
                    ${oldPriceHtml}
                </div>
                <div class="icons">
                    <span class="btn_add_cart ${isInCart ? 'active' : ''}" data-id="${product.id}">
                        <i class="fa-solid fa-cart-shopping"></i> ${isInCart ? 'في السلة' : 'أضف للسلة'}
                    </span>
                    <span class="icon_product"><i class="fa-regular fa-heart"></i></span>
                </div>
            </div>
        `;
    });

    document.querySelectorAll('.related-products .btn_add_cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const pid = this.getAttribute('data-id');
            const product = allData.find(p => p.id == pid);
            if(product && typeof addToCart === 'function'){
                addToCart(product);
                this.classList.add('active');
                this.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> في السلة';
            }
        });
    });
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-10px); }
    }
`;
document.head.appendChild(shakeStyle);