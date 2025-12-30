import 'package:fixity_mobile/theme/colors.dart';
import 'package:fixity_mobile/theme/typography.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // For Haptics
import 'dart:ui' as ui;

class CustomNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const CustomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
      child: Material(
        elevation: 8,
        shadowColor: Colors.black.withOpacity(0.15), // Softer shadow
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(40),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(40),
          child: BackdropFilter(
            filter: ui.ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(
              height: 60, // Fixed height for segmented feel
              padding: const EdgeInsets.all(4), // Padding for the "track"
              decoration: BoxDecoration(
                color: FixityColors.surface.withOpacity(0.90),
                borderRadius: BorderRadius.circular(40),
                border: Border.all(
                  color: Colors.white.withOpacity(0.5),
                  width: 1,
                ),
              ),
              child: Stack(
                children: [
                  // LAYER 1: The Sliding "Pill" (Active Indicator)
                  AnimatedAlign(
                    alignment: Alignment(
                      -1.0 +
                          (currentIndex * 1.0), // -1, 0, 1 for indices 0, 1, 2
                      0,
                    ),
                    duration: const Duration(
                      milliseconds: 250,
                    ), // Premium Glide
                    curve: Curves.easeOutCubic, // Mature easing, no bounce
                    child: FractionallySizedBox(
                      widthFactor: 0.33,
                      heightFactor: 1.0,
                      child: Container(
                        decoration: BoxDecoration(
                          color: const Color(
                            0xFF222831,
                          ), // Dark Charcoal (Not pitch black)
                          borderRadius: BorderRadius.circular(30),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),

                  // LAYER 2: The Clickable Labels
                  Row(
                    children: [
                      _buildNavItem(0, "Live Map"),
                      _buildNavItem(1, "Report"),
                      _buildNavItem(2, "Feed"),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, String label) {
    final bool isSelected = currentIndex == index;

    return Expanded(
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () {
          HapticFeedback.lightImpact(); // Subtle physical response
          onTap(index);
        },
        child: Center(
          child: AnimatedDefaultTextStyle(
            duration: const Duration(milliseconds: 200),
            style: FixityTypography.body.copyWith(
              color: isSelected ? Colors.white : FixityColors.textSecondary,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
              fontSize: 13,
            ),
            child: Text(label, textAlign: TextAlign.center, softWrap: false),
          ),
        ),
      ),
    );
  }
}
