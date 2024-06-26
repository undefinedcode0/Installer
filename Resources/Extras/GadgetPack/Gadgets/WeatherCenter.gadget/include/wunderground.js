//	Javascript file for the WeatherCenter gadget
//	(c) 2009
//	WeatherCenter Gadget Team
//	Development: hadj 
//	Graphics: Tex
//	Testing: Digital	
////////////////////////////////////////////////////////////////////////


function parseForecastWunderground(CurrentXml,ForecastXml)
{

	var parametrsArray = [{"name":"nothing", "capt":"", "span":""}]

	var locName = System.Gadget.Settings.read("WUlastSearch");
	
	setLocation(locName);


	var current = CurrentXml.substring(CurrentXml.indexOf("<weather>") + 9, CurrentXml.indexOf("</weather>"));
	if (!current) current = lng_nodata;
	
	var icon = CurrentXml.substring(CurrentXml.indexOf("<icon_url>") + 10, CurrentXml.indexOf("</icon_url>"));
	if (icon) icon = icon.substring(icon.lastIndexOf("/") + 1, icon.lastIndexOf("."));

	
	var currenttime_str = ForecastXml.substring(ForecastXml.indexOf("<current_time>") + 14, ForecastXml.indexOf("</current_time>"));
	time = currenttime_str.substring(currenttime_str.indexOf("<hour>") + 6, currenttime_str.indexOf("</hour>")) + ":" + currenttime_str.substring(currenttime_str.indexOf("<minute>") + 8, currenttime_str.indexOf("</minute>"));
	var sunrise_str = ForecastXml.substring(ForecastXml.indexOf("<sunrise>") + 9, ForecastXml.indexOf("</sunrise>"));
	var sunriseTm = sunrise_str.substring(sunrise_str.indexOf("<hour>") + 6, sunrise_str.indexOf("</hour>")) + ":" + sunrise_str.substring(sunrise_str.indexOf("<minute>") + 8, sunrise_str.indexOf("</minute>"));
	var sunset_str = ForecastXml.substring(ForecastXml.indexOf("<sunset>") + 9, ForecastXml.indexOf("</sunset>"));
	var sunsetTm = sunset_str.substring(sunset_str.indexOf("<hour>") + 6, sunset_str.indexOf("</hour>")) + ":" + sunset_str.substring(sunset_str.indexOf("<minute>") + 8, sunset_str.indexOf("</minute>"));
	checkDayorNight(time, sunriseTm, sunsetTm, current);


	SunriseCapt = lng_Stats["sunrise"];
	SunriseSpan = TimeTo24Convert(sunriseTm);
	if (sunriseTm == 'N/A') SunriseSpan = lng_nodata;
	parametrsArray.push({"name":"sunrise", "capt":SunriseCapt, "span":SunriseSpan});
	
	SunsetCapt = lng_Stats["sunset"];
	SunsetSpan = TimeTo24Convert(sunsetTm);
	if (sunsetTm == 'N/A') SunsetSpan = lng_nodata;
	parametrsArray.push({"name":"sunset", "capt":SunsetCapt, "span":SunsetSpan});
	

	
	var timeupdate_str = CurrentXml.substring(CurrentXml.indexOf("<observation_time>") + 18, CurrentXml.indexOf("</observation_time>"));
	var timeupdate = timeupdate_str.substring(timeupdate_str.indexOf(",") + 2, timeupdate_str.indexOf(":") + 6);
	lasttimeupdate24full = TimeTo24Convert(timeupdate);
	if ((System.Gadget.Settings.read("showLastTimeUpdate")) != 1 || timeupdate_str == "N/A" || timeupdate_str == 'Last Updated on , ') TimeLastUpdate.innerText = "";
	else TimeLastUpdate.innerText = lasttimeupdate24full;
	


	if (System.Gadget.Settings.read("tunits") == "m") {
		var temp = CurrentXml.substring(CurrentXml.indexOf("<temp_c>") + 8, CurrentXml.indexOf("</temp_c>"));
		if (!temp) temp = lng_nodata;
		var TemperatureUnits = "C";
	}
	if (System.Gadget.Settings.read("tunits") == "f") {
		var temp = CurrentXml.substring(CurrentXml.indexOf("<temp_f>") + 8, CurrentXml.indexOf("</temp_f>"));
		if (!temp) temp = lng_nodata;
		var TemperatureUnits = "F";
	}
	if (temp != lng_nodata) temp = Math.round(temp);
	TempSpan.innerText = temp + "°" + lng_Units[TemperatureUnits];



	if (System.Gadget.Settings.read("punits") == "mm") {
		var pressure = CurrentXml.substring(CurrentXml.indexOf("<pressure_mb>") + 13, CurrentXml.indexOf("</pressure_mb>"));
		if (!pressure) pressure = lng_nodata;
		pressure = (pressure * 0.75).toFixed(0);
		var PressureUnits = "mm";
	}
	if (System.Gadget.Settings.read("punits") == "mb") {
		var pressure = CurrentXml.substring(CurrentXml.indexOf("<pressure_mb>") + 13, CurrentXml.indexOf("</pressure_mb>"));
		if (!pressure) pressure = lng_nodata;
		var PressureUnits = "mb";
	}
	if (System.Gadget.Settings.read("punits") == "in") {
		var pressure = CurrentXml.substring(CurrentXml.indexOf("<pressure_in>") + 13, CurrentXml.indexOf("</pressure_in>"));
		if (!pressure) pressure = lng_nodata;
		var PressureUnits = "in";
	}
	if (System.Gadget.Settings.read("punits") == "kpa") {
		var pressure = CurrentXml.substring(CurrentXml.indexOf("<pressure_mb>") + 13, CurrentXml.indexOf("</pressure_mb>"));
		if (!pressure) pressure = lng_nodata;
		pressure = (pressure/10).toFixed(2);
		var PressureUnits = "kPa";
	}
	var PressureCapt = lng_Stats["pressure"];
	var PressureSpan = pressure + lng_Units[PressureUnits];
	if (pressure == 'N/A' || pressure == 'NaN' || pressure == lng_nodata || pressure == 0) PressureSpan = lng_nodata;
	parametrsArray.push({"name":"pressure", "capt":PressureCapt, "span":PressureSpan});



	var windSpeed = CurrentXml.substring(CurrentXml.indexOf("<wind_mph>") + 10, CurrentXml.indexOf("</wind_mph>"));
	if (!windSpeed) windSpeed = lng_nodata;
	if (System.Gadget.Settings.read("sunits") == "ms") {
		windSpeed = (windSpeed*0.44704).toFixed(0);
		var WindSpeedUnits = "m/s";
	}
	if (System.Gadget.Settings.read("sunits") == "km") {
		windSpeed = (windSpeed*1.609344).toFixed(0);
		var WindSpeedUnits = "km/h";
	}
	if (System.Gadget.Settings.read("sunits") == "mp") {
		var WindSpeedUnits = "mph";
	}
	var windDirection = CurrentXml.substring(CurrentXml.indexOf("<wind_dir>") + 10, CurrentXml.indexOf("</wind_dir>"));
	if (!windDirection) windDirection = lng_nodata;
	if (winddirection_Stats[windDirection] != undefined) var WindDirectionSpan = "[" + winddirection_Stats[windDirection] + "]";
	else WindDirectionSpan = "";
	WindCapt = lng_Stats["wind"] + WindDirectionSpan;
	WindSpan = windSpeed + lng_Units[WindSpeedUnits];
	if (windSpeed == 'N/A' || windSpeed == 'calm' || windSpeed == 'CALM' || windSpeed == 'CALM' || windSpeed == 'NaN' || !windSpeed) WindSpan = lng_nodata;
	parametrsArray.push({"name":"wind", "capt":WindCapt, "span":WindSpan});



	if (System.Gadget.Settings.read("dunits") == "km") {
		var visibility = CurrentXml.substring(CurrentXml.indexOf("<visibility_km>") + 15, CurrentXml.indexOf("</visibility_km>"));
		if (!visibility) visibility = lng_nodata;
		var DistanceUnits = "km";
	}
	if (System.Gadget.Settings.read("dunits") == "mi") {
		var visibility = CurrentXml.substring(CurrentXml.indexOf("<visibility_mi>") + 15, CurrentXml.indexOf("</visibility_mi>"));
		if (!visibility) visibility = lng_nodata;
		var DistanceUnits = "mi";
	}
	VisibilityCapt = lng_Stats["visibility"];
	VisibilitySpan = visibility + lng_Units[DistanceUnits];
	if (visibility == 'N/A' || visibility == lng_nodata) VisibilitySpan = lng_nodata;
	parametrsArray.push({"name":"visibility", "capt":VisibilityCapt, "span":VisibilitySpan});



	var humidity = CurrentXml.substring(CurrentXml.indexOf("<relative_humidity>") + 19, CurrentXml.indexOf("</relative_humidity>"));
	if (!humidity) humidity = lng_nodata;
	HumidityCapt = lng_Stats["humidity"];
	if (humidity.indexOf("%") == -1) humidity = humidity + "%";
	HumiditySpan = humidity;
	if (humidity == 'N/A') HumiditySpan = lng_nodata;
	parametrsArray.push({"name":"humidity", "capt":HumidityCapt, "span":HumiditySpan});


											//dewpoint
	if (System.Gadget.Settings.read("tunits") == "m") {
		var dewpoint = CurrentXml.substring(CurrentXml.indexOf("<dewpoint_c>") + 12, CurrentXml.indexOf("</dewpoint_c>"));
		if (!dewpoint) dewpoint = lng_nodata;
		var TemperatureUnits = "C";
	}
	if (System.Gadget.Settings.read("tunits") == "f") {
		var dewpoint = CurrentXml.substring(CurrentXml.indexOf("<dewpoint_f>") + 12, CurrentXml.indexOf("</dewpoint_f>"));
		if (!dewpoint) dewpoint = lng_nodata;
		var TemperatureUnits = "F";
	}
	DewpCapt = lng_Stats["dewpoint"];
	DewpSpan = dewpoint + "°" + lng_Units[TemperatureUnits];
	if (dewpoint == 'N/A') DewpSpan = lng_nodata;
	parametrsArray.push({"name":"dewpoint", "capt":DewpCapt, "span":DewpSpan});


	
	var moonphase = ForecastXml.substring(ForecastXml.indexOf("<ageOfMoon>") + 11, ForecastXml.indexOf("</ageOfMoon>"));
	moonphase = moonphase*1;
	if (moonphase < 1.84566) moonterminator = "New";
    	else if (moonphase < 5.53699) moonterminator = "Waxing Crescent";
    	else if (moonphase < 9.22831) moonterminator = "First Quarter";
    	else if (moonphase < 12.91963) moonterminator = "Waxing Gibbous";
    	else if (moonphase < 16.61096) moonterminator = "Full";
    	else if (moonphase < 20.30228) moonterminator = "Waning Gibbous";
    	else if (moonphase < 23.99361) moonterminator = "Last Quarter";
    	else if (moonphase < 27.68493) moonterminator = "Waning Crescent";
    	else moonterminator = "New";
	MoonCapt = lng_Stats["moonterminator"];
	MoonSpan = moon_Stats[moonterminator];
	if (MoonSpan == undefined) MoonSpan = lng_nodata;
	parametrsArray.push({"name":"moonterminator", "capt":MoonCapt, "span":MoonSpan});
	

	var latitude = CurrentXml.substring(CurrentXml.indexOf("<latitude>") + 10, CurrentXml.indexOf("</latitude>"));		//latitude
	if (!latitude) latitude = lng_nodata;
	else latitude = (latitude*1).toFixed(2);
	LatitudeCapt = lng_Stats["latitude"];
	LatitudeSpan = latitude;
	if (latitude == 'N/A') LatitudeSpan = lng_nodata;
	parametrsArray.push({"name":"latitude", "capt":LatitudeCapt, "span":LatitudeSpan});


	var longitude = CurrentXml.substring(CurrentXml.indexOf("<longitude>") + 11, CurrentXml.indexOf("</longitude>"));	//longitude
	if (!longitude) longitude = lng_nodata;
	else longitude = (longitude*1).toFixed(2);
	LongitudeCapt = lng_Stats["longitude"];
	LongitudeSpan = longitude;
	if (longitude == 'N/A') LongitudeSpan = lng_nodata;
	parametrsArray.push({"name":"longitude", "capt":LongitudeCapt, "span":LongitudeSpan});


	var precipitation = ForecastXml.substring(ForecastXml.indexOf("<pop>") + 5, ForecastXml.indexOf("</pop>"));
	if (precipitation) PrecipitationSpan = precipitation + "%";
	else PrecipitationSpan = lng_nodata;
	PrecipitationCapt = lng_Stats["precipitation"];
	parametrsArray.push({"name":"precipitation", "capt":PrecipitationCapt, "span":PrecipitationSpan});

	setOptionsSettings(parametrsArray);


	wundergroundurl = CurrentXml.substring(CurrentXml.indexOf("<forecast_url>") + 14, CurrentXml.indexOf("</forecast_url>"));
	


	currentImg.src = "images/" + System.Gadget.Settings.read('Skin') + "/" + daytime + "/" + WUGetCondImage(icon);


	if (daytime == "Night" && (img == "partcloudy.png" || img == "cloudy.png" || img == "mostcloudy.png" || img == "clear.png")) {

		var moon_img = {
			New: "new.png",
			"Waxing Crescent": "waxing_crescent.png",
			"First Quarter": "first_quater.png",
			"Waxing Gibbous": "waxing_gibbous.png",
			Full: "full.png",
			"Waning Gibbous": "waning_gibbous.png",
			"Last Quarter": "last_quater.png",
			"Waning Crescent": "waning_crescent.png",
			Darkened: "new.png"
		};

		var moonphase = ForecastXml.substring(ForecastXml.indexOf("<ageOfMoon>") + 11, ForecastXml.indexOf("</ageOfMoon>"));
		moonphase = moonphase*1;
		if (moonphase < 1.84566) Phase = "New";
    		else if (moonphase < 5.53699) Phase = "Waxing Crescent";
    		else if (moonphase < 9.22831) Phase = "First Quarter";
    		else if (moonphase < 12.91963) Phase = "Waxing Gibbous";
    		else if (moonphase < 16.61096) Phase = "Full";
    		else if (moonphase < 20.30228) Phase = "Waning Gibbous";
    		else if (moonphase < 23.99361) Phase = "Last Quarter";
    		else if (moonphase < 27.68493) Phase = "Waning Crescent";
    		else Phase = "New";
    		currentImgMoon.src = "images/" + System.Gadget.Settings.read('Skin') + "/Night/moon/" + moon_img[Phase];
		if (System.Gadget.Settings.read('showFlyoutForecast') == "1") {
			currentImg.alt = moon_Stats_full[Phase];
			currentImgMoon.alt = moon_Stats_full[Phase];
		}
		if (img != "clear.png") {currentImg.style.display = "block";}
		else currentImg.style.display = "none";
	}
	else {
		currentImgMoon.style.display = "none";
		currentImg.alt = "";
	}


	
	if (lng_WundergroundStatus[current.toLowerCase()] != undefined) current = lng_WundergroundStatus[current.toLowerCase()];
		while (current.length > 19) {
	 		current = current.slice(0, current.lastIndexOf(" "));
			lastsymbol = current.substring(current.lastIndexOf(" ") + 1, current.length);
			if (lastsymbol.length == 1 || lastsymbol == 'and') current = current.slice(0, current.lastIndexOf(" "));
		}
	CondSpan.innerText = current;



	//alert module
	var msgalert = "";
	var alertData = loadXmlDoc("http://api.wunderground.com/auto/wui/geo/AlertsXML/index.xml?query=" + System.Gadget.Settings.read('locationCode'));
	if (alertData.parseError.errorCode == 0) {
		var alerts = alertData.getElementsByTagName("./AlertItem");
		if (alerts.length > 0)
			{
				for (var alert_index = 0; alert_index < alerts.length; alert_index++)
				msgalert += alerts[alert_index].getElementsByTagName("./description")[0].firstChild.nodeValue + "   ";
				CondSpan.innerHTML = "<MARQUEE WIDTH='115' SCROLLDELAY='70' SCROLLAMOUNT='2'><font color='red'><b>" + msgalert + "</b></font></MARQUEE>";
			}
	}
	



	
	updateBar.style.display = "none";
	
	WUFillForecast(ForecastXml.substring(ForecastXml.indexOf("<simpleforecast>") + 16, ForecastXml.indexOf("</simpleforecast>")));

	
	redrawGadget();


	//autoupdate module
	if (System.Gadget.Settings.read("WUupdateInterval") == "0")
	{
		currenttime24m = time.slice(time.indexOf(":") + 1, time.indexOf(":") + 3);
		if (currenttime24m < 15) intervalupd = 15 - currenttime24m;
		if (currenttime24m >= 15 && currenttime24m < 45) intervalupd = 45 - currenttime24m;
		if (currenttime24m >= 45) intervalupd = 60 - currenttime24m + 15;
		if ((DateToMinutesConvert(time) - DateToMinutesConvert(timeupdate)) > 43) intervalupd = 2;
		clearTimeout(updateTimer);
		updateTimer = setTimeout('getForecastData();', 1000*60*intervalupd);
	}
	
	
	
	
}





