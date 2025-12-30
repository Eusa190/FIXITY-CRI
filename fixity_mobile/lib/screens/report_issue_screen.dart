import 'dart:io';
import 'package:fixity_mobile/models/issue.dart';
import 'package:fixity_mobile/services/api_service.dart';
import 'package:fixity_mobile/theme/colors.dart';
import 'package:fixity_mobile/theme/typography.dart';
import 'package:fixity_mobile/widgets/primary_button.dart';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:image_picker/image_picker.dart';

class ReportIssueScreen extends StatefulWidget {
  const ReportIssueScreen({super.key});

  @override
  State<ReportIssueScreen> createState() => _ReportIssueScreenState();
}

class _ReportIssueScreenState extends State<ReportIssueScreen> {
  final _descriptionController = TextEditingController();

  // Location Data
  String _selectedState = "Odisha";
  String? _selectedDistrict = "Khordha";
  String? _selectedBlock = "Bhubaneswar Ward 19";
  // Default to Bhubaneswar coordinates for demo consistency
  double? _latitude = 20.2961;
  double? _longitude = 85.8245;
  bool _isGettingLocation = false;

  // Form selections
  String _selectedCategory = "Road Hazard";
  String _locationContext = "Residential";
  File? _image;
  bool _isLoading = false;

  final ApiService _apiService = ApiService();

  final List<Map<String, dynamic>> _categories = [
    {'name': 'Road Hazard', 'icon': Icons.construction},
    {'name': 'Sanitation', 'icon': Icons.delete_outline},
    {'name': 'Lighting', 'icon': Icons.lightbulb_outline},
    {'name': 'Water Supply', 'icon': Icons.water_drop_outlined},
    {'name': 'Traffic', 'icon': Icons.traffic_outlined},
    {'name': 'Other', 'icon': Icons.warning_amber_rounded},
  ];

  final List<Map<String, dynamic>> _contexts = [
    {'name': 'Residential', 'icon': Icons.home_outlined},
    {'name': 'School Zone', 'icon': Icons.school_outlined},
    {'name': 'Hospital', 'icon': Icons.local_hospital_outlined},
    {'name': 'Highway', 'icon': Icons.add_road},
    {'name': 'Market', 'icon': Icons.storefront},
  ];

  // Odisha Districts & Blocks (Complete List of 30 Districts)
  // Odisha Districts & Blocks (Synced with Website index.ts)
  final Map<String, List<String>> _odishaLocations = {
    'Angul': ['Angul', 'Talcher', 'Pallahara', 'Chhendipada', 'Athamallik'],
    'Balangir': [
      'Balangir',
      'Titlagarh',
      'Patnagarh',
      'Kantabanji',
      'Saintala',
    ],
    'Balasore': ['Balasore', 'Soro', 'Jaleswar', 'Nilagiri', 'Remuna'],
    'Bargarh': ['Bargarh', 'Padampur', 'Attabira', 'Sohela', 'Barpali'],
    'Bhadrak': ['Bhadrak', 'Basudevpur', 'Dhamnagar', 'Chandbali', 'Bonth'],
    'Bhubaneswar': [
      'Bhubaneswar Ward 1',
      'Bhubaneswar Ward 5',
      'Bhubaneswar Ward 12',
      'Bhubaneswar Ward 19',
      'Bhubaneswar Ward 20',
      'Bhubaneswar Ward 25',
      'Saheed Nagar',
      'Nayapalli',
      'Chandrasekharpur',
      'Patia',
      'Old Town',
    ],
    'Boudh': ['Boudh', 'Kantamal', 'Harabhanga'],
    'Cuttack': [
      'Cuttack Ward 1',
      'Cuttack Ward 7',
      'Cuttack Ward 15',
      'CDA Sector 6',
      'Chauliaganj',
      'Badambadi',
      'Ranihat',
      'Bidanasi',
      'Tulsipur',
      'Link Road',
    ],
    'Deogarh': ['Deogarh', 'Barkote', 'Reamal'],
    'Dhenkanal': ['Dhenkanal', 'Kamakhyanagar', 'Hindol', 'Bhuban', 'Gondia'],
    'Gajapati': ['Paralakhemundi', 'Mohana', 'R.Udayagiri', 'Kashi Nagar'],
    'Ganjam': [
      'Chatrapur',
      'Berhampur (Sadar)',
      'Bhanjanagar',
      'Aska',
      'Hinjilicut',
      'Gopalpur',
    ],
    'Jagatsinghpur': ['Jagatsinghpur', 'Paradeep', 'Tirtol', 'Raghunathpur'],
    'Jajpur': ['Jajpur', 'Vyasanagar', 'Binjharpur', 'Dharmasala', 'Sukinda'],
    'Jharsuguda': ['Jharsuguda', 'Brajarajnagar', 'Belpahar', 'Lakhanpur'],
    'Kalahandi': ['Bhawanipatna', 'Dharamgarh', 'Junagarh', 'Kesinga'],
    'Kandhamal': ['Phulbani', 'Baliguda', 'G.Udayagiri', 'Raikia'],
    'Kendrapara': ['Kendrapara', 'Pattamundai', 'Aul', 'Rajnagar'],
    'Keonjhar': ['Keonjhar', 'Anandapur', 'Champua', 'Barbil', 'Joda'],
    'Khordha': [
      'Bhubaneswar Ward 1',
      'Bhubaneswar Ward 5',
      'Bhubaneswar Ward 12',
      'Bhubaneswar Ward 19',
      'Bhubaneswar Ward 20',
      'Bhubaneswar Ward 25',
      'Saheed Nagar',
      'Nayapalli',
      'Chandrasekharpur',
      'Patia',
      'Old Town',
    ],
    'Koraput': ['Koraput', 'Jeypore', 'Sunabeda', 'Semiliguda', 'Kotpad'],
    'Malkangiri': ['Malkangiri', 'Balimela', 'Kalimela', 'Mathili'],
    'Mayurbhanj': ['Baripada', 'Rairangpur', 'Udala', 'Karanjia', 'Betnoti'],
    'Nabarangpur': ['Nabarangpur', 'Umerkote', 'Raighar', 'Dabugam'],
    'Nayagarh': ['Nayagarh', 'Odagaon', 'Ranpur', 'Khandapada', 'Dasapalla'],
    'Nuapada': ['Nuapada', 'Khariar', 'Komna', 'Sinapali'],
    'Puri': [
      'Grand Road',
      'Sea Beach',
      'Talabania',
      'Chakra Tirtha',
      'Swargadwar',
    ],
    'Rayagada': ['Rayagada', 'Gunupur', 'Bissam Cuttack', 'Muniguda'],
    'Rourkela': [
      'Civil Township',
      'Sector 19',
      'Chhend',
      'Koel Nagar',
      'Panposh',
    ],
    'Sambalpur': ['Sambalpur', 'Hirakud', 'Burla', 'Rairakhol', 'Kuchinda'],
    'Subarnapur': ['Sonepur', 'Binka', 'Tarbha', 'Dunguripali'],
    'Sundargarh': [
      'Sundargarh',
      'Rourkela',
      'Rajgangpur',
      'Biramitrapur',
      'Bonai',
    ],
  };

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
  }

  Future<void> _getCurrentLocation() async {
    setState(() => _isGettingLocation = true);
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Location services are disabled.');
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw Exception('Location permissions are denied');
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw Exception('Location permissions are permanently denied');
      }

      Position position = await Geolocator.getCurrentPosition();
      if (mounted) {
        setState(() {
          _latitude = position.latitude;
          _longitude = position.longitude;
          _isGettingLocation = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isGettingLocation = false);
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text("GPS Error: ${e.toString()}")));
      }
    }
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(source: source);
      if (pickedFile != null) {
        setState(() {
          _image = File(pickedFile.path);
        });
      }
    } catch (e) {
      // ignore
    }
  }

  void _submit() async {
    if (_image == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Evidence photo is required")),
      );
      return;
    }
    if (_latitude == null || _longitude == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Location is required. Please enable GPS."),
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final issue = Issue(
        category: _selectedCategory,
        imagePath: _image!.path,
        latitude: _latitude!,
        longitude: _longitude!,
        description: _descriptionController.text,
        state: _selectedState,
        district: _selectedDistrict,
        block: _selectedBlock,
        locationContext: _locationContext.toLowerCase(),
      );

      await _apiService.submitIssue(issue);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("Risk Signal Submitted!"),
            backgroundColor: FixityColors.riskSafe,
          ),
        );

        // Clear form
        setState(() {
          _image = null;
          _descriptionController.clear();
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Submission failed: ${e.toString()}"),
            backgroundColor: FixityColors.riskCritical,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: FixityColors.surface, // Clean white like design
      appBar: AppBar(
        title: const Text("New Risk Signal"),
        centerTitle: false,
        backgroundColor: FixityColors.surface,
        elevation: 0,
        actions: [
          IconButton(onPressed: () {}, icon: const Icon(Icons.info_outline)),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 10, 20, 120),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Report Civic Incident", style: FixityTypography.h2),
            const SizedBox(height: 4),
            Text(
              "Submissions are verified against the Civic Risk Index.",
              style: FixityTypography.body.copyWith(
                color: FixityColors.textMuted,
                fontSize: 13,
              ),
            ),

            const SizedBox(height: 32),

            // 1. INCIDENT CATEGORY GRID
            _buildSectionHeader("INCIDENT CATEGORY"),
            const SizedBox(height: 16),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.0,
              ),
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                final cat = _categories[index];
                final isSelected = _selectedCategory == cat['name'];
                return GestureDetector(
                  onTap: () => setState(() => _selectedCategory = cat['name']),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSelected ? Colors.black : Colors.white,
                      border: Border.all(
                        color: isSelected
                            ? Colors.black
                            : FixityColors.borderSubtle,
                      ),
                      borderRadius: BorderRadius.circular(
                        4,
                      ), // Square-ish look like reference
                      boxShadow: isSelected
                          ? []
                          : [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.02),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                    ),
                    child: Stack(
                      children: [
                        Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                cat['icon'],
                                color: isSelected
                                    ? FixityColors.brandHighVis
                                    : FixityColors.textSecondary,
                                size: 28,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                cat['name'].toString().toUpperCase(),
                                style: FixityTypography.small.copyWith(
                                  color: isSelected
                                      ? Colors.white
                                      : FixityColors.textSecondary,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),
                        if (isSelected)
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Container(
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(
                                color: FixityColors.brandHighVis,
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),

            const SizedBox(height: 32),

            // 2. IMPACT CONTEXT CHIPS
            _buildSectionHeader("IMPACT CONTEXT"),
            const SizedBox(height: 12),
            SizedBox(
              height: 40,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _contexts.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final ctx = _contexts[index];
                  final isSelected = _locationContext == ctx['name'];
                  return GestureDetector(
                    onTap: () => setState(() => _locationContext = ctx['name']),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: isSelected ? FixityColors.primary : Colors.white,
                        border: Border.all(
                          color: isSelected
                              ? FixityColors.primary
                              : FixityColors.borderSubtle,
                        ),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      alignment: Alignment.center,
                      child: Row(
                        children: [
                          Icon(
                            ctx['icon'],
                            size: 16,
                            color: isSelected
                                ? Colors.white
                                : FixityColors.textSecondary,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            ctx['name'].toString().toUpperCase(),
                            style: FixityTypography.small.copyWith(
                              color: isSelected
                                  ? Colors.white
                                  : FixityColors.textSecondary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 32),

            // 3. LOCATION & EVIDENCE (SIDE BY SIDE or Stacked?)
            // Design mocks show Location left, Evidence right (Desktop). Mobile we stack.

            // LOCATION
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                border: Border.all(color: FixityColors.borderSubtle),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionHeader(
                    "LOCATION",
                    icon: Icons.location_on_outlined,
                  ),
                  const SizedBox(height: 16),

                  // State
                  _buildLabel("STATE"),
                  _buildDropdown(
                    ["Odisha", "Maharashtra", "Delhi", "Karnataka"],
                    _selectedState,
                    (v) => setState(() {
                      _selectedState = v!;
                      // Reset district/block on state change
                      if (_selectedState == "Odisha") {
                        _selectedDistrict = "Khordha";
                        _selectedBlock = "Bhubaneswar";
                      } else {
                        _selectedDistrict = null;
                        _selectedBlock = null;
                      }
                    }),
                    hint: "Select State",
                  ),
                  const SizedBox(height: 12),

                  // District
                  _buildLabel("DISTRICT"),
                  _buildDropdown(
                    _selectedState == "Odisha"
                        ? (_odishaLocations.keys.toList()..sort())
                        : ["Pune", "Mumbai", "Nagpur", "Bangalore"],
                    _selectedDistrict,
                    (v) => setState(() {
                      _selectedDistrict = v;
                      _selectedBlock = null; // Reset block on district change
                      // Auto-select first block? optional.
                      if (_selectedState == "Odisha" &&
                          v != null &&
                          _odishaLocations[v]?.isNotEmpty == true) {
                        _selectedBlock = _odishaLocations[v]!.first;
                      }
                    }),
                    hint: "Select District",
                  ),
                  const SizedBox(height: 12),

                  // Block
                  _buildLabel("BLOCK / WARD"),
                  _buildDropdown(
                    (_selectedState == "Odisha" && _selectedDistrict != null)
                        ? (_odishaLocations[_selectedDistrict] ?? [])
                        : [
                            "Saheed Nagar",
                            "Patia",
                            "Wakad",
                            "Indiranagar",
                            "Aundh",
                          ],
                    _selectedBlock,
                    (v) => setState(() => _selectedBlock = v),
                    hint: "Select Block/Ward",
                  ),
                  const SizedBox(height: 16),

                  // GPS Button
                  InkWell(
                    onTap: _getCurrentLocation,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: FixityColors.borderSubtle,
                          style: BorderStyle.solid,
                        ), // dashed logic tricky in flutter vanilla, keep solid
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          _isGettingLocation
                              ? const SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Icon(
                                  Icons.my_location,
                                  size: 18,
                                  color: FixityColors.textPrimary,
                                ),
                          const SizedBox(width: 8),
                          Text(
                            _latitude == null
                                ? "DETECT PRECISE GPS"
                                : "${_latitude!.toStringAsFixed(4)}, ${_longitude!.toStringAsFixed(4)}",
                            style: FixityTypography.small.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // EVIDENCE UPLOAD
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                border: Border.all(color: FixityColors.borderSubtle),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionHeader("EVIDENCE", icon: Icons.upload_file),
                  const SizedBox(height: 16),
                  GestureDetector(
                    onTap: () {
                      // Show picker
                      showModalBottomSheet(
                        context: context,
                        builder: (_) => SafeArea(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              ListTile(
                                leading: const Icon(Icons.camera),
                                title: const Text('Camera'),
                                onTap: () {
                                  Navigator.pop(context);
                                  _pickImage(ImageSource.camera);
                                },
                              ),
                              ListTile(
                                leading: const Icon(Icons.image),
                                title: const Text('Gallery'),
                                onTap: () {
                                  Navigator.pop(context);
                                  _pickImage(ImageSource.gallery);
                                },
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                    child: Container(
                      height: 150,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: FixityColors.canvas,
                        border: Border.all(
                          color: FixityColors.borderSubtle,
                        ), // Dashed ideal
                        borderRadius: BorderRadius.circular(4),
                        image: _image != null
                            ? DecorationImage(
                                image: FileImage(_image!),
                                fit: BoxFit.cover,
                              )
                            : null,
                      ),
                      child: _image == null
                          ? Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.cloud_upload_outlined,
                                  size: 32,
                                  color: FixityColors.textMuted,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  "Click to upload",
                                  style: FixityTypography.small.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  "JPG, PNG (MAX 5MB)",
                                  style: FixityTypography.small.copyWith(
                                    color: FixityColors.textMuted,
                                    fontSize: 10,
                                  ),
                                ),
                              ],
                            )
                          : null,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildLabel("DESCRIPTION"),
                  TextField(
                    controller: _descriptionController,
                    maxLines: 3,
                    style: FixityTypography.body,
                    decoration: InputDecoration(
                      hintText: "Describe the issue...",
                      filled: true,
                      fillColor: FixityColors.canvas,
                      border: OutlineInputBorder(
                        borderSide: BorderSide.none,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      contentPadding: const EdgeInsets.all(12),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // SUBMIT BUTTON
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(4),
                  ),
                  elevation: 0,
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : Text(
                        "SUBMIT RISK SIGNAL",
                        style: FixityTypography.button.copyWith(
                          letterSpacing: 1.0,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, {IconData? icon}) {
    return Row(
      children: [
        if (icon != null) ...[
          Icon(icon, size: 16, color: FixityColors.primary),
          const SizedBox(width: 6),
        ],
        if (icon == null) ...[
          Container(width: 3, height: 14, color: FixityColors.primary),
          const SizedBox(width: 8),
        ],
        Text(
          title,
          style: FixityTypography.small.copyWith(
            fontWeight: FontWeight.bold,
            letterSpacing: 1.0,
          ),
        ),
      ],
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        text,
        style: FixityTypography.small.copyWith(
          fontSize: 10,
          fontWeight: FontWeight.bold,
          color: FixityColors.textSecondary,
        ),
      ),
    );
  }

  Widget _buildDropdown(
    List<String> items,
    String? value,
    Function(String?) onChanged, {
    String? hint,
  }) {
    // Ensure value is present in items or null
    final effectiveValue = items.contains(value) ? value : null;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: FixityColors.canvas,
        borderRadius: BorderRadius.circular(4),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: effectiveValue,
          isExpanded: true,
          menuMaxHeight: 300, // Enables scrolling for long lists
          dropdownColor: Colors.white,
          borderRadius: BorderRadius.circular(8),
          icon: const Icon(
            Icons.keyboard_arrow_down,
            color: FixityColors.textSecondary,
          ),
          hint: hint != null
              ? Text(
                  hint,
                  style: FixityTypography.body.copyWith(
                    color: FixityColors.textMuted,
                  ),
                )
              : null,
          items: items
              .map(
                (e) => DropdownMenuItem(
                  value: e,
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    physics: const BouncingScrollPhysics(), // Horizontal bounce
                    child: Text(e, style: FixityTypography.body),
                  ),
                ),
              )
              .toList(),
          onChanged: onChanged,
        ),
      ),
    );
  }
}
