import { YMaps, Map, Placemark } from 'react-yandex-maps';

const Maps = ({ longitude, latitude, style }) => {
    const coordinates = [latitude, longitude];
    const zoom = 16;

    return (
        <YMaps query={{ apikey: 'YOUR_API_KEY' }}>
            <Map defaultState={{ center: coordinates, zoom: zoom }} style={style}>
                <Placemark geometry={coordinates} />
            </Map>
        </YMaps>
    );
};

export default Maps;