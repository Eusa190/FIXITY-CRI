// User types
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'citizen';
    is_verified: boolean;
    created_at: string;
    trust_score?: number;
}

export interface Authority {
    id: number;
    username: string;
    email: string;
    role: 'authority';
    state: string;
    district: string;
    block: string;
    department?: string;
    created_at: string;
}

export type CurrentUser = User | Authority | null;

// Issue types
export interface Issue {
    id: number;
    user_id: number;
    title: string;
    description: string;
    category: IssueCategory;
    latitude?: number;
    longitude?: number;
    image_path?: string;
    status: IssueStatus;
    severity_score: number;
    severity_level?: 'low' | 'medium' | 'high';
    location_context?: 'residential' | 'school' | 'hospital' | 'highway' | 'commercial';
    state?: string;
    district?: string;
    block?: string;
    created_at: string;
    user?: User;
}

export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved';

export type IssueCategory =
    | 'Pothole'
    | 'Garbage'
    | 'Street Light'
    | 'Water Leakage'
    | 'Traffic Violation'
    | 'Other';

// CRI Map types
export interface CRIData {
    block: string;
    cri: number;
    color: 'red' | 'orange' | 'green';
    lat: number;
    lng: number;
}

// Form types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface CitizenRegisterFormData {
    username: string;
    email: string;
    password: string;
    otp: string;
}

export interface AuthorityRegisterFormData {
    username: string;
    email: string;
    password: string;
    state: string;
    district: string;
    block: string;
}

export interface ReportFormData {
    title: string;
    description: string;
    category: IssueCategory;
    latitude?: number;
    longitude?: number;
    state: string;
    district: string;
    block: string;
    image?: File;
}

// API Response types
export interface ApiResponse<T = unknown> {
    message?: string;
    error?: string;
    redirect?: string;
    success?: boolean;
    data?: T;
}

// Location hierarchy - All Indian States and Union Territories
export const STATES = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    // Union Territories
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry',
] as const;

