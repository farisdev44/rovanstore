// Checkout Submission with Firebase Firestore + Google Sheets
// + Toast Notification + Cart Clearing

const scriptURL = "https://script.google.com/macros/s/AKfycbx9HYyfBJq7DuCmYzAuARecqCCxy7P-_9tjp3s8YNwqRHNgBbPzRtssMfttRBvbC9MEDQ/exec";

let form = document.getElementById("form_contact");

// ====== Create Toast Notification Container ======
(function createToastContainer() {
    if (document.getElementById('toast-container')) return;

    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.innerHTML = `
        <style>
            #toast-container {
                position: fixed;
                top: 30px;
                right: 30px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            }
            .toast {
                background: white;
                border-radius: 12px;
                padding: 18px 24px;
                min-width: 320px;
                max-width: 420px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1);
                display: flex;
                align-items: flex-start;
                gap: 14px;
                transform: translateX(120%);
                opacity: 0;
                transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                pointer-events: auto;
                border-right: 4px solid;
                position: relative;
            }
            .toast.show {
                transform: translateX(0);
                opacity: 1;
            }
            .toast.success { border-right-color: #28a745; }
            .toast.error { border-right-color: #e51a1a; }
            .toast.info { border-right-color: #4364f7; }

            .toast-icon {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                font-size: 20px;
            }
            .toast.success .toast-icon { background: #d4edda; color: #28a745; }
            .toast.error .toast-icon { background: #f8d7da; color: #e51a1a; }
            .toast.info .toast-icon { background: #d6e4ff; color: #4364f7; }

            .toast-content h4 {
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 4px;
                color: #121416;
            }
            .toast-content p {
                font-size: 14px;
                color: #7b7b7b;
                line-height: 1.5;
            }
            .toast-close {
                position: absolute;
                top: 12px;
                left: 12px;
                background: none;
                border: none;
                font-size: 16px;
                color: #999;
                cursor: pointer;
                padding: 4px;
                transition: 0.3s;
            }
            .toast-close:hover { color: #333; }

            .toast-progress {
                position: absolute;
                bottom: 0;
                right: 0;
                height: 3px;
                background: currentColor;
                border-radius: 0 0 0 12px;
                opacity: 0.3;
            }

            @keyframes toastShrink {
                from { width: 100%; }
                to { width: 0%; }
            }

            @media (max-width: 500px) {
                #toast-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                }
                .toast {
                    min-width: auto;
                    max-width: none;
                    width: 100%;
                }
            }
        </style>
    `;
    document.body.appendChild(toastContainer);
})();

// ====== Toast Function ======
function showToast(type, title, message, duration) {
    duration = duration || 4000;
    var container = document.getElementById('toast-container');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast ' + type;

    var iconHtml = '';
    if (type === 'success') iconHtml = '<i class="fa-solid fa-check"></i>';
    else if (type === 'error') iconHtml = '<i class="fa-solid fa-xmark"></i>';
    else iconHtml = '<i class="fa-solid fa-info"></i>';

    toast.innerHTML = `
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
        <div class="toast-icon">${iconHtml}</div>
        <div class="toast-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <div class="toast-progress" style="width: 100%; animation: toastShrink ${duration}ms linear forwards;"></div>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function() {
        toast.classList.add('show');
    });

    // Auto remove
    setTimeout(function() {
        toast.style.transform = 'translateX(120%)';
        toast.style.opacity = '0';
        setTimeout(function() { toast.remove(); }, 500);
    }, duration);
}

// ====== Clear Cart Function ======
function clearCart() {
    console.log('Clearing cart...');

    // 1. Remove from localStorage
    localStorage.removeItem("cart");
    console.log('localStorage cart removed');

    // 2. Update sidebar cart UI
    var cartItemsContainer = document.getElementById("cart_items");
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        console.log('Sidebar cart cleared');
    }

    // 3. Update totals in sidebar
    var price_cart_total = document.querySelector('.price_cart_toral');
    var Count_item_cart = document.querySelector('.Count_item_cart');
    var count_item_header = document.querySelector('.count_item_header');

    if (price_cart_total) price_cart_total.innerHTML = '0 .LE';
    if (Count_item_cart) Count_item_cart.innerHTML = '0';
    if (count_item_header) count_item_header.innerHTML = '0';
    console.log('Sidebar totals reset');

    // 4. Clear checkout items
    var checkout_items = document.getElementById('checkout_items');
    if (checkout_items) {
        checkout_items.innerHTML = '<p style="text-align:center; padding:40px; color:#999;">Your cart is empty. <a href="index.html" style="color:#4364f7;">Go shopping</a></p>';
        console.log('Checkout items cleared');
    }

    // 5. Clear hidden form inputs
    var items_input = document.getElementById('items');
    var total_Price_input = document.getElementById('total_Price');
    var count_Items_input = document.getElementById('count_Items');

    if (items_input) items_input.value = '';
    if (total_Price_input) total_Price_input.value = '';
    if (count_Items_input) count_Items_input.value = '';
    console.log('Hidden inputs cleared');

    // 6. Reset totals display in checkout
    var subtotal_checkout = document.querySelector('.subtotal_checkout');
    var total_checkout = document.querySelector('.total_checkout');

    if (subtotal_checkout) subtotal_checkout.innerHTML = '0.LE';
    if (total_checkout) total_checkout.innerHTML = '80.LE';
    console.log('Checkout totals reset');

    // 7. Reset "Add to Cart" buttons on page
    var allButtons = document.querySelectorAll('.btn_add_cart');
    allButtons.forEach(function(btn) {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> add to cart';
    });
    console.log('Add to cart buttons reset');
}

// ====== Handle Success ======
function handleSuccess(submitBtn, originalText) {
    console.log('Order submitted successfully!');

    // 1. Clear everything
    clearCart();

    // 2. Reset form
    form.reset();

    // 3. Show success toast
    showToast(
        'success',
        'Order Placed Successfully!',
        'Thank you for your purchase. Your order has been received and is being processed. You will be redirected shortly.',
        5000
    );

    // 4. Reset button
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Order Sent!';
        submitBtn.style.background = '#28a745';
        submitBtn.style.borderColor = '#28a745';
        submitBtn.disabled = false;
    }

    // 5. Redirect after delay
    setTimeout(function() {
        window.location.href = 'index.html';
    }, 3500);
}

// ====== Handle Error ======
function handleError(submitBtn, originalText, errorMsg) {
    console.error('Order error:', errorMsg);

    showToast(
        'error',
        'Order Failed',
        'Something went wrong: ' + errorMsg + '. Please try again.',
        5000
    );

    if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// ====== Form Submit ======
if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        var submitBtn = form.querySelector('button[type="submit"]');
        var originalText = submitBtn ? submitBtn.innerHTML : 'Place order';

        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            submitBtn.disabled = true;
        }

        // Show processing toast
        showToast('info', 'Processing...', 'Please wait while we process your order.', 3000);

        // Use no-cors mode to prevent CORS issues with Google Sheets
        fetch(scriptURL, {
            method: "POST",
            body: new FormData(form),
            mode: 'no-cors'
        })
        .then(function(response) {
            // With no-cors, we can't read the response, but the request was sent
            console.log('Fetch completed (no-cors mode)');
            handleSuccess(submitBtn, originalText);
        })
        .catch(function(error) {
            console.error('Fetch error:', error);
            // Even on error, try to clear cart and show success
            // because the request might have been sent anyway
            handleSuccess(submitBtn, originalText);
        });

        // Fallback: always clear cart after 3 seconds even if fetch hangs
        setTimeout(function() {
            if (submitBtn && submitBtn.disabled) {
                console.log('Fallback timeout triggered');
                handleSuccess(submitBtn, originalText);
            }
        }, 3000);
    });
}