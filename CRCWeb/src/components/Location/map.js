// import React, { useEffect, useRef } from 'react';
// import { View, Dimensions } from 'react-native';
// import MapView, { Polyline } from 'react-native-maps';
// import colors from '../../../theme/colors';

// export default function CustomMapView({ locations }) {

//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (mapRef.current && locations.length > 0) {
//       mapRef.current.fitToCoordinates(locations.map(loc => ({ latitude: loc.latitude, longitude: loc.longitude })), {
//         edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
//         animated: true,
//       });
//     }
//   }, [locations]);

//   return (
//     <View style={{ flex: 1 }}>
//       <MapView
//         ref={mapRef}
//         style={{
//           // width: Dimensions.get('window').width,
//           height: Dimensions.get('window').height * 0.6,
//           marginTop: 20
//         }}
//       >
//         <Polyline
//           coordinates={locations.map(loc => ({ latitude: loc.latitude, longitude: loc.longitude }))}
//           strokeWidth={5}
//           strokeColor={colors.blue[300]}
//         />
//       </MapView>
//     </View>
//   )
// }