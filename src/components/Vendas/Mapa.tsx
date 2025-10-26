import React, { useState, useContext } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import VendasContext from '@/context/VendasContext';
import DnaIcon from '../../../public/logoDNA.svg';
import MapImage from '@/images/base_mapa.png';
import Image from 'next/image';

interface Center {
    lat: number;
    lng: number
}

export default function Mapa() {

    const { imovelMidas } = useContext(VendasContext);

    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);

    console.log(imovelMidas);

    const googleKey: string = "AIzaSyCm40mS1oqk_yY-nuYO01S5rJQDj0ZgtGc";
    let enderecoCompleto: string;

    if (imovelMidas.length > 0) {
        let rua: string = imovelMidas[0].endereco_completo;
        let bairro: string = imovelMidas[0].bairro_comercial;
        let municipio: string = imovelMidas[0].municipio;

        enderecoCompleto = rua + ', ' + bairro + ' - ' + municipio;
        geoCode();
    }
    /*else{
        enderecoCompleto = 'Avenida Rio Branco, 114, Centro - Rio de Janeiro'
        geoCode();
    }*/

    //console.log(enderecoCompleto); 

    async function geoCode() {
        //Geocode
        const address: string = await enderecoCompleto; // Insira o endereço desejado aqui
        const geocodeUrl: any = await `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleKey}`;

        try {
            await fetch(geocodeUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'OK') {
                        const location = data.results[0].geometry.location;
                        console.log(location);

                        setLatitude(location.lat);
                        setLongitude(location.lng);

                        console.log('Latitude:', typeof (latitude));
                        console.log('Longitude:', typeof (longitude));
                    } else {
                        console.log('Não foi possível obter as coordenadas para o endereço fornecido.');
                    }
                })
                .catch(error => {
                    console.error('Ocorreu um erro:', error);
                });
        }
        catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
    }

    //Maps
    const containerStyle = {
        width: '100%',
        maxWidth: '600px',
        height: '600px'
    };

    const center: Center = {
        lat: latitude,
        lng: longitude,
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleKey
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map: any) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map);        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null);
    }, [])

    return isLoaded ? (
        <div className="comp-maps">

            {
                (imovelMidas.length > 0 && imovelMidas[0].referencia !== "NTAP22978")
                    ?
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={18}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                    >
                        { /* Child components, such as markers, info windows, etc. */}
                        <Marker
                            position={center}
                            icon={{
                                url: DnaIcon,
                                scaledSize: new window.google.maps.Size(40, 40), // Tamanho personalizado do ícone
                                origin: new window.google.maps.Point(0, 0), // Ponto de origem do ícone
                                anchor: new window.google.maps.Point(20, 20) // Ponto de ancoragem do ícone
                            }}
                        />
                        <></>
                    </GoogleMap>

                    :
                    <Image
                        className="img-map"
                        src={MapImage}
                        alt="mapa"
                    />
            }
        </div>
    ) : <>
        <Image
            className="img-map"
            src={MapImage}
            alt="mapa"
        />
    </>
}
