const apikey = '98ba959294b91c68a47267449977f5f6';

let input = document.querySelector('#search')
const btn = document.querySelector('.search-btn')
const showdata = document.querySelector('.showdata')
const ListElement = document.querySelector('#autocompleteList')

let Locations = [];

async function fecthList() {
    input.value = "";

    await fetch('https://restcountries.com/v3.1/all')
        .then((res) => res.json())
        .then((data) => {
            Locations = data.map((country) => {
                return country.name.common
            })
            Locations.sort();
            loaddata(Locations, ListElement);
        })
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

input.addEventListener('focusin', fecthList);

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

