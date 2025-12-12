// Global State
let currentPage = 'onboarding';
let currentSlide = 0;
let progress = 0;
let progressInterval = null;
let messages = [
    {
        id: '1',
        content: "Hello! I'm Libby, your UBLC Library assistant. How can I help you today?",
        isUser: false,
        timestamp: 'Today, 09:00 AM'
    }
];
let isTyping = false;
let isGenerating = false;
let eyePositions = {};

// Onboarding Slides
const slides = [
    {
        title: "Hey! I'm Libby!",
        description: "Your friendly library assistant at University of Batangas Lipa Campus."
    },
    {
        title: "Find Books Easily",
        description: "Search our extensive collection and discover new resources for your studies."
    },
    {
        title: "Get Instant Help",
        description: "Ask me about library hours, borrowing rules, and available facilities."
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeMascots();
    startOnboarding();
    setupChatInput();
    checkOnboardingStatus();
    updateBottomNav();
    hydrateUserProfile();
});

// Check if user has completed onboarding
function checkOnboardingStatus() {
    const completed = localStorage.getItem('onboardingCompleted');
    if (completed === 'true') {
        navigateTo('home');
    }
}

// Initialize all mascots with eye tracking
function initializeMascots() {
    const mascots = document.querySelectorAll('.mascot-wrapper');
    mascots.forEach((mascot, index) => {
        setupEyeTracking(mascot, `mascot-${index}`);
    });
}

// Setup eye tracking for mascot
function setupEyeTracking(mascotElement, id) {
    const leftEye = mascotElement.querySelector('.mascot-eye-left .eye-pupil');
    const rightEye = mascotElement.querySelector('.mascot-eye-right .eye-pupil');
    const leftHighlight = mascotElement.querySelector('.mascot-eye-left .eye-highlight');
    const rightHighlight = mascotElement.querySelector('.mascot-eye-right .eye-highlight');
    
    if (!leftEye || !rightEye) return;
    
    eyePositions[id] = { x: 0, y: 0 };
    
    mascotElement.addEventListener('click', () => {
        mascotElement.classList.add('animate-blink');
        setTimeout(() => {
            mascotElement.classList.remove('animate-blink');
        }, 500);
    });
    
    document.addEventListener('mousemove', (e) => {
        const rect = mascotElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = Math.max(-5, Math.min(5, (e.clientX - centerX) / 50));
        const y = Math.max(-5, Math.min(5, (e.clientY - centerY) / 50));
        
        eyePositions[id] = { x, y };
        
        if (leftEye && rightEye) {
            leftEye.setAttribute('cx', 70 + x);
            leftEye.setAttribute('cy', 85 + y);
            rightEye.setAttribute('cx', 130 + x);
            rightEye.setAttribute('cy', 85 + y);
            
            if (leftHighlight && rightHighlight) {
                leftHighlight.setAttribute('cx', 67 + x);
                leftHighlight.setAttribute('cy', 82 + y);
                rightHighlight.setAttribute('cx', 127 + x);
                rightHighlight.setAttribute('cy', 82 + y);
            }
        }
    });
    
    // Add float animation
    mascotElement.classList.add('animate-float');
}

// Onboarding Functions
function startOnboarding() {
    updateOnboardingSlide();
    progressInterval = setInterval(() => {
        progress += 2;
        updateProgressBar();
        
        if (progress >= 100) {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                progress = 0;
                updateOnboardingSlide();
            } else {
                clearInterval(progressInterval);
            }
        }
    }, 100);
}

function updateProgressBar() {
    for (let i = 0; i < 3; i++) {
        const progressBar = document.getElementById(`progress-${i + 1}`);
        if (progressBar) {
            if (i < currentSlide) {
                progressBar.style.width = '100%';
            } else if (i === currentSlide) {
                progressBar.style.width = `${progress}%`;
            } else {
                progressBar.style.width = '0%';
            }
        }
    }
}

function updateOnboardingSlide() {
    const titleEl = document.getElementById('onboarding-title');
    const descEl = document.getElementById('onboarding-desc');
    const continueBtn = document.getElementById('continue-btn');
    
    if (titleEl) titleEl.textContent = slides[currentSlide].title;
    if (descEl) descEl.textContent = slides[currentSlide].description;
    if (continueBtn) {
        continueBtn.textContent = currentSlide === slides.length - 1 ? 'Get Started' : 'Continue';
    }
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        progress = 0;
        updateOnboardingSlide();
    } else {
        skipOnboarding();
    }
}

function skipOnboarding() {
    clearInterval(progressInterval);
    localStorage.setItem('onboardingCompleted', 'true');
    navigateTo('home');
}

