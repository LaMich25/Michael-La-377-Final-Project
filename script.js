/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
    return list.filter((item) => {
        const lowerCaseName = item.course.toLowerCase();
        const lowerCaseQuery = query.toLowerCase();
        return lowerCaseName.includes(lowerCaseQuery);
    })
    /*
      Using the .filter array method, 
      return a list that is filtered by comparing the item name in lower case
      to the query in lower case
  
      Ask the TAs if you need help with this
    */
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
function injectHTML(list) {
    console.log('fired injectHTML')
    const target = document.querySelector('#restaurant_list');
    target.innerHTML = '';
    list.forEach((item) => {
        const str = `<li>${item.course}</li>`;
        target.innerHTML += str
    });
}

function cutRestaurantList(list) {
    console.log('fired cut list');
    const range = [...Array(15).keys()];
    return newArray = range.map((item) => {
        const index = getRandomIntInclusive(0, list.length - 1);
        return list[index]
    })

}

async function mainEvent() { // the async keyword means we can make API requests
    const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
    // Add a querySelector that targets your filter button here
    const loadDataButton = document.querySelector('#data_load');
    const generateListButton = document.querySelector('#generate');
    const textField = document.querySelector('#resto');

    const loadAnimation = document.querySelector('#data_load_animation');
    loadAnimation.style.display = 'none';
    generateListButton.classList.add('hidden');

    let storedList = [];


    let currentList = []; // this is "scoped" to the main event function

    /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
    mainForm.addEventListener('submit', async (submitEvent) => { // async has to be declared on every function that needs to "await" something

        // This prevents your page from becoming a list of 1000 records from the county, even if your form still has an action set on it
        submitEvent.preventDefault();

        // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form
        console.log('form submission');

        /*
          ## GET requests and Javascript
            We would like to send our GET request so we can control what we do with the results
            Let's get those form results before sending off our GET request using the Fetch API
        
          ## Retrieving information from an API
            The Fetch API is relatively new,
            and is much more convenient than previous data handling methods.
            Here we make a basic GET request to the server using the Fetch method to the county
        */



        // Basic GET request - this replaces the form Action
        const results = await fetch('https://api.umd.io/v1/courses/sections?per_page=100');

        // This changes the response from the GET into data we can use - an "object"
        currentList = await results.json();

        /*
          This array initially contains all 1,000 records from your request,
          but it will only be defined _after_ the request resolves - any filtering on it before that
          simply won't work.
        */


        console.table(currentList);
        injectHTML(currentList);
    });


    loadDataButton.addEventListener('click', async (event) => {

        console.log('Loading data');
        loadAnimation.style.display = 'inline-block'
        const results = await fetch('https://api.umd.io/v1/courses/sections?per_page=100');
        storedList = await results.json();

        if (storedList.length > 0) {
            generateListButton.classList.remove('hidden');
        }
        
        loadAnimation.style.display = 'none';
        console.table(storedList);
    })



    generateListButton.addEventListener('click', (event) => {
        console.log('generate new list');
        currentList = cutRestaurantList(storedList);
        console.log(currentList);
        injectHTML(currentList);
    })

    textField.addEventListener("input", (event) => {
        console.log("input", event.target.value);
        const newList = filterList(currentList, event.target.value);
        console.log(newList);
        injectHTML(newList);
    })

}

/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests