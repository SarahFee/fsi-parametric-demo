// Main website functionality

// Debug flag
const DEBUG = true;
function debugLog(msg, data = null) {
    if (DEBUG) {
        console.log('[DEBUG]', msg, data || '');
    }
}
// ---- Safety shim: ensure updateSimulationLog exists even if charts.js failed to load ----
if (typeof window.updateSimulationLog !== 'function') {
  window.updateSimulationLog = function (simulationResults) {
    const logContainer = document.getElementById('logContainer');
    if (!logContainer) return;

    logContainer.innerHTML = '';
    (simulationResults || []).forEach((result, idx) => {
      const monthLabel = (typeof MONTH_LABELS !== 'undefined' && MONTH_LABELS[idx]) ? MONTH_LABELS[idx] : `Month ${idx + 1}`;
      let line = `${monthLabel}: Cash=${(result?.cashBalance ?? 0).toFixed ? result.cashBalance.toFixed(1) : result.cashBalance}`;

      if (result?.emergencyEvent) line += ' 🔴Emergency';
      if (result?.securityEvent)  line += ' 🟡Security';
      if ((result?.insurancePayout ?? 0) > 0) line += ` 💰Insurance=${result.insurancePayout}`;
      const fsiEnabledEl = document.getElementById('fsiEnabled');
      if (fsiEnabledEl && fsiEnabledEl.checked && typeof result?.fsiValue === 'number') {
        line += ` FSI=${result.fsiValue.toFixed(2)}`;
      }

      const div = document.createElement('div');
      div.textContent = line;
      div.style.marginBottom = '4px';
      logContainer.appendChild(div);
    });
    logContainer.scrollTop = logContainer.scrollHeight;
  };
}

document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOM Content Loaded');
    // Initialize the website
    initializeWebsite();
});

function initializeWebsite() {
    debugLog('Initializing website');
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize charts
    try {
        initializeCharts();
        debugLog('Charts initialized successfully');
    } catch (error) {
        debugLog('Error initializing charts:', error);
    }
    
    // Initialize demo controls
    try {
        initializeDemoControls();
        debugLog('Demo controls initialized successfully');
    } catch (error) {
        debugLog('Error initializing demo controls:', error);
    }
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize event map with default country
    try {
        const countrySelect = document.getElementById('countrySelect');
        if (countrySelect) {
            const defaultCountry = countrySelect.value;
            debugLog('Initializing map for country:', defaultCountry);
            initializeEventMap(defaultCountry);
            updateEventMap(defaultCountry);
        }
    } catch (error) {
        debugLog('Error initializing map:', error);
    }
}

function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active navigation item on scroll
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Update scroll progress
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        scrollProgress.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    }
}

