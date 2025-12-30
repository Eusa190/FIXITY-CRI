import 'package:fixity_mobile/services/api_service.dart';
import 'package:fixity_mobile/theme/colors.dart';
import 'package:fixity_mobile/theme/typography.dart';
import 'package:flutter/material.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<dynamic>> _feedFuture;

  @override
  void initState() {
    super.initState();
    _feedFuture = _apiService.fetchCommunityFeed();
  }

  Future<void> _refreshFeed() async {
    setState(() {
      _feedFuture = _apiService.fetchCommunityFeed();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FixityColors.canvas,
      appBar: AppBar(
        title: const Text("Community Feed"),
        centerTitle: true,
        backgroundColor: FixityColors.surface,
        elevation: 0,
        automaticallyImplyLeading: false,
      ),
      body: RefreshIndicator(
        onRefresh: _refreshFeed,
        color: FixityColors.primary,
        child: FutureBuilder<List<dynamic>>(
          future: _feedFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: CircularProgressIndicator(color: FixityColors.primary),
              );
            } else if (snapshot.hasError) {
              return Center(
                child: Text('Error loading feed: ${snapshot.error}'),
              );
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return Center(
                child: Text(
                  'No reports yet.',
                  style: FixityTypography.body.copyWith(
                    color: FixityColors.textMuted,
                  ),
                ),
              );
            }

            final issues = snapshot.data!;
            return ListView.builder(
              padding: const EdgeInsets.fromLTRB(24, 24, 24, 100),
              itemCount: issues.length,
              itemBuilder: (context, index) {
                final issue = issues[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: FixityColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: FixityColors.borderSubtle),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 12,
                            backgroundColor: FixityColors.primary.withOpacity(
                              0.1,
                            ),
                            child: const Icon(
                              Icons.person,
                              size: 14,
                              color: FixityColors.primary,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              "Report #${issue['id']}",
                              style: FixityTypography.small.copyWith(
                                color: FixityColors.textSecondary,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color:
                                  (issue['status'] == 'Resolved'
                                          ? FixityColors.riskSafe
                                          : FixityColors.riskCritical)
                                      .withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              issue['status'] ?? 'Pending',
                              style: FixityTypography.small.copyWith(
                                color: issue['status'] == 'Resolved'
                                    ? FixityColors.riskSafe
                                    : FixityColors.riskCritical,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        issue['title'] ?? 'Untitled Issue',
                        style: FixityTypography.h3.copyWith(fontSize: 16),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        issue['description'] ?? 'No description provided.',
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: FixityTypography.body.copyWith(
                          fontSize: 14,
                          color: FixityColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Location chip
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: FixityColors.canvas,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          "${issue['block'] ?? 'Unknown Block'}, ${issue['district'] ?? 'Unknown District'}",
                          style: FixityTypography.small.copyWith(
                            fontSize: 10,
                            color: FixityColors.textMuted,
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        issue['created_at'] != null
                            ? "Reported on ${issue['created_at'].toString().split('T')[0]}"
                            : "Just now",
                        style: FixityTypography.small.copyWith(
                          color: FixityColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                );
              },
            );
          },
        ),
      ),
    );
  }
}
