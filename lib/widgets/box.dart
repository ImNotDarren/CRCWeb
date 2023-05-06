import 'package:flutter/material.dart';

class MyBox extends StatelessWidget {
  const MyBox({super.key, required this.title, required this.information});

  final String title;
  final List<String> information;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: (MediaQuery.of(context).size.width - 40) * 0.5,
        height: 100,
        decoration: BoxDecoration(
          border: Border.all(
            color: Colors.blue,
            width: 1.3,
          ),
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }
}
