import 'package:flutter/material.dart';

// Minimal scaffold for a pharmacist page in Flutter mobile client
class PharmacistPage extends StatelessWidget {
  const PharmacistPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pharmacy')),
      body: const Center(child: Text('Pharmacist dashboard scaffold — list pending prescriptions here')),
    );
  }
}
