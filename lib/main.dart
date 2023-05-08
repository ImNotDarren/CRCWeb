import 'package:flutter/material.dart';
import 'package:crc_web/screens/home.dart';
import 'package:crc_web/theme/theme.dart' as theme;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: theme.theme,
      home: const HomePage(title: 'CRC Web'),
    );
  }
}
