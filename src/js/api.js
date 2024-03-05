"use strict";

//asynkron hämtning av api Nobelpriset
async function fetchAPI() {
    const year = 1974;
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

        //kolla om det finns 0, en eller flera mottagare av pris 
        if (result.nobelPrizes.length > 0) {
            const laureates = result.nobelPrizes[0].laureates;
            if (laureates.length > 0) {
                //spara författaren/-na i en array
                const authors = [];
                laureates.forEach(author => {
                    authors.push(author.fullName.en)
                });
                console.log("Författare: ", authors);

            } else {
                console.log("Inga mottagare av priset detta år...")
            }
        }
    } catch (error) {
        console.error('Process error:', error);
    }
}
processAPI();
