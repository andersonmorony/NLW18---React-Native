import { View, Text, Alert } from 'react-native'
import { useEffect, useState } from 'react';

import { api } from '@/services/api'

import { Places } from '@/components/places';
import { PlacesProps } from '@/components/place';
import { Categories, CategoriesProps } from '@/components/categories';
import { colors } from '@/styles/colors';

type MarketsProps = PlacesProps & {

}

export default function Home() {
    const [categories, setCategories] = useState<CategoriesProps>([]);
    const [category, setCategory] = useState("");
    const [markets, setMarket] = useState<MarketsProps[]>([]);

    async function fecthCategories() {
        try {
            const { data } = await  api.get("/categories");
            setCategories(data)
            setCategory(data[0].id)
        } catch (error) {
            console.log(error)
            Alert.alert("Categorias", "Não foi possivel carregar as categorias");
        }
    }

    async function fectheMarkets() {
        try {
            if(!category) 
                return

            const { data } = await api.get("/markets/category/" + category)
            setMarket(data)
        } catch (error) {
            console.log(error);
            Alert.alert("Locais", "Não foi possivel carregar os locais.");
        }
    }

    useEffect(() => {
        fecthCategories()
    }, [])

    useEffect(() => {
        fectheMarkets()
    }, [category])

    return (
        <View style={{ flex: 1, backgroundColor: colors.gray[300] }}>
            <Text>Home</Text>
            <Categories data={categories} onSelect={setCategory} selected={category} />
            <Places data={markets} />
        </View>
    )
}