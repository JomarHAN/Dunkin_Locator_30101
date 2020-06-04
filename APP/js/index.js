var map;
var infoWindow;
var markers = []

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 33.753746, lng: -84.386330},
        zoom: 8
    });
    infoWindow = new google.maps.InfoWindow();

}

const onEnter = (e)=>{
    if (e.key=='Enter') {
        getStore()
    }
}

const getStore = ()=>{
    const URL = 'http://localhost:3000/api/dunkin'
    const zipCode = document.getElementById('zip-code').value;
    if(!zipCode) return;
    const fullUrl = `${URL}?zip_code=${zipCode}`
    fetch(fullUrl)
    .then((response)=>{
        if (response.status==200) {
            return response.json()
        }
    }).catch((error)=>{
        throw new Error(error)
    }).then((data)=>{
        if (data.length>0) {
            clearLocations()
            searchLocationNear(data)
            setStoresList(data)
            onClickStore()
        } else{
            clearLocations()
            noStoreFound()
        }
        
    })
}

const noStoreFound = ()=>{
    let html = `
    <div class="no-stores">
        <p>Oooppss</p>
        <span>No Stores Found</span>
    </div>
    `
    document.querySelector('.stores-list').innerHTML = html
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

const setStoresList = (stores)=>{
    let storeList = '';
    stores.forEach((store,index)=>{
        storeList += `
        <div class="store-conatiner">
            <div class="store-background">
                <div class="store-info-container">
                    <div class="store-address">
                        <span>${store.addressLine1}</span>
                        <span>${store.addressLine2}</span>
                    </div>
                    <div class="store-phone-number">
                        ${store.phone}
                    </div>
                </div>
                <div class="store-number">${index+1}</div>
            </div>  
        </div>
        `
    })
    document.querySelector('.stores-list').innerHTML = storeList
}

const onClickStore = ()=>{
    let storeElement = document.querySelectorAll('.store-conatiner');
    storeElement.forEach((elem,index)=>{
        elem.addEventListener('click',()=>{
            google.maps.event.trigger(markers[index], 'click')
        })
    })
}

const searchLocationNear = (stores)=>{
    var bounds = new google.maps.LatLngBounds();
    stores.forEach((store,index)=>{
        let latlng = new google.maps.LatLng(
            store.location.coordinates[1],
            store.location.coordinates[0]
        );
        let name =  store.name;
        let address1 = store.addressLine1;
        let address2 = store.addressLine2;
        let openStatus  = store.open;
        let phone = store.phone
       
        createMarker(latlng,name,address1,index,address2,openStatus,phone);
        bounds.extend(latlng);
        
    })
    map.fitBounds(bounds);
    
}

const createMarker = (latlng,name,address1,index,address2,openStatus,phone)=>{
    var html = `
    <div class="store-info">
        <div class="store-name">
            ${name}
        </div>
        <div class="open-status">
            ${openStatus}
        </div>
        <div class="location">
            <i class="fa fa-location-arrow"></i>
            <span>
                ${address1}
            </span>
        </div>
        <div class="telephone">
                <i class="fa fa-phone"></i>
            <span>
                <a href="tell:${phone}">${phone}</a>
            </span>
        </div>
    </div>
    `;
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: `${index+1}`
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
      });
      markers.push(marker);
}