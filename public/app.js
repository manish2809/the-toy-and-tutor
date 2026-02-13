const API_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let currentProfile = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (token && currentUser) {
        checkExistingProfile();
    } else {
        showSection('authSection');
    }
});

// Tab switching
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
    } else {
        tabs[1].classList.add('active');
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
    }
}

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Show toast message
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            currentUser = data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            showToast('Login successful!');
            checkExistingProfile();
        } else {
            showToast(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Connection error', 'error');
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            currentUser = data.user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            showToast('Registration successful!');
            showSection('profileSection');
        } else {
            showToast(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Connection error', 'error');
    }
}

// Check existing profile
async function checkExistingProfile() {
    try {
        const response = await fetch(`${API_URL}/profiles`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const profiles = await response.json();
        
        if (profiles.length > 0) {
            currentProfile = profiles[0];
            loadDashboard();
        } else {
            showSection('profileSection');
        }
    } catch (error) {
        showToast('Error loading profile', 'error');
    }
}

// Handle Create Profile
async function handleCreateProfile(event) {
    event.preventDefault();
    
    const childName = document.getElementById('childName').value;
    const age = parseInt(document.getElementById('childAge').value);
    const grade = parseInt(document.getElementById('childGrade').value);
    const board = document.getElementById('childBoard').value;
    const location = document.getElementById('childLocation').value;
    const apartment = document.getElementById('childApartment').value;
    
    const interests = Array.from(document.querySelectorAll('input[name="interest"]:checked'))
        .map(cb => cb.value);
    
    if (interests.length === 0) {
        showToast('Please select at least one interest', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ childName, age, grade, board, interests, location, apartment })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentProfile = data;
            showToast('Profile created successfully!');
            loadDashboard();
        } else {
            showToast(data.error || 'Failed to create profile', 'error');
        }
    } catch (error) {
        showToast('Connection error', 'error');
    }
}

