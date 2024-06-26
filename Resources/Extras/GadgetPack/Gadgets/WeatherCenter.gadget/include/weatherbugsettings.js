//	Javascript file for the WeatherCenter gadget
//	(c) 2009
//	WeatherCenter Gadget Team
//	Development: hadj 
//	Graphics: Tex
//	Testing: Digital	
////////////////////////////////////////////////////////////////////////

var WeatherBugCityFlag;

function WeatherBugLoadSettings()
{
	WeatherBugCityFlag = 0;

	loccode.value = System.Gadget.Settings.read("WBlastSearch");
	loccode_id.value = System.Gadget.Settings.read("WBlocationCode");

	updateInt[0].disabled = true;
	updateInt[1].checked = "1";
	updateIntValue.value = System.Gadget.Settings.read("WBupdateInterval");

	
	WBUnits_makeUnitSelector("ShowParametersOption1");
	WBUnits_makeUnitSelector("ShowParametersOption2");
	WBUnits_makeUnitSelector("ShowParametersOption3");
	WBUnits_makeUnitSelector("ShowParametersOption4");
	
}



/////////////////


function WBUnits_makeUnitSelector(ShowParametersOption)
{
var unitsArray = [
		{"name":lng_Stats["nothing"], "value":"nothing"},
		{"name":lng_Stats["flik"], "value":"flik"},
		{"name":lng_Stats["wind"], "value":"wind"},
		{"name":lng_Stats["precipitation"], "value":"precipitation"},
		{"name":lng_Stats["gust"], "value":"gust"},
		{"name":lng_Stats["humidity"], "value":"humidity"},
		{"name":lng_Stats["pressure"], "value":"pressure"},
		{"name":lng_Stats["sunrise"], "value":"sunrise"},
		{"name":lng_Stats["sunset"], "value":"sunset"},
		{"name":lng_Stats["dewpoint"], "value":"dewpoint"},
		{"name":lng_Stats["latitude"], "value":"latitude"},
		{"name":lng_Stats["longitude"], "value":"longitude"}
		]


for (i = 0; i < unitsArray.length; i++)
	{
		var sel = document.getElementById(ShowParametersOption);
		var opt = document.createElement("option");
		opt.value = unitsArray[i].value;
		opt.innerHTML = unitsArray[i].name;
		if (unitsArray[i].value == System.Gadget.Settings.read("WB"+ShowParametersOption)) opt.selected = true; 
		sel.appendChild(opt);
	}
} 


/////////////////



function WeatherBugSearchCityCode(LocCode)
{
	if ((loccode.value).search(/\d/) > -1) {loccode.value = "Type city name instead"; hide("load_indicator"); return;}

	var location = "http://datafeed.weatherbug.com/GetXml.aspx?RequestType=103&PartnerId=BFB7BE81-EF74-4b7b-A9EF-A82D059992EF&SearchString=" + LocCode + "&rnd=" + Math.round(Math.random() * 10000);

	clearResults();

	var tmp = new ActiveXObject("Microsoft.XMLHTTP");
	tmp.open("GET", location, true);
	tmp.onreadystatechange=function()
	{
		if (tmp.readyState==4)
			{
				if (tmp.Status == 200) WeatherBugParseCityResults(tmp.responseXML.documentElement);
				else {document.getElementById("loccode").value = lng_NoData; return;}
			}
	}
	tmp.Send(null);
}



function WeatherBugSearchStationCode()
{
	show("load_indicator");	

	if ((loccode_id.value).indexOf('u') > -1)
		var location = "http://datafeed.weatherbug.com/GetXML.aspx?RequestType=502&PartnerId=0eb57a3e-1462-4e61-bd79-bea5ca004c9f&ZipCode=" + (loccode_id.value).slice(1) + "&rnd=" + Math.round(Math.random() * 10000);
	else
		var location = "http://datafeed.weatherbug.com/GetXML.aspx?RequestType=502&PartnerId=0eb57a3e-1462-4e61-bd79-bea5ca004c9f&CityCode=" + loccode_id.value + "&rnd=" + Math.round(Math.random() * 10000);

	
	clearResults();

	var tmp = new ActiveXObject("Microsoft.XMLHTTP");
	tmp.open("GET", location, false);
	tmp.onreadystatechange=function()
	{
		if (tmp.readyState==4)
			{
				if (tmp.Status == 200) WeatherBugParseStationResults(tmp.responseXML.documentElement);
				else {document.getElementById("loccode").value = lng_NoData; return;}
			}
	}
	tmp.Send(null);
}

//////////////////


function WeatherBugParseCityResults(xmlData)
{
	tempNodes=xmlData.getElementsByTagName('location');
	for (count=0;count<tempNodes.length;count++) {
		var option = document.createElement("OPTION");
		cityNode=tempNodes[count];
		option.value=cityNode.getAttribute("citycode");
		if (cityNode.getAttribute("state") == "") var state = ", ";
		else var state = ", " + cityNode.getAttribute("state") + ", ";
		option.innerText=cityNode.getAttribute("city") + state + cityNode.getAttribute("country");
		results.appendChild(option);
	}
hide("load_indicator");	
}


function WeatherBugParseStationResults(xmlData)
{
	tempNodes=xmlData.getElementsByTagName('aws:station');
	for (count=0;count<tempNodes.length;count++) {
		var option = document.createElement("OPTION");
		cityNode=tempNodes[count];

		var distance=cityNode.getAttribute("distance");
		if (distance != "") distance = "[" + distance + " " + lng_Units['mi'] + "]";
		
		option.value=cityNode.getAttribute("id");
		option.innerText=cityNode.getAttribute("name") + " " + distance;
		results.appendChild(option);
	}

hide("load_indicator");

}

/////////////////////

