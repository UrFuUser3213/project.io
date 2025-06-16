// Состояние приложения с сохранением в localStorage
const state = {
    get currentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    set currentUser(value) {
        if (value) {
            localStorage.setItem('currentUser', JSON.stringify(value));
        } else {
            localStorage.removeItem('currentUser');
        }
    },
    get cart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },
    set cart(value) {
        localStorage.setItem('cart', JSON.stringify(value));
    },
    get currentPage() {
        return parseInt(localStorage.getItem('currentPage')) || 1;
    },
    set currentPage(value) {
        localStorage.setItem('currentPage', value);
    },
    get orders() {
        return parseInt(localStorage.getItem('orders')) || 0;
    },
    set orders(value) {
        localStorage.setItem('orders', value);
    },
    productsPerPage: 6
};

// DOM элементы
const elements = {
    loginBtn: document.getElementById('login-btn'),
    registerBtn: document.getElementById('register-btn'),
    cartBtn: document.getElementById('cart-btn'),
    cartCount: document.querySelector('.cart-count'),
    loginModal: document.getElementById('login-modal'),
    registerModal: document.getElementById('register-modal'),
    cartModal: document.getElementById('cart-modal'),
    profileModal: document.getElementById('profile-modal'),
    productDetailsModal: document.getElementById('product-details-modal'),
    closeModalBtns: document.querySelectorAll('.close-modal'),
    showRegister: document.getElementById('show-register'),
    showLogin: document.getElementById('show-login'),
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    productsContainer: document.getElementById('products-container'),
    pagination: document.getElementById('pagination'),
    cartItems: document.getElementById('cart-items'),
    cartTotalPrice: document.querySelector('.cart-total-price'),
    closeCartBtn: document.getElementById('close-cart'),
    checkoutBtn: document.getElementById('checkout'),
    profileName: document.getElementById('profile-name'),
    profileEmail: document.getElementById('profile-email'),
    profileAvatar: document.getElementById('profile-avatar'),
    profileRegDate: document.getElementById('profile-reg-date'),
    profilePhone: document.getElementById('profile-phone'),
    profileAddress: document.getElementById('profile-address'),
    profileOrders: document.getElementById('profile-orders'),
    editProfileBtn: document.getElementById('edit-profile'),
    logoutBtn: document.getElementById('logout'),
    productDetails: document.getElementById('product-details')
};

// Инициализация приложения
function init() {
    renderProducts();
    setupEventListeners();
    updateCartCount();
    updateAuthButtons();
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Модальные окна
    elements.loginBtn.addEventListener('click', () => showModal(elements.loginModal));
    elements.registerBtn.addEventListener('click', () => showModal(elements.registerModal));
    elements.cartBtn.addEventListener('click', () => {
        showModal(elements.cartModal);
        renderCartItems();
    });
    
    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target === btn) {
                hideModal(elements.loginModal);
                hideModal(elements.registerModal);
                hideModal(elements.cartModal);
                hideModal(elements.profileModal);
                hideModal(elements.productDetailsModal);
            }
        });
    });
    
    elements.showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(elements.loginModal);
        showModal(elements.registerModal);
    });
    
    elements.showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal(elements.registerModal);
        showModal(elements.loginModal);
    });
    
    // Формы
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });
    
    elements.registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegister();
    });
    
    // Корзина
    elements.closeCartBtn.addEventListener('click', () => hideModal(elements.cartModal));
    elements.checkoutBtn.addEventListener('click', handleCheckout);
    
    // Профиль
    elements.editProfileBtn.addEventListener('click', handleEditProfile);
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Клик вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === elements.loginModal) hideModal(elements.loginModal);
        if (e.target === elements.registerModal) hideModal(elements.registerModal);
        if (e.target === elements.cartModal) hideModal(elements.cartModal);
        if (e.target === elements.profileModal) hideModal(elements.profileModal);
        if (e.target === elements.productDetailsModal) hideModal(elements.productDetailsModal);
    });

    // Обработка касаний для мобильных
    document.addEventListener('touchstart', function(){}, {passive: true});
    
    // Предотвращаем масштабирование при двойном тапе
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, {passive: false});
}

