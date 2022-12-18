mapboxgl.accessToken = 'pk.eyJ1IjoiZGlwYXlhbmRhczM2MCIsImEiOiJja3Fybm1xZXUxMWFjMzJuYnlqeDhkYjJtIn0.kqhXRux7wwHsaj9rOL3v_w';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  zoom: 3.2,
  center: [80, 22],
  minZoom: 4,
});

var geocoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken });
map.addControl(geocoder);

// let store = {}

// const code_to_state_name = {

//   "AN": "Andaman and Nicobar Islands",
//   "AP": "Andhra Pradesh",
//   "AR": "Arunachal Pradesh",
//   "AS": "Assam",
//   "CH": "Chandigarh",
//   "CT": "Chhattisgarh",
//   "BR": "Bihar",
//   "DL": "Delhi",
//   "DN": "Dadra and Nagar Haveli and Daman and Diu",
//   "GA": "Goa",
//   "GJ": "Gujarat",
//   "HP": "Himachal Pradesh",
//   "HR": "Haryana",
//   "JH": "Jharkhand",    //not read
//   "JK": "Jammu and Kashmir",
//   "KA": "Karnataka",
//   "KL": "Kerala",
//   "LA": "Ladakh",
//   "LD": "Lakshadweep",
//   "MH": "Maharashtra",
//   "ML": "Meghalaya",
//   "MN": "Manipur",
//   "MP": "Madhya Pradesh",
//   "MZ": "Mizoram",
//   "NL": "Nagaland",
//   "OR": "Odisha",
//   "PB": "Punjab",
//   "PY": "Puducherry",
//   "RJ": "Rajasthan",
//   "SK": "Sikkim",
//   "TG": "Telangana",
//   "TN": "Tamil Nadu",
//   "TR": "Tripura",
//   "UP": "Uttar Pradesh",
//   "UT": "Uttarakhand",
//   "WB": "West Bengal"
// }

fetch('https://data.covid19india.org/v4/min/data.min.json')
  .then((response) => {
    return response.json()
  })
  .then((content) => {

    //content is an object of all the info returned
    for (let state in content){
      
      let dist = content[state].districts

      // dist is an district object that contains all the districts relating to that state

      for (let dist_name in dist){

        //center first one is longitude, and second one is latitude
        //object  -> features -> which is an array... take the 0th item, this item is an object, -> center ->  this is an array, 0th element is longitude, 1st element is latitude

          //Had used the mapbox Geocoding API, but it gives Request limit exceeded error
          //  `https://api.mapbox.com/geocoding/v5/mapbox.places/${code_to_state_name[state]}%20${dist_name}.json?country=IN&access_token=${mapboxgl.accessToken}`

          // `https://states-districts-api.herokuapp.com/elements/${state}` is slow, so takes time to load
          fetch(`https://raw.githubusercontent.com/PiXeL99-eng/States-and-district-coordinates-data/master/data.json`).then((response) => {return response.json()})
          .then((state_data) => {

                if (dist_name in state_data[state].districts)
                {
                    let details = state_data[state].districts[dist_name]
                    let longitude = details[0]
                    let latitude = details[1]

                    let data = dist[dist_name].total
            
                    map.on('load', function () {
            
                      var da = data.confirmed;
            
                      if (da > 11400) {
                        var colour = "#5d3fd3";
                      }
                      else if (da > 7800) {
                        var colour = "#00ff00";
                      }
                      else if (da > 3500) {
                        var colour = "#bdb742";
                      }
                      else if (da > 1000) {
                        var colour = "#2b9401";
                      }
                      else if (da > 400) {
                        var colour = "#c42929";
                      }
                      else if (da > 280) {
                        var colour = "#2ae860";
                      }
                      else if (da > 110) {
                        var colour = "#2ae8b8";
                      }
                      else if (da > 45) {
                        var colour = "#10a39c";
                      }
                      else {
                        var colour = "#ffc0cb";
                      }

                      // this part of code was used to form the data collection of state and district coordinates
                      // if (!(state in store)){
                      //   store = {...store, 
                      //             [`${state}`]: {"name": `${code_to_state_name[state]}`,
                      //                            "districts": {
                      //                                           [`${dist_name}`]: [`${longitude}`, `${latitude}`]
                      //                                         }
                      //                           }
                      //           }
                      // }
                      // else{

                      //   let d_store = (store[`${state}`])["districts"]

                      //   store = {...store,

                      //           [`${state}`]: {"name": `${code_to_state_name[state]}`,
                      //                           "districts": {
                      //                                           ...d_store,
                      //                                           [`${dist_name}`]: [`${longitude}`, `${latitude}`]
                      //                                        }
                      //                         }


                      //           }
                      // }
            
                      marker = new mapboxgl.Marker({
                        color: colour,
                        draggable: false,
                        scale: 0.6
            
                      }).setLngLat([longitude, latitude]).setPopup(new mapboxgl.Popup().setHTML(`<div>INFO</div><div><strong>State</strong>  :  ${state_data[state].name}</div>
                        <div><strong>District</strong>  :  ${dist_name}</div>
                        <div><strong>Confirmed</strong>  :  ${data.confirmed}</div>
                        <div><strong>Recovered</strong>  :  ${data.recovered}</div>
                        <div><strong>Active</strong>  :  ${data.deceased}</div>
                      `)).addTo(map);
            
                    })

              }
        })

      }

  }


    // content.forEach(element => {
    //   element.districtData.forEach(districtData => {
    //     fetch('https://raw.githubusercontent.com/dipayandas2002/udemy/main/exp/longlat.json')
    //       .then((response) => {
    //         return response.json()
    //       })
    //       .then((pos) => {

    //         // console.log(pos[2].District);

    //         pos.forEach(posElement => {
    //           // var index =  pos.indexOf(districtData.district)
    //           if (districtData.district == posElement.district) {

    //             map.on('load', function () {

    //               var da = districtData.active;

    //               if (da > 11400) {
    //                 var colour = "#5d3fd3";
    //               }
    //               else if (da > 7800) {
    //                 var colour = "#00ff00";
    //               }
    //               else if (da > 3500) {
    //                 var colour = "#bdb742";
    //               }
    //               else if (da > 1000) {
    //                 var colour = "#2b9401";
    //               }
    //               else if (da > 400) {
    //                 var colour = "#c42929";
    //               }
    //               else if (da > 280) {
    //                 var colour = "#2ae860";
    //               }
    //               else if (da > 110) {
    //                 var colour = "#2ae8b8";
    //               }
    //               else if (da > 45) {
    //                 var colour = "#10a39c";
    //               }
    //               else {
    //                 var colour = "#ffc0cb";
    //               }


    //               marker = new mapboxgl.Marker({
    //                 color: colour,
    //                 draggable: false,
    //                 scale: 0.6

    //               }).setLngLat([posElement.longitude, posElement.latitude])

    //                 .setPopup(new mapboxgl.Popup().setHTML(`<div>INFO</div><div><strong>State</strong>  :  ${element.state}</div>
    //                 <div><strong>District</strong>  :  ${districtData.district}</div>
    //                 <div><strong>Confirmed</strong>  :  ${districtData.confirmed}</div>
    //                 <div><strong>Recovered</strong>  :  ${districtData.recovered}</div>
    //                 <div><strong>Active</strong>  :  ${districtData.active}</div>
    //                 `))
    //                 .addTo(map);

    //             })

    //           }


    //         })

    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       })
    //   })
    // })



  })