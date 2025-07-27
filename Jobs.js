// JobFinder India - Single Page Layout JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeSearch();
    initializeCategoryCards();
    initializeJobCards();
    initializeScrollEffects();
    initializeModal();
    initializeFAQ();
});

// Navigation
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                    
                    // Update active nav link
                    updateActiveNavLink(this);
                }
            }
        });
    });

    // Update active nav link based on scroll position
    window.addEventListener('scroll', updateActiveNavOnScroll);
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Search Functionality
function initializeSearch() {
    const searchForm = document.getElementById('search-form');
    const jobSearchInput = document.getElementById('job-search');
    const locationSearchInput = document.getElementById('location-search');
    const jobSuggestions = document.getElementById('job-suggestions');
    const locationSuggestions = document.getElementById('location-suggestions');

    // Sample data for suggestions
    const jobSuggestions_data = [
        'Software Engineer', 'Data Analyst', 'Sales Executive', 'HR Manager',
        'Marketing Manager', 'Accountant', 'Teacher', 'Nurse', 'Security Guard',
        'Delivery Executive', 'Customer Service', 'Content Writer', 'Graphic Designer',
        'Web Developer', 'Digital Marketing', 'Business Analyst', 'Project Manager'
    ];

    const locationSuggestions_data = [
        'Mumbai, Maharashtra', 'Delhi, NCR', 'Bangalore, Karnataka', 'Hyderabad, Telangana',
        'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
        'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Kochi, Kerala', 'Indore, Madhya Pradesh',
        'Nagpur, Maharashtra', 'Visakhapatnam, Andhra Pradesh', 'Bhopal, Madhya Pradesh',
        'Patna, Bihar', 'Vadodara, Gujarat', 'Guwahati, Assam', 'Remote/Work from Home'
    ];

    // Job search suggestions
    if (jobSearchInput && jobSuggestions) {
        jobSearchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            showSuggestions(query, jobSuggestions_data, jobSuggestions, jobSearchInput);
        });

        jobSearchInput.addEventListener('focus', function() {
            if (this.value) {
                const query = this.value.toLowerCase();
                showSuggestions(query, jobSuggestions_data, jobSuggestions, jobSearchInput);
            }
        });

        jobSearchInput.addEventListener('blur', function() {
            setTimeout(() => {
                jobSuggestions.style.display = 'none';
            }, 200);
        });
    }

    // Location search suggestions
    if (locationSearchInput && locationSuggestions) {
        locationSearchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            showSuggestions(query, locationSuggestions_data, locationSuggestions, locationSearchInput);
        });

        locationSearchInput.addEventListener('focus', function() {
            if (this.value) {
                const query = this.value.toLowerCase();
                showSuggestions(query, locationSuggestions_data, locationSuggestions, locationSearchInput);
            }
        });

        locationSearchInput.addEventListener('blur', function() {
            setTimeout(() => {
                locationSuggestions.style.display = 'none';
            }, 200);
        });
    }

    // Search form submission
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const jobQuery = jobSearchInput.value.trim();
            const locationQuery = locationSearchInput.value.trim();
            
            if (jobQuery || locationQuery) {
                performSearch(jobQuery, locationQuery);
            } else {
                console.log('Please enter a job title or location to search.');
            }
        });
    }
}

function showSuggestions(query, data, container, input) {
    if (!query) {
        container.style.display = 'none';
        return;
    }

    const filteredSuggestions = data.filter(item => 
        item.toLowerCase().includes(query)
    ).slice(0, 5);

    if (filteredSuggestions.length > 0) {
        container.innerHTML = filteredSuggestions.map(suggestion => 
            `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}', '${input.id}')">${suggestion}</div>`
        ).join('');
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

function selectSuggestion(suggestion, inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.value = suggestion;
        const container = inputId === 'job-search' ? 
            document.getElementById('job-suggestions') : 
            document.getElementById('location-suggestions');
        if (container) {
            container.style.display = 'none';
        }
    }
}

function performSearch(jobQuery, locationQuery) {
    // Show loading in console
    console.log('Searching for jobs...');
    
    // Simulate search delay
    setTimeout(() => {
        // For demo purposes, show a sample search result
        const searchResults = generateSearchResults(jobQuery, locationQuery);
        showSearchModal(searchResults, jobQuery, locationQuery);
    }, 1500);
}

function generateSearchResults(jobQuery, locationQuery) {
    // Sample search results - in a real application, this would come from a backend API
    const sampleResults = [
        {
            title: jobQuery || 'Software Engineer',
            company: 'TechCorp India',
            location: locationQuery || 'Bangalore, Karnataka',
            salary: '₹12-18 LPA',
            type: 'Full-time',
            description: 'Join our dynamic team to build innovative software solutions.',
            tags: ['JavaScript', 'React', 'Node.js'],
            posted: '2 days ago'
        },
        {
            title: jobQuery || 'Senior Developer',
            company: 'InnovateTech Solutions',
            location: locationQuery || 'Mumbai, Maharashtra',
            salary: '₹15-25 LPA',
            type: 'Full-time',
            description: 'Lead development projects and mentor junior developers.',
            tags: ['Python', 'Django', 'AWS'],
            posted: '1 day ago'
        }
    ];

    return sampleResults;
}

// Category Cards
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryLink = this.querySelector('.category-link');
            if (categoryLink) {
                const href = categoryLink.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Log to console
                        const categoryTitle = this.querySelector('.category-title').textContent;
                        console.log(`Browsing ${categoryTitle}...`);
                        
                        // Highlight the target section briefly
                        setTimeout(() => {
                            targetElement.style.background = 'linear-gradient(135deg, rgba(0, 168, 150, 0.1), rgba(255, 153, 51, 0.1))';
                            setTimeout(() => {
                                targetElement.style.background = '';
                            }, 2000);
                        }, 500);
                    }
                }
            }
        });

        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Job Cards
function initializeJobCards() {
    const jobCards = document.querySelectorAll('.job-card');
    const applyButtons = document.querySelectorAll('.btn-apply');
    
    // Job card hover effects
    jobCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Apply button functionality
    applyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const jobCard = this.closest('.job-card');
            const jobTitle = jobCard.querySelector('.job-title').textContent;
            const companyName = jobCard.querySelector('.company-name').textContent;
            
            console.log(`Application submitted for ${jobTitle} at ${companyName}!`);
            
            // Disable button temporarily
            this.textContent = 'Applied';
            this.style.background = '#28a745';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Apply Now';
                this.style.background = '';
                this.disabled = false;
            }, 3000);
        });
    });

    // View more buttons
    const viewMoreButtons = document.querySelectorAll('.btn-outline-primary');
    viewMoreButtons.forEach(button => {
        if (button.textContent.includes('View All')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const buttonText = this.textContent;
                console.log(`Loading more jobs... ${buttonText}`);
                
                // Simulate loading more jobs
                setTimeout(() => {
                    console.log('More jobs loaded successfully!');
                }, 2000);
            });
        }
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Fade in animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe job category sections
    const sections = document.querySelectorAll('.job-category-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Modal
function initializeModal() {
    const modal = document.getElementById('search-modal');
    const closeButton = document.getElementById('modal-close');

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeModal();
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function showSearchModal(results, jobQuery, locationQuery) {
    const modal = document.getElementById('search-modal');
    const modalBody = document.getElementById('search-results');
    
    if (!modal || !modalBody) return;

    let searchSummary = 'Search Results';
    if (jobQuery && locationQuery) {
        searchSummary = `Results for "${jobQuery}" in "${locationQuery}"`;
    } else if (jobQuery) {
        searchSummary = `Results for "${jobQuery}"`;
    } else if (locationQuery) {
        searchSummary = `Results in "${locationQuery}"`;
    }

    modalBody.innerHTML = `
        <div class="search-summary">
            <h4>${searchSummary}</h4>
            <p>Found ${results.length} job(s) matching your criteria</p>
        </div>
        <div class="search-results-list">
            ${results.map(job => `
                <div class="search-result-item">
                    <h5>${job.title}</h5>
                    <p class="company">${job.company}</p>
                    <div class="job-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                        <span><i class="fas fa-rupee-sign"></i> ${job.salary}</span>
                        <span><i class="fas fa-clock"></i> ${job.type}</span>
                    </div>
                    <p class="description">${job.description}</p>
                    <div class="tags">
                        ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="result-footer">
                        <span class="posted">Posted ${job.posted}</span>
                        <button class="btn btn-apply" onclick="applyToJob('${job.title}', '${job.company}')">Apply Now</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="search-actions">
            <button class="btn btn-outline-primary" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="browseAllJobs()">Browse All Jobs</button>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function applyToJob(jobTitle, company) {
    console.log(`Application submitted for ${jobTitle} at ${company}!`);
    closeModal();
}

function browseAllJobs() {
    closeModal();
    const allJobsSection = document.getElementById('jobs-male');
    if (allJobsSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = allJobsSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    console.log('Browsing all available jobs...');
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization
const debouncedScroll = debounce(updateActiveNavOnScroll, 100);
window.removeEventListener('scroll', updateActiveNavOnScroll);
window.addEventListener('scroll', debouncedScroll);

// Add smooth scrolling for all internal links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Initialize tooltips and other interactive elements
function initializeTooltips() {
    const elements = document.querySelectorAll('[data-tooltip]');
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Call initialize tooltips after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTooltips);

// Add CSS for tooltips
const tooltipStyles = `
    .tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        animation: fadeInTooltip 0.3s ease forwards;
    }
    
    @keyframes fadeInTooltip {
        to {
            opacity: 1;
        }
    }
`;

// Add tooltip styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = tooltipStyles;
document.head.appendChild(styleSheet);

console.log('JobFinder India - Single Page Layout JavaScript Loaded Successfully!');


// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                // Close other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
}

// Enhanced error handling for robust JavaScript
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

function safeQuerySelectorAll(selector) {
    try {
        return document.querySelectorAll(selector);
    } catch (error) {
        console.warn(`Elements not found: ${selector}`);
        return [];
    }
}

// Enhanced navigation with error handling
function updateActiveNavOnScroll() {
    try {
        const sections = safeQuerySelectorAll('section[id]');
        const navLinks = safeQuerySelectorAll('.nav-link[href^="#"]');
        const header = safeQuerySelector('.header');
        
        if (!header || sections.length === 0 || navLinks.length === 0) return;
        
        const headerHeight = header.offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    } catch (error) {
        console.warn('Error in updateActiveNavOnScroll:', error);
    }
}

// Enhanced scroll effects with error handling
function initializeScrollEffects() {
    try {
        // Parallax effect for hero section
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = safeQuerySelector('.hero');
            
            if (hero) {
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            }
        });

        // Fade in animation for sections
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe job category sections
        const sections = safeQuerySelectorAll('.job-category-section, .article-section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    } catch (error) {
        console.warn('Error in initializeScrollEffects:', error);
    }
}

// Enhanced category cards with error handling
function initializeCategoryCards() {
    try {
        const categoryCards = safeQuerySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const categoryLink = this.querySelector('.category-link');
                if (categoryLink) {
                    const href = categoryLink.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        const targetId = href.substring(1);
                        const targetElement = safeQuerySelector(`#${targetId}`);
                        
                        if (targetElement) {
                            const header = safeQuerySelector('.header');
                            const headerHeight = header ? header.offsetHeight : 80;
                            const targetPosition = targetElement.offsetTop - headerHeight - 20;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                            
                            // Log to console
                            const categoryTitle = this.querySelector('.category-title');
                            if (categoryTitle) {
                                console.log(`Browsing ${categoryTitle.textContent}...`);
                            }
                            
                            // Highlight the target section briefly
                            setTimeout(() => {
                                targetElement.style.background = 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 149, 0, 0.1))';
                                setTimeout(() => {
                                    targetElement.style.background = '';
                                }, 2000);
                            }, 500);
                        }
                    }
                }
            });

            // Add hover effect
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    } catch (error) {
        console.warn('Error in initializeCategoryCards:', error);
    }
}

