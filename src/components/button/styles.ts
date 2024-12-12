import { StyleSheet } from "react-native"
import { colors, fontFamily } from "@/styles/theme"

export const s = StyleSheet.create({
    container: {
        height: 56,
        maxHeight: 56,
        backgroundColor: colors.green.base,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 14
    },
    title: {
        color: colors.gray[100],
        fontFamily: fontFamily.semiBold,
        fontSize: 16
    },
    loadingMessage: {
        flex: 1,
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
        justifyContent: "center",
        color: colors.gray[100],
    }
})