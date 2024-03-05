"use strict";

//asynkron hämtning av api
async function fetchAPI() {
    const year = 2018;
    const url = `https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeCategory=lit&nobelPrizeYear=${year}&format=json&csvLang=se`

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}


async function processAPI() {
    try {
        const result = await fetchAPI();
        console.log('Hämtad data:', result);
    } catch (error) {
        console.error('Process error:', error);
    }
}
processAPI();