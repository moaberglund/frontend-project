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
}

//funktion för input
function checkInput() {
    const input = searchYear.value;
    //kontrollera längd
    if (input.length < 4 || input.length > 4) {
        message.innerHTML = "Ange ett år i formatet YYYY.";
        submitYear.disabled = true;
    } else {
        message.innerHTML = "";
        submitYear.disabled = false;
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


// Funktion för att hämta och behandla data från API:et
async function yearThroughAPI() {
    try {
        //inaktivera knapp medan data hämtas
        submitYear.disabled = true;

        const result = await fetchAPI();
        console.log("Hämtad data av Nobelpristagare: ", result);

        //kolla om det finns 0, en eller flera mottagare av pris 
        if (result.nobelPrizes.length > 0) {
            const laureates = result.nobelPrizes[0].laureates;
            if (laureates.length > 0) {
                //spara författaren/-na i en array
                const authors = laureates.map(author => author.fullName.en);
                console.log("Författare: ", authors);

                //hämta info från google books
                await processBook(authors);

            } else {
                console.log("Inga mottagare av priset detta år...")
            }
        } else {
            console.log("Inga priser delades ut ditt angivna år...")
        }
    } catch (error) {
        console.error('Process error:', error);
    } finally {
        //aktivera submit knapp oavsett resultat
        submitYear.disabled = false;
    }
}

//asynkron hämtning av api Google Books
//skicka med authors
async function fetchBook(authors) {
    //let för att det ska gå att ändras nedan
    let nobelAuthor = authors;

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
    const bookUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&lang=en&maxResults=4`;

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

async function processBook(authors) {
    try {
        const result = await fetchBook(authors);
        console.log("Hämtad data från Google Books: ", result);

        //test av utskrift med DOM
        const bookOutput = document.getElementById("book-output");
        //först och främst - töm!!
        bookOutput.innerHTML = "";

        result.items.forEach(item => {
            const coverURL = item.volumeInfo.imageLinks.thumbnail;
            const bookTitle = item.volumeInfo.title;
            const bookAuthors = item.volumeInfo.authors.join(", ");
            const bookDescription = item.volumeInfo.description;

            //skapa div och lägg till class="book"
            const bookElement = document.createElement("div");
            bookElement.classList.add("book");

            //omslag
            const coverElement = document.createElement("img");
            coverElement.classList.add("book-cover"); // Lägg till klassen för bokomslaget
            coverElement.src = coverURL; // Sätt källan för bokomslaget
            bookElement.appendChild(coverElement); 

            //skapa titel
            const titleElement = document.createElement("h3");
            titleElement.textContent = bookTitle;
            bookElement.appendChild(titleElement);

            const authorsElement = document.createElement("h4");
            authorsElement.textContent = "Författare: " + bookAuthors;
            bookElement.appendChild(authorsElement);

            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = bookDescription;
            bookElement.appendChild(descriptionElement);

            bookOutput.appendChild(bookElement);


        })
    }
    catch (error) {
        console.error('Process error:', error);
    }
}