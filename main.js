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

    // 🔒 Disable motion for conceptual framework nodes
    document.body.classList.add('no-cf-motion');
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
  // Only decorate cards with a subtle focus style; no movement via JS.
  const cards = document.querySelectorAll('.timeline-item, .innovation-card, .result-card, .partner');
  const isTouch = window.matchMedia('(hover: none)').matches;

  // On touch devices, add a class to disable motion in CSS.
  if (isTouch) document.body.classList.add('no-card-motion');

  // Add a class so CSS can style hover/focus consistently
  cards.forEach(card => {
    card.classList.add('hover-card');
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

// ==== Interactive Conceptual Framework ====
document.addEventListener('DOMContentLoaded', () => {
  try { initializeConceptualFramework(); } catch(e){ console.warn(e); }
});

function initializeConceptualFramework() {
  const mount = document.getElementById('cfCanvas');
  if (!mount) return;

  // Data: nodes
  const NODES = [
    // Status Quo (grey)
    { id:'principal',  x:40,  y:120, w:140, h:60, layer:'grey',
      title:'Principal (Donors)',
      body:'Donor governments & institutions set priorities and control disbursements. Their incentives are political and budget‑cycle driven.'
    },
    { id:'planned',    x:205, y:120, w:170, h:60, layer:'grey',
      title:'Planned Funding Flow',
      body:'Intended flow from pledges to agencies. In reality this is disrupted by delays, volatility and partial/earmarked releases.' },
    { id:'agent',      x:410, y:120, w:190, h:60, layer:'grey',
      title:'Agent (Humanitarian Orgs)',
      body:'UN agencies & NGOs execute operations but cannot predict timing/amount of cash inflows reliably.' },
    { id:'distortion', x:205, y:210, w:170, h:80, layer:'grey',
      title:'Political & Economic Distortion',
      body:'Elections, policy shifts, sanctions, GDP & debt shocks create systematic frictions on planned flows.' },

    // Proposed (yellow)
    { id:'fsiFunders', x:205, y:30,  w:220, h:60, layer:'yellow',
      title:'FSI Funders',
      body:'Blended capital: donors, INGOs/UN, banks/insurers/reinsurers backstop the mechanism.' },
    { id:'fsi',        x:410, y:210, w:190, h:80, layer:'yellow',
      title:'FSI = DI + VI + CI + CoI + PSI + EPI',
      body:'Composite Funding Stress Index combining delay, volatility, coverage, concentration, political and macro pressures.' },
    { id:'param',      x:610, y:120, w:190, h:60, layer:'yellow',
      title:'Parametric Insurance Payout',
      body:'Automatic payout stabilizes operations when FSI crosses threshold or cash balance hits safety trigger.' },
    { id:'trigger',    x:610, y:210, w:190, h:60, layer:'yellow',
      title:'Trigger: FSI Threshold Breach',
      body:'Contract specifies objective thresholds & governance; no claims handling delay.' },
    { id:'stabilize',  x:205, y:310, w:170, h:40, layer:'yellow',
      title:'Stabilizing Effect',
      body:'Bridge liquidity smooths shocks; fewer service disruptions & restarts.' },
    { id:'measure',    x:410, y:310, w:190, h:40, layer:'yellow',
      title:'Measurement',
      body:'FSI monitored from FTS/IATI + PSI/EPI signals; auditable and neutralized via governance.' },
  ];

  // Edges
  const EDGES = [
    // grey baseline flow + distortions
    { from:'principal', to:'planned', layer:'grey' },
    { from:'planned', to:'agent', layer:'grey' },
    { from:'distortion', to:'planned', layer:'grey' },

    // yellow additions
    { from:'fsiFunders', to:'planned', layer:'yellow' },
    { from:'planned', to:'fsi', layer:'yellow' },
    { from:'fsi', to:'trigger', layer:'yellow' },
    { from:'trigger', to:'param', layer:'yellow' },
    { from:'param', to:'agent', layer:'yellow' },
    { from:'stabilize', to:'planned', layer:'yellow' },
    { from:'measure', to:'fsi', layer:'yellow' },
  ];

  // Build SVG
  const W = 820, H = 380;
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS,'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // Arrowhead
  const defs = document.createElementNS(svgNS, 'defs');
  const marker = document.createElementNS(svgNS, 'marker');
  marker.setAttribute('id','arrow');
  marker.setAttribute('markerWidth','10');
  marker.setAttribute('markerHeight','7');
  marker.setAttribute('refX','10');
  marker.setAttribute('refY','3.5');
  marker.setAttribute('orient','auto');
  const arrowPath = document.createElementNS(svgNS, 'path');
  arrowPath.setAttribute('d','M0,0 L10,3.5 L0,7 z');
  arrowPath.setAttribute('fill','#ffffff');
  marker.appendChild(arrowPath);
  defs.appendChild(marker);
  svg.appendChild(defs);

  // Draw edges first
  EDGES.forEach(e=>{
    const from = NODES.find(n=>n.id===e.from);
    const to   = NODES.find(n=>n.id===e.to);
    if (!from||!to) return;

    const x1 = from.x + from.w, y1 = from.y + from.h/2;
    const x2 = to.x,             y2 = to.y + to.h/2;

    const path = document.createElementNS(svgNS, 'path');
    const midX = (x1 + x2)/2;
    const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
    path.setAttribute('d', d);
    path.setAttribute('class', `cf-edge ${e.layer==='grey'?'cf-edge-grey':'cf-edge-yellow'} cf-${e.layer}`);
    svg.appendChild(path);
  });

  // Draw nodes
  NODES.forEach(n=>{
    const g = document.createElementNS(svgNS,'g');
    g.setAttribute('class', `cf-node cf-${n.layer}`);
    g.setAttribute('data-id', n.id);
    g.setAttribute('transform', `translate(${n.x},${n.y})`);

    const rect = document.createElementNS(svgNS,'rect');
    rect.setAttribute('width', n.w);
    rect.setAttribute('height', n.h);
    g.appendChild(rect);

    const label = wrapText(svgNS, n.title, n.w - 18, 12, n.h - 14); // a bit more breathing room
    label.setAttribute('transform','translate(9,8)');
    g.appendChild(label);

    g.addEventListener('click', ()=>showCFInfo(n));
    svg.appendChild(g);
  });

  mount.innerHTML = '';
  mount.appendChild(svg);

  // Side panel
  const sideEmpty = document.getElementById('cfSideEmpty');
  const sideBox   = document.getElementById('cfSideContent');
  const tEl       = document.getElementById('cfTitle');
  const bEl       = document.getElementById('cfBody');

  function showCFInfo(n){
    sideEmpty.hidden = true;
    sideBox.hidden = false;
    tEl.textContent = n.title;
    bEl.textContent = n.body;
  }

  // Toggles
  const chkGrey   = document.getElementById('cfToggleStatusQuo');
  const chkYellow = document.getElementById('cfToggleProposal');
  function applyLayerVisibility() {
    const showGrey = !!chkGrey?.checked;
    const showYellow = !!chkYellow?.checked;
    svg.querySelectorAll('.cf-grey').forEach(el=>{
      el.classList.toggle('cf-hidden', !showGrey);
    });
    svg.querySelectorAll('.cf-yellow').forEach(el=>{
      el.classList.toggle('cf-hidden', !showYellow);
    });
  }
  chkGrey?.addEventListener('change', applyLayerVisibility);
  chkYellow?.addEventListener('change', applyLayerVisibility);
  applyLayerVisibility();
}

// Helper: wrap multi-line <text> inside width/height with ellipsis
function wrapText(ns, text, maxWidth, fontSize, maxHeight) {
  const lineGap = 5;                    // space between lines
  const lineHeight = fontSize + lineGap;
  const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));

  const textEl = document.createElementNS(ns, 'text');
  textEl.setAttribute('font-size', fontSize);
  textEl.setAttribute('fill', '#111827');
  textEl.setAttribute('x', '0');
  textEl.setAttribute('y', '0');
  textEl.setAttribute('dominant-baseline', 'hanging');
  textEl.setAttribute('pointer-events', 'none');

  // measurer
  const measurer = document.createElementNS(ns, 'text');
  measurer.setAttribute('font-size', fontSize);
  measurer.setAttribute('opacity', '0');
  const svgRoot = document.querySelector('#cfCanvas svg') || document.body;
  svgRoot.appendChild(measurer);

  function widthOf(s) {
    measurer.textContent = s || '';
    return measurer.getComputedTextLength ? measurer.getComputedTextLength() : 0;
  }

  const words = String(text).split(/\s+/);
  let line = '';
  let used = 0;

  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];

    if (widthOf(test) <= maxWidth) {
      line = test;
      if (i < words.length - 1) continue;
    }

    // push current line
    const tspan = document.createElementNS(ns, 'tspan');
    tspan.setAttribute('x', '0');
    tspan.setAttribute('dy', used === 0 ? 0 : lineHeight);
    tspan.textContent = line || words[i];  // handles a single very long word
    textEl.appendChild(tspan);
    used++;

    if (i === words.length - 1) break;

    // start new line
    line = (widthOf(test) > maxWidth) ? words[i] : '';

    // if next line would be the last visible, condense remainder with ellipsis
    if (used >= maxLines - 1) {
      let remaining = line ? [line].concat(words.slice(i + 1)).join(' ') : words.slice(i + 1).join(' ');
      const suffix = '…';
      while (remaining.length && widthOf(remaining + suffix) > maxWidth) {
        remaining = remaining.slice(0, -1);
      }
      const last = document.createElementNS(ns, 'tspan');
      last.setAttribute('x', '0');
      last.setAttribute('dy', lineHeight);
      last.textContent = remaining + suffix;
      textEl.appendChild(last);
      if (measurer.parentNode) measurer.parentNode.removeChild(measurer);
      return textEl;
    }
  }

  // leftover line if loop ended exactly on width boundary
  if (line && used < maxLines) {
    const tspan = document.createElementNS(ns, 'tspan');
    tspan.setAttribute('x', '0');
    tspan.setAttribute('dy', used === 0 ? 0 : lineHeight);
    tspan.textContent = line;
    textEl.appendChild(tspan);
  }

  if (measurer.parentNode) measurer.parentNode.removeChild(measurer);
  return textEl;
}




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
