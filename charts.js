// Chart rendering functions using Chart.js

let cashBalanceChart = null;
let fsiChart = null;
let fundingChart = null;
let icebergChart = null;
let eventMap = null;
window.eventMap = eventMap; // expose for safety/use in main.js resize


// Initialize charts
function initializeCharts() {
    // Problem section
    initializeFundingChart();
    initializeIcebergChart();

    // Demo section charts (so canvases are populated on load)
    initializeCashBalanceChart();
    initializeFSIChart();
}



function initializeFundingChart() {
    const ctx = document.getElementById('fundingChart');
    if (!ctx) return;
    
    fundingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ukraine 2022', 'Sudan 2022', 'Ukraine 2023', 'Sudan 2023'],
            datasets: [{
                label: 'Funding Received (Billions USD)',
                data: [15.2, 1.8, 8.5, 2.1],
                backgroundColor: ['#3b82f6', '#f97316', '#3b82f6', '#f97316'],
                borderColor: ['#1e3a8a', '#ea580c', '#1e3a8a', '#ea580c'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Funding Disparity: Ukraine vs Sudan',
                    color: '#1e3a8a',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Funding (Billions USD)',
                        color: '#64748b'
                    }
                }
            }
        }
    });
}

function initializeIcebergChart() {
  const canvas = document.getElementById('icebergChart');
  if (!canvas) return; // no iceberg chart on this build
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
    
    icebergChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Visible: Funding Gaps', 'Hidden: Delays & Volatility', 'Deep: Political Risk'],
            datasets: [{
                data: [30, 35, 35],
                backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.4)'],
                borderColor: ['#1e3a8a', '#1e3a8a', '#1e3a8a'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'The Funding Risk Iceberg',
                    color: '#ffffff',
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

function initializeCashBalanceChart() {
    const ctx = document.getElementById('cashBalanceChart');
    if (!ctx) return;
    
    cashBalanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Baseline',
                data: [],
                borderColor: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
                borderWidth: 2,
                fill: false
            }, {
                label: 'With Insurance',
                data: [],
                borderColor: '#f97316',
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                borderWidth: 2,
                fill: false,
                hidden: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Cash Balance Comparison',
                    color: '#ffffff',
                    font: { size: 14, weight: 'bold' }
                },
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cash Balance',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

function initializeFSIChart() {
    const ctx = document.getElementById('fsiChart');
    if (!ctx) return;
    
    fsiChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'FSI',
                data: [],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                fill: false
            }, {
                label: 'Threshold',
                data: [],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'FSI Timeline',
                    color: '#ffffff',
                    font: { size: 14, weight: 'bold' }
                },
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'FSI Value',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

function initializeEventMap(country) {
    const mapContainer = document.getElementById('eventMap');
    if (!mapContainer) return;
    
    // Clear existing map
    if (eventMap) {
        eventMap.remove();
    }
    
    const countryData = COUNTRY_BOUNDARIES[country];
    eventMap = L.map('eventMap').setView(countryData.center, 6);
    window.eventMap = eventMap;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(eventMap);
    
    // Add country bounds
    const bounds = L.latLngBounds(countryData.bounds);
    eventMap.fitBounds(bounds);
    
    return eventMap;
}

function updateEventMap(country, currentMonth = null) {
    if (!eventMap) {
        initializeEventMap(country);
    }

    // Clear existing markers
    eventMap.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            eventMap.removeLayer(layer);
        }
    });

    // Get events to display
    let eventsToShow;
    if (currentMonth !== null) {
        eventsToShow = getEventsForMonth(country, currentMonth);
    } else {
        eventsToShow = getEventsForCountry(country);
    }

    // Add event markers and collect their positions
    const markerLatLngs = [];
    eventsToShow.forEach(event => {
        if (!event.latitude || !event.longitude) return;

        const category = categorizeEvent(event.eventType);
        let markerColor = '#64748b';
        let markerSymbol = '●';

        if (category === 'Emergency') {
            markerColor = '#ef4444';
            markerSymbol = '▼';
        } else if (category === 'Security') {
            markerColor = '#f97316';
            markerSymbol = '■';
        }

        const marker = L.marker([event.latitude, event.longitude], {
            icon: L.divIcon({
                html: `<div style="color: ${markerColor}; font-size: 16px; text-align: center;">${markerSymbol}</div>`,
                className: 'custom-marker',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        });

        marker.bindPopup(`
            <strong>${event.eventType}</strong><br>
            <em>${event.location}</em><br>
            ${event.month} ${event.year}<br>
            <small>${event.details}</small>
        `);

        marker.addTo(eventMap);
        markerLatLngs.push([event.latitude, event.longitude]);
    });

    // Focus map tightly on the area where events happen
    if (markerLatLngs.length) {
        const bounds = L.latLngBounds(markerLatLngs);
        eventMap.fitBounds(bounds, { padding: [20, 20], maxZoom: 6 });
    }
}    
    // Clear existing markers
    eventMap.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            eventMap.removeLayer(layer);
        }
    });
    
    // Get events to display
    let eventsToShow;
    if (currentMonth !== null) {
        eventsToShow = getEventsForMonth(country, currentMonth);
    } else {
        eventsToShow = getEventsForCountry(country);
    }
    
    // Add event markers
    eventsToShow.forEach(event => {
        if (!event.latitude || !event.longitude) return;
        
        const category = categorizeEvent(event.eventType);
        let markerColor = '#64748b';
        let markerSymbol = '●';
        
        if (category === 'Emergency') {
            markerColor = '#ef4444';
            markerSymbol = '▼';
        } else if (category === 'Security') {
            markerColor = '#f97316';
            markerSymbol = '■';
        }
        
        const marker = L.marker([event.latitude, event.longitude], {
            icon: L.divIcon({
                html: `<div style="color: ${markerColor}; font-size: 16px; text-align: center;">${markerSymbol}</div>`,
                className: 'custom-marker',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        });
        
        marker.bindPopup(`
            <strong>${event.eventType}</strong><br>
            <em>${event.location}</em><br>
            ${event.month} ${event.year}<br>
            <small>${event.details}</small>
        `);
        
        marker.addTo(eventMap);
    });


function updateCashBalanceChart(baselineData, insuranceData, eventData, duration) {
    if (!cashBalanceChart) {
        initializeCashBalanceChart();
    }
    
    const labels = MONTH_LABELS.slice(0, duration);
    
    // Update chart data
    cashBalanceChart.data.labels = labels;
    cashBalanceChart.data.datasets[0].data = baselineData;
    cashBalanceChart.data.datasets[1].data = insuranceData.map(d => d.withInsurance);
    
    // Show/hide insurance dataset based on whether insurance is enabled
    const insuranceEnabled = document.getElementById('insuranceEnabled').checked;
    cashBalanceChart.data.datasets[1].hidden = !insuranceEnabled;
    
    cashBalanceChart.update();
}

function updateFSIChart(fsiData, duration) {
    if (!fsiChart) {
        initializeFSIChart();
    }
    
    const labels = MONTH_LABELS.slice(0, duration);
    const threshold = parseFloat(document.getElementById('triggerThreshold').value);
    
    // Update chart data
    fsiChart.data.labels = labels;
    fsiChart.data.datasets[0].data = fsiData.map(d => d.fsi);
    fsiChart.data.datasets[1].data = new Array(duration).fill(threshold);
    
    // Show/hide FSI chart based on whether FSI is enabled
    const fsiEnabled = document.getElementById('fsiEnabled').checked;
    fsiChart.data.datasets[0].hidden = !fsiEnabled;
    fsiChart.data.datasets[1].hidden = !fsiEnabled;
    
    fsiChart.update();
}

function updateSimulationLog(simulationResults) {
    const logContainer = document.getElementById('logContainer');
    if (!logContainer) return;
    
    logContainer.innerHTML = '';
    
    simulationResults.forEach((result, index) => {
        const monthLabel = MONTH_LABELS[index];
        let logEntry = `${monthLabel}: Cash=${result.cashBalance.toFixed(1)}`;
        
        if (result.emergencyEvent) logEntry += ' 🔴Emergency';
        if (result.securityEvent) logEntry += ' 🟡Security';
        if (result.insurancePayout > 0) logEntry += ` 💰Insurance=${result.insurancePayout}`;
        if (document.getElementById('fsiEnabled').checked) {
            logEntry += ` FSI=${result.fsiValue.toFixed(2)}`;
        }
        
        const logDiv = document.createElement('div');
        logDiv.textContent = logEntry;
        logDiv.style.marginBottom = '4px';
        logContainer.appendChild(logDiv);
    });
    
    // Scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
}

