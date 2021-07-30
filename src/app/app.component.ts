import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  APIKey = 'e715ee420b2901036bf3605289120530';
  cityFormControl = new FormControl();
  filteredOptions: Observable<any[]>;
  options: any[] = [];
  coords: any = {};
  weather: any = null;
  forecast: any = null;
  forecastHourly: any = null;
  currentDate: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getCurrentLocation()
    this.getListCity()
    this.filteredOptionList()
  }

  getCurrentLocation() {
    let getLocationPromise = new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          const lat = position.coords.latitude
          const long = position.coords.longitude
          resolve({
            latitude: lat,
            longitude: long
          })
        })
      } else {
        reject("Geolocation is not supported by this browser.")
      }
    })
    getLocationPromise.then(({ latitude, longitude }) => {
      this.getWeatherByCurrentLocation(latitude, longitude)
      this.getForecastByCurrentLocation(latitude, longitude)
    }).catch((err) => {
      console.log(err)
    })
  }

  getWeatherByCurrentLocation(latitude: Number, longitude: Number) {
    try {
      this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.APIKey}&units=metric`).subscribe(res => {
        if (res) {
          this.getForecastHourly(res.id)
          res.weather[0].icon = `http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`
          this.currentDate = moment(new Date()).format('DD MMM, HH:mm');
          this.weather = res;
          console.log('weather : ', this.weather)
        }
      })
    } catch {
      console.log('Error Get Weather By Current Location')
    }
  }

  getWeather(city: string) {
    try {
      this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.APIKey}&units=metric`).subscribe(res => {
        if (res) {
          this.getForecastHourly(res.id)
          res.weather[0].icon = `http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png`
          this.currentDate = moment(new Date()).format('DD MMM, HH:mm');
          this.getForecastByCurrentLocation(res.coord.lat, res.coord.lon);
          this.weather = res;
          console.log('weather : ', this.weather)
        }
      })
    } catch {
      console.log('Error Get Weather By City')
    }
  }

  getForecastByCurrentLocation(latitude: Number, longitude: Number) {
    try {
      this.http.get<any>(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=10&appid=${this.APIKey}&units=metric`).subscribe(res => {
        if (res) {
          res.list = res.list.map(item => {
            item.dt = moment(new Date(item.dt * 1000)).format('ddd, DD MMMM');
            item.weather[0].icon = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
            return item
          })
          this.forecast = res
          console.log('forecast : ', this.forecast)
        }
      })
    } catch {
      console.log('Error Get Weather By Current Location')
    }
  }

  getListCity() {
    this.http.get<any>(`../assets/json/city.list.json`).subscribe(res => {
      this.options = res;
    })
  }

  getForecastHourly(id: Number) {
    this.http.get<any>(`http://api.openweathermap.org/data/2.5/forecast/hourly?id=${id}&lang=id&appid=${this.APIKey}`).subscribe(res => {
      this.forecastHourly = res;
    })
  }

  filteredOptionList() {
    this.filteredOptions = this.cityFormControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name.length >= 4 ? this._filter(name) : [])
      );
  }

  handleSearchCity(city: string) {
    this.getWeather(city)
  }

  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }

  _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
}
