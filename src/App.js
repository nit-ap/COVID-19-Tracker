import React, { useState, useEffect } from 'react';
import InfoBox from './InfoBox';
import{
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from '@material-ui/core';
import './App.css';
import Map from './Map';
import Table from './Table';
import './Table.css';
import {sortData,preetyPrintStat} from'./util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState("worldwide");
  const [countryInfo,setCountryInfo]=useState({});
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796});
  const [mapZoom,setMapZoom]=useState(3);
  const [mapCountries,setMapCountries]=useState([]);
  const [casesType,setCasesType]=useState('cases');
  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    });
  },[]);

useEffect(()=>{
  const getCountriesData=async()=>{
    await fetch('https://disease.sh/v3/covid-19/countries')
    .then((response)=>response.json())
    .then((data)=>{
      const countries=data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2
        }));
        const sortedData=sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
      setCountries(countries);
    });
  };
  getCountriesData();
  },[]);
  const onCountryChange=async(event)=>{
    const countryCode=event.target.value;
    setCountry(countryCode);
    const url = countryCode ==='worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then(response=>response.json())
    .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      console.log(data.countryInfo.lat)
    })
  };
 
  return (
    <div className="App">
    <div className='app_left'>

    <div className='app_header'>
    <h2>COVID-19  Webapp By <a href="https://manikant.herokuapp.com/">Manikant</a></h2>
    <h2><a href="https://github.com/devil-cyber/COVID-19-Tracker">Github</a></h2>
      <FormControl className='app_dropdown'>
      <Select 
      variant='outlined'
      onChange={onCountryChange} 
      value={country}
      >
      <MenuItem value='worldwide'>worldwide</MenuItem>
      {
        countries.map(country=>(
          <MenuItem value={country.value}>{country.name}</MenuItem>
        ))
      }
       
      </Select>
      </FormControl>
    </div>
    <div className='app_stats'>
    <InfoBox isRed active={casesType==='cases'} onClick={e=>setCasesType('cases')} title='Coronavirus Cases'cases={preetyPrintStat(countryInfo.todayCases)}total={preetyPrintStat(countryInfo.cases)}/>

    <InfoBox active={casesType==='recovered'}  onClick={e=>setCasesType('recovered')}  title='Recovered'cases={preetyPrintStat(countryInfo.todayRecovered)} total={preetyPrintStat(countryInfo.recovered)}/>

    <InfoBox  isRed active={casesType==='deaths'}  onClick={e=>setCasesType('deaths')}  title='Deaths'cases={preetyPrintStat(countryInfo.todayDeaths)} total={preetyPrintStat(countryInfo.deaths)}/>
    </div>

    <Map
    casesType={casesType}
    countries={mapCountries}
    center={mapCenter}
    zoom={mapZoom}
    />

    </div>

    <Card className='app_right'>
    <CardContent>
    <h3>Live Cases By Country</h3>
    <Table countries={tableData}/>
    <h3 className='app_graphTitle'>WorldWide new {casesType}</h3>
    <LineGraph
    casesType={casesType}
    className="app_graph"
    />
    </CardContent>

    </Card>
   
      

    
    
    
    
    
    
    
    </div> );
}

export default App;
