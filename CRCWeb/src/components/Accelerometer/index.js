import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Accelerometer } from 'expo-sensors';

export default function AccelerometerComponent() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Subscribe to accelerometer updates
    Accelerometer.setUpdateInterval(5000);
    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
    });

    // Unsubscribe to the accelerometer updates when the component unmounts
    return () => subscription.remove();
  }, []);

  return (
    <View>
      <Text>Accelerometer:</Text>
      <Text>x: {data.x.toFixed(3)}</Text>
      <Text>y: {data.y.toFixed(3)}</Text>
      <Text>z: {data.z.toFixed(3)}</Text>
    </View>
  );
}