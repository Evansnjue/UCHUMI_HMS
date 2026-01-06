# Flutter Scaffold (Auth)

This folder provides a small scaffold for a Flutter login page.

lib/auth/login_page.dart (example):

```dart
import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  void _submit() {
    // call backend /auth/login and store JWT securely (flutter_secure_storage)
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(controller: _emailController, decoration: const InputDecoration(labelText: 'Email')),
            TextField(controller: _passwordController, decoration: const InputDecoration(labelText: 'Password'), obscureText: true),
            ElevatedButton(onPressed: _submit, child: const Text('Login')),
          ],
        ),
      ),
    );
  }
}
```

Security note: use secure storage and follow platform best practices for tokens and biometric unlock.
