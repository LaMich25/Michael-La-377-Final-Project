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

function initChart(chart){

    new Chart(chart, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
      
  
}



function shapedData(array){
    return array.reduce((collection, item) => {
        if(!collection[item.category]){
            collection[item.category] = [item]
        }else{
            collection[item.category].push(item);
        }
        return collection;
    }, {})
}

async function mainEvent() { // the async keyword means we can make API requests
    const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
    // Add a querySelector that targets your filter button here
    const loadDataButton = document.querySelector('#data_load');
    const generateListButton = document.querySelector('#generate');
    const textField = document.querySelector('#resto');
    const chartTarget = document.querySelector('#myChart');
    const loadAnimation = document.querySelector('#data_load_animation');
    const clearDataButton = document.querySelector('#data_clear');
    loadAnimation.style.display = 'none';
    generateListButton.classList.add('hidden');

    
   

    const storedData = localStorage.getItem('storedData');
    let parsedData = JSON.parse(storedData);
    if (parsedData?.length > 0) {
        generateListButton.classList.remove('hidden');
    }


    let currentList = []; // this is "scoped" to the main event function

    /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
    


    loadDataButton.addEventListener('click', async (event) => {

        console.log('Loading data');
        loadAnimation.style.display = 'inline-block'
        const results = await fetch('https://api.umd.io/v1/courses/sections?per_page=100');
        const storedList = await results.json();

        initChart(chartTarget);
        /*
        const chartData = await results.json();
        const shapeData = shapedData(chartData);
        console.log(shapedData);
        const myChart = initChart(chartTarget, shapedData);
        */
        localStorage.setItem('storedData', JSON.stringify(storedList));
        parsedData = storedList;

        if (storedList?.length>0){
            generateListButton.classList.remove("hidden");
        }


        loadAnimation.style.display = 'none';
        console.table(storedList);
    })

 


    generateListButton.addEventListener('click', (event) => {
        console.log('generate new list');
        currentList = cutRestaurantList(parsedData);
        console.log(currentList);
        injectHTML(currentList);
       
    })

    textField.addEventListener("input", (event) => {
        console.log("input", event.target.value);
        const newList = filterList(currentList, event.target.value);
        console.log(newList);
        injectHTML(newList);
    })

    clearDataButton.addEventListener("click", (event) => {
        console.log('clear browser data');
        localStorage.clear();
        console.log('localStorage Check', localStorage.getItem("storedData"))
    })
}

/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests