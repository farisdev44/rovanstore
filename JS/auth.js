

// ⚠️ ضع بيانات مشروعك هنا (نفس البيانات في login.html و signup.html)
const firebaseConfig = {
  apiKey: "AIzaSyASJ7cJKFskjkY8BomxZZZHQAaBYPIFNs8",
  authDomain: "rovan-store.firebaseapp.com",
  databaseURL: "https://rovan-store-default-rtdb.firebaseio.com",
  projectId: "rovan-store",
  storageBucket: "rovan-store.firebasestorage.app",
  messagingSenderId: "24046570512",
  appId: "1:24046570512:web:b5b7f5bc47ffc112838e95",
  measurementId: "G-YYV1X1T9G8"
};


// Import Firebase (using CDN modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Update UI based on auth state
onAuthStateChanged(auth, (user) => {
    const authButtons = document.getElementById('auth-buttons');
    
    if (user) {
        // User is logged in
        const displayName = user.displayName || user.email.split('@')[0];
        
        if (authButtons) {
            authButtons.innerHTML = `
                <div style="display:flex; align-items:center; gap:15px;">
                    <span style="color:var(--color_heading); font-weight:500;">
                        <i class="fa-solid fa-user" style="color:var(--main_color); margin-right:5px;"></i>
                        ${displayName}
                    </span>
                    <button onclick="logoutUser()" class="btn" style="background:#e51a1a; border-color:#e51a1a;">
                        Logout <i class="fa-solid fa-right-from-bracket"></i>
                    </button>
                </div>
            `;
        }
        
        // Save user info to localStorage for checkout
        localStorage.setItem('currentUser', JSON.stringify({
            uid: user.uid,
            email: user.email,
            name: user.displayName || ''
        }));
    } else {
        // User is logged out
        if (authButtons) {
            authButtons.innerHTML = `
                <a href="login.html" class="btn">Login <i class="fa-solid fa-right-to-bracket"></i></a>
                <a href="signup.html" class="btn">Sign UP <i class="fa-solid fa-user-plus"></i></a>
            `;
        }
        localStorage.removeItem('currentUser');
    }
});

// Global logout function
window.logoutUser = async function() {
    try {
        await signOut(auth);
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
    }
};