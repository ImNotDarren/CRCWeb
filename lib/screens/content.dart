import 'package:flutter/material.dart';
import 'package:crc_web/globals.dart' as globals;

class ContentPage extends StatelessWidget {
  ContentPage({super.key});
  final Map user = globals.user;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: user['id'] == -1
          ? const Center(
              child: Text(''),
            )
          : const Text("2"),
    );
  }
}
