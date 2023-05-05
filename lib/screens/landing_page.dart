import 'package:flutter/material.dart';

var decoration = BoxDecoration(
    // border: Border.all(
    //   color: Colors.blue,
    //   width: 1.3,
    // ),
    color: Colors.white,
    boxShadow: [
      BoxShadow(
          color: Colors.grey.withOpacity(0.5), spreadRadius: 2, blurRadius: 5)
    ],
    borderRadius: BorderRadius.circular(10));

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 20),
            child: Column(
              children: <Widget>[
                // choose patient or caregivers
                Center(
                  child: Row(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Container(
                        width: (MediaQuery.of(context).size.width - 40) * 0.5,
                        height: 200,
                        decoration: decoration,
                      ),
                    ],
                  ),
                ),
              ],
            )));
  }
}
