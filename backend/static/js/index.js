document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate on Scroll)
  AOS.init({
    duration: 800, // values from 0 to 3000, with step 50ms
    once: true, // whether animation should happen only once - while scrolling down
  });

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Active link highlighting on scroll
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // Show Citizen Login Modal
  const citizenBtn = document.getElementById('citizen-login-btn');
  if (citizenBtn) {
    citizenBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const modal = document.getElementById('citizen-login-modal');
      if (modal) {
        modal.classList.add('show');
        document.body.classList.add('modal-open');
      }
    });
  }

  // Show Authority Login Modal
  const authorityBtn = document.getElementById('authority-login-btn');
  if (authorityBtn) {
    authorityBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const modal = document.getElementById('authority-login-modal');
      if (modal) {
        modal.classList.add('show');
        document.body.classList.add('modal-open');
      }
    });
  }

  // Close Citizen Modal
  const closeCitizenBtn = document.getElementById('close-citizen-modal');
  if (closeCitizenBtn) {
    closeCitizenBtn.addEventListener('click', function() {
      document.getElementById('citizen-login-modal').classList.remove('show');
      document.body.classList.remove('modal-open');
    });
  }

  // Close Authority Modal
  const closeAuthorityBtn = document.getElementById('close-authority-modal');
  if (closeAuthorityBtn) {
    closeAuthorityBtn.addEventListener('click', function() {
      document.getElementById('authority-login-modal').classList.remove('show');
      document.body.classList.remove('modal-open');
    });
  }

  // Citizen Login form submit
  var citizenLoginForm = document.getElementById('citizen-login-form');
  if (citizenLoginForm) {
    citizenLoginForm.onsubmit = function(e) {
      e.preventDefault();
      
      const username = document.getElementById('citizen-username').value;
      const password = document.getElementById('citizen-password').value;
      
      // Simple validation
      if (username && password) {
        localStorage.setItem('citizenLoggedIn', 'true');
        localStorage.setItem('citizenUsername', username);
        document.getElementById('citizen-login-modal').classList.remove('show');
        document.body.classList.remove('modal-open');
        window.location.href = 'Dashboard.html'; // Corrected redirect
      } else {
        alert('Please fill in all fields');
      }
    };
  }

  // Authority Login form submit
  var authorityLoginForm = document.getElementById('authority-login-form');
  if (authorityLoginForm) {
    authorityLoginForm.onsubmit = function(e) {
      e.preventDefault();
      
      const username = document.getElementById('authority-username').value;
      const password = document.getElementById('authority-password').value;
      
      // Simple validation
      if (username && password) {
        localStorage.setItem('authorityLoggedIn', 'true');
        localStorage.setItem('authorityUsername', username);
        document.getElementById('authority-login-modal').classList.remove('show');
        document.body.classList.remove('modal-open');
        window.location.href = 'auth-dashboard.html'; // Redirect to authority dashboard
      } else {
        alert('Please fill in all fields');
      }
    };
  }

  // Animated Counters
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 400; // The lower the faster

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
      const observer = new IntersectionObserver(entries => {
          if (entries[0].isIntersecting) {
              animateCounters();
              observer.disconnect();
          }
      }, { threshold: 0.4 });
      observer.observe(statsSection);
  }

  // Show logged-in status and logout option
  function updateCitizenStatus() {
    const loggedIn = localStorage.getItem('citizenLoggedIn') === 'true';
    const loginOptions = document.querySelector('.login-options');
    if (loggedIn && loginOptions) {
      loginOptions.innerHTML = `
        <span class="citizen-status"><i class="fas fa-user"></i> Citizen Logged In</span>
        <a href="#" class="login-btn citizen" id="citizen-logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
      `;
      document.getElementById('citizen-logout').onclick = function(e) {
        e.preventDefault();
        localStorage.removeItem('citizenLoggedIn');
        window.location.href = 'fixity.html'; // Redirect to fixity.html on logout
      };
    }
  }
  updateCitizenStatus();

  // Issue report form submission
  const issueReportForm = document.getElementById('issue-report-form');
  if (issueReportForm) {
    issueReportForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const title = document.getElementById('issue-title').value;
      const description = document.getElementById('issue-description').value;
      const location = document.getElementById('issue-zone').value;
      const fileInput = document.getElementById('issue-media');
      const file = fileInput.files[0];

      const processSubmit = (imageDataUrl) => {
        const newIssue = {
            id: Date.now(),
            title: title,
            description: description,
            location: location,
            timestamp: new Date().toLocaleString(),
            status: "Pending",
            upvotes: 0,
            image: imageDataUrl || "https://via.placeholder.com/400x250.png?text=No+Image+Provided"
        };

        let issues = JSON.parse(localStorage.getItem('issues')) || [];
        issues.push(newIssue);
        localStorage.setItem('issues', JSON.stringify(issues));

        alert('Issue reported successfully!');
        window.location.href = 'Community-Feed.html';
      };

      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            processSubmit(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        processSubmit(null);
      }
    });
  }

  // Custom file upload button handler
  const fileInput = document.getElementById('issue-media');
  const fileNameSpan = document.getElementById('upload-filename');
  const uploadBtn = document.querySelector('.upload-btn');
  if (fileInput && fileNameSpan && uploadBtn) {
    uploadBtn.addEventListener('click', function() {
      fileInput.click();
    });
    fileInput.addEventListener('change', function() {
      fileNameSpan.textContent = fileInput.files.length ? fileInput.files[0].name : '';
    });
  }

  // Anonymous report form submission
  const anonymousReportForm = document.getElementById('anonymous-report-form');
  if (anonymousReportForm) {
    anonymousReportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const file = document.getElementById('issue-media').files[0];

        const processSubmit = (imageDataUrl) => {
            const newIssue = {
                id: Date.now(),
                title: document.getElementById('issue-title').value,
                description: document.getElementById('issue-description').value,
                location: document.getElementById('issue-zone').value,
                timestamp: new Date().toLocaleString(),
                status: "Pending",
                upvotes: 1, // Anonymous reports start with 1 upvote
                image: imageDataUrl || "https://via.placeholder.com/400x250.png?text=No+Image+Provided"
            };

            let issues = JSON.parse(localStorage.getItem('issues')) || [];
            issues.unshift(newIssue);
            localStorage.setItem('issues', JSON.stringify(issues));

            alert('Anonymous report submitted successfully!');
            window.location.href = 'Community-Feed.html';
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                processSubmit(event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            processSubmit(null);
        }
    });
  }

  const locationBtn = document.getElementById('get-location');
  const zoneInput = document.getElementById('issue-zone');
  if (locationBtn && zoneInput) {
    locationBtn.onclick = function() {
      if (navigator.geolocation) {
        locationBtn.classList.add('loading');
        locationBtn.innerHTML = '<i class="fas fa-spinner"></i> Locating...';
        locationBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(function(pos) {
          const lat = pos.coords.latitude.toFixed(5);
          const lng = pos.coords.longitude.toFixed(5);
          zoneInput.value = `Lat: ${lat}, Lng: ${lng}`;
          locationBtn.classList.remove('loading');
          locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Use Current Location';
          locationBtn.disabled = false;
        }, function() {
          zoneInput.value = "Unable to get location";
          locationBtn.classList.remove('loading');
          locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Use Current Location';
          locationBtn.disabled = false;
        });
      } else {
        zoneInput.value = "Geolocation not supported";
      }
    };
  }

  // Quick Snap Feature
  const quickSnapBtn = document.getElementById('quick-snap-btn');
  const quickSnapInput = document.getElementById('quick-snap-input');
  const quickSnapLoader = document.getElementById('quick-snap-loader');
  const quickSnapFilename = document.getElementById('quick-snap-filename');

  if (quickSnapBtn && quickSnapInput) {
      quickSnapBtn.addEventListener('click', () => {
          quickSnapInput.click();
      });

      quickSnapInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
              document.querySelector('.quick-snap-box').classList.add('loading');
              quickSnapBtn.style.display = 'none';
              quickSnapFilename.textContent = `Uploading ${file.name}...`;
              quickSnapLoader.style.display = 'block';

              // Simulate AI processing
              setTimeout(() => {
                  const reader = new FileReader();
                  reader.onload = function(event) {
                      const imageDataUrl = event.target.result;
                      
                      // Dummy AI results
                      const categories = ["Pothole", "Garbage", "Streetlight", "Water Leakage", "Blocked Drain"];
                      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
                      const randomLocation = `Sector ${Math.floor(Math.random() * 20) + 1}, Near Landmark ${Math.floor(Math.random() * 100)}`;

                      const newIssue = {
                          id: Date.now(),
                          title: `AI Detected: ${randomCategory}`,
                          description: `Issue automatically detected from Quick Snap. Category: ${randomCategory}.`,
                          location: randomLocation,
                          timestamp: new Date().toLocaleString(),
                          status: "Pending",
                          upvotes: 1, // Start with 1 upvote
                          image: imageDataUrl
                      };

                      let issues = JSON.parse(localStorage.getItem('issues')) || [];
                      issues.unshift(newIssue); // Add to the top of the list
                      localStorage.setItem('issues', JSON.stringify(issues));

                      quickSnapLoader.innerHTML = `<i class="fas fa-check-circle" style="color: #4caf50; font-size: 2.5rem; margin-bottom: 1rem;"></i><p style="font-weight: 600; font-size: 1.1rem;">Success! Issue reported as '${randomCategory}'.</p>`;
                      
                      setTimeout(() => {
                          window.location.href = 'Community-Feed.html';
                      }, 2500);
                  };
                  reader.readAsDataURL(file);
              }, 2500); // 2.5 second delay for simulation
          }
      });
  }

  // Before-After Slider
  const slider = document.querySelector('.before-after-slider');
  if (slider) {
    const afterWrapper = slider.querySelector('.after-image-wrapper');
    const handle = slider.querySelector('.slider-handle');
    let isDragging = false;

    function moveSlider(x) {
      const rect = slider.getBoundingClientRect();
      let newWidth = ((x - rect.left) / rect.width) * 100;
      if (newWidth < 0) newWidth = 0;
      if (newWidth > 100) newWidth = 100;
      afterWrapper.style.width = `${newWidth}%`;
      handle.style.left = `${newWidth}%`;
    }

    // Mouse events
    slider.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    slider.addEventListener('mousemove', (e) => {
      if (isDragging) {
        moveSlider(e.clientX);
      }
    });

    // Touch events
    slider.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchend', () => { isDragging = false; });
    slider.addEventListener('touchmove', (e) => {
        if (isDragging) {
            moveSlider(e.touches[0].clientX);
        }
    });
  }

  // AI Demo Section
  const aiConsole = document.querySelector('.ai-console');
  if (aiConsole) {
    const aiObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runAIDemo();
        aiObserver.disconnect();
      }
    }, { threshold: 0.6 });
    aiObserver.observe(aiConsole);
  }

  function runAIDemo() {
    const typedTextEl = document.getElementById('typed-text');
    const aiStepsEl = document.getElementById('ai-steps');
    const cursorEl = document.querySelector('.typing-cursor');
    const textToType = "There's a huge pile of garbage overflowing onto the street near the city park on 5th avenue.";
    let charIndex = 0;

    const steps = [
      { text: 'Analyzing text...', delay: 500, icon: 'fas fa-search' },
      { text: 'Identifying keywords: <span class="highlight">[garbage, overflowing, street, park]</span>', delay: 1000, icon: 'fas fa-tags' },
      { text: 'Matching keywords to categories...', delay: 1000, icon: 'fas fa-cogs' },
      { text: 'Confidence score: <span class="highlight">98.7%</span>', delay: 800, icon: 'fas fa-chart-line' },
      { text: 'Classification complete!', delay: 500, icon: 'fas fa-check-circle' },
      { text: 'Result: <strong class="highlight" style="font-size: 1.2em; color: #48bb78;">Sanitation</strong>', delay: 300, icon: 'fas fa-award' }
    ];

    function typeChar() {
      if (charIndex < textToType.length) {
        typedTextEl.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 50);
      } else {
        cursorEl.style.display = 'none';
        showAISteps();
      }
    }

    function showAISteps() {
      let totalDelay = 0;
      steps.forEach((step, index) => {
        totalDelay += step.delay;
        setTimeout(() => {
          const stepEl = document.createElement('p');
          stepEl.className = 'ai-step';
          stepEl.innerHTML = `<i class="${step.icon}"></i> ${step.text}`;
          aiStepsEl.appendChild(stepEl);
          
          // Trigger the transition
          setTimeout(() => {
            stepEl.classList.add('visible');
          }, 50);

        }, totalDelay);
      });
    }

    typeChar();
  }

});