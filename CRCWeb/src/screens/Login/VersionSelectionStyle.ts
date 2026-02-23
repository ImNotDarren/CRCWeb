import { StyleSheet } from 'react-native';

const versionColors = {
  background: '#0a0a0a',
  card: '#171717',
  cardBorder: '#262626',
  text: '#fafafa',
  textSecondary: '#a3a3a3',
  border: '#404040',
} as const;

export default StyleSheet.create({
  grid: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: 40,
    paddingVertical: '20%',
    backgroundColor: versionColors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    width: '100%',
    backgroundColor: versionColors.card,
    borderWidth: 1,
    borderColor: versionColors.cardBorder,
    marginBottom: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'column',
    padding: 20,
  },
  cellTitle: {
    fontSize: 35,
    color: versionColors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 18,
    color: versionColors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
  },
  addCell: {
    width: '100%',
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'column',
    padding: 20,
    borderColor: versionColors.border,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
});
