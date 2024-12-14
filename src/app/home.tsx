import { View, Text, Alert } from 'react-native'
import { useEffect, useState } from 'react';
import MapView, { Callout, Marker } from 'react-native-maps';
import * as Location from 'expo-location'

import { api } from '@/services/api'

import { Places } from '@/components/places';
import { PlacesProps } from '@/components/place';
import { Categories, CategoriesProps } from '@/components/categories';
import { colors, fontFamily } from '@/styles/theme';
import { router } from 'expo-router';

type MarketsProps = PlacesProps & {
    latitude: number,
    longitude: number
}

const currentLocation = {
    latitude: -23.561187293883442,
    longitude: -46.656451388116494
}

export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps>([]);
    const [category, setCategory] = useState("");
    const [markets, setMarket] = useState<MarketsProps[]>([]);

    const [location, setLocation] = useState<Location.LocationObject>();

    async function fecthCategories() {
        try {
            const { data } = await api.get("/categories");
            setCategories(data)
            setCategory(data[0].id)
        } catch (error) {
            console.log(error)
            Alert.alert("Categorias", "Não foi possivel carregar as categorias");
        }
    }

    async function fectheMarkets() {
        try {
            if (!category)
                return

            const { data } = await api.get("/markets/category/" + category)
            setMarket(data)
        } catch (error) {
            console.log(error);
            Alert.alert("Locais", "Não foi possivel carregar os locais.");
        }
    }

    async function getCurrentLocation() {
        try {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if(granted) {
                const location = await Location.getCurrentPositionAsync();
                console.log(location)
                setLocation(location)
            }
        } catch (error) {
            
        }
    }

    useEffect(() => {
        getCurrentLocation()
        fecthCategories()
    }, [])

    useEffect(() => {
        fectheMarkets()
    }, [category])

    return (
        <View style={{ flex: 1, backgroundColor: colors.gray[300] }}>
            <Categories data={categories} onSelect={setCategory} selected={category} />

            <MapView style={{ flex: 1, minHeight: 700 }} 
            initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
            }}>
                <Marker
                    identifier='current'
                    coordinate={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude
                    }}
                    image={require("@/assets/location.png")}
                />
                {
                    markets.map((item) => (
                        <Marker
                            key={item.id}
                            identifier={item.id}
                            coordinate={{
                                latitude: item.latitude,
                                longitude: item.longitude
                            }}
                            image={require("@/assets/pin.png")}
                        >
                            <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
                                <View>
                                    <Text style={{ fontSize: 14, color: colors.gray[600], fontFamily: fontFamily.medium }}>{item.name}</Text>
                                    <Text style={{ fontSize: 13, color: colors.gray[600], fontFamily: fontFamily.regular }}>{item.address}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))
                }
            </MapView>

            <Places data={markets} />
        </View>
    )
}