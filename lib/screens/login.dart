import 'package:flutter/material.dart';
import 'package:crc_web/globals.dart' as globals;

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';

  Color color = Colors.blue.shade900;

  @override
  Widget build(BuildContext context) {
    // debugPrint(globals.user['id'].toString());
    TextStyle textStyle = TextStyle(
      fontSize: 15,
      fontWeight: FontWeight.w500,
      color: color,
      decoration: TextDecoration.underline,
    );
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          color: color,
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(30),
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                SizedBox(
                  width: MediaQuery.of(context).size.width * 0.5,
                  child: Text(
                    'Login to CRC Web',
                    textAlign: TextAlign.start,
                    style: TextStyle(
                      fontSize: 35,
                      fontWeight: FontWeight.w900,
                      color: color,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 50),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        TextFormField(
                          decoration: const InputDecoration(
                            labelText: 'Email',
                          ),
                          validator: (value) {
                            RegExp regex = RegExp(
                                r'^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
                            if (value == null || value.isEmpty) {
                              return 'Please enter your email';
                            } else if (!regex.hasMatch(value)) {
                              return 'Please enter a valid email';
                            }
                            return null;
                          },
                          onSaved: (value) {
                            _email = value ?? '';
                          },
                        ),
                        const SizedBox(height: 16.0),
                        TextFormField(
                          obscureText: true,
                          decoration: const InputDecoration(
                            labelText: 'Password',
                          ),
                          validator: (value) {
                            RegExp regex = RegExp(
                                r'^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
                            if (value == null || value.isEmpty) {
                              return 'Please enter your password';
                            } else if (!regex.hasMatch(value)) {
                              return 'Incorrect password';
                            }
                            return null;
                          },
                          onSaved: (value) {
                            _password = value ?? '';
                          },
                        ),
                        const SizedBox(height: 16.0),
                        Padding(
                          padding: const EdgeInsets.only(top: 50),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              // GestureDetector(
                              //   onTap: () {
                              //     // register function
                              //     debugPrint('register');
                              //   },
                              //   child: Text(
                              //     'register',
                              //     style: textStyle,
                              //   ),
                              // ),
                              GestureDetector(
                                onTap: () {
                                  // forgot password function
                                  debugPrint('forgot password');
                                },
                                child: Text(
                                  'Forgot password',
                                  style: textStyle,
                                ),
                              ),
                              ElevatedButton(
                                style: ButtonStyle(
                                  backgroundColor:
                                      MaterialStateProperty.all<Color>(
                                          Colors.transparent),
                                ),
                                onPressed: () {},
                                child: FloatingActionButton(
                                  backgroundColor: color,
                                  child: const Icon(Icons.arrow_forward),
                                  onPressed: () {
                                    if (_formKey.currentState != null &&
                                        _formKey.currentState!.validate()) {
                                      _formKey.currentState!.save();
                                      // Perform sign in logic here
                                      debugPrint('sign in');
                                    }
                                  },
                                ),
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ],
            ),
            // Positioned(
            //   bottom: 0,
            //   left: 0,
            //   right: 0,
            //   child: Row(
            //     mainAxisAlignment: MainAxisAlignment.spaceBetween,
            //     children: [
            //       Text(
            //         'Sign in',
            //         style: TextStyle(
            //           fontSize: 18,
            //           fontWeight: FontWeight.bold,
            //           color: color,
            //         ),
            //       ),
            //       Text(
            //         'Forgot password',
            //         style: TextStyle(
            //           fontSize: 18,
            //           fontWeight: FontWeight.bold,
            //           color: color,
            //         ),
            //       ),
            //     ],
            //   ),
            // ),
          ],
        ),
      ),
    );
  }
}