// Navigation
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
        
        // Update bottom nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const navMap = {
            'home': 0,
            'chat': 1,
            'profile': 2,
            'settings': 3
        };
        
        if (navMap.hasOwnProperty(page)) {
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems[navMap[page]]) {
                navItems[navMap[page]].classList.add('active');
            }
        }
        
        // Hide/show bottom nav based on page
        updateBottomNav();
        
        // Initialize mascots on new page
        setTimeout(() => {
            initializeMascots();
        }, 100);

        // Refresh profile data when opening profile
        if (page === 'profile') {
            hydrateUserProfile();
        }
        
        // Scroll to top for chat page
        if (page === 'chat') {
            const container = document.getElementById('messages-container');
            if (container) {
                container.scrollTop = 0;
            }
        }
    }
}

// Hide/show bottom nav based on current page
function updateBottomNav() {
    const bottomNav = document.querySelector('.bottom-nav');
    if (!bottomNav) return;
    
    if (currentPage === 'onboarding') {
        bottomNav.classList.add('hidden');
    } else {
        bottomNav.classList.remove('hidden');
    }
}

// Chat Functions
function setupChatInput() {
    const input = document.getElementById('chat-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
            }
        });
    }
}

function handleSend(event) {
    event.preventDefault();
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim() || isTyping) return;
    
    const message = input.value.trim();
    input.value = '';
    
    // Hide quick suggestions after first message
    const quickSuggestions = document.getElementById('quick-suggestions');
    if (quickSuggestions) {
        quickSuggestions.style.display = 'none';
    }
    
    // Add user message
    addMessage(message, true);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(message);
        addMessage(response, false);
    }, 1500);
}