// Load Dashboard
async function loadDashboard() {
    showSection('dashboardSection');
    
    document.getElementById('welcomeMessage').textContent = 
        `Welcome! Here's what we recommend for ${currentProfile.childName} 🎉`;
    
    // Load profile display
    displayProfile();
    
    try {
        const response = await fetch(`${API_URL}/recommendations/${currentProfile.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        // Display products
        const productsList = document.getElementById('productsList');
        if (data.products.length > 0) {
            productsList.innerHTML = data.products.map(product => `
                <div class="item product-card">
                    <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div>
                            ${product.interests.split(',').map(i => 
                                `<span class="badge">${i}</span>`
                            ).join('')}
                        </div>
                        <div class="product-footer">
                            <div class="price">₹${product.price}</div>
                            <button onclick="addToCart(${product.id})" class="btn-add-cart">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            productsList.innerHTML = '<p>No products found matching the profile.</p>';
        }
        
        // Display services
        const servicesList = document.getElementById('servicesList');
        if (data.services.length > 0) {
            servicesList.innerHTML = data.services.map(service => `
                <div class="item service-card">
                    <div class="service-header">
                        <h3>${service.name}</h3>
                        <div class="rating">
                            <span class="stars">${'⭐'.repeat(Math.round(service.rating))}</span>
                            <span class="rating-text">${service.rating} (${service.reviewsCount} reviews)</span>
                        </div>
                    </div>
                    <p class="tutor-name">👨‍🏫 ${service.tutorName}</p>
                    <p>${service.description}</p>
                    <p><strong>📍 Location:</strong> ${service.location}</p>
                    <p><strong>🏢 Address:</strong> ${service.address}</p>
                    <p><strong>💼 Experience:</strong> ${service.experience}</p>
                    <p><strong>🎓 Qualifications:</strong> ${service.qualifications}</p>
                    <div>
                        ${service.interests.split(',').map(i => 
                            `<span class="badge">${i}</span>`
                        ).join('')}
                    </div>
                    <div class="service-footer">
                        <div class="price">₹${service.price}/month</div>
                        <div class="booking-buttons">
                            <button onclick="bookService(${service.id}, 'intro')" class="btn-book">Book Intro</button>
                            <button onclick="bookService(${service.id}, 'class')" class="btn-book btn-book-class">Book Class</button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            servicesList.innerHTML = '<p>No services found matching the profile in your area.</p>';
        }
    } catch (error) {
        showToast('Error loading recommendations', 'error');
    }
}

// Switch dashboard tabs
function switchDashboardTab(tab) {
    const tabs = document.querySelectorAll('.dashboard-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    
    if (tab === 'products') {
        tabs[0].classList.add('active');
        document.getElementById('productsTab').classList.add('active');
    } else if (tab === 'services') {
        tabs[1].classList.add('active');
        document.getElementById('servicesTab').classList.add('active');
    } else if (tab === 'profile') {
        tabs[2].classList.add('active');
        document.getElementById('profileTab').classList.add('active');
    }
}

// Display profile
function displayProfile() {
    const profileDisplay = document.getElementById('profileDisplay');
    profileDisplay.innerHTML = `
        <h3>${currentProfile.childName}'s Profile</h3>
        <div class="profile-field">
            <label>Name:</label>
            <span>${currentProfile.childName}</span>
        </div>
        <div class="profile-field">
            <label>Age:</label>
            <span>${currentProfile.age} years</span>
        </div>
        <div class="profile-field">
            <label>Grade:</label>
            <span>Grade ${currentProfile.grade}</span>
        </div>
        <div class="profile-field">
            <label>Board:</label>
            <span>${currentProfile.board}</span>
        </div>
        <div class="profile-field">
            <label>Location:</label>
            <span>${currentProfile.location || 'Not specified'}</span>
        </div>
        <div class="profile-field">
            <label>Apartment/Area:</label>
            <span>${currentProfile.apartment || 'Not specified'}</span>
        </div>
        <div class="profile-field">
            <label>Interests:</label>
            <div class="profile-interests">
                ${currentProfile.interests.map(i => `<span class="badge">${i}</span>`).join('')}
            </div>
        </div>
    `;
}

// Toggle edit profile form
function toggleEditProfile() {
    const editForm = document.getElementById('editProfileForm');
    const editBtn = document.getElementById('editProfileBtn');
    
    if (editForm.style.display === 'none') {
        // Populate form with current values
        document.getElementById('editChildName').value = currentProfile.childName;
        document.getElementById('editChildAge').value = currentProfile.age;
        document.getElementById('editChildGrade').value = currentProfile.grade;
        document.getElementById('editChildBoard').value = currentProfile.board;
        document.getElementById('editChildLocation').value = currentProfile.location || '';
        document.getElementById('editChildApartment').value = currentProfile.apartment || '';
        
        // Check interests
        document.querySelectorAll('input[name="editInterest"]').forEach(cb => {
            cb.checked = currentProfile.interests.includes(cb.value);
        });
        
        editForm.style.display = 'block';
        editBtn.textContent = 'Cancel Edit';
    } else {
        editForm.style.display = 'none';
        editBtn.textContent = 'Edit Profile';
    }
}

// Handle Update Profile
async function handleUpdateProfile(event) {
    event.preventDefault();
    
    const childName = document.getElementById('editChildName').value;
    const age = parseInt(document.getElementById('editChildAge').value);
    const grade = parseInt(document.getElementById('editChildGrade').value);
    const board = document.getElementById('editChildBoard').value;
    const location = document.getElementById('editChildLocation').value;
    const apartment = document.getElementById('editChildApartment').value;
    
    const interests = Array.from(document.querySelectorAll('input[name="editInterest"]:checked'))
        .map(cb => cb.value);
    
    if (interests.length === 0) {
        showToast('Please select at least one interest', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/profiles/${currentProfile.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ childName, age, grade, board, interests, location, apartment })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentProfile = data;
            showToast('Profile updated successfully!');
            toggleEditProfile();
            displayProfile();
            loadDashboard();
        } else {
            showToast(data.error || 'Failed to update profile', 'error');
        }
    } catch (error) {
        showToast('Connection error', 'error');
    }
}

// Show profile section
function showProfileSection() {
    document.getElementById('childName').value = '';
    document.getElementById('childAge').value = '';
    document.getElementById('childGrade').value = '';
    document.getElementById('childBoard').value = '';
    document.querySelectorAll('input[name="interest"]').forEach(cb => cb.checked = false);
    showSection('profileSection');
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token = null;
    currentUser = null;
    currentProfile = null;
    showSection('authSection');
    showToast('Logged out successfully');
}


// Add to cart
async function addToCart(productId) {
    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });
        
        if (response.ok) {
            showToast('Added to cart!');
            updateCartCount();
        } else {
            showToast('Failed to add to cart', 'error');
        }
    } catch (error) {
        showToast('Connection error', 'error');
    }
}

// Update cart count
async function updateCartCount() {
    try {
        const response = await fetch(`${API_URL}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const cart = await response.json();
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartBadge = document.getElementById('cartCount');
        if (cartBadge) {
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Book service
async function bookService(serviceId, bookingType) {
    const bookingDate = prompt(`Enter date for ${bookingType} (YYYY-MM-DD):`);
    if (!bookingDate) return;
    
    const bookingTime = prompt('Enter time (HH:MM):');
    if (!bookingTime) return;
    
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ serviceId, bookingType, bookingDate, bookingTime })
        });
        
        if (response.ok) {
            showToast(`${bookingType === 'intro' ? 'Intro' : 'Class'} booked successfully!`);
        } else {
            showToast('Failed to book', 'error');
        }
    } catch (error) {
        showToast('Connection error', 'error');
    }
}
