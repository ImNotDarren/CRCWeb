import 'package:flutter/material.dart';
import 'package:crc_web/widgets/role_cards.dart';
import 'package:crc_web/screens/login.dart';
import 'package:crc_web/globals.dart' as globals;

var decoration = BoxDecoration(
  color: Colors.white,
  borderRadius: BorderRadius.circular(10),
);

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
        child: Column(
          children: <Widget>[
            Visibility(
              visible: globals.user['id'] == -1,
              child: SizedBox(
                width: double
                    .infinity, // set the width to the maximum available width
                child: ElevatedButton(
                  onPressed: () {
                    // Do something when the button is pressed
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const LoginPage()),
                    );
                  },
                  child: const Text('LOGIN'),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 10),
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  Container(
                    margin: const EdgeInsets.only(bottom: 20),
                    // width: (MediaQuery.of(context).size.width - 40) * 0.5,
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
                    // width: (MediaQuery.of(context).size.width - 40) * 0.5,
                    decoration: decoration,
                    child: const Padding(
                      padding: EdgeInsets.all(15),
                      child: MyCard(
                        title: 'Caregivers',
                        content: [
                          'Caregiver Education',
                          'Family Involvement & suport',
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