function initializeDemoControls() {
    debugLog('Setting up demo controls');

    // Check if required elements exist
    const requiredElements = [
        'durationSlider', 'countrySelect', 'organizationSelect', 'runSimulation'
    ];
    
    for (const elementId of requiredElements) {
        const element = document.getElementById(elementId);
        if (!element) {
            debugLog(`Missing required element: ${elementId}`);
        }
    }

    // Duration slider
    const durationSlider = document.getElementById('durationSlider');
    const durationValue = document.getElementById('durationValue');
    
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', function() {
            durationValue.textContent = this.value;
            debugLog('Duration changed to:', this.value);
        });
    }

    // Set up all the weight sliders
    const weightSliders = [
        { slider: 'delayWeight', value: 'delayWeightValue' },
        { slider: 'volatilityWeight', value: 'volatilityWeightValue' },
        { slider: 'coverageWeight', value: 'coverageWeightValue' },
        { slider: 'concentrationWeight', value: 'concentrationWeightValue' },
        { slider: 'psiWeight', value: 'psiWeightValue' },
        { slider: 'epiWeight', value: 'epiWeightValue' },
        { slider: 'premiumRate', value: 'premiumRateValue' },
        { slider: 'payoutCapX', value: 'payoutCapXValue' },
        { slider: 'claimTriggerFrac', value: 'claimTriggerFracValue' },
        { slider: 'waitingPeriod', value: 'waitingPeriodValue' },
        { slider: 'triggerThreshold', value: 'triggerThresholdValue' }
    ];

    weightSliders.forEach(({ slider, value }) => {
        const sliderElement = document.getElementById(slider);
        const valueElement = document.getElementById(value);
        
        if (sliderElement && valueElement) {
            sliderElement.addEventListener('input', function() {
                const val = parseFloat(this.value);
                if (slider === 'claimTriggerFrac' || slider === 'waitingPeriod') {
                    valueElement.textContent = val.toFixed(0);
                } else {
                    valueElement.textContent = val.toFixed(slider === 'premiumRate' || slider === 'payoutCapX' || slider === 'triggerThreshold' ? 1 : 2);
                }
            });
        }
    });

    // Country selection change
    const countrySelect = document.getElementById('countrySelect');
    if (countrySelect) {
        countrySelect.addEventListener('change', function() {
            debugLog('Country changed to:', this.value);
            try {
                updateEventMap(this.value);
            } catch (error) {
                debugLog('Error updating map:', error);
            }
        });
    }

    // Run simulation button - Multiple ways to attach the event
    const runButton = document.getElementById('runSimulation');
    if (runButton) {
        debugLog('Found run button, attaching event listener');
        
        // Remove any existing listeners
        runButton.onclick = null;
        
        // Add the event listener
        runButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            debugLog('Run button clicked!');
            runSimulationDemo();
        });
        
        // Also try onclick as backup
        runButton.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            debugLog('Run button clicked via onclick!');
            runSimulationDemo();
        };
        
        debugLog('Event listeners attached to run button');
    } else {
        debugLog('ERROR: Could not find run simulation button');
    }
}

function initializeScrollEffects() {
    // Add hover effects to interactive elements
    document.querySelectorAll('.timeline-item, .innovation-card, .result-card, .partner').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function runSimulationDemo() {
    debugLog('=== SIMULATION STARTED ===');
    
    try {
        const runButton = document.getElementById('runSimulation');
        if (!runButton) {
            debugLog('ERROR: Run button not found in simulation function');
            return;
        }
        
        // Disable button and show loading state
        runButton.disabled = true;
        runButton.textContent = 'Running...';
        runButton.classList.add('loading');
        
        // Check if simulation functions exist
        if (typeof runSimulation !== 'function') {
            debugLog('ERROR: runSimulation function not found');
            showNotification('Simulation function not available', 'error');
            return;
        }
        
        // Get configuration from controls
        const config = getSimulationConfig();
        debugLog('Simulation config:', config);
        
        // Run simulation with delay to show loading state
        setTimeout(() => {
            try {
                debugLog('Running simulation with config...');
                
                // Run the simulation
                const simulationResults = runSimulation(config);
                debugLog('Simulation completed, results:', simulationResults);
                
                if (!simulationResults || simulationResults.length === 0) {
                    throw new Error('Simulation returned no results');
                }
                
                // Generate baseline data
                const baselineData = generateBaselineData(config.country, config.organization, config.duration);
                debugLog('Generated baseline data:', baselineData);
                
                // Generate insurance comparison data
                const insuranceData = generateInsuranceData(baselineData, simulationResults);
                debugLog('Generated insurance data:', insuranceData);
                
                // Calculate FSI timeline
                const fsiData = calculateFSITimeline(simulationResults);
                debugLog('Generated FSI data:', fsiData);
                
                // Update charts
                updateChartsWithData(baselineData, insuranceData, simulationResults, fsiData, config);
                
                // Update simulation log
                updateSimulationLog(simulationResults);
                
                // Update event map
                updateEventMap(config.country);
                
                // Show success message
                showNotification('Simulation completed successfully!', 'success');
                debugLog('=== SIMULATION COMPLETED SUCCESSFULLY ===');
                
            } catch (error) {
                debugLog('Simulation execution error:', error);
                showNotification(`Simulation failed: ${error.message}`, 'error');
            } finally {
                // Re-enable button
                runButton.disabled = false;
                runButton.textContent = 'Run Simulation';
                runButton.classList.remove('loading');
            }
        }, 100); // Reduced delay for faster feedback
        
    } catch (error) {
        debugLog('Error in runSimulationDemo:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}

function getSimulationConfig() {
    const config = {
        country: getElementValue('countrySelect', 'Sudan'),
        organization: getElementValue('organizationSelect', 'UNHCR'),
        duration: parseInt(getElementValue('durationSlider', '6')),
        // FSI
        fsiEnabled: getElementChecked('fsiEnabled', true),
        delayWeight: parseFloat(getElementValue('delayWeight', '0.25')),
        volatilityWeight: parseFloat(getElementValue('volatilityWeight', '0.25')),
        coverageWeight: parseFloat(getElementValue('coverageWeight', '0.25')),
        concentrationWeight: parseFloat(getElementValue('concentrationWeight', '0.25')),
        psiWeight: parseFloat(getElementValue('psiWeight', '0.10')),
        epiWeight: parseFloat(getElementValue('epiWeight', '0.10')),
        triggerThreshold: parseFloat(getElementValue('triggerThreshold', '2.0')),
        // Insurance
        insuranceEnabled: getElementChecked('insuranceEnabled', false),
        premiumRate: parseFloat(getElementValue('premiumRate', '2.0')),
        payoutCapX: parseFloat(getElementValue('payoutCapX', '3.0')),
        claimTriggerFrac: parseFloat(getElementValue('claimTriggerFrac', '50')) / 100.0,
        waitingPeriod: parseInt(getElementValue('waitingPeriod', '1'))
    };
    
    return config;
}

function getElementValue(id, defaultValue) {
    const element = document.getElementById(id);
    return element ? element.value : defaultValue;
}

function getElementChecked(id, defaultValue) {
    const element = document.getElementById(id);
    return element ? element.checked : defaultValue;
}

function updateChartsWithData(baselineData, insuranceData, simulationResults, fsiData, config) {
    try {
        // Ensure charts are initialized
        if (!window.cashBalanceChart) {
            debugLog('Initializing cash balance chart');
            initializeCashBalanceChart();
        }
        if (!window.fsiChart) {
            debugLog('Initializing FSI chart');
            initializeFSIChart();
        }
        
        // Update charts
        debugLog('Updating cash balance chart');
        updateCashBalanceChart(baselineData, insuranceData, simulationResults, config.duration);
        
        debugLog('Updating FSI chart');
        updateFSIChart(fsiData, config.duration);
        
    } catch (error) {
        debugLog('Error updating charts:', error);
    }
}

function showNotification(message, type = 'info') {
    debugLog(`Showing notification: ${message} (${type})`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions for demo
function scrollToDemo() {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add click handler for CTA button
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button[href="#demo"]');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToDemo();
        });
    }
});

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
    if (window.cashBalanceChart) window.cashBalanceChart.resize();
    if (window.fsiChart) window.fsiChart.resize();
    if (window.fundingChart) window.fundingChart.resize();
    if (window.icebergChart) window.icebergChart.resize();
    if (window.eventMap) window.eventMap.invalidateSize();
});

// Export functions for debugging
window.simulationDemo = {
    runSimulation: runSimulationDemo,
    updateEventMap: updateEventMap,
    showNotification: showNotification,
    getConfig: getSimulationConfig
};

// Test function to verify everything is loaded
window.testSimulation = function() {
    debugLog('=== TESTING SIMULATION SETUP ===');
    debugLog('runSimulation function exists:', typeof runSimulation === 'function');
    debugLog('generateBaselineData function exists:', typeof generateBaselineData === 'function');
    debugLog('Button element:', document.getElementById('runSimulation'));
    debugLog('Config:', getSimulationConfig());
};
