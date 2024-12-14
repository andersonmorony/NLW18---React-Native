import { useEffect, useRef, useState } from "react";
import { View, Text, Alert, Modal, StatusBar, ScrollView } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { useCameraPermissions, CameraView } from "expo-camera";

import { api } from "@/services/api";

import { Loading } from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { Details, PropsDetails } from "@/components/market/details";
import { Coupon } from "@/components/market/coupon";
import { Button } from "@/components/button";

type DataProps = PropsDetails & {
    cover: string
}

export default function Market() {
    const [data, setData] = useState<DataProps>();
    const [isLoading, setIsLoading] = useState(true);
    const [cupom, setCupom] = useState<string | null>(null);
    const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);
    const [cupomIsFetching, setCupomIsFetching] = useState(false);

    const [_, requestPermission] = useCameraPermissions()
    const params = useLocalSearchParams<{id: string}>()
    const qrLock = useRef(false)


    async function fecthMarket() {
        try {

            const { data } = await api.get("/markets/" + params.id)
            setData(data)
            setIsLoading(false)

        } catch (error) {
            console.log(error)
            Alert.alert("Error", "Não foi possivel carregar os dados", [
                { text: "OK", onPress: () => router.back() },
            ])
        }
    }

    async function handleOpenCamera(){
        try {
            const { granted } = await requestPermission();

            if (!granted) {
                return Alert.alert("Câmera","Você precisa habilitar o uso da câmera.")
            }
            qrLock.current = false;
            setIsVisibleCameraModal(true);
        } catch (error) {
            console.log(error)
             Alert.alert("Câmera","Não foi possivel habilitar a camera.")

        }
    }

    async function getCupom(id: string) {
        try {
            setCupomIsFetching(true)
            const { data } = await api.patch("/coupons/" + id);

            Alert.alert("Cupom", data.coupon)
            setCupom(data.coupon)
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Não foi possivel utilizar o cupom")
        } finally {
            setCupomIsFetching(false);
        }
    }

    function handleuseCupom(id: string) {
        setIsVisibleCameraModal(false);

        Alert.alert("Cupom", "Não é possivel reutilizar o cupom resgatado. Deseja realmente resgatar o cupom?",
            [
                { style: "cancel", text: "Não"},
                { text: "Sim", onPress: () => getCupom(id) }

            ]
        );
    }

    useEffect(() => {
        fecthMarket()
    },[params.id, cupom])


    if(isLoading) {
        return <Loading />
    }

    if(!data) {
        return <Redirect href={"/home"} />
    }

    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

            <ScrollView showsHorizontalScrollIndicator={false}>
                <Cover uri={data.cover} />
                <Details data={data} />
                { cupom && <Coupon code={cupom} /> }
            </ScrollView>
            <View style={{ padding:32 }}>
                <Button onPress={handleOpenCamera}>
                    <Button.Title> Ler QR Code</Button.Title>
                </Button>
            </View>

            <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
                <CameraView style={{flex: 1}}
                    facing="back"
                    onBarcodeScanned={({data}) => {
                        if(data && !qrLock.current) {
                            qrLock.current = true;
                            setTimeout(() => handleuseCupom(data), 500)
                        }
                    }}
                />
                <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
                    <Button onPress={() => setIsVisibleCameraModal(false)} isLoading={cupomIsFetching}>
                        <Button.Title>Voltar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}