//////////////////////







function WUGetCondImage(condition)
{
	img="undefined.png";

	if (condition == "clear" || condition == "sunny")
		img="clear.png";

	if (condition == "cloudy")
		img="cloudy.png";

	if (condition == "flurries")
		img="lightsnow.png";

	if (condition == "fog")
		img="fog.png";

	if (condition == "haze" || condition == "hazy")
		img="dusthaze.png";

	if (condition == "mostlycloudy" || condition == "partlysunny")
		img="mostcloudy.png";

	if (condition == "mostlysunny")
		img="mostsunny.png";

	if (condition == "partlycloudy")
		img="partcloudy.png";

	if (condition == "rain" || condition == "chancerain")
		img="rain.png";

	if (condition == "sleat" || condition == "sleet" || condition == "chancesleet" || condition == "chancesleat")
		img="rainandsnow.png";

	if (condition == "snow" || condition == "chancesnow")
		img="snow.png";

	if (condition == "thunderstorms" || condition == "tstorms" || condition == "chancetstorms")
		img="thunderstorm.png";

	return img;
}

///////////////////////


//////////////////////



function WUFillForecast(XmlData)
{

	XmlData = XmlData.split('<forecastday>');

	var a = 1;
	totalFCDays = 0;

	for (var i = 1; i < XmlData.length; i++) {

	if ((System.Gadget.Settings.read("showForecastToday")) != 1 || DateToMinutesConvert(time) >= 900)
			{
				if (i == 1) i++;
				if (System.Gadget.Settings.read("showDayNameForecast") == 0) dayName1.innerText = lng_Tomorrow;
			}
 		else
			{
				if (System.Gadget.Settings.read("showDayNameForecast") == 0) {
					dayName1.innerText = lng_Today;
					dayName2.innerText = lng_Tomorrow;
				}
			}

		var dayData = XmlData[i];		

		var high_str = dayData.substring(dayData.indexOf("<high>") + 6, dayData.indexOf("</high>"));
		if (!high_str) high_str = lng_nodata;
		var high = high_str.substring(high_str.indexOf("<celsius>") + 9, high_str.indexOf("</celsius>"));
		var low_str = dayData.substring(dayData.indexOf("<low>") + 5, dayData.indexOf("</low>"));
		if (!low_str) low_str = lng_nodata;
		var low = low_str.substring(low_str.indexOf("<celsius>") + 9, low_str.indexOf("</celsius>"));
		if (System.Gadget.Settings.read("tunits") == "f") {high = (high*(9/5) + 32).toFixed(0); low = (low*(9/5) + 32).toFixed(0);}
		
		if (high != "N/A" || high_str != lng_nodata)
			high+="°";
		else	high = "??°";
		if (low != "N/A" || low_str != lng_nodata)
			low +="°";
		else	low = "??°";

		var day = dayData.substring(dayData.indexOf('<weekday>') + 9, dayData.indexOf('</weekday>'));
		day = lng_DayOfWeek[day];
		var date = dayData.substring(dayData.indexOf('<day>') + 5, dayData.indexOf('</day>'));
		var month = dayData.substring(dayData.indexOf('<monthname>') + 11, dayData.indexOf('</monthname>'));
		date = date +" " + lng_Month_full[month];

		var precip = dayData.substring(dayData.indexOf('<pop>') + 5, dayData.indexOf('</pop>'));

		var condition = dayData.substring(dayData.indexOf("<conditions>") + 12, dayData.indexOf("</conditions>"));

		var icon = dayData.substring(dayData.indexOf("<icon>") + 6, dayData.indexOf("</icon>"));
		
				
		document.getElementById("dayName" + a).innerText = day; 
		document.getElementById("date" + a).innerText = date; 
		document.getElementById("dayHi" + a).innerText = high;
		document.getElementById("separator"  + a).innerText = "/";
		document.getElementById("dayLow" + a).innerText = low; 
		document.getElementById("dayImg" + a).src = "images/" + System.Gadget.Settings.read('Skin') + "/Forecast/" + WUGetCondImage(icon);
		if (lng_WundergroundStatus[condition.toLowerCase()] != undefined) condition = lng_WundergroundStatus[condition.toLowerCase()];
		if (System.Gadget.Settings.read('showFlyoutForecast') == "1") document.getElementById("dayImg" + a).alt = condition + ", " + lng_Stats['precipitation'] + ": " + precip + "%";
		a++;
		totalFCDays++;
	}

}