// Показать модальное окно
function showModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Скрыть модальное окно
function hideModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Обработка входа
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    state.currentUser = {
        email,
        name: email.split('@')[0],
        regDate: new Date().toLocaleDateString('ru-RU'),
        phone: '+7 (999) 123-45-67',
        address: 'Москва, ул. Примерная, 123'
    };
    
    alert(`Добро пожаловать, ${state.currentUser.name}!`);
    updateAuthButtons();
    hideModal(elements.loginModal);
    elements.loginForm.reset();
}

// Обработка регистрации
function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }
    
    state.currentUser = {
        email,
        name,
        regDate: new Date().toLocaleDateString('ru-RU'),
        phone: '+7 (999) 000-00-00',
        address: 'Не указан'
    };
    
    alert(`Регистрация успешна, ${name}!`);
    updateAuthButtons();
    hideModal(elements.registerModal);
    elements.registerForm.reset();
}

// Обновить кнопки авторизации
function updateAuthButtons() {
    if (state.currentUser) {
        elements.loginBtn.innerHTML = `<i class="fas fa-user"></i> ${state.currentUser.name}`;
        elements.registerBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Выйти';
        
        elements.loginBtn.onclick = showProfile;
        elements.registerBtn.onclick = handleLogout;
    } else {
        elements.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти';
        elements.registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Регистрация';
        
        elements.loginBtn.onclick = () => showModal(elements.loginModal);
        elements.registerBtn.onclick = () => showModal(elements.registerModal);
    }
}

// Показать профиль пользователя
function showProfile() {
    if (!state.currentUser) return;
    
    elements.profileName.textContent = state.currentUser.name;
    elements.profileEmail.textContent = state.currentUser.email;
    elements.profileRegDate.textContent = state.currentUser.regDate;
    elements.profilePhone.textContent = state.currentUser.phone;
    elements.profileAddress.textContent = state.currentUser.address;
    elements.profileOrders.textContent = state.orders;
    
    elements.profileAvatar.textContent = state.currentUser.name.charAt(0).toUpperCase();
    
    showModal(elements.profileModal);
}

// Редактирование профиля
function handleEditProfile() {
    const newPhone = prompt('Введите новый телефон:', state.currentUser.phone);
    if (newPhone !== null) {
        state.currentUser.phone = newPhone;
        elements.profilePhone.textContent = newPhone;
    }
    
    const newAddress = prompt('Введите новый адрес:', state.currentUser.address);
    if (newAddress !== null) {
        state.currentUser.address = newAddress;
        elements.profileAddress.textContent = newAddress;
    }
    
    // Обновляем данные в localStorage
    state.currentUser = {...state.currentUser};
}

// Обработка выхода
function handleLogout() {
    state.currentUser = null;
    updateAuthButtons();
    hideModal(elements.profileModal);
    alert('Вы успешно вышли из системы');
}

