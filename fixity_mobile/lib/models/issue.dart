class Issue {
  final String category;
  final String imagePath;
  final double latitude;
  final double longitude;
  final String description;
  final String? state;
  final String? district;
  final String? block;
  final String? locationContext;

  Issue({
    required this.category,
    required this.imagePath,
    required this.latitude,
    required this.longitude,
    required this.description,
    this.state,
    this.district,
    this.block,
    this.locationContext,
  });

  Map<String, String> toFields() {
    return {
      'category': category,
      'latitude': latitude.toString(),
      'longitude': longitude.toString(),
      'description': description,
      'state': state ?? '',
      'district': district ?? '',
      'block': block ?? '',
      'location_context': locationContext ?? '',
    };
  }
}
