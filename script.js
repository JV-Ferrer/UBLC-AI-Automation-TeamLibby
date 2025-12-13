// Global State
let currentPage = 'onboarding';
let currentSlide = 0;
let progress = 0;
let progressInterval = null;
let messages = [];
let isTyping = false;
let isGenerating = false;
let eyePositions = {};
let notificationUnsubscribe = null;
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
        // Firebase is initialized in index.html; ensure auth state is observed
        if (window.firebase && firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                hydrateUserProfile(user);
                if (!user) {
                    // Always gate behind auth: send unauthenticated users to auth.html
                    window.location.href = 'auth.html';
                    return;
                }
                // Initialize notifications for authenticated user
                initializeNotifications(user);
                // Authenticated: show onboarding only if not completed
                const completed = localStorage.getItem('onboardingCompleted') === 'true';
                if (!completed) {
                    navigateTo && navigateTo('onboarding');
                } else {
                    navigateTo && navigateTo('home');
                }
            });
        }
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

// Start chat from feature card with automatic message
function startFeatureChat(message) {
    // Navigate to chat page
    navigateTo('chat');
    
    // Wait for page to be active, then send the message
    setTimeout(() => {
        const input = document.getElementById('chat-input');
        if (input && message.trim()) {
            // Add user message
            addMessage(message, true);
            
            // Hide quick suggestions
            const quickSuggestions = document.getElementById('quick-suggestions');
            if (quickSuggestions) {
                quickSuggestions.style.display = 'none';
            }
            
            // Show typing indicator and send to webhook
            showTypingIndicator();
            sendToWebhook(message);
        }
    }, 300);
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
    
    // Send message to webhook
    sendToWebhook(message);
}

