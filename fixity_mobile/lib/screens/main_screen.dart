import 'package:fixity_mobile/screens/cri_snapshot_screen.dart';
import 'package:fixity_mobile/screens/feed_screen.dart';
import 'package:fixity_mobile/screens/report_issue_screen.dart';
import 'package:fixity_mobile/widgets/custom_nav_bar.dart';
import 'package:flutter/material.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  late PageController _pageController;

  final List<Widget> _screens = [
    const CriSnapshotScreen(),
    const ReportIssueScreen(),
    const FeedScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _currentIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onPageChanged(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  void _onNavBarTap(int index) {
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Content Layer (PageView for swipe)
          Positioned.fill(
            child: PageView(
              controller: _pageController,
              onPageChanged: _onPageChanged,
              physics: const BouncingScrollPhysics(), // Nice bounce effect
              children: _screens,
            ),
          ),

          // Navbar Layer (Always Top)
          Align(
            alignment: Alignment.bottomCenter,
            child: SafeArea(
              child: CustomNavBar(
                currentIndex: _currentIndex,
                onTap: _onNavBarTap,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
