import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:fixity_mobile/models/issue.dart';

class ApiService {
  // Use 10.0.2.2 for Android Emulator, or your LAN IP for real device
  // Current LAN IP: 10.107.61.242 (Updated: 2025-12-24)
  static const String baseUrl = 'http://10.89.186.242:8000/api';

  Future<void> submitIssue(Issue issue) async {
    final uri = Uri.parse('$baseUrl/mobile/report');

    final request = http.MultipartRequest('POST', uri);

    // Add fields
    request.fields.addAll(issue.toFields());

    // Add file
    // Note: In real app, check if file exists.
    // Here we assume path is valid from image picker.
    if (issue.imagePath.isNotEmpty) {
      request.files.add(
        await http.MultipartFile.fromPath('image', issue.imagePath),
      );
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to submit issue: ${response.body}');
    }
  }

  Future<List<dynamic>> fetchCRISnapshot({String district = 'Khordha'}) async {
    // Fetch data for the selected district
    final uri = Uri.parse('$baseUrl/get_cri_data/$district');

    try {
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        // Backend returns List<dynamic> (List of blocks)
        return json.decode(response.body);
      } else {
        throw Exception('Failed to load snapshot');
      }
    } catch (e) {
      // For demo resilience, if backend fails/unreachable, rethrow
      // so UI can handle error.
      rethrow;
    }
  }

  Future<List<dynamic>> fetchCommunityFeed() async {
    final uri = Uri.parse('$baseUrl/community_feed');
    try {
      final response = await http.get(uri);
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Failed to load feed');
      }
    } catch (e) {
      // Return empty list on error for resilience
      print('Error fetching feed: $e');
      return [];
    }
  }
}