async function sendToWebhook(message) {
    const webhookUrl = 'https://roxasejay08.app.n8n.cloud/webhook/aec495fe-e9bb-46f0-861b-4ef1d1a14beb';
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });
        
        const data = await response.json();
        hideTypingIndicator();
        
        // Use the response from webhook, fallback to a generic error if unavailable
        let assistantResponse = data.response || data.message || "Sorry, I couldn't get a response right now. Please try again.";
        
        // Convert escaped newlines to actual newlines
        assistantResponse = assistantResponse.replace(/\\n/g, '\n');
        
        addMessage(assistantResponse, false);
    } catch (error) {
        console.error('Error sending message to webhook:', error);
        hideTypingIndicator();
        // Fallback to a generic error if webhook fails
        addMessage("Sorry, I couldn't get a response right now. Please try again.", false);
    }
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
    // Convert newlines to <br> tags and preserve formatting
    if (!isUser) {
        p.innerHTML = content
            .replace(/\n\n/g, '<br><br>')  // Double newlines for paragraphs
            .replace(/\n/g, '<br>');        // Single newlines for line breaks
        p.style.whiteSpace = 'pre-wrap';    // Preserve spaces and wrapping
    } else {
        p.textContent = content;
    }
    bubble.appendChild(p);
    
    messageContent.appendChild(bubble);
    
    if (!isUser) {
        // Extract book title and its availability status together
        let detectedStatus = null;
        let bookTitle = null;
        
        // Count how many books are mentioned (for lists, don't show buttons)
        const bookCount = (content.match(/Title:/g) || []).length;
        const multipleBooks = bookCount > 1;
        
        // Only process for action buttons if it's about a single book
        if (!multipleBooks) {
            // Extract title - try multiple patterns
            // Pattern 1: "Title: [Book Name]" format - be very strict to stop at next field
            let titleMatch = content.match(/Title:\s*([^\n]+?)(?=\n|Author:|ISBN:|Location:|Availability:)/i);
            
            // Pattern 2: Quoted book title like "1984" or 'The Great Gatsby'
            if (!titleMatch) {
                titleMatch = content.match(/["']([^"']{3,50})["']/i);
            }
            
            // Pattern 3: "The book [title]" format
            if (!titleMatch) {
                titleMatch = content.match(/\bbook\s+"?([^"\n]{3,50})"?/i);
            }
            
            if (titleMatch) {
                bookTitle = titleMatch[1].trim();
                bookTitle = bookTitle.replace(/[*\-\s]+$/, '').trim();
                bookTitle = bookTitle.replace(/^the\s+/i, 'The '); // Normalize "the"
            }
            
            // Extract availability status with better pattern matching
            // Priority 1: Look for "Availability: [Status]" format (case insensitive, flexible spacing)
            let statusMatch = content.match(/Availability:\s*(Available|Borrowed|Reserved|Unavailable|Not\s*Available)/i);
            
            if (statusMatch) {
                const status = statusMatch[1].toLowerCase().replace(/\s+/g, '');
                if (status === 'notavailable') {
                    detectedStatus = 'unavailable';
                } else {
                    detectedStatus = status;
                }
            } 
            // Priority 2: Look for status keywords in context
            else {
                const lowerContent = content.toLowerCase();
                
                // Check for "available" status first (most specific)
                if (/availability:\s*available/i.test(content) ||
                    lowerContent.includes('currently available') || 
                    lowerContent.includes('is available') ||
                    lowerContent.includes('available to borrow')) {
                    detectedStatus = 'available';
                }
                // Check for "borrowed" status
                else if (lowerContent.includes('currently borrowed') || 
                    lowerContent.includes('is borrowed') ||
                    lowerContent.includes('has been borrowed') ||
                    /borrowed\s+and\s+not\s+available/i.test(content) ||
                    /availability:\s*borrowed/i.test(content)) {
                    detectedStatus = 'borrowed';
                }
                // Check for "reserved" status
                else if (lowerContent.includes('reserved') ||
                         lowerContent.includes('on hold') ||
                         /availability:\s*reserved/i.test(content)) {
                    detectedStatus = 'reserved';
                }
                // Check for generic unavailable
                else if (lowerContent.includes('not available') ||
                         lowerContent.includes('unavailable')) {
                    detectedStatus = 'unavailable';
                }
            }
            
            // Debug logging
            console.log('Button Detection Debug:', {
                multipleBooks,
                bookTitle,
                detectedStatus,
                contentPreview: content.substring(0, 200)
            });
        }
        
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
        
        // Add action buttons based on status (only for single book discussions)
        if (bookTitle && detectedStatus && !multipleBooks) {
            if (detectedStatus === 'available') {
                // Available - show Borrow button
                const borrowBtn = document.createElement('button');
                borrowBtn.className = 'message-action-btn borrow-btn';
                borrowBtn.title = 'Borrow this book';
                borrowBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                `;
                borrowBtn.addEventListener('click', () => {
                    handleBorrowRequest(bookTitle, 'available');
                });
                actions.appendChild(borrowBtn);
            } else if (detectedStatus === 'borrowed') {
                // Borrowed - show Reserve button
                const reserveBtn = document.createElement('button');
                reserveBtn.className = 'message-action-btn reserve-btn';
                reserveBtn.title = 'Reserve this book';
                reserveBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                `;
                reserveBtn.addEventListener('click', () => {
                    handleBorrowRequest(bookTitle, 'reserved');
                });
                actions.appendChild(reserveBtn);
            } else if (detectedStatus === 'unavailable') {
                // Unavailable - show Notify Me button
                const notifyBtn = document.createElement('button');
                notifyBtn.className = 'message-action-btn notify-btn';
                notifyBtn.title = 'Notify me when available';
                notifyBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                `;
                notifyBtn.addEventListener('click', () => {
                    addBookToInterests(bookTitle);
                });
                actions.appendChild(notifyBtn);
            }
        }
        
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

// Firebase Auth helpers
function getCurrentUser() {
    return firebase && firebase.auth ? firebase.auth().currentUser : null;
}

function hydrateUserProfile(userParam) {
    const user = userParam || getCurrentUser();
    const nameEl = document.getElementById('profile-name');
    const yearEl = document.getElementById('profile-year');
    const idEl = document.getElementById('profile-id');
    const welcomeEl = document.querySelector('.welcome-title');

    if (user) {
        // Firebase Auth user fields
        const displayName = user.displayName || 'Welcome, Scholar';
        const email = user.email || '';
        if (nameEl) nameEl.textContent = displayName;
        if (yearEl) yearEl.textContent = email ? email : '';
        if (idEl) idEl.textContent = email ? `Email: ${email}` : '';
        if (welcomeEl) welcomeEl.textContent = `Hey, ${displayName.split(' ')[0]}!`;
        
        // Load user's borrowing data from Firestore
        loadUserBorrowingData(user);
    } else {
        if (nameEl) nameEl.textContent = 'Not signed in';
        if (yearEl) yearEl.textContent = '';
        if (idEl) idEl.textContent = '';
        if (welcomeEl) welcomeEl.textContent = 'Welcome!';
    }
}

function loadUserBorrowingData(user) {
    if (!user || !firebase.firestore) return;
    
    const db = firebase.firestore();
    const borrowedCountEl = document.getElementById('borrowed-count');
    const reservedCountEl = document.getElementById('reserved-count');
    const dueReturnsCountEl = document.getElementById('due-returns-count');
    
    // Fetch borrow requests
    db.collection('users').doc(user.uid)
        .collection('borrowRequests')
        .where('status', '==', 'pending')
        .get()
        .then((snapshot) => {
            let borrowedCount = 0;
            let reservedCount = 0;
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.action === 'available') {
                    borrowedCount++;
                } else if (data.action === 'reserved') {
                    reservedCount++;
                }
            });
            
            if (borrowedCountEl) borrowedCountEl.textContent = borrowedCount;
            if (reservedCountEl) reservedCountEl.textContent = reservedCount;
            
            // For now, due returns = borrowed books (can be enhanced with due date logic)
            if (dueReturnsCountEl) dueReturnsCountEl.textContent = borrowedCount;
        })
        .catch(err => {
            console.error('Error loading borrowing data:', err);
        });
}

function logoutUser() {
    if (firebase && firebase.auth) {
        firebase.auth().signOut().then(() => {
            window.location.href = 'auth.html';
        });
    } else {
        window.location.href = 'auth.html';
    }
}

// Notification System
function initializeNotifications(user) {
    if (!user || !firebase.firestore) return;
    
    const db = firebase.firestore();
    const notificationBell = document.getElementById('notificationBell');
    const notificationPanel = document.getElementById('notificationPanel');
    const notificationList = document.getElementById('notificationList');
    const notificationBadge = document.getElementById('notificationBadge');
    const clearBtn = document.getElementById('clearNotifications');
    
    // Toggle notification panel
    if (notificationBell) {
        notificationBell.addEventListener('click', () => {
            notificationPanel.style.display = 
                notificationPanel.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // Clear all notifications
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            db.collection('users').doc(user.uid)
                .collection('notifications')
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => doc.ref.delete());
                });
        });
    }
    
    // Listen to notifications in real-time
    if (notificationUnsubscribe) notificationUnsubscribe();
    
    notificationUnsubscribe = db
        .collection('users')
        .doc(user.uid)
        .collection('notifications')
        .onSnapshot((snapshot) => {
            console.log('Notifications snapshot:', snapshot.size, 'docs');
            notificationList.innerHTML = '';
            let unreadCount = 0;
            
            if (snapshot.empty) {
                notificationList.innerHTML = '<p class="empty-message">No notifications yet</p>';
            } else {
                // Sort manually by createdAt
                const notifications = [];
                snapshot.forEach((doc) => {
                    notifications.push({ id: doc.id, ...doc.data() });
                });
                
                notifications.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                    const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                    return dateB - dateA; // Descending order
                });
                
                notifications.forEach((notification) => {
                    console.log('Notification:', notification);
                    if (!notification.read) unreadCount++;
                    
                    const item = document.createElement('div');
                    item.className = `notification-item ${notification.read ? '' : 'unread'}`;
                    
                    // Handle different timestamp formats
                    let timestamp = 'Just now';
                    if (notification.createdAt) {
                        try {
                            if (notification.createdAt.toDate) {
                                // Firestore Timestamp
                                timestamp = new Date(notification.createdAt.toDate()).toLocaleString();
                            } else if (typeof notification.createdAt === 'string') {
                                // String timestamp
                                timestamp = new Date(notification.createdAt).toLocaleString();
                            } else if (typeof notification.createdAt === 'number') {
                                // Unix timestamp
                                timestamp = new Date(notification.createdAt).toLocaleString();
                            }
                        } catch (e) {
                            console.error('Error parsing timestamp:', e);
                        }
                    }
                    
                    item.innerHTML = `
                        <strong>${notification.title || 'Notification'}</strong>
                        <p>${notification.message || ''}</p>
                        <small>${timestamp}</small>
                    `;
                    
                    item.addEventListener('click', () => {
                        db.collection('users').doc(user.uid)
                            .collection('notifications').doc(notification.id)
                            .update({ read: true });
                    });
                    
                    notificationList.appendChild(item);
                });
            }
            
            // Update badge
            if (unreadCount > 0) {
                notificationBadge.style.display = 'block';
                notificationBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            } else {
                notificationBadge.style.display = 'none';
            }
        }, (error) => {
            console.error('Notification listener error:', error);
        });
}

function addBookToInterests(bookTitle) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Please log in to enable notifications');
        return;
    }
    
    const db = firebase.firestore();
    
    // Save to both old and new structure for compatibility
    // New structure: top-level bookInterests collection for easy querying
    db.collection('bookInterests').doc(`${bookTitle}_${user.uid}`).set({
        bookTitle: bookTitle || 'Unknown Book',
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Unknown',
        createdAt: new Date(),
        notified: false
    })
    .then(() => {
        // Also save to user's subcollection for profile display
        return db.collection('users').doc(user.uid)
            .collection('interestedBooks').add({
                bookTitle: bookTitle || 'Unknown Book',
                createdAt: new Date(),
                notified: false,
                status: 'unavailable'
            });
    })
    .then(() => {
        alert('✅ You will be notified when this book becomes available!');
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Failed to save interest. Please try again.');
    });
}

function handleBorrowRequest(bookTitle, action) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Please log in to borrow books');
        return;
    }
    
    const db = firebase.firestore();
    const webhookUrl = 'https://roxasejay08.app.n8n.cloud/webhook/aec495fe-e9bb-46f0-861b-4ef1d1a14beb';
    
    const requestData = {
        bookTitle: bookTitle,
        action: action,
        studentId: user.email,
        studentEmail: user.email,
        studentUid: user.uid,
        studentName: user.displayName || 'Unknown',
        timestamp: new Date().toLocaleString(),
        requestedAt: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save borrow request to Firestore
    db.collection('users').doc(user.uid)
        .collection('borrowRequests').add({
            ...requestData,
            requestedAt: new Date()
        })
        .then(() => {
            // Send notification to webhook for admin email
            return fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: 'BORROW_REQUEST',
                    data: requestData
                })
            });
        })
        .then(() => {
            if (action === 'available') {
                alert('✅ Borrow request sent! Please collect the book at the library counter with your student ID.');
            } else if (action === 'reserved') {
                alert('✅ Reservation request sent! You will be notified when the book is available.');
            }
        })
        .catch(err => {
            console.error('Error:', err);
            alert('Failed to send request. Please try again.');
        });
}

// Show book list modal
function showBookList(type) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Please log in to view your books');
        return;
    }
    
    const modal = document.getElementById('bookListModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBookList = document.getElementById('modalBookList');
    
    // Set title based on type
    const titles = {
        'borrowed': 'Borrowed Books',
        'history': 'My Requests',
        'favorites': 'Favorite Books'
    };
    modalTitle.textContent = titles[type] || 'Books';
    
    // Show modal
    modal.style.display = 'flex';
    
    // Load books based on type
    modalBookList.innerHTML = '<p class="empty-message">Loading...</p>';
    
    const db = firebase.firestore();
    
    if (type === 'borrowed') {
        // Show current borrowed books (pending borrow requests)
        db.collection('users').doc(user.uid)
            .collection('borrowRequests')
            .where('status', '==', 'pending')
            .get()
            .then(snapshot => {
                // Filter for borrowed books (action = 'available')
                const borrowedBooks = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.action === 'available') {
                        borrowedBooks.push(data);
                    }
                });
                
                // Sort by date (newest first)
                borrowedBooks.sort((a, b) => {
                    const dateA = a.requestedAt?.toMillis?.() || 0;
                    const dateB = b.requestedAt?.toMillis?.() || 0;
                    return dateB - dateA;
                });
                
                if (borrowedBooks.length === 0) {
                    modalBookList.innerHTML = '<p class="empty-message">No borrowed books yet</p>';
                } else {
                    modalBookList.innerHTML = '';
                    borrowedBooks.forEach(data => {
                        modalBookList.innerHTML += createBookItemHTML(data, 'pending');
                    });
                }
            })
            .catch(err => {
                console.error('Error:', err);
                modalBookList.innerHTML = '<p class="empty-message">Failed to load books</p>';
            });
    } else if (type === 'history') {
        // Show all borrow requests (history)
        db.collection('users').doc(user.uid)
            .collection('borrowRequests')
            .orderBy('requestedAt', 'desc')
            .limit(20)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    modalBookList.innerHTML = '<p class="empty-message">No reading history yet</p>';
                } else {
                    modalBookList.innerHTML = '';
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const status = data.action === 'available' ? 'borrowed' : 'reserved';
                        modalBookList.innerHTML += createBookItemHTML(data, status);
                    });
                }
            })
            .catch(err => {
                console.error('Error:', err);
                modalBookList.innerHTML = '<p class="empty-message">Failed to load history</p>';
            });
    } else if (type === 'favorites') {
        // Show interested books (notify me)
        db.collection('users').doc(user.uid)
            .collection('interestedBooks')
            .orderBy('createdAt', 'desc')
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    modalBookList.innerHTML = '<p class="empty-message">No favorite books yet</p>';
                } else {
                    modalBookList.innerHTML = '';
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        modalBookList.innerHTML += createBookItemHTML(data, 'interested');
                    });
                }
            })
            .catch(err => {
                console.error('Error:', err);
                modalBookList.innerHTML = '<p class="empty-message">Failed to load favorites</p>';
            });
    }
}

// Create book item HTML
function createBookItemHTML(data, status) {
    const timestamp = data.requestedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date();
    const dateStr = timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    let statusBadge = '';
    if (status === 'pending') {
        statusBadge = '<span class="book-status pending">Pending Pickup</span>';
    } else if (status === 'borrowed') {
        statusBadge = '<span class="book-status borrowed">Borrowed</span>';
    } else if (status === 'reserved') {
        statusBadge = '<span class="book-status reserved">Reserved</span>';
    } else if (status === 'interested') {
        statusBadge = '<span class="book-status pending">Watching</span>';
    }
    
    return `
        <div class="book-item">
            <h4>${data.bookTitle || 'Unknown Book'}</h4>
            <p>Student: ${data.studentName || 'Unknown'}</p>
            <p>Date: ${dateStr}</p>
            <div class="book-item-meta">
                ${statusBadge}
            </div>
        </div>
    `;
}

// Close book list modal
function closeBookListModal() {
    const modal = document.getElementById('bookListModal');
    modal.style.display = 'none';
}
