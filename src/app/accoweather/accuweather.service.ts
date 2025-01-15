import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from 'rxjs';

import { AccuweatherLocationDTO } from "./DTO/accuweather-location.dto";
import { TemperatueDTO } from "./DTO/temperature.dto";
import { CurrentWeatherDTO } from "./DTO/current-weather.dto";
import { TemperatureUnit } from "./DTO/temperature-unit.enum";

@Injectable({
    providedIn: 'root',
})
export class AccuweatherService {

    private httpClient = inject(HttpClient);

    private locationBaseUrl = 'http://dataservice.accuweather.com/locations/v1/cities';
    private baseUrl = 'http://dataservice.accuweather.com/currentconditions/v1';
    private apiKey = "";

    private async getLocationByGeolocation(latitude: string, longitude: string): Promise<AccuweatherLocationDTO | null | undefined> {
        const url = `${this.locationBaseUrl}/geoposition/search?apikey=${this.apiKey}&q=${latitude},${longitude}&language=en-us&details=false&toplevel=false`;
        const response = await firstValueFrom(this.httpClient.get<any>(url));
        console.log('getLocationByGeolocation', response);

        if (response !== undefined && response !== null) {
            const responseData = response;
            const returnValue: AccuweatherLocationDTO = {
                key: responseData.Key,
                type: responseData.Type,
                name: responseData.LocalizedName,
                countryName: responseData.Country.LocalizedName,
                administrativeAreaName: responseData.AdministrativeArea.LocalizedName
            };
            return returnValue;
        }
        return null;
    }

    private async getLocationByTextSearch(search: string): Promise<AccuweatherLocationDTO | null | undefined> {
        const url = `${this.locationBaseUrl}/autocomplete?apikey=${this.apiKey}&q=${search}&language=en-us`;
        const response = await firstValueFrom(this.httpClient.get<any>(url));
        console.log('getLocationByTextSearch', response);

        if (response !== undefined && response !== null) {
            const responseData = response[0];
            const returnValue: AccuweatherLocationDTO = {
                key: responseData.Key,
                type: responseData.Type,
                name: responseData.LocalizedName,
                countryName: responseData.Country.LocalizedName,
                administrativeAreaName: responseData.AdministrativeArea.LocalizedName
            };
            return returnValue;
        }
        return null;
    }

    getCurrent = async (query: string): Promise<CurrentWeatherDTO | null> => {
        if (typeof query === 'string') {
            const [latitude, longitude] = this.getGeolocationCoordinates(query);
            let location: AccuweatherLocationDTO | null | undefined;
            if (latitude !== null && longitude !== null) {
                location = await this.getLocationByGeolocation(latitude, longitude);
            }
            else {
                location = await this.getLocationByTextSearch(query);
            }
            if (location !== null) {
                console.log(location);
                const url = `${this.baseUrl}/${location?.key}?apikey=${this.apiKey}&language=en-us&details=true`;
                const response = await firstValueFrom(this.httpClient.get<any>(url));
                console.log('getCurrent', response);

                if (response !== undefined && response !== null) {
                    const responseData = response[0];
                    const returnValue: CurrentWeatherDTO = {
                        text: responseData.WeatherText,
                        temperature: { value: responseData.Temperature.Metric.Value, unit: TemperatureUnit.celcius } as TemperatueDTO,
                        humidity: responseData.RelativeHumidity,
                        feeling: { value: responseData.RealFeelTemperature.Metric.Value, unit: TemperatureUnit.celcius } as TemperatueDTO,
                        image: '',
                        uv: {
                            index: responseData.UVIndex,
                            text: responseData.UVIndexText,
                            color: ''
                        },
                        pressure: {
                            value: responseData.Pressure.Metric.Value,
                            unit: responseData.Pressure.Metric.Unit
                        },
                        wind: {
                            direction: {
                                value: responseData.Wind.Direction.Degrees,
                                unit: '',
                                text: ''
                            },
                            speed: {
                                value: responseData.Wind.Speed.Metric.Value,
                                unit: responseData.Wind.Speed.Metric.Unit
                            }
                        },
                        maxTemp: { value: responseData.TemperatureSummary.Past24HourRange.Maximum.Metric.Value, unit: TemperatureUnit.celcius } as TemperatueDTO,
                        minTemp: { value: responseData.TemperatureSummary.Past24HourRange.Minimum.Metric.Value, unit: TemperatureUnit.celcius } as TemperatueDTO,
                        sunset: undefined,
                        sunrise: undefined
                    };
                    return returnValue;
                }
            }
        }
        return null;
    }

    private getGeolocationCoordinates(input: string): [string | null, string | null] {
        const queryStr = input as string;
        const regex = /(\-{0,1}\d+\.{0,1}\d{0,})\,{1}(\-{0,1}\d+\.{0,1}\d{0,})/i;
        if (regex.test(queryStr)) {
            const match = queryStr.match(regex);
            if (match?.length === 3) {
                return [match[1], match[2]];
            }
        }
        return [null, null];
    }
}
