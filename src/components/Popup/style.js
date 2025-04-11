import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  // topArea: {
  //   display: "flex",
  //   flexDirection: "row",
  //   width: "100%",
  //   alignItems: "flex-end",
  //   justifyContent: "flex-end",
  // },
  iconButton: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  childrenView: {
    padding: 20,
    maxHeight: 500,
  }
});

export default styles;