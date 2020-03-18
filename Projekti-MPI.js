////// Header Vue component starts. Printing out name of the app.
Vue.component('mpi-header', {                           
    template: '<h1>MPI Weather App</h1>'
})
////// Header Vue component ends.

////// Weather-list Vue component starts. This prints out the cities and temperature of the cities user searches. For the each city user can get detailed weather. Tables are using fade when printing out (or minimizing)  
////// the table. There's a new API call and it's using city ID instead city name (to get correct result).
Vue.component('weather-list', {
    template: `
    <div>
        <transition name="fade">
            <table v-if="this.$parent.$data.citylist.length > 0 && show" style="width:100%">
                <tr>
                    <th v-for="header in this.$parent.$data.citylistHeader">{{header}}</th>
                 </tr>        
                <tr v-for="item in this.$parent.$data.citylist" :v-bind:key="item.id">
                    <td>{{ item.city }}</td>
                    <td><a v-bind:href="item.map" target="_blank"><img border="0" alt="Map" src="map_image.png" width="50" height="50"></a></td>
                    <td>{{ item.temp }}</td>
                    <td>{{ item.temp_min }}</td>
                    <td>{{ item.temp_max }}</td>
                    <td>{{ item.description }}</td>
                    <td><img :src="item.icon" alt=""/></td>
                    <td>
                        <input type="hidden" name="" value="" v-model="item.city_id">
                        <button class="nappula" type="button" name="button" v-on:click="visible = true" @click="getDetailedWeather(item.city_id)">Show detail weather</button>
                    </td>
                </tr>       
            </table>
        </transition>
        <transition name="fade">
            <hr v-if="visible && show">
        </transition>
        <transition name="fade">
            <table v-if="visible && show" style="width:100%">
                <tr>
                    <th colspan="3"><button class="nappula" type="button" name="button" v-on:click="visible = !visible">Hide {{this.city}} weather</button></th>
                </tr>
                <tr>
                    <th colspan="3"></th>
                </tr>
                <tr>
                    <th>Date/time</th>
                    <th>Icon</th>
                    <th>Temperature</th>
                </tr>
                <tr v-for="item in detailweather" :key="item.id">
                    <td>{{ item.datetime }}</td>
                    <td><img :src="item.weather_icon" alt=""/></td>
                    <td>{{ item.temp_c }}</td>
                </tr>
            </table>
        </transition>
    </div>`,
    data: function(){
        return {
            detailweather: [],
            visible: false,
            city: '',
            show: true
            };
        },    
    methods: {
        ////// New API call to get detailed weather.
        getDetailedWeather: function(cityA) {
            axios.get('https://api.openweathermap.org/data/2.5/forecast?id=' + cityA + '&appid=8c93d7d7f2e1b114fcfb5693bd4eb7fc')
            .then(response => {    
                this.detailweather = [];    //Clearing the table in the beginning of each API call.
                var i;
                // There's a for arrays in the response so need to go through all of them. Saving interesting data to table.
                for (i = 0; i < response.data.list.length; i++) {
                    var id = i;
                    this.city = response.data.city.name;
                    var datetime = response.data.list[i].dt_txt;
                    var temp_k = response.data.list[i].main.temp;
                    var temp_c = (temp_k - 273.15).toFixed(1);  //Calculating unit from Kelvin to Celsius and rounding value to one digit.
                    var icon = response.data.list[i].weather[0].icon;
                    var weather_icon = 'http://openweathermap.org/img/w/' + icon + '.png';
                    this.detailweather.push({
                        id,
                        datetime,
                        weather_icon,
                        temp_c
                    })
                } 
            console.log(response);
            }
        )},
    },
})
////// Weather-list Vue component ends.

////// Weather-stats Vue component starts. This is printed after first search is made. Data is fetched from root app. Using fade to print out the table.
Vue.component('weather-stats', {
    template: `
    <transition name="fade">
        <table v-if="this.$parent.$data.citylist.length > 0 && show" style="width:100%"> 
            <tr>
                <th v-for="header in this.$parent.$data.analyzeHeader">{{header}}</th>
            </tr>
            <tr>
                <td>{{ this.$parent.tempMax }}</td>
                <td>{{ this.$parent.tempMin }}</td>
                <td>{{ this.$parent.tempAverage }}</td>
            </tr>
        </table>
    </transition>`,
    data: function(){
        return {
            show: true  //Including boolean value to be able to use transition.
            };
        }        
})
////// Weather-stats Vue component ends.

////// Footer Vue component starts. Fetching amount of searches from root app. Also printing out the current date/time.
Vue.component('mpi-footer', {
    template: `<p>You've made {{this.$parent.$data.nextId}} searches.<br>{{currentDateTime}}</p>`,
    computed: {
        currentDateTime() {
            return Date();
    }
}})
////// Footer Vue component ends.

////// Root app starts. This is printed after first search is made. Data is fetched from root app.
var app = new Vue ({
    el: '#app',        
        data:{
        citytosearch: '',
        weather_icon: '',
        citylistHeader:["City","Map","Temperature (C)","Temperature min (C)","Temperature max (C)","Description","Icon",""],
        analyzeHeader:["Max temperature (C) of searches","Min temperature (C) of searches","Average temperature of searches"],
        citylist: [],
        nextId: 0,
        city: '',
        city_id: '',
        temp: '',  
        temp_min: '',
        temp_max: '',
        description: '',
        icon: '',
        map: ''
    },
    computed: {
        ////// After each search made, checking out which of the temperatures is the biggest and saving it.
        tempMax: function() {
                var values = [];
                var i;
                // Saving each values to table.
                for (i = 0; i < this.citylist.length; i++) {
                    if(this.citylist[i].temp != undefined)
                    {
                    values.push(this.citylist[i].temp);
                    }
                }
                var max = Math.max.apply(Math, values); //Checking out the max value from the table.
                if (max == '-Infinity') return 'Give a city first...';  //In case user hasn't search anything.
                return max.toFixed(1);  //Returning rounded value.
            },
        ////// After each search made, checking out which of the temperatures is the lowest and saving it.
        tempMin: function() {
                var values = [];
                var i;
                // Saving each values to table.
                for (i = 0; i < this.citylist.length; i++) {
                    if(this.citylist[i].temp != undefined)
                    {
                    values.push(this.citylist[i].temp);
                    }
                }
                var min = Math.min.apply(Math, values); //Checking out the min value from the table.
                if (min == 'Infinity') return 'Give a city first...';   //In case user hasn't search anything.
                return min.toFixed(1);  //Returning rounded value.        
        },
        ////// After each search made, calculating average of searched temperature.
        tempAverage: function() {
                var sum = null, i;
                for (i = 0; i < this.citylist.length; i++) {
                    if(this.citylist[i].temp != undefined)
                    {
                    sum += (parseFloat(this.citylist[i].temp));
                    }
                }
                if (sum == undefined) return 'Give a city first...';    //In case user hasn't search anything.
                return (sum / this.nextId).toFixed(1);  //Returning rounded value.
            }
        },
        ////// Main method 'getWeather' to get weather based on the user input (city). Saving interesting information from the API response and saving them to local variables and finally pushing them to table.
        methods: {
            getWeather: function (citytosearch) {
                axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + this.citytosearch + '&appid=8c93d7d7f2e1b114fcfb5693bd4eb7fc')              
                .then(function (response) {
                    console.log(response);
                    var temp_k = response.data.main.temp;
                    weather_icon = response.data.weather[0].icon;

                    app.nextId = app.nextId;
                    this.city = response.data.name;
                    this.city_id = response.data.id;
                    this.temp = (temp_k - 273.15).toFixed(1);   //Calculating unit from Kelvin to Celsius and rounding value to one digit.
                    this.temp_min = (response.data.main.temp_min - 273.15).toFixed(1);  //Calculating unit from Kelvin to Celsius and rounding value to one digit.
                    this.temp_max = (response.data.main.temp_max - 273.15).toFixed(1);  //Calculating unit from Kelvin to Celsius and rounding value to one digit.
                    this.description = response.data.weather[0].main + ', ' + response.data.weather[0].description
                    this.icon = 'http://openweathermap.org/img/w/' + weather_icon + '.png'; //Creating a link to weather icon.
                    this.map = 'https://www.google.com/maps/@?api=1&map_action=map&center=' + response.data.coord.lat + ',' + response.data.coord.lon + '&zoom=9';  //Creating a link to show city in the map.
                    
                    // Pushing saved data to table.
                    app.citylist.push({
                        id: app.nextId,
                        city: this.city,
                        city_id: this.city_id,
                        temp: this.temp,
                        temp_min: this.temp_min,
                        temp_max: this.temp_max,
                        description:  this.description,
                        icon: this.icon,
                        map: this.map,
                    }) 
                    app.nextId++;     
            })
            ////// In case something goes wrong, printing out some info to user. API response code tells if something goes wrong.
            .catch (function(response) {
                console.log(response);
                if (response.data.cod == 404 || response.data.cod == 400) {
                    console.log('Incorrect input!');
                   alert('Probably incorrect city... try again!');
                }
            })
            ////// In case API can't be reached for some reason.
            .catch (function(error) {
                app.answer = 'Error ! Could not reach the API. ' + error;
            })
        },
    }
})
////// Root app ends.