function addMessage(content, isUser) {
    const container = document.getElementById('messages-container');
    if (!container) return;
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = `message-wrapper ${isUser ? 'user' : ''}`;
    
    if (!isUser) {
        const mascot = document.createElement('div');
        mascot.className = 'mascot-wrapper mascot-xs';
        mascot.innerHTML = `
            <svg viewBox="0 0 200 200" class="mascot-svg">
                <circle cx="100" cy="100" r="80" fill="hsl(51, 100%, 50%)" class="mascot-head"/>
                <g class="mascot-eye-left">
                    <ellipse cx="70" cy="85" rx="15" ry="18" fill="white"/>
                    <circle class="eye-pupil" cx="70" cy="85" r="8" fill="black"/>
                    <circle class="eye-highlight" cx="67" cy="82" r="3" fill="white"/>
                </g>
                <g class="mascot-eye-right">
                    <ellipse cx="130" cy="85" rx="15" ry="18" fill="white"/>
                    <circle class="eye-pupil" cx="130" cy="85" r="8" fill="black"/>
                    <circle class="eye-highlight" cx="127" cy="82" r="3" fill="white"/>
                </g>
                <path d="M 65 120 Q 100 150 135 120" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
            </svg>
        `;
        messageWrapper.appendChild(mascot);
        setTimeout(() => setupEyeTracking(mascot, `msg-${Date.now()}`), 100);
    }
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isUser ? 'user' : 'assistant'}`;
    
    const p = document.createElement('p');
    p.textContent = content;
    bubble.appendChild(p);
    
    messageContent.appendChild(bubble);
    
    if (!isUser) {
        const actions = document.createElement('div');
        actions.className = 'message-actions';
        actions.innerHTML = `
            <button class="message-action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 9V5a3 3 0 0 0-6 0v4"></path>
                    <rect x="2" y="9" width="20" height="11" rx="2" ry="2"></rect>
                    <path d="M7 13h10"></path>
                </svg>
            </button>
            <button class="message-action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                </svg>
            </button>
            <button class="message-action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            </button>
            <button class="message-action-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
            </button>
        `;
        messageContent.appendChild(actions);
    }
    
    const timestamp = document.createElement('span');
    timestamp.className = 'message-time';
    timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageContent.appendChild(timestamp);
    
    messageWrapper.appendChild(messageContent);
    container.appendChild(messageWrapper);
    
    // Scroll to bottom
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
    
    messages.push({
        id: Date.now().toString(),
        content,
        isUser,
        timestamp: timestamp.textContent
    });
}

function showTypingIndicator() {
    isTyping = true;
    isGenerating = true;
    
    const container = document.getElementById('messages-container');
    if (!container) return;
    
    const typingWrapper = document.createElement('div');
    typingWrapper.className = 'typing-indicator';
    typingWrapper.id = 'typing-indicator';
    
    const mascot = document.createElement('div');
    mascot.className = 'mascot-wrapper mascot-xs';
    mascot.innerHTML = `
        <svg viewBox="0 0 200 200" class="mascot-svg">
            <circle cx="100" cy="100" r="80" fill="hsl(51, 100%, 50%)" class="mascot-head"/>
            <g class="mascot-eye-left">
                <ellipse cx="70" cy="85" rx="15" ry="18" fill="white"/>
                <circle class="eye-pupil" cx="70" cy="85" r="8" fill="black"/>
                <circle class="eye-highlight" cx="67" cy="82" r="3" fill="white"/>
            </g>
            <g class="mascot-eye-right">
                <ellipse cx="130" cy="85" rx="15" ry="18" fill="white"/>
                <circle class="eye-pupil" cx="130" cy="85" r="8" fill="black"/>
                <circle class="eye-highlight" cx="127" cy="82" r="3" fill="white"/>
            </g>
            <path d="M 65 120 Q 100 150 135 120" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
        </svg>
    `;
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble assistant typing-dots';
    bubble.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    
    typingWrapper.appendChild(mascot);
    typingWrapper.appendChild(bubble);
    container.appendChild(typingWrapper);
    
    setTimeout(() => setupEyeTracking(mascot, `typing-${Date.now()}`), 100);
    
    // Show stop generating button
    const stopBtn = document.getElementById('stop-generating');
    if (stopBtn) {
        stopBtn.classList.remove('hidden');
    }
    
    container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
    
    const stopBtn = document.getElementById('stop-generating');
    if (stopBtn) {
        stopBtn.classList.add('hidden');
    }
}

function stopGenerating() {
    hideTypingIndicator();
    isGenerating = false;
}

function sendQuickSuggestion(suggestion) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = suggestion;
        handleSend({ preventDefault: () => {} });
    }
}

function generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
        return "📚 Library Hours\n\nMonday - Friday: 7:00 AM - 7:00 PM\nSaturday: 8:00 AM - 5:00 PM\nSunday: Closed\n\nNote: Hours may vary during holidays and exam periods. Would you like me to check anything else?";
    }
    
    if (lowerMessage.includes('borrow') || lowerMessage.includes('loan') || lowerMessage.includes('return')) {
        return "📖 Borrowing Rules\n\n• Students can borrow up to 3 books at a time\n• Loan period is 7 days\n• Overdue fine: ₱5.00 per day\n• Reference materials are for in-library use only\n\nDo you need help with anything else?";
    }
    
    if (lowerMessage.includes('book') || lowerMessage.includes('search') || lowerMessage.includes('find')) {
        return "🔍 I can help you search for books! Just tell me:\n\n1. The title or author name\n2. The subject area\n3. Or any keywords\n\nWhat book are you looking for?";
    }
    
    if (lowerMessage.includes('room') || lowerMessage.includes('discussion') || lowerMessage.includes('study')) {
        return "🚪 Discussion Room Booking\n\nWe have 5 discussion rooms available:\n\n• Room A (4 persons) - Available\n• Room B (6 persons) - Available\n• Room C (8 persons) - Occupied until 3 PM\n• Room D (4 persons) - Available\n• Room E (10 persons) - Available\n\nWould you like to book one?";
    }
    
    return "I'm here to help with library services! You can ask me about:\n\n📚 Book searches\n🕐 Library hours\n📖 Borrowing rules\n🚪 Discussion room bookings\n\nWhat would you like to know?";
}

// Utility Functions
function toggleMenu() {
    // Menu toggle functionality can be added here
    console.log('Menu toggled');
}

// User auth helpers shared with index.html
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    const currentId = localStorage.getItem('currentUserId');
    const users = getUsers();
    if (currentId && users[currentId]) {
        return { id: currentId, ...users[currentId] };
    }
    return null;
}

function hydrateUserProfile() {
    const user = getCurrentUser();
    const nameEl = document.getElementById('profile-name');
    const yearEl = document.getElementById('profile-year');
    const idEl = document.getElementById('profile-id');
    const welcomeEl = document.querySelector('.welcome-title');

    if (user) {
        if (nameEl) nameEl.textContent = user.fullName || 'Welcome, Scholar';
        if (yearEl) yearEl.textContent = user.yearLevel || '';
        if (idEl) idEl.textContent = `Student ID: ${user.studentNumber || ''}`;
        if (welcomeEl) welcomeEl.textContent = `Hey, ${user.fullName?.split(' ')[0] || 'Scholar'}!`;
    } else {
        if (nameEl) nameEl.textContent = 'Juan Dela Cruz';
        if (yearEl) yearEl.textContent = 'BSIT - 4th Year';
        if (idEl) idEl.textContent = 'Student ID: 2220777';
        if (welcomeEl) welcomeEl.textContent = 'Hey, UBian!';
    }
}

function logoutUser() {
    localStorage.removeItem('currentUserId');
    window.location.href = 'auth.html';
}

