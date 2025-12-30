import 'dart:async';
import 'package:fixity_mobile/screens/main_screen.dart';
import 'package:fixity_mobile/screens/report_issue_screen.dart';
import 'package:fixity_mobile/theme/colors.dart';
import 'package:fixity_mobile/theme/typography.dart';
import 'package:flutter/material.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    // Navigate after 2 seconds
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const MainScreen()),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FixityColors.surface, // Clean white background
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo placeholder
            const Icon(
              Icons.shield_outlined,
              size: 80,
              color: FixityColors.primary,
            ),
            const SizedBox(height: 24),
            Text("Fixity Mobile", style: FixityTypography.h1),
            const SizedBox(height: 8),
            Text(
              "Civic Risk Reporting",
              style: FixityTypography.body.copyWith(
                color: FixityColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
