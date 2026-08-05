import {View, Text} from 'react-native'
import { styled } from "nativewind"
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Vault = () => {
    return (
        <SafeAreaView>
            <Text>Vault</Text>
        </SafeAreaView>
    )
}
export default Vault
