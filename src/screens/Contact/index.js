import { useSelector } from "react-redux";
import getStyles from "./style";
import { ScrollView, Text } from "react-native";
import RichText from "../../components/RichText";
import WhiteSpace from "../../components/WhiteSpace";

export default function ContactScreen({ navigation }) {
  
    const fontSize = useSelector((state) => state.font.fontSize);
    const styles = getStyles(fontSize);
  
    return (
      <ScrollView style={styles.container}>
        <Text style={[styles.title, { marginTop: 0 }]}>About Us</Text>
        <RichText text="We are cancer researchers from the Nell Hodgson Woodruff School of Nursing, School of Medicine, and the Winship Cancer Institute of Emory University. The project is funded by the Oncology Nursing Foundation (ONF2022RE03). We aim to conduct a clinical trial to assess the feasibility and acceptability of a web-based dyadic intervention to manage psychoneurological symptoms for patients with colorectal cancer receiving chemotherapy and their family caregivers." fontSize={18} />

        <Text style={styles.title}>Principal Investigator</Text>
        <RichText text="Yufen Lin, PhD, RN" fontSize={18} />

        <Text style={styles.title}>Investigator</Text>
        <RichText text={"Canhua Xiao, PhD, RN\nLaura S. Porter, PhD\nXiao Hu, PhD\nOlatunji B. Alese, MD\nKimberly A. Curseen, MD\nMelinda K. Higgins, PhD\nLaurel Northouse, PhD, RN"} fontSize={18} />

        <Text style={styles.title}>Software Engineers</Text>
        <RichText text={"Darren Liu\nDel Bold"} fontSize={18} />

        <Text style={styles.title}>Contact Number</Text>
        <RichText text={"(404) 251-4072"} fontSize={18} />

        <Text style={styles.title}>Contact Email</Text>
        <RichText text={"yufen.lin.470@gmail.com"} fontSize={18} />

        <WhiteSpace />
      </ScrollView>
    );
}