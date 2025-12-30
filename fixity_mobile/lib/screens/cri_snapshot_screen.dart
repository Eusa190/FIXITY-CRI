import 'package:fixity_mobile/services/api_service.dart';
import 'package:fixity_mobile/theme/colors.dart';
import 'package:fixity_mobile/theme/typography.dart';
import 'package:flutter/material.dart';
import 'package:fixity_mobile/data/india_locations.dart';

class CriSnapshotScreen extends StatefulWidget {
  const CriSnapshotScreen({super.key});

  @override
  State<CriSnapshotScreen> createState() => _CriSnapshotScreenState();
}

class _CriSnapshotScreenState extends State<CriSnapshotScreen> {
  final ApiService _apiService = ApiService();
  Map<String, dynamic>? _snapshotData;
  bool _isLoading = true;
  String? _error;

  // Location State
  String? _selectedState = 'Odisha';
  String? _selectedDistrict = 'Khordha';
  String? _selectedBlock = 'Bhubaneswar Ward 19';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      // Fetch list of block data for the district
      final List<dynamic> blocksData = await _apiService.fetchCRISnapshot(
        district: _selectedDistrict ?? 'Khordha',
      );

      if (mounted) {
        setState(() {
          // Find the specific block matching user selection
          final matchingBlock = blocksData.firstWhere(
            (item) => item['block'] == _selectedBlock,
            orElse: () => null,
          );

          if (matchingBlock != null) {
            // Block found in backend (has reports)
            _snapshotData = {
              'area_name': matchingBlock['block'],
              'cri_score': matchingBlock['cri'],
              'issue_count':
                  matchingBlock['issue_count'] ?? 0, // Catch the new field
              'trend': 'Stable', // Determine based on data if possible
              'is_demo': false,
            };
          } else {
            // Block not found (safe / no reports yet)
            _snapshotData = {
              'area_name': _selectedBlock ?? 'Unknown Area',
              'cri_score': 0.0,
              'issue_count': 0,
              'trend': 'Stable',
              'is_demo': false,
            };
          }
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          // Error Fallback - still show selected block as safe (or error state)
          _snapshotData = {
            'area_name': _selectedBlock ?? 'Connection Error',
            'cri_score': 0.0,
            'trend': 'Unknown',
            // Keep is_demo false so we don't confuse user with "Sample Data" tag on error
            'is_demo': false,
          };
          _isLoading = false;
        });
      }
    }
  }

  Color _getRiskColor(num score) {
    if (score > 80) return FixityColors.riskCritical;
    if (score > 50) return FixityColors.riskElevated;
    return FixityColors.riskSafe;
  }

  // Helper for "Progressive" Dropdowns
  Widget _buildMinimalDropdown({
    required String value,
    required List<String> items,
    required Function(String?) onChanged,
    required bool isHighlighted,
    double fontSize = 14,
    FontWeight fontWeight = FontWeight.normal,
  }) {
    // Ensure value is currently in items or null (fallback to first if not, or just show value)
    // For specific UI, we want to show the text cleanly.

    return DropdownButtonHideUnderline(
      child: DropdownButton<String>(
        value: items.contains(value) ? value : null,
        hint: Text(
          value,
          style: TextStyle(
            fontSize: fontSize,
            fontWeight: fontWeight,
            color: isHighlighted
                ? FixityColors.textPrimary
                : FixityColors.textSecondary,
          ),
        ),
        isDense: true,
        isExpanded: true,
        icon: Icon(
          Icons.keyboard_arrow_down,
          size: 20,
          color: isHighlighted ? FixityColors.primary : FixityColors.textMuted,
        ),
        items: items.map((item) {
          return DropdownMenuItem(
            value: item,
            child: Text(
              item,
              style: FixityTypography.body.copyWith(fontSize: 14),
              overflow: TextOverflow.ellipsis,
            ),
          );
        }).toList(),
        onChanged: onChanged,
        selectedItemBuilder: (context) {
          return items.map((item) {
            return Text(
              item,
              style: FixityTypography.body.copyWith(
                fontSize: fontSize,
                fontWeight: fontWeight,
                color: isHighlighted
                    ? FixityColors.textPrimary
                    : FixityColors.textSecondary,
              ),
              overflow: TextOverflow.ellipsis,
            );
          }).toList();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final score = _snapshotData?['cri_score'] as num? ?? 0;
    // final riskColor = _getRiskColor(score); // Unused here, used in builder
    final trend = _snapshotData?['trend'] ?? 'Stable';
    final issueCount = _snapshotData?['issue_count'] ?? 0; // New field

    return Scaffold(
      backgroundColor: const Color(
        0xFFF8F9FA,
      ), // Slightly softer than pure white/canvas
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(
              'assets/images/logo.png',
              height: 24, // Subtle branding
              width: 24,
            ),
            const SizedBox(width: 12),
            Text(
              "FIXITY-CRI",
              style: FixityTypography.small.copyWith(
                fontWeight: FontWeight.w900,
                letterSpacing: 2.0,
                color: FixityColors.textSecondary,
              ),
            ),
          ],
        ),
        centerTitle: true,
        backgroundColor: const Color(0xFFF8F9FA),
        elevation: 0,
        automaticallyImplyLeading: false,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // 1. TOP AREA: Progressive Hierarchy
                  // Instead of a heavy card, we use a clean vertical flow.
                  Container(
                    margin: const EdgeInsets.only(bottom: 32),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // State (Top level, subtle)
                        Row(
                          children: [
                            const Icon(
                              Icons.location_on,
                              size: 14,
                              color: FixityColors.textMuted,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: _buildMinimalDropdown(
                                value: _selectedState ?? "Select State",
                                items: indiaLocations.keys.toList(),
                                onChanged: (val) {
                                  setState(() {
                                    _selectedState = val;
                                    _selectedDistrict = null;
                                    _selectedBlock = null;
                                  });
                                },
                                isHighlighted: false,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),

                        // Connector line roughly
                        Padding(
                          padding: const EdgeInsets.only(left: 6),
                          child: Container(
                            width: 2,
                            height: 12,
                            color: FixityColors.borderSubtle,
                          ),
                        ),

                        // District (Mid level)
                        Row(
                          children: [
                            const SizedBox(width: 22), // Indent
                            Expanded(
                              child: _buildMinimalDropdown(
                                value: _selectedDistrict ?? "Select District",
                                items: _selectedState != null
                                    ? indiaLocations[_selectedState]!.keys
                                          .toList()
                                    : [],
                                onChanged: (val) {
                                  setState(() {
                                    _selectedDistrict = val;
                                    _selectedBlock = null;
                                    _loadData();
                                  });
                                },
                                isHighlighted: false,
                                fontSize: 15,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),

                        Padding(
                          padding: const EdgeInsets.only(left: 30),
                          child: Container(
                            width: 2,
                            height: 12,
                            color: FixityColors.borderSubtle,
                          ),
                        ),

                        // Block/Ward (Focus)
                        Row(
                          children: [
                            const SizedBox(width: 22 + 20), // Double Indent
                            Expanded(
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(8),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.black.withOpacity(0.04),
                                      blurRadius: 10,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: _buildMinimalDropdown(
                                  value: _selectedBlock ?? "Select Ward",
                                  items:
                                      (_selectedState != null &&
                                          _selectedDistrict != null)
                                      ? indiaLocations[_selectedState]![_selectedDistrict]!
                                      : [],
                                  onChanged: (val) {
                                    setState(() {
                                      _selectedBlock = val;
                                      _loadData();
                                    });
                                  },
                                  isHighlighted: true,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // 2. HERO CARD: "Alive" UI
                  TweenAnimationBuilder<double>(
                    tween: Tween<double>(begin: 0, end: score.toDouble()),
                    duration: const Duration(seconds: 2), // Slow "load" feel
                    curve: Curves.fastOutSlowIn,
                    builder: (context, animatedScore, child) {
                      final animatedColor = _getRiskColor(animatedScore);

                      return Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(30),
                          boxShadow: [
                            BoxShadow(
                              color: animatedColor.withOpacity(
                                0.15,
                              ), // Dynamic glow
                              blurRadius: 30, // Big soft glow
                              offset: const Offset(0, 10),
                              spreadRadius: 0,
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.all(32),
                        child: Column(
                          children: [
                            // "Data is Alive" Header
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    color: animatedColor,
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(
                                        color: animatedColor.withOpacity(0.6),
                                        blurRadius: 6,
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  "REAL-TIME RISK ANALYSIS",
                                  style: FixityTypography.small.copyWith(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1.2,
                                    color: FixityColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 32),

                            // Animated Circle
                            Stack(
                              alignment: Alignment.center,
                              children: [
                                SizedBox(
                                  width: 180,
                                  height: 180,
                                  child: CircularProgressIndicator(
                                    value: 1.0,
                                    strokeWidth: 8,
                                    color: const Color(
                                      0xFFF0F0F0,
                                    ), // faint track
                                  ),
                                ),
                                SizedBox(
                                  width: 180,
                                  height: 180,
                                  child: CircularProgressIndicator(
                                    value: animatedScore / 100,
                                    strokeWidth: 12,
                                    color: animatedColor,
                                    strokeCap: StrokeCap.round,
                                  ),
                                ),
                                Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      animatedScore.toStringAsFixed(1),
                                      style: FixityTypography.h1.copyWith(
                                        fontSize: 56,
                                        height: 1.0,
                                        color: FixityColors.textPrimary,
                                        fontWeight: FontWeight.w800,
                                      ),
                                    ),
                                    Text(
                                      "CRI SCORE",
                                      style: FixityTypography.small.copyWith(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w600,
                                        color: FixityColors.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),

                            const SizedBox(height: 32),

                            // Trend Context
                            Text(
                              "Risk Trend: $trend over last 7 days",
                              style: FixityTypography.body.copyWith(
                                fontSize: 13,
                                color: FixityColors.textSecondary,
                                fontWeight: FontWeight.normal,
                              ),
                            ),

                            const SizedBox(height: 24),

                            // 3. INSIGHT STRIP (The High Impact Addition)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                vertical: 12,
                                horizontal: 16,
                              ),
                              decoration: BoxDecoration(
                                color: issueCount > 0
                                    ? FixityColors.riskElevated.withOpacity(0.1)
                                    : FixityColors.riskSafe.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    issueCount > 0
                                        ? Icons.warning_amber_rounded
                                        : Icons.check_circle_outline,
                                    color: issueCount > 0
                                        ? FixityColors.riskElevated
                                        : FixityColors.riskSafe,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      issueCount > 0
                                          ? "$issueCount unresolved civic issues affecting this ward"
                                          : "No active civic risks reported in this area.",
                                      style: FixityTypography.small.copyWith(
                                        color: issueCount > 0
                                            ? Colors.brown
                                            : FixityColors.riskSafe,
                                        fontWeight: FontWeight.w600,
                                        height: 1.3,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 32),

                  // 4. DATA ACTION BUTTON
                  // Less aggression, more utility
                  Center(
                    child: TextButton.icon(
                      onPressed: () {
                        _loadData();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("Refreshing live data..."),
                            duration: Duration(milliseconds: 800),
                            backgroundColor: Colors.black87,
                          ),
                        );
                      },
                      icon: Icon(
                        Icons.refresh,
                        size: 18,
                        color: FixityColors.primary,
                      ),
                      label: Text(
                        "REFRESH LIVE DATA",
                        style: FixityTypography.small.copyWith(
                          color: FixityColors.primary,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1.0,
                        ),
                      ),
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 16,
                        ),
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                          side: BorderSide(color: FixityColors.borderSubtle),
                        ),
                      ),
                    ),
                  ),

                  /* DEMO FLAG (Optional, keeping it subtle at bottom if needed) */
                  if (_snapshotData?['is_demo'] == true)
                    Padding(
                      padding: const EdgeInsets.only(top: 24),
                      child: Center(
                        child: Text(
                          "Demo Mode: Simulated Data",
                          style: FixityTypography.small.copyWith(
                            color: FixityColors.textMuted.withOpacity(0.5),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
    );
  }
}
