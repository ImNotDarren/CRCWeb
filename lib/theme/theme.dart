library crc_web.theme;
import 'package:flutter/material.dart';

final ThemeData theme = ThemeData(
    primarySwatch: Colors.blue,
    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    appBarTheme: const AppBarTheme(
      elevation: 0,
    ),
    cardTheme: CardTheme(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: EdgeInsets.zero,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ButtonStyle(
        elevation: MaterialStateProperty.all(0),
        shape: MaterialStateProperty.all(
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
        ),
      ),
    ),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      elevation: 0,
    ),
    textButtonTheme: TextButtonThemeData(
      style: ButtonStyle(
        elevation: MaterialStateProperty.all(0),
        shape: MaterialStateProperty.all(
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
        ),
      ),
    ),
    textTheme: const TextTheme(
      bodyLarge: TextStyle(
        // fontFamily: 'Open_Sans',
        fontSize: 35,
      ),
    ),
  );