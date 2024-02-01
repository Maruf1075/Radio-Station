import { RadioBrowserApi } from "radio-browser-api";
import { useEffect, useState } from "react";
import AudioPlayer, { } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import defaultImage from "./pic.jpg"

const Radio = () => {
  const [stations, setStations] = useState();
  const [selectedRadioStation, setSelectedRadioStation] = useState(null)
  const [countryList, setCountryList] = useState([])
  const [showCountryList, setShowCountryList] = useState([])
  const [searchedText, setSearchedText] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    getCountryList()
    getStationsByCountries("us")
  }, []);

  // when search text changes -> update shows countries list according to searched string
  useEffect(() => {
    const newShowCountries = countryList?.filter((country) =>
      country.name.toLowerCase().includes(searchedText.toLowerCase())
    )
    setShowCountryList(newShowCountries)
  }, [searchedText]);

  const getStationsByCountries = async (countryCode) => {

    // query stations by country code and limit to first top 100 stations
    const api = new RadioBrowserApi(fetch.bind(window), "My Radio App");
    try {
      const newStations = await api.searchStations({
        countryCode: countryCode,
        limit: 100,
        offset: 0 // this is the default - can be omited
      })
      setStations(newStations);
    } catch (e) {
      console.log(e.message);
    }
  }

  // getting country list
  const getCountryList = async () => {
    fetch("https://de1.api.radio-browser.info/json/countries")
      .then((data) => {
        return data.json()
      })
      .then((data) => {
        //console.log({data});
        setCountryList(data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setDefaultSrc = (event) => {
    event.target.src = defaultImage;
  };

  return <>
    <div className="Radio container mx-auto">
      <div className="relative max-w-[400px] mx-auto flex justify-center py-4 mb-5 z-10">
        <input
          placeholder="Search by country"
          type="text"
          value={searchedText}
          className="px-4 py-2 w-full bg-gray-600 "
          onFocus={() => setIsSearching(true)}
          onBlur={() => setTimeout(() => {
            setIsSearching(false)
          }, 500)}
          onChange={e => setSearchedText(e.target.value)}
        />

        {(showCountryList.length > 0 && isSearching)
          &&
          <div className="w-full max-h-[300px] overflow-y-auto absolute z-[10] top-[100%] left-1/2 translate-x-[-50%] p-2 bg-gray-800 text-white" >
            {
              showCountryList?.map((country, index) =>
                <div
                  key={index}
                  onClick={() => {
                    getStationsByCountries(country.iso_3166_1)
                    setSearchedText(country.name)
                    setTimeout(() => {
                      setShowCountryList([])
                    }, 10)

                  }
                  }
                  className="w-full p-2 hover:bg-gray-950 rounded-md text-white cursor-pointer">
                  {country.name}
                </div>)
            }
          </div>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-[100px]">
        {stations &&
          stations.map((station, index) => {
            return (
              <div className="col-span-1" key={index}>
                <div
                  onClick={() => {
                    setSelectedRadioStation(station)
                  }}
                  tabIndex={1} className={`${selectedRadioStation?.urlResolved === station.urlResolved ? " bg-gray-950/50" : ""} ring-2 ring-blue-300 rounded-lg flex items-center justify-between gap-5 px-3 py-2 cursor-pointer dark:bg-gray-800 h-full dark:hover:bg-gray-950 hover:bg-gray-300 dark:focus:bg-gray-950 duration-200`}>
                  <img
                    className="logo w-[50px] aspect-square rounded-full"
                    src={station.favicon}
                    alt="station logo"
                    onError={setDefaultSrc}
                  />
                  
                  <div className="name flex-1 text-sm">{station.name}</div>
                </div>
              </div>
            );
          })}

      </div>

    </div >

    <div className="fixed bottom-0 mt-2 w-full grid grid-cols-2">
      
        <div className="flex items-center p-3 bg-blue-300">

          {
            selectedRadioStation && <>

            {<img src={selectedRadioStation?.favicon} alt="station logo" onError={setDefaultSrc}/>}

            {<div className="flex-1">
              {selectedRadioStation?.name}
          </div>}
          
            </>

          }

        </div>

          <div className="bg-white flex items-center">
              <AudioPlayer
                autoPlay
                className=""
                src={selectedRadioStation?.urlResolved}
                showJumpControls={false}
                layout="stacked"
                customProgressBarSection={[]}
                customControlsSection={["MAIN_CONTROLS", "VOLUME_CONTROLS"]}
                autoPlayAfterSrcChange={false}
                volume={0.5}
              />
          </div>
           
      </div>

  </> 
}

export default Radio