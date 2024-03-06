"use strict";


//sök
const searchYear = document.getElementById("search-input");
const submitYear = document.getElementById("submit");
const message = document.getElementById("message");
searchYear.addEventListener("input", checkInput);
submitYear.addEventListener("click", yearThroughAPI);

window.onload = init;

function init() {
    //inaktivera sökknappen
    submitYear.disabled = true;

    // Lyssna på formulärets submit-händelse
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault(); // Förhindra formuläret från att skickas innan kontrollen är klar
        yearThroughAPI(); //anropa funktion vid submit
    });
}

//funktion för input
function checkInput() {
    const input = searchYear.value;
    //kontrollera längd
    if (input.length < 4) {
        message.innerHTML = "Ange ett år i formatet YYYY.";
        submitYear.disabled = true;
    } else {
        message.innerHTML = "";
        submitYear.disabled = false;
    }
}


// Funktion för att hämta och behandla data från API:et
async function yearThroughAPI() {
    try {
        const result = await fetchAPI();
        console.log("Hämtad data av Nobelpristagare: ", result);

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



//asynkron hämtning av api Nobelpriset
async function fetchAPI() {
    const year = searchYear.value;
    const url = `https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeCategory=lit&nobelPrizeYear=${year}&format=json&csvLang=se`;

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
        console.log("Hämtad data av Nobelpristagare: ", result);

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


//asynkron hämtning av api Google Books
async function fetchBook() {
    const nobelAuthor = authors;

    // Kontrollera och förbered författarnamnet
    nobelAuthor = nobelAuthor.map(author => {
        // Trimma namnet
        author = author.trim();

        // Kodera eventuella specialtecken
        author = encodeURIComponent(author);

        return author;
    });
    // Skapa en söksträng för Google Books API-anropet baserat på författarnas namn
    const searchQuery = nobelAuthor.map(author => `inauthor:${author}`).join('+OR+');
    const bookUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&maxResults=4`;

    try {
        const response = await fetch(bookUrl);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function processBook() {
    try {
        const result = await fetchBook();
        console.log("Hämtad data från Google Books: ", result)
    }
    catch (error) {
        console.error('Process error:', error);
    }
}

processBook();