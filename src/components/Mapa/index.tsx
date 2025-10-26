import React, { useState, useContext, useEffect, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import VendasContext from '@/context/VendasContext';
import DnaIcon from '../../../public/logoDNA.svg';
import MapImage from '@/images/map.png';
import Image from 'next/image';
import styles from './index.module.scss';
import Axios from 'axios';
interface Center {
    lat: number;
    lng: number
}

interface MapProps {
    url?: string
}

export default function Mapa({ url }: MapProps) {
    const { imovelMidas } = useContext(VendasContext);
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);

    //Google Maps
    const googleKey: string = "";
    let enderecoCompleto: string;

    if (imovelMidas.length > 0) {
        let rua: string = imovelMidas[0].tipo_logradouro + ' ' + imovelMidas[0].nome_logradouro;
        let numero: string = imovelMidas[0].numero;
        let bairro: string = imovelMidas[0].bairro_comercial;
        let municipio: string = imovelMidas[0].municipio;

        enderecoCompleto = numero + ', ' + rua + ', ' + bairro + ' - ' + municipio;
        geoCode();
    }

    async function geoCode() {

        //Geocode
        try {
            const response = await Axios.get('https://nominatim.openstreetmap.org/search?q=' + enderecoCompleto + '&format=geocodejson&limit=1');
            //console.log('geocode');
            //console.log(response);

            const location = response.data.features[0].geometry.coordinates;
            //console.log(location);

            setLatitude(location[1]);
            setLongitude(location[0]);
        } catch (error) {
            console.log('Erro ao acessar a API');
        }


        //Geocode Google Maps
        /*const address: string = await enderecoCompleto; // Insira o endereço desejado aqui
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
        }*/
    }

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [mapHeight, setMapHeight] = useState<number>(633);

    useEffect(() => {
        const handleResize = () => {
            if (mapContainerRef.current) {
                const containerHeight = mapContainerRef.current.clientHeight;
                setMapHeight(containerHeight > 633 ? containerHeight : 633);
            }
        };

        handleResize(); // Chamando a função inicialmente para definir a altura correta

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Maps
    const containerStyle = {
        width: '100%',
        maxWidth: '633px',
        height: mapHeight,
    };

    const center: Center = {
        lat: latitude,
        lng: longitude,
    };

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleKey || "AIzaSyCm40mS1oqk_yY-nuYO01S5rJQDj0ZgtGc"
    });

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return googleKey && isLoaded ? (
        <div className={styles.compMaps}>

            {
                // imovelMidas.length > 0
                //     ?
                //     <GoogleMap
                //         mapContainerStyle={containerStyle}
                //         center={center}
                //         zoom={19}
                //         onLoad={onLoad}
                //         onUnmount={onUnmount}
                //     >
                //         { /* Child components, such as markers, info windows, etc. */}

                //         <>
                //             <Marker
                //                 position={center}
                //             /*icon={{
                //                 url: DnaIcon,
                //                 scaledSize: new window.google.maps.Size(40, 40), // Tamanho personalizado do ícone
                //                 origin: new window.google.maps.Point(0, 0), // Ponto de origem do ícone
                //                 anchor: new window.google.maps.Point(20, 20) // Ponto de ancoragem do ícone
                //             }}*/
                //             />
                //         </>
                //     </GoogleMap>

                //     :
                    <Image
                        className={styles.imgMap}
                        src={MapImage}
                        alt="mapa"
                    />
            }
        </div>
    ) : <>
        <Image
            className={styles.imgMap}
            src={url || MapImage}
            alt="mapa"
            data-testid="img-map"
        />
    </>
}
