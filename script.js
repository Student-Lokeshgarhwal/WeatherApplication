const apikey = '27b38cba679d4079d0e3a81989eea5e5';

let input = document.querySelector('#search')
const btn = document.querySelector('.search-btn')
const showdata = document.querySelector('.showdata')
const ListElement = document.querySelector('#autocompleteList')

let Locations = [];

async function fecthList() {
    console.log("fetching..")
    input.value = "";
try{
    
    const res = await fetch('https://restcountries.com/v2/all?fields=name')
        .then((res) => res.json())
        .then((data) => {
            Locations = data.map((country) => {
                return country.name
            })
            Locations.sort();
            loaddata(Locations, ListElement);
        })
}catch(err){
    console.log(err)
}
}

function loaddata(data, ListElement) {

    ListElement.innerHTML = " ";
    let listitem = " ";
    data.forEach((item) => {
        listitem += `<li class=red>${item}</li>`
    })
    ListElement.innerHTML = listitem;

}
ListElement.addEventListener('click', (event) => {
    input.value = event.target.innerHTML;
    getlocation();
    ListElement.innerHTML = "";
})

input.addEventListener(/* The `'focusin', fecthList` is an event listener that listens for the
`focusin` event on the input element. When the input element receives focus
(i.e., when the user clicks on it or tabs into it), the `fecthList` function
is called. In this case, `fecthList` is responsible for fetching a list of
countries from an API and populating the autocomplete list with the fetched
data. */
'focusin', fecthList);

function filterdata(data, searchText) {
    return data.filter((location) =>
        location.toLowerCase().includes(searchText.toLowerCase()))
}

input.addEventListener('input', function () {
    const filterdData = filterdata(Locations, input.value);
    loaddata(filterdData, ListElement);
})

const getlocation = () => {
    const place = input.value;
    if (place) {
        console.log(place)
        btn.addEventListener('click', fetchweather(place))
    }
}

input.addEventListener('change', getlocation)

const fetchweather = async (place) => {
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${apikey}&q=${place}`)
        if (!res.ok) { throw new Error("Location not found!") }
        let data = await res.json();
        displaydata(data);
    }
    catch (err) {
        console.log(("Here!"))
        showdata.innerHTML = `<p>${err.message}</p>`;
    }
}

function displaydata(data) {
    showdata.innerHTML = `
        <p>Location    : ${data.name}</p>
        <p>Temperature : ${(data.main.temp - 273.15).toFixed(0)} &#176C</p>
        <p>Weather     : ${data.weather[0].description}</p>
        <p>Humidity    : ${data.main.humidity}%</p>
        `;
}

