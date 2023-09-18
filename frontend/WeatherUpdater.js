class WeatherUpdater {
    constructor() {
        this.weather = null;
        setInterval(
            ()=>{this.updateWeather()},
            1000 * 1800
        );

    }

    getData() {
        if (this.weather == null) {
            console.warn("cannot read weather data.");
            return;
        }

        return this.weather;
    }
    async updateWeather() {
        // AJAX 요청 설정
        const response = await fetch("./get_weather_json", {
            method: "GET",
            headers: {
            "Content-Type": "application/json"
            }
        });
        
        const data = await response.json();
        this.weather = data;
        return data
    }
}

module.exports = {WeatherUpdater}