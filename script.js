

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
    return list.filter((item) => {
        const lowerCaseName = item.course_id.toLowerCase();
        const lowerCaseQuery = query.toLowerCase();
        return lowerCaseName.includes(lowerCaseQuery);
    })
  
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
        const str = `<li>${item.course_id}</li>`;
        target.innerHTML += str
    });
}

function cutList(list) {
    console.log('fired cut list');
    const range = [...Array(15).keys()];
    return newArray = range.map((item) => {
        const index = getRandomIntInclusive(0, list.length - 1);
        return list[index]
    })

}

function initChart(chart, object){

    const labels = Object.keys(object);
    const info = Object.keys(object).map((item) => object[item].length);
    
      const data = {
        labels: labels,
        datasets: [{
          label: 'Classes by Department ID',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: info,
        }]
      };
    
      const config = {
        type: 'bar',
        data: data,
        options: {}
      };
      
      return new Chart(
        chart,
        config
      );
  
}



function shapeData(array){
    return array.reduce((collection, item) => {
        if(!collection[item.dept_id]){
            collection[item.dept_id] = [item]
        }else{
            collection[item.dept_id].push(item);
        }
        return collection;
    }, {})
}

async function getData()
{
    const results  = await fetch('https://api.umd.io/v1/courses/sections?per_page=100');
    const barData = await results.json();
    console.log(barData);
    return barData;
}



function changeChart(chart, dataObject){
    const labels = Object.keys(dataObject);
    const info = Object.keys(dataObject).map((item) => dataObject[item].length);
    chart.data.labels = labels;
    chart.data.datasets.forEach((set) => {
        set.data = info;
        return set;
    })
    chart.update();
}

async function mainEvent() { // the async keyword means we can make API requests
    const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
    // Add a querySelector that targets your filter button here
    const loadDataButton = document.querySelector('#data_load');
    const generateListButton = document.querySelector('#generate');
    const textField = document.querySelector('#class');
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
    
    const list = [];


    loadDataButton.addEventListener('click', async (event) => {

        console.log('Loading data');
        loadAnimation.style.display = 'inline-block'
        const results = await fetch('https://api.umd.io/v1/courses?per_page=100');
        const storedList = await results.json();
        console.log(storedList);

        
        
        localStorage.setItem('storedData', JSON.stringify(storedList));
        parsedData = storedList;

        if (storedList?.length>0){
            generateListButton.classList.remove("hidden");
        }


        loadAnimation.style.display = 'none';
        console.table(storedList);
        
        
    })

    const chartData = list;
    const shapedData = shapeData(chartData);
    console.log(shapedData);
    const myChart = initChart(chartTarget, shapedData);
 


    generateListButton.addEventListener('click', (event) => {
        console.log('generate new list');
        currentList = cutList(parsedData);
        console.log(currentList);
        injectHTML(currentList);
        
        const localData = shapeData(currentList);
        console.log(localData);
        changeChart(myChart, localData);
       
    })

    textField.addEventListener("input", (event) => {
        console.log("input", event.target.value);
        const newList = filterList(currentList, event.target.value);
        console.log(newList);
        injectHTML(newList);
        const localData = shapeData(newList);
        console.log(localData);
        changeChart(myChart, localData);
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