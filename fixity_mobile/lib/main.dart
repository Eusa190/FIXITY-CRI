import 'package:fixity_mobile/screens/main_screen.dart';
import 'package:fixity_mobile/screens/splash_screen.dart';
import 'package:fixity_mobile/theme/colors.dart';
import 'package:fixity_mobile/theme/typography.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(const FixityApp());
}

class FixityApp extends StatelessWidget {
  const FixityApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Fixity Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: FixityColors.surface,
        primaryColor: FixityColors.primary,
        colorScheme: ColorScheme.fromSeed(
          seedColor: FixityColors.primary,
          surface: FixityColors.surface,
        ),
        textTheme: TextTheme(
          displayLarge: FixityTypography.h1,
          displayMedium: FixityTypography.h2,
          displaySmall: FixityTypography.h3,
          bodyLarge: FixityTypography.body,
          bodyMedium: FixityTypography.body, // Default usually
          bodySmall: FixityTypography.small,
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: FixityColors.surface,
          foregroundColor: FixityColors.textPrimary,
          elevation: 0,
          centerTitle: true,
          titleTextStyle: FixityTypography.h3,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: FixityColors.primary,
            foregroundColor: Colors.white,
            textStyle: FixityTypography.button,
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            elevation: 0,
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: FixityColors.surface,
          contentPadding: const EdgeInsets.all(16),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: FixityColors.borderSubtle),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(color: FixityColors.borderSubtle),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: const BorderSide(
              color: FixityColors.textPrimary,
              width: 1.5,
            ),
          ),
          hintStyle: FixityTypography.body.copyWith(
            color: FixityColors.textMuted,
          ),
        ),
        // cardTheme: CardTheme(
        //   color: FixityColors.surface,
        //   elevation: 0,
        //   shape: RoundedRectangleBorder(
        //     borderRadius: BorderRadius.circular(12),
        //     side: const BorderSide(color: FixityColors.borderSubtle),
        //   ),
        // ),
      ),
      home: const SplashScreen(),
    );
  }
}
