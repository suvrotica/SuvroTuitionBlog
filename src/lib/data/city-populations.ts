// File: src/lib/data/city-populations.ts

export type CityPopulationData = {
	name: string;
	p0: number; // Population at year 0
	year0: number; // The base year
	doublingPeriod: number; // --- CHANGE: Add the new property
};

export const cityPopulations: CityPopulationData[] = [
	{ name: 'Tokyo', p0: 37435191, year0: 2018, doublingPeriod: 85 },
	{ name: 'Delhi', p0: 29399141, year0: 2018, doublingPeriod: 30 },
	{ name: 'Shanghai', p0: 26317104, year0: 2018, doublingPeriod: 70 },
	{ name: 'São Paulo', p0: 21846507, year0: 2018, doublingPeriod: 55 },
	{ name: 'Mexico City', p0: 21671908, year0: 2018, doublingPeriod: 60 },
	{ name: 'Cairo', p0: 20484965, year0: 2018, doublingPeriod: 35 },
	{ name: 'Mumbai', p0: 20185064, year0: 2018, doublingPeriod: 38 },
	{ name: 'Beijing', p0: 20035455, year0: 2018, doublingPeriod: 75 },
	{ name: 'Dhaka', p0: 19578500, year0: 2018, doublingPeriod: 28 },
	{ name: 'Kolkata', p0: 15800000, year0: 2025, doublingPeriod: 50 },
	{ name: 'Riyadh', p0: 7682000, year0: 2023, doublingPeriod: 25 },
	{ name: 'Jeddah', p0: 4863000, year0: 2023, doublingPeriod: 22 },
	{ name: 'Kuwait City', p0: 3298000, year0: 2023, doublingPeriod: 45 },
	{ name: 'Dubai', p0: 3655000, year0: 2023, doublingPeriod: 20 },
	{ name: 'Abu Dhabi', p0: 3789860, year0: 2024, doublingPeriod: 24 },
	{ name: 'Doha', p0: 1186023, year0: 2020, doublingPeriod: 18 }
];