// Enhanced job cards with error handling
function initializeJobCards() {
    try {
        const jobCards = safeQuerySelectorAll('.job-card');
        const applyButtons = safeQuerySelectorAll('.btn-apply');
        
        // Job card hover effects
        jobCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Apply button functionality
        applyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const jobCard = this.closest('.job-card');
                if (jobCard) {
                    const jobTitle = jobCard.querySelector('.job-title');
                    const companyName = jobCard.querySelector('.company-name');
                    
                    if (jobTitle && companyName) {
                        console.log(`Application submitted for ${jobTitle.textContent} at ${companyName.textContent}!`);
                        
                        // Disable button temporarily
                        this.textContent = 'Applied';
                        this.style.background = '#28a745';
                        this.disabled = true;
                        
                        setTimeout(() => {
                            this.textContent = 'Apply Now';
                            this.style.background = '';
                            this.disabled = false;
                        }, 3000);
                    }
                }
            });
        });

        // View more buttons
        const viewMoreButtons = safeQuerySelectorAll('.btn-outline-primary');
        viewMoreButtons.forEach(button => {
            if (button.textContent.includes('View All')) {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const buttonText = this.textContent;
                    console.log(`Loading more jobs... ${buttonText}`);
                    
                    // Simulate loading more jobs
                    setTimeout(() => {
                        console.log('More jobs loaded successfully!');
                    }, 2000);
                });
            }
        });
    } catch (error) {
        console.warn('Error in initializeJobCards:', error);
    }
}

// Enhanced navigation with error handling
function initializeNavigation() {
    try {
        const hamburger = safeQuerySelector('#hamburger');
        const navMenu = safeQuerySelector('#nav-menu');
        const navLinks = safeQuerySelectorAll('.nav-link');

        // Mobile menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = safeQuerySelector(`#${targetId}`);
                    
                    if (targetElement) {
                        const header = safeQuerySelector('.header');
                        const headerHeight = header ? header.offsetHeight : 80;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        if (navMenu && navMenu.classList.contains('active')) {
                            hamburger.classList.remove('active');
                            navMenu.classList.remove('active');
                        }
                        
                        // Update active nav link
                        updateActiveNavLink(this);
                    }
                }
            });
        });

        // Update active nav link based on scroll position
        window.addEventListener('scroll', updateActiveNavOnScroll);
    } catch (error) {
        console.warn('Error in initializeNavigation:', error);
    }
}

console.log('JobFinder India - Enhanced Single Page Layout JavaScript Loaded Successfully!');