// Рендер товаров
function renderProducts() {
    const startIndex = (state.currentPage - 1) * state.productsPerPage;
    const endIndex = startIndex + state.productsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    elements.productsContainer.innerHTML = '';
    
    if (paginatedProducts.length === 0) {
        elements.productsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Товары не найдены</p>';
        return;
    }
    
    paginatedProducts.forEach(product => {
        const productEl = document.createElement('div');
        productEl.className = 'product-card';
        productEl.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="category">${product.category}</span>
                <div class="price">${product.price.toLocaleString()} ₽</div>
                <div class="rating">
                    ${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> В корзину</button>
                    <button class="view-details" data-id="${product.id}"><i class="fas fa-eye"></i> Подробнее</button>
                </div>
            </div>
        `;
        
        elements.productsContainer.appendChild(productEl);
    });
    
    // Добавить обработчики для кнопок товаров
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            showProductDetails(productId);
        });
    });
    
    renderPagination();
}

// Показать детали товара
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let specsHTML = '';
    for (const [key, value] of Object.entries(product.specs)) {
        specsHTML += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    
    elements.productDetails.innerHTML = `
        <div class="product-details-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-details-info">
            <h3>${product.name}</h3>
            <span class="category">${product.category}</span>
            <div class="product-details-price">${product.price.toLocaleString()} ₽</div>
            <div class="product-details-description">
                ${product.description}
            </div>
            <div class="product-details-specs">
                <h4>Характеристики</h4>
                <ul>
                    ${specsHTML}
                </ul>
            </div>
            <button class="btn add-to-cart-details" data-id="${product.id}" style="width: 100%; margin-top: 1.5rem;">
                <i class="fas fa-shopping-cart"></i> Добавить в корзину
            </button>
        </div>
    `;
    
    document.querySelector('.add-to-cart-details')?.addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-id'));
        addToCart(productId);
        hideModal(elements.productDetailsModal);
    });
    
    showModal(elements.productDetailsModal);
}

// Рендер пагинации
function renderPagination() {
    const pageCount = Math.ceil(products.length / state.productsPerPage);
    
    if (pageCount <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    if (state.currentPage > 1) {
        paginationHTML += `<button class="prev-page"><i class="fas fa-chevron-left"></i></button>`;
    }
    
    for (let i = 1; i <= pageCount; i++) {
        paginationHTML += `<button class="page-number ${i === state.currentPage ? 'active' : ''}">${i}</button>`;
    }
    
    if (state.currentPage < pageCount) {
        paginationHTML += `<button class="next-page"><i class="fas fa-chevron-right"></i></button>`;
    }
    
    elements.pagination.innerHTML = paginationHTML;
    
    // Добавить обработчики для пагинации
    document.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', (e) => {
            state.currentPage = parseInt(e.target.textContent);
            renderProducts();
            window.scrollTo({ top: elements.productsContainer.offsetTop - 100, behavior: 'smooth' });
        });
    });
    
    document.querySelector('.prev-page')?.addEventListener('click', () => {
        state.currentPage--;
        renderProducts();
        window.scrollTo({ top: elements.productsContainer.offsetTop - 100, behavior: 'smooth' });
    });
    
    document.querySelector('.next-page')?.addEventListener('click', () => {
        state.currentPage++;
        renderProducts();
        window.scrollTo({ top: elements.productsContainer.offsetTop - 100, behavior: 'smooth' });
    });
}

// Добавить товар в корзину
function addToCart(productId) {
    if (!state.currentUser) {
        alert('Пожалуйста, войдите в систему, чтобы добавить товар в корзину');
        showModal(elements.loginModal);
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const currentCart = [...state.cart];
    const existingItem = currentCart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        currentCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    state.cart = currentCart;
    updateCartCount();
    alert(`${product.name} добавлен в корзину`);
}

// Обновить счетчик корзины
function updateCartCount() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
}

// Рендер товаров в корзине
function renderCartItems() {
    if (state.cart.length === 0) {
        elements.cartItems.innerHTML = '<p class="empty-cart-message">Ваша корзина пуста</p>';
        elements.cartTotalPrice.textContent = '0 ₽';
        return;
    }
    
    elements.cartItems.innerHTML = '';
    
    state.cart.forEach(item => {
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></div>
        `;
        
        elements.cartItems.appendChild(cartItemEl);
    });
    
    // Добавить обработчики для изменения количества и удаления
    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity < 1) {
                e.target.value = 1;
                return;
            }
            
            const cartItem = state.cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity = newQuantity;
                state.cart = [...state.cart];
            }
            
            updateCartTotal();
        });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    updateCartTotal();
}

// Обновить количество товара в корзине
function updateCartItemQuantity(productId, change) {
    const currentCart = [...state.cart];
    const cartItem = currentCart.find(item => item.id === productId);
    if (!cartItem) return;
    
    const newQuantity = cartItem.quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    cartItem.quantity = newQuantity;
    state.cart = currentCart;
    
    const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
    if (quantityInput) quantityInput.value = newQuantity;
    
    updateCartTotal();
    updateCartCount();
}

// Удалить товар из корзины
function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    renderCartItems();
    updateCartCount();
}

// Обновить итоговую сумму в корзине
function updateCartTotal() {
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    elements.cartTotalPrice.textContent = `${total.toLocaleString()} ₽`;
}

// Обработка оформления заказа
function handleCheckout() {
    if (state.cart.length === 0) {
        alert('Ваша корзина пуста');
        return;
    }
    
    if (!state.currentUser) {
        alert('Пожалуйста, войдите в систему для оформления заказа');
        hideModal(elements.cartModal);
        showModal(elements.loginModal);
        return;
    }
    
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = state.cart.map(item => 
        `${item.name} x ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ₽`
    ).join('\n');
    
    alert(`Заказ оформлен!\n\nДетали заказа:\n${orderDetails}\n\nИтого: ${total.toLocaleString()} ₽\n\nСпасибо за покупку, ${state.currentUser.name}!`);
    
    state.orders++;
    state.cart = [];
    updateCartCount();
    hideModal(elements.cartModal);
}

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', init);