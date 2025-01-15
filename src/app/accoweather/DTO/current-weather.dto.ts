import { TemperatueDTO } from "./temperature.dto";
import { UltravioletIndexDTO } from "./ultraviolet-Index.dto";
import { UnitDTO } from "./unit.dto";
import { WindDTO } from "./wind.dto";

export type CurrentWeatherDTO = {
    text: string,
    temperature: TemperatueDTO,
    humidity: number,
    feeling: TemperatueDTO,
    image: string
    uv: UltravioletIndexDTO
    pressure: UnitDTO,
    wind: WindDTO,
    maxTemp: TemperatueDTO,
    minTemp: TemperatueDTO,
    sunset: Date | null | undefined,
    sunrise: Date | null | undefined
};