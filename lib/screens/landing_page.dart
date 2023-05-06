import 'package:crc_web/widgets/role_cards.dart';
import 'package:flutter/material.dart';

var decoration = BoxDecoration(
    // border: Border.all(
    //   color: Colors.blue.shade200,
    //   width: 1.5,
    // ),
    color: Colors.white,
    boxShadow: [
      BoxShadow(
        color: Colors.grey.withOpacity(0.5),
        spreadRadius: 2,
        blurRadius: 5,
      ),
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
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  Container(
                    margin: const EdgeInsets.only(bottom: 20),
                    // width: MediaQuery.of(context).size.width,
                    decoration: decoration,
                    child: const Padding(
                      padding: EdgeInsets.all(15),
                      child: MyCard(
                        title: 'Patients',
                        content: [
                          'Patient Education: three learning modules, resources, assignments, evaluations',
                          'Surveys: 1 week, 8 weeks'
                        ],
                      ),
                    ),
                  ),
                  Container(
                    margin: const EdgeInsets.only(bottom: 20),
                    // width: MediaQuery.of(context).size.width,
                    decoration: decoration,
                    child: const Padding(
                      padding: EdgeInsets.all(15),
                      child: MyCard(
                        title: 'Caregivers',
                        content: [
                          'Caregiver Education',
                          'Family Involvement & support',
                          'Surveys: 1 week, 8 weeks'
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
