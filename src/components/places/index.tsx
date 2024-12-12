import { useRef } from 'react'
import {Text, useWindowDimensions } from 'react-native'
import {s} from "./styles"

import { Place, PlacesProps } from '../place'
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet'

type Props = {
    data: PlacesProps[]
}

export function Places({ data }: Props){
    const damensions = useWindowDimensions()
    const bottomSheetRef = useRef<BottomSheet>(null)

    const snapPoints = {
        min: 278,
        max: damensions.height - 228
    }

    return (
        <BottomSheet ref={bottomSheetRef} 
        snapPoints={[snapPoints.min, snapPoints.max]}
        handleIndicatorStyle={s.indicator}
        backgroundStyle={s.container}
        enableOverDrag={false} >
            <BottomSheetFlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <Place data={item} />}
                contentContainerStyle={s.content}
                ListHeaderComponent={() => (
                    <Text style={s.title}>Explote locais perto de você</Text>
                )}
                showsHorizontalScrollIndicator={false}
            />
        </BottomSheet>
    )
}