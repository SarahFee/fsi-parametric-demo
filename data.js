// Embedded event data from CSV
const EVENT_DATA = [
    {month: "January", year: 2022, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "Three protesters killed during pro-democracy demonstrations. PM Hamdok announces resignation.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Security Issue", location: "El Fasher North Darfur", details: "Looting at WFP and UNAMID warehouses.", source: "Dabanga Sudan", latitude: 13.6258, longitude: 25.3494, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "Protesters take to the street again in Sudan.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Conflict", location: "West Darfur", details: "Large numbers of heavily armed militants gathering north-east of West Darfur capital.", source: "Dabanga Sudan", latitude: 13.4531, longitude: 22.8853, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "Three protesters killed in Khartoum during Marches of the Millions.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Conflict", location: "Abu Jubeiha South Kordofan", details: "Robbers use Rocket-Propelled Grenades (RPGs).", source: "Dabanga Sudan", latitude: 11.4583, longitude: 31.2333, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Security Issue", location: "North Darfur", details: "Woman gang-raped and nine others injured by gunmen.", source: "Dabanga Sudan", latitude: 14.0, longitude: 25.0, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "Two more protesters killed and 96 injured in Khartoum demonstrations.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Security Issue", location: "North Darfur", details: "Group allegedly of government forces and former rebels plunder remaining assets from UNAMID.", source: "Dabanga Sudan", latitude: 14.0, longitude: 25.0, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Security Issue", location: "Khartoum", details: "Sudanese Journalists Network reports detention of two press photographers.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "Young protester shot dead during anti-junta Marches of the Millions.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Security Issue", location: "Khartoum", details: "Ministry of Information withdraws Al Jazeera Live license.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "January", year: 2022, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "Seven demonstrators shot dead during demonstrations.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "February", year: 2022, country: "Sudan", eventType: "Conflict", location: "Sudan", details: "Protests against military junta continued throughout February, as did their violent and deadly suppression by Sudanese forces.", source: "Dabanga Sudan", latitude: 12.8628, longitude: 30.2176, geocoded: true},
    {month: "February", year: 2022, country: "Sudan", eventType: "Security Issue", location: "Darfur", details: "Looting of international and NGO resources continued.", source: "Dabanga Sudan", latitude: 11.0, longitude: 25.0, geocoded: true},
    {month: "March", year: 2022, country: "Sudan", eventType: "Floods", location: "South Sudan", details: "Satellite detected water extents between 20 and 24 March 2022.", source: "ReliefWeb", latitude: 6.877, longitude: 31.307, geocoded: true},
    {month: "April", year: 2022, country: "Sudan", eventType: "Conflict", location: "Kerenik West Darfur", details: "At least 159 people were killed.", source: "Security Council Report", latitude: 13.2167, longitude: 22.7, geocoded: true},
    {month: "April", year: 2023, country: "Sudan", eventType: "Conflict", location: "Sudan", details: "Civil war begins between Sudanese Armed Forces (SAF) and Rapid Support Forces (RSF).", source: "BBC Wikipedia", latitude: 12.8628, longitude: 30.2176, geocoded: true},
    {month: "April", year: 2023, country: "Sudan", eventType: "Conflict", location: "El Geneina West Darfur", details: "RSF and Arab militias carried out attacks against non-Arab communities.", source: "Human Rights Watch", latitude: 13.4531, longitude: 22.4503, geocoded: true},
    {month: "March", year: 2024, country: "Sudan", eventType: "Conflict", location: "Sudan", details: "UN Security Council (UNSC) passed a resolution calling for an immediate cessation of violence.", source: "CFR", latitude: 12.8628, longitude: 30.2176, geocoded: true},
    {month: "March", year: 2024, country: "Sudan", eventType: "Conflict", location: "Omdurman", details: "The army says it has taken control of the state broadcaster's headquarters.", source: "Reuters", latitude: 15.6167, longitude: 32.4833, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "Heavy SAF-RSF clashes near Um Rawaba in North Kordofan.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Security Issue", location: "Khartoum", details: "Sudan's Emergency Lawyers condemn blocking of food transport in Khartoum state.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "At least 20 killed in ongoing battles.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "RSF resumes attacks on SAF Command in central Khartoum.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Conflict", location: "Delling South Kordofan", details: "Clashes between SAF and SPLM-N El Hilu erupt.", source: "Dabanga Sudan", latitude: 11.2, longitude: 30.5, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "Several people killed in continued fierce fighting.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Security Issue", location: "Central Darfur", details: "Hasaheisa camp for displaced people encircled by SAF-RSF fighting.", source: "Dabanga Sudan", latitude: 12.85, longitude: 24.2, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Security Issue", location: "West Darfur", details: "El Geneina Teaching Hospital resumes services.", source: "Dabanga Sudan", latitude: 13.4531, longitude: 22.8853, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Conflict", location: "Karari northern Omdurman", details: "Continued artillery shelling hits several civilians.", source: "Dabanga Sudan", latitude: 15.6167, longitude: 32.4833, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Security Issue", location: "Khartoum", details: "MSF suspends surgical operations at Bashair Hospital in southern Khartoum.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Security Issue", location: "Khartoum", details: "Alban El Jadeed Hospital in Khartoum North temporarily closes after attack by RSF troops.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "Shelling and air strikes persist in Khartoum state.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Conflict", location: "Nyala Zalingei and Khartoum", details: "Fierce SAF-RSF battles continue.", source: "Dabanga Sudan", latitude: 13.0, longitude: 30.0, geocoded: true},
    {month: "October", year: 2023, country: "Sudan", eventType: "Conflict", location: "Nyala", details: "RSF takes control of Nyala.", source: "Dabanga Sudan", latitude: 12.0488, longitude: 24.8813, geocoded: true},
    {month: "November", year: 2023, country: "Sudan", eventType: "Conflict", location: "West Darfur", details: "RSF takes control of West Darfur capital El Geneina.", source: "Dabanga Sudan", latitude: 13.4531, longitude: 22.8853, geocoded: true},
    {month: "December", year: 2023, country: "Sudan", eventType: "Conflict", location: "El Gezira", details: "RSF invades El Gezira's capital Wad Madani.", source: "Dabanga Sudan", latitude: 14.4, longitude: 33.5, geocoded: true},
    {month: "June", year: 2022, country: "Sudan", eventType: "Floods", location: "Kassala", details: "Flash floods triggered by torrential rains affected an estimated 750 people.", source: "ReliefWeb", latitude: 15.45, longitude: 36.4, geocoded: true},
    {month: "July", year: 2022, country: "Sudan", eventType: "Security Issue", location: "Sudan", details: "Health workers and facilities continued to be affected by political violence.", source: "ReliefWeb - Sudan: Violence Against Health Care in Conflict 2022", latitude: 12.8628, longitude: 30.2176, geocoded: true},
    {month: "August", year: 2022, country: "Sudan", eventType: "Security Issue", location: "Khartoum", details: "Six ambulances were attacked by military forces.", source: "The implications of the Sudan war on healthcare workers and facilities", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "September", year: 2022, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "An explosion in Gorro market killed 43 people and wounded more than 60 people.", source: "Doctors Without Borders", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "September", year: 2022, country: "Sudan", eventType: "Security Issue", location: "Sudan", details: "At least 192 attacks on Sudan's health care system have been documented.", source: "ReliefWeb", latitude: 12.8628, longitude: 30.2176, geocoded: true},
    {month: "April", year: 2022, country: "Sudan", eventType: "Conflict", location: "South Darfur", details: "Tribal clashes leave 30 dead.", source: "Dabanga Sudan", latitude: 11.5, longitude: 24.5, geocoded: true},
    {month: "April", year: 2022, country: "Sudan", eventType: "Security Issue", location: "El Fasher North Darfur", details: "Former UNAMID headquarters again subjected to armed looting.", source: "Dabanga Sudan", latitude: 13.6258, longitude: 25.3494, geocoded: true},
    {month: "April", year: 2022, country: "Sudan", eventType: "Conflict", location: "Khartoum", details: "One protestor killed and at least 78 injured during demonstrations.", source: "Dabanga Sudan", latitude: 15.5007, longitude: 32.5599, geocoded: true},
    {month: "April", year: 2022, country: "Sudan", eventType: "Conflict", location: "Sirba West Darfur", details: "At least 12 villagers shot dead in attacks by gunmen.", source: "Dabanga Sudan", latitude: 13.0833, longitude: 22.5833, geocoded: true},
    {month: "April", year: 2022, country: "Sudan", eventType: "Conflict", location: "Abyei", details: "Gunmen wearing SAF uniforms killed at least 42 people in armed robberies.", source: "Dabanga Sudan", latitude: 9.5833, longitude: 28.4167, geocoded: true},
    {month: "April", year: 2022, country: "Sudan", eventType: "Conflict", location: "Kereinik West Darfur", details: "At least 168 people killed and 110 injured.", source: "Dabanga Sudan", latitude: 13.2167, longitude: 22.7, geocoded: true},
    {month: "January", year: 2022, country: "Ukraine", eventType: "Conflict", location: "Belarus", details: "Russian troops began arriving in Belarus for military exercises.", source: "Wikipedia", latitude: 53.7098, longitude: 27.9534, geocoded: true},
    {month: "January", year: 2022, country: "Ukraine", eventType: "Conflict", location: "Ukraine", details: "NATO put troops on standby.", source: "Wikipedia", latitude: 48.3794, longitude: 31.1656, geocoded: true},
    {month: "February", year: 2022, country: "Ukraine", eventType: "Conflict", location: "Ukraine", details: "Russia and Belarus began 10 days of military maneuvers.", source: "Wikipedia", latitude: 48.3794, longitude: 31.1656, geocoded: true},
    {month: "February", year: 2022, country: "Ukraine", eventType: "Conflict", location: "eastern Ukraine", details: "Fighting escalated in separatist regions.", source: "Wikipedia", latitude: 48.5, longitude: 38.0, geocoded: true},
    {month: "February", year: 2022, country: "Ukraine", eventType: "Conflict", location: "eastern Ukraine", details: "Vladimir Putin officially ordered Russian forces to enter the separatist republics.", source: "Wikipedia", latitude: 48.5, longitude: 38.0, geocoded: true},
    {month: "February", year: 2022, country: "Ukraine", eventType: "Conflict", location: "Ukraine", details: "Russia launched a full-scale military invasion.", source: "Wikipedia", latitude: 48.3794, longitude: 31.1656, geocoded: true},
    {month: "April", year: 2022, country: "Ukraine", eventType: "Conflict", location: "north and the outskirts of Kyiv", details: "Russian troops retreated after encountering stiff resistance and logistical challenges.", source: "Wikipedia", latitude: 50.4501, longitude: 30.5234, geocoded: true},
    {month: "April", year: 2022, country: "Ukraine", eventType: "Security Issue", location: "Ukraine", details: "307 health facilities were damaged by shelling.", source: "Cambridge.org", latitude: 48.3794, longitude: 31.1656, geocoded: true},
    {month: "April", year: 2022, country: "Ukraine", eventType: "Conflict", location: "eastern and southern Ukraine", details: "Heavy fighting between Ukrainian and Russian forces continued.", source: "ACLED", latitude: 47.0, longitude: 35.0, geocoded: true},
    {month: "June", year: 2022, country: "Ukraine", eventType: "Conflict", location: "Ukraine's east and south", details: "Fighting largely confined.", source: "Council on Foreign Relations", latitude: 47.0, longitude: 35.0, geocoded: true},
    {month: "October", year: 2022, country: "Ukraine", eventType: "Conflict", location: "Ukraine", details: "Russia continued to launch air and missile assaults targeting civilian infrastructure.", source: "Security Council Report", latitude: 48.3794, longitude: 31.1656, geocoded: true},
    {month: "December", year: 2022, country: "Ukraine", eventType: "Conflict", location: "Ukraine", details: "Russia's latest attacks on Ukraine damaged power facilities and left key regions with limited electricity supply.", source: "CNN", latitude: 48.3794, longitude: 31.1656, geocoded: true},
    {month: "January", year: 2024, country: "Ukraine", eventType: "Security Issue", location: "Ukraine", details: "Continuous attacks on schools and medical facilities have had far-reaching consequences.", source: "UNOCHA", latitude: 48.3794, longitude: 31.1656, geocoded: true},
    {month: "January", year: 2024, country: "Ukraine", eventType: "Conflict", location: "Ukraine", details: "Russia attacked Ukraine's energy facilities.", source: "Wilson Center", latitude: 48.3794, longitude: 31.1656, geocoded: true},
    {month: "February", year: 2024, country: "Ukraine", eventType: "Conflict", location: "Ukraine", details: "Marks two years since Russia began its full-scale invasion.", source: "State.gov", latitude: 48.3794, longitude: 31.1656, geocoded: true},
    {month: "March", year: 2024, country: "Ukraine", eventType: "Conflict", location: "Ukraine", details: "Russian forces conducted the largest series of combined drone and missile strikes targeting Ukrainian energy infrastructure.", source: "Understanding War", latitude: 48.3794, longitude: 31.1656, geocoded: true},
    {month: "March", year: 2024, country: "Ukraine", eventType: "Security Issue", location: "Ukraine", details: "A steady stream of attacks across Ukraine impacted the ability of humanitarian organizations to reach the people affected with emergency assistance.", source: "ReliefWeb Response", latitude: 48.3794, longitude: 31.1656, geocoded: true}
];

// Baseline cash balance data (synthetic but realistic)
const BASELINE_DATA = {
    Sudan: {
        UNHCR: [100, 95, 88, 82, 75, 68, 62, 58, 55, 52, 48, 45, 42, 38, 35, 32, 28, 25, 22, 20, 18, 16, 14, 12, 10, 8, 6],
        IOM: [90, 86, 81, 76, 71, 66, 61, 57, 53, 49, 45, 41, 37, 33, 29, 25, 21, 18, 15, 12, 10, 8, 6, 4, 3, 2, 1],
        ICRC: [85, 82, 78, 74, 70, 66, 62, 58, 54, 50, 46, 42, 38, 34, 30, 26, 22, 19, 16, 13, 11, 9, 7, 5, 4, 3, 2]
    },
    Ukraine: {
        UNHCR: [95, 92, 87, 83, 78, 74, 69, 65, 61, 57, 53, 49, 45, 41, 37, 33, 29, 25, 22, 19, 16, 14, 12, 10, 8, 6, 5],
        IOM: [88, 85, 81, 77, 73, 69, 65, 61, 57, 53, 49, 45, 41, 37, 33, 29, 25, 21, 18, 15, 12, 10, 8, 6, 5, 4, 3],
        ICRC: [92, 89, 85, 81, 77, 73, 69, 65, 61, 57, 53, 49, 45, 41, 37, 33, 29, 25, 22, 19, 16, 14, 12, 10, 8, 6, 5]
    }
};

// Month labels for 27 months (Jan 2022 - Mar 2024)
const MONTH_LABELS = [
    "2022-01", "2022-02", "2022-03", "2022-04", "2022-05", "2022-06",
    "2022-07", "2022-08", "2022-09", "2022-10", "2022-11", "2022-12",
    "2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06",
    "2023-07", "2023-08", "2023-09", "2023-10", "2023-11", "2023-12",
    "2024-01", "2024-02", "2024-03"
];

// Country boundaries (simplified)
const COUNTRY_BOUNDARIES = {
    Sudan: {
        center: [15.5007, 32.5599],
        bounds: [[8.0, 21.0], [23.0, 39.0]]
    },
    Ukraine: {
        center: [48.3794, 31.1656],
        bounds: [[44.0, 22.0], [53.0, 41.0]]
    }
};

// Helper functions
function getMonthIndex(month, year) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    const monthNum = monthNames.indexOf(month) + 1;
    const yearOffset = year - 2022;
    return yearOffset * 12 + monthNum - 1;
}

function getEventsForCountry(country) {
    return EVENT_DATA.filter(event => event.country === country && event.geocoded);
}

function getEventsForMonth(country, monthIndex) {
    const targetYear = Math.floor(monthIndex / 12) + 2022;
    const targetMonth = (monthIndex % 12) + 1;
    const monthNames = ["January", "February", "March", "April", "May", "June",
                       "July", "August", "September", "October", "November", "December"];
    const targetMonthName = monthNames[targetMonth - 1];
    
    return EVENT_DATA.filter(event => 
        event.country === country && 
        event.month === targetMonthName && 
        event.year === targetYear &&
        event.geocoded
    );
}

function categorizeEvent(eventType) {
    if (eventType === "Conflict" || eventType === "Floods") {
        return "Emergency";
    } else if (eventType === "Security Issue") {
        return "Security";
    }
    return "Other";
}

