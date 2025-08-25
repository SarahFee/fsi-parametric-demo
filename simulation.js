// Simulation logic (rewritten) — lightweight JS port of the Streamlit ABM

class CashAgent {
    constructor(model, monthlyIncome) {
        this.model = model;
        this.balance = model.initialBudget;
        this.monthlyIncome = monthlyIncome;
        this.events = [];
        this.claimsMade = 0;
        this.lastClaimMonth = -model.waitingPeriod;
    }

    step(monthIdx) {
        const monthLabel = MONTH_LABELS[monthIdx];
        // Event flags from embedded data
        const events = getEventsForMonth(this.model.country, monthIdx);
        const emergencyEvent = events.some(e => categorizeEvent(e.eventType) === 'Emergency');
        const securityEvent  = events.some(e => categorizeEvent(e.eventType) === 'Security');

        const programCost = 10.0; // base
        let shockCost = 0.0;
        if (emergencyEvent) shockCost += 5.0;
        if (securityEvent)  shockCost += 3.0;

        // FSI for this month
        const fsiVal = this.model.fsiEnabled ? this.model.computeFSI(monthIdx) : 0.0;
        // If FSI exceeds threshold, add some operational friction cost
        if (this.model.fsiEnabled && fsiVal >= this.model.triggerThreshold) {
            shockCost += 4.0;
        }

        // Premium
        let premiumPaid = 0.0;
        if (this.model.insuranceEnabled) {
            premiumPaid = this.model.premiumPerMonth;
        }

        // Income (baseline synthetic)
        const income = this.monthlyIncome[monthIdx] ?? 100.0;

        // Apply cash flow
        let insurancePayout = 0.0;
        // First subtract premium and expenses, then add income
        this.balance -= premiumPaid;
        this.balance += income;
        this.balance -= (programCost + shockCost);

        // Trigger payouts if rules met
        if (this.model.insuranceEnabled) {
            const belowTrigger = this.balance < (this.model.initialBudget * this.model.claimTriggerFrac);
            const fsiTrigger   = this.model.fsiEnabled && (fsiVal >= this.model.triggerThreshold);
            const cooldownOk   = (monthIdx - this.lastClaimMonth) >= this.model.waitingPeriod;
            if ((belowTrigger || fsiTrigger) && cooldownOk) {
                insurancePayout = this.model.payoutPerClaim;
                this.balance += insurancePayout;
                this.claimsMade += 1;
                this.lastClaimMonth = monthIdx;
            }
        }

        // Clamp
        if (this.balance < 0) this.balance = 0;

        const result = {
            month: monthIdx,
            monthLabel,
            cashBalance: this.balance,
            fsiValue: fsiVal,
            emergencyEvent,
            securityEvent,
            premiumPaid,
            insurancePayout
        };
        this.events.push(result);
        return result;
    }
}

class CashModel {
    constructor(country, organization, duration, cfg) {
        this.country = country;
        this.organization = organization;
        this.duration = duration;
        // FSI
        this.fsiEnabled = !!cfg.fsiEnabled;
        this.delayW = cfg.delayWeight ?? 0.25;
        this.volW   = cfg.volatilityWeight ?? 0.25;
        this.covW   = cfg.coverageWeight ?? 0.25;
        this.conW   = cfg.concentrationWeight ?? 0.25;
        this.psiW   = cfg.psiWeight ?? 0.10;
        this.epiW   = cfg.epiWeight ?? 0.10;
        this.triggerThreshold = cfg.triggerThreshold ?? 2.0;

        // Insurance
        this.insuranceEnabled = !!cfg.insuranceEnabled;
        this.initialBudget = 100.0;
        this.premiumPerMonth = (cfg.premiumRate ?? 2.0) / 100.0 * this.initialBudget;
        this.payoutPerClaim  = (cfg.payoutCapX ?? 3.0) * this.premiumPerMonth;
        this.claimTriggerFrac = cfg.claimTriggerFrac ?? 0.5; // 0..1
        this.waitingPeriod = cfg.waitingPeriod ?? 1;

        // Generate monthly income series from BASELINE_DATA
        const baseArr = (BASELINE_DATA[country] && BASELINE_DATA[country][organization]) ?
            BASELINE_DATA[country][organization] : new Array(27).fill(100);
        this.monthlyIncome = baseArr.slice(0, duration);

        this.agent = new CashAgent(this, this.monthlyIncome);
    }

    computeFSI(monthIdx) {
        // Simple deterministic + small noise to make it lively
        const base = this.delayW + this.volW + this.covW + this.conW + this.psiW + this.epiW;
        const seasonal = ((monthIdx % 6) === 0) ? (this.psiW + this.epiW) : 0;
        const val = base + seasonal + (Math.random() * 0.2 - 0.1);
        return Math.max(0, parseFloat(val.toFixed(2)));
    }

    run() {
        const out = [];
        for (let m = 0; m < this.duration; m++) {
            out.push(this.agent.step(m));
        }
        return out;
    }
}

// Public API
function runSimulation(config) {
    const model = new CashModel(
        config.country,
        config.organization,
        config.duration,
        config
    );
    return model.run();
}

function generateBaselineData(country, organization, duration) {
    const baseline = (BASELINE_DATA[country] && BASELINE_DATA[country][organization]) ?
        BASELINE_DATA[country][organization] : new Array(27).fill(100);
    return baseline.slice(0, duration);
}

function calculateFSITimeline(simulationResults) {
    // Threshold read dynamically on the chart side too; we keep fsi + threshold here
    const thr = parseFloat(document.getElementById('triggerThreshold').value);
    return simulationResults.map((r) => ({ month: r.month, fsi: r.fsiValue, threshold: thr }));
}

function generateInsuranceData(baselineResults, simulationResults) {
    return simulationResults.map((r, i) => ({
        month: i,
        baseline: baselineResults[i] || 0,
        withInsurance: r.cashBalance
    }));
}
