const axios = require('axios');
const geoUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

class googleServer{
    async getCoordinates(zipCode){
        let coordinates = [];
        await axios.get(geoUrl,{
            params:{
                address:zipCode,
                key:process.env.GOOGLE_API_KEY
            }
        }).then((response)=>{
            const data = response.data;
            coordinates=[
                data.results[0].geometry.location.lng,
                data.results[0].geometry.location.lat
            ]
        }).catch((err)=>{
            throw new Error(err)
        })
        return coordinates
    }
}

module.exports = googleServer