export const DISTRICTS: Record<string, string[]> = {
    'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
    'Arunachal Pradesh': ['Anjaw', 'Changlang', 'East Kameng', 'East Siang', 'Itanagar', 'Lohit', 'Papum Pare', 'Tawang', 'Tirap', 'West Kameng', 'West Siang'],
    'Assam': ['Barpeta', 'Bongaigaon', 'Cachar', 'Darrang', 'Dhubri', 'Dibrugarh', 'Goalpara', 'Guwahati', 'Jorhat', 'Kamrup', 'Nagaon', 'Sivasagar', 'Sonitpur', 'Tinsukia'],
    'Bihar': ['Araria', 'Aurangabad', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Darbhanga', 'Gaya', 'Gopalganj', 'Muzaffarpur', 'Nalanda', 'Patna', 'Purnia', 'Samastipur', 'Saran', 'Vaishali'],
    'Chhattisgarh': ['Balod', 'Baloda Bazar', 'Bastar', 'Bilaspur', 'Durg', 'Janjgir-Champa', 'Korba', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Surguja'],
    'Goa': ['North Goa', 'South Goa'],
    'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Gandhinagar', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mehsana', 'Patan', 'Rajkot', 'Surat', 'Vadodara', 'Valsad'],
    'Haryana': ['Ambala', 'Bhiwani', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Panipat', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'],
    'Himachal Pradesh': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'],
    'Jharkhand': ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Giridih', 'Godda', 'Hazaribagh', 'Jamshedpur', 'Ranchi', 'West Singhbhum'],
    'Karnataka': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Dakshina Kannada', 'Davangere', 'Dharwad', 'Hassan', 'Kalaburagi', 'Kodagu', 'Kolar', 'Mandya', 'Mangaluru', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada'],
    'Kerala': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kochi', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'],
    'Madhya Pradesh': ['Balaghat', 'Betul', 'Bhopal', 'Chhindwara', 'Dewas', 'Gwalior', 'Indore', 'Jabalpur', 'Katni', 'Morena', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Ujjain', 'Vidisha'],
    'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
    'Manipur': ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Senapati', 'Thoubal', 'Ukhrul'],
    'Meghalaya': ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri-Bhoi', 'Shillong', 'South Garo Hills', 'South West Garo Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'],
    'Mizoram': ['Aizawl', 'Champhai', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Serchhip'],
    'Nagaland': ['Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Peren', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto'],
    'Odisha': ['Angul', 'Balasore', 'Bargarh', 'Bhadrak', 'Bhubaneswar', 'Cuttack', 'Dhenkanal', 'Ganjam', 'Gajapati', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kendrapara', 'Keonjhar', 'Khordha', 'Koraput', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'],
    'Punjab': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'SAS Nagar', 'SBS Nagar', 'Tarn Taran'],
    'Rajasthan': ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'],
    'Sikkim': ['East Sikkim', 'Gangtok', 'North Sikkim', 'South Sikkim', 'West Sikkim'],
    'Tamil Nadu': ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kanchipuram', 'Kanniyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thiruvallur', 'Thiruvarur', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvannamalai', 'Vellore', 'Viluppuram', 'Virudhunagar'],
    'Telangana': ['Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal', 'Nalgonda', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal Rural', 'Warangal Urban', 'Yadadri Bhuvanagiri'],
    'Tripura': ['Agartala', 'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unokoti', 'West Tripura'],
    'Uttar Pradesh': ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Rae Bareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'],
    'Uttarakhand': ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'],
    'West Bengal': ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'],
    // Union Territories
    'Andaman and Nicobar Islands': ['Nicobar', 'North and Middle Andaman', 'South Andaman'],
    'Chandigarh': ['Chandigarh'],
    'Dadra and Nagar Haveli and Daman and Diu': ['Dadra and Nagar Haveli', 'Daman', 'Diu'],
    'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
    'Jammu and Kashmir': ['Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'],
    'Ladakh': ['Kargil', 'Leh'],
    'Lakshadweep': ['Lakshadweep'],
    'Puducherry': ['Karaikal', 'Mahe', 'Puducherry', 'Yanam'],
};

export const BLOCKS: Record<string, string[]> = {
    'Pune': ['Hinjewadi', 'Wakad', 'Baner', 'Shivajinagar', 'Kothrud', 'Hadapsar', 'Aundh', 'Kharadi', 'Viman Nagar', 'Koregaon Park'],
    'Mumbai City': ['Colaba', 'Fort', 'Marine Lines', 'Churchgate', 'Nariman Point', 'Malabar Hill'],
    'Mumbai Suburban': ['Andheri', 'Bandra', 'Borivali', 'Dadar', 'Worli', 'Goregaon', 'Kandivali', 'Malad', 'Santacruz', 'Vile Parle'],
    'Central Delhi': ['Connaught Place', 'Karol Bagh', 'Paharganj', 'Rajender Nagar'],
    'New Delhi': ['Chanakyapuri', 'Lodhi Colony', 'Defence Colony', 'Lajpat Nagar'],
    'South Delhi': ['Saket', 'Mehrauli', 'Greater Kailash', 'Hauz Khas', 'Vasant Kunj', 'Malviya Nagar'],
    'Bengaluru Urban': ['Whitefield', 'Koramangala', 'Indiranagar', 'Electronic City', 'HSR Layout', 'Marathahalli', 'JP Nagar', 'Jayanagar', 'BTM Layout', 'Banashankari'],
    'Hyderabad': ['Gachibowli', 'HITEC City', 'Banjara Hills', 'Secunderabad', 'Madhapur', 'Kondapur', 'Kukatpally', 'Jubilee Hills', 'Ameerpet', 'Begumpet'],
    'Chennai': ['T. Nagar', 'Adyar', 'Anna Nagar', 'Velachery', 'Mylapore', 'Guindy', 'Tambaram', 'Porur', 'OMR', 'ECR'],
    'Ahmedabad': ['Navrangpura', 'Satellite', 'Maninagar', 'SG Highway', 'Bodakdev', 'Vastrapur', 'Prahlad Nagar', 'Thaltej', 'Chandkheda', 'Gota'],
    'Kolkata': ['Salt Lake', 'Park Street', 'New Town', 'Ballygunge', 'Alipore', 'Gariahat', 'Behala', 'Dum Dum', 'Jadavpur', 'Tollygunge'],
    'Jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Raja Park', 'C-Scheme', 'Tonk Road', 'Ajmer Road', 'Sodala', 'Bani Park', 'MI Road'],
    'Lucknow': ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar', 'Aminabad', 'Charbagh', 'Alambagh', 'Rajajipuram', 'Vikas Nagar'],
    'Khordha': ['Bhubaneswar Ward 1', 'Bhubaneswar Ward 5', 'Bhubaneswar Ward 12', 'Bhubaneswar Ward 19', 'Bhubaneswar Ward 20', 'Bhubaneswar Ward 25', 'Saheed Nagar', 'Nayapalli', 'Chandrasekharpur', 'Patia', 'Old Town'],
    'Bhubaneswar': ['Bhubaneswar Ward 1', 'Bhubaneswar Ward 5', 'Bhubaneswar Ward 12', 'Bhubaneswar Ward 19', 'Bhubaneswar Ward 20', 'Bhubaneswar Ward 25', 'Saheed Nagar', 'Nayapalli', 'Chandrasekharpur', 'Patia', 'Old Town'],
    'Cuttack': ['Cuttack Ward 1', 'Cuttack Ward 7', 'Cuttack Ward 15', 'CDA Sector 6', 'Chauliaganj', 'Badambadi', 'Ranihat', 'Bidanasi', 'Tulsipur', 'Link Road'],
    'Puri': ['Grand Road', 'Sea Beach', 'Talabania', 'Chakra Tirtha', 'Swargadwar'],
    'Rourkela': ['Civil Township', 'Sector 19', 'Chhend', 'Koel Nagar', 'Panposh'],
    'Darjeeling': ['Mall Road', 'Ghoom', 'Lebong', 'Chowrasta', 'Singamari'],
    'Siliguri': ['Hill Cart Road', 'Sevoke Road', 'Pradhan Nagar', 'Hakim Para', 'Deshbandhu Para'],
};

export const ISSUE_CATEGORIES: IssueCategory[] = [
    'Pothole',
    'Garbage',
    'Street Light',
    'Water Leakage',
    'Traffic Violation',
    'Other',
];
