import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  Wifi,
  Utensils,
  Sparkles,
  Zap,
  Droplet,
  Camera,
  Flame,
  Car,
  BookOpen,
  Lock,
  Clock,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Star,
  Compass,
  ArrowRight,
  Menu,
  X,
  Share2,
  Copy,
  Check,
  FileCode,
  Download,
  AlertCircle,
  ChevronDown,
  Navigation,
  ExternalLink,
  Users,
  Eye,
  Info,
  Database,
  Loader2,
  RefreshCw,
  LayoutDashboard
} from 'lucide-react';
import { saveBookingToSupabase, getRecentBookings, SUPABASE_URL } from './lib/supabase.ts';
import AdminPanel from './components/AdminPanel.tsx';

// Contact details for easy editing
const BUSINESS_INFO = {
  name: "Royal Boys and Girls PG",
  tagline: "Your Comfortable Home Away From Home",
  subTagline: "Premium, secure, and hygienic PG accommodation near Acharya Institute, Soladevanahalli, Bengaluru.",
  phone: "09606338697",
  phoneFormatted: "+91 96063 38697",
  phoneTel: "+919606338697",
  whatsappNumber: "919606338697",
  whatsappLink: "https://wa.me/919606338697",
  email: "royalboysgirlspg@gmail.com",
  plusCode: "3FRP+J5 Soladevanahalli, Karnataka",
  address: "3rd Main Cottage Road, 5th Cross Rd, near Acharya Institute, near Sri Lakshmi Venkateswara Swami Devasthana, Achit Nagar, MSPP Colony, Soladevanahalli, Bengaluru, Karnataka 560107",
  googleMapsDirections: "https://www.google.com/maps/dir/?api=1&destination=3FRP%2BJ5+Soladevanahalli%2C+Karnataka",
  googleMapsEmbed: "https://www.google.com/maps?q=3FRP%2BJ5+Soladevanahalli%2C+Karnataka&output=embed"
};

// Room pricing and data
const ROOM_DATA = {
  boys: [
    {
      id: "b-single",
      type: "Single Occupancy Room",
      badge: "Maximum Privacy",
      price: "₹12,000",
      period: "month",
      deposit: "2 Months Deposit",
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
      description: "Private personal room with individual study workstation, large window ventilation, and attached private washroom.",
      features: [
        "Private attached clean bathroom",
        "Dedicated ergonomic study desk & chair",
        "Full-height steel wardrobe with personal key",
        "High-density orthopedic mattress & pillow",
        "3 Home-cooked meals + evening tea included",
        "High-speed 100 Mbps Wi-Fi & power backup",
        "Daily housekeeping & garbage collection"
      ]
    },
    {
      id: "b-double",
      type: "Double Sharing Room",
      badge: "Most Popular",
      price: "₹8,000",
      period: "month",
      deposit: "2 Months Deposit",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      description: "Spacious sharing room for two students or working professionals with separate beds, distinct study desks and lockable wardrobes.",
      features: [
        "Spacious room with cross ventilation",
        "Separate individual beds with mattresses",
        "2 Separate study tables & executive chairs",
        "2 Independent lockable wardrobe units",
        "Attached western bathroom with 24/7 hot geyser",
        "3 Times fresh home meals daily",
        "High-speed Wi-Fi & daily cleaning"
      ]
    },
    {
      id: "b-triple",
      type: "Triple Sharing Room",
      badge: "Budget Friendly",
      price: "₹6,500",
      period: "month",
      deposit: "2 Months Deposit",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      description: "Economical and vibrant shared living room with ample walking room, individual cupboards and premium sanitation.",
      features: [
        "Well-ventilated wide bedroom space",
        "3 Individual single beds with storage drawers",
        "Individual steel lockers for each resident",
        "Dedicated study zone access",
        "Attached spacious bathroom with 24/7 geyser",
        "All 3 daily meals included with zero extra charges",
        "High-speed Wi-Fi & power backup"
      ]
    }
  ],
  girls: [
    {
      id: "g-single",
      type: "Single Deluxe Room (Girls Wing)",
      badge: "Ultra Secure & Private",
      price: "₹12,500",
      period: "month",
      deposit: "2 Months Deposit",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      description: "Safe sanctuary for female students and working women. Dedicated female warden, biometric check-in, and quiet study vibes.",
      features: [
        "Exclusive secure wing with resident lady warden",
        "Attached bathroom with 24/7 solar + geyser water",
        "Dedicated dressing mirror & lockable storage",
        "Ergonomic study setup with warm reading light",
        "3 Fresh hygienic meals + evening refreshments",
        "High-speed Wi-Fi, automatic laundry machines",
        "Strict biometric door access"
      ]
    },
    {
      id: "g-double",
      type: "Double Sharing (Girls Wing)",
      badge: "Top Choice for Friends",
      price: "₹8,500",
      period: "month",
      deposit: "2 Months Deposit",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
      description: "Comfortable and cheerful twin sharing room for college friends with roomy layout, large windows, and attached bath.",
      features: [
        "Bright, airy room with private balcony access",
        "2 Separate comfortable beds & clean linens",
        "Dual full-length wardrobes with personal keys",
        "Two study tables with power sockets",
        "Sanitized attached western washroom",
        "3 Times nutritious homestyle meals",
        "Round-the-clock CCTV in corridors"
      ]
    },
    {
      id: "g-triple",
      type: "Triple Sharing (Girls Wing)",
      badge: "Affordable & Cozy",
      price: "₹6,800",
      period: "month",
      deposit: "2 Months Deposit",
      image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80",
      description: "Social and supportive environment for first-year Acharya students. Budget-friendly with all amenities and meals included.",
      features: [
        "Spacious shared bedroom with cozy bedding",
        "3 Individual secure wardrobe lockers",
        "Separate study desks in room & study lounge access",
        "Attached bathroom with instant hot water",
        "Nutritious breakfast, lunch & dinner",
        "High-speed Wi-Fi and power backup",
        "Washing machine access & clean water"
      ]
    }
  ]
};

// Amenities
const AMENITIES = [
  {
    icon: Wifi,
    title: "High-Speed Wi-Fi",
    desc: "100+ Mbps dedicated dual-band fiber optic Wi-Fi with zero lag for online classes, assignments, and streaming."
  },
  {
    icon: Utensils,
    title: "3x Home-Style Meals",
    desc: "Freshly prepared, balanced South & North Indian food (Breakfast, Lunch, Dinner & Evening Chai) in a hygienic kitchen."
  },
  {
    icon: Sparkles,
    title: "Daily Housekeeping",
    desc: "Rigorous daily room sweeping, mopping, bathroom sanitization, and deep dust clearing by trusted staff."
  },
  {
    icon: Zap,
    title: "24/7 Power Backup",
    desc: "Continuous inverter & generator support so your study sessions, Wi-Fi, and lights never get interrupted."
  },
  {
    icon: Droplet,
    title: "RO UV Drinking Water",
    desc: "Multi-stage industrial RO + UV alkaline mineral water dispensers available on every floor for 100% safe drinking."
  },
  {
    icon: Camera,
    title: "24/7 CCTV & Security",
    desc: "Round-the-clock security guard, biometric access, and comprehensive CCTV coverage of all entry and common points."
  },
  {
    icon: Flame,
    title: "24/7 Hot Water",
    desc: "Dual system with solar heaters and electric geysers in every attached washroom for uninterrupted hot showers."
  },
  {
    icon: Car,
    title: "Secure Parking",
    desc: "Spacious, well-lit covered parking area inside the compound for two-wheelers and resident vehicles."
  },
  {
    icon: BookOpen,
    title: "Dedicated Study Area",
    desc: "Quiet, air-conditioned study hall with ample power sockets, comfortable seating, and silence discipline for exams."
  },
  {
    icon: Lock,
    title: "Individual Wardrobes",
    desc: "Every resident receives an individual full-sized wardrobe and lockable drawer for safety of personal valuables."
  },
  {
    icon: ShieldCheck,
    title: "Separate Wings & Wardens",
    desc: "100% separate entrances, stairways, and living spaces for boys and girls with on-site resident wardens."
  },
  {
    icon: Clock,
    title: "Automatic Laundry",
    desc: "Commercial top-load washing machines and expansive covered terrace drying racks available for all residents."
  }
];

// Weekly Food Menu Timetable
const FOOD_MENU = [
  {
    day: "Monday",
    breakfast: "Crispy Idli & Vada with Sambar & Coconut Chutney + Filter Coffee/Tea",
    lunch: "Steamed Rice, Dal Tadka, Seasonal Veg Curry, Roti, Fresh Curd & Papad",
    snacks: "Onion Pakoda / Biscuits & Hot Kadak Masala Chai",
    dinner: "Veg Pulao, Chapati, Paneer Curry, Fresh Green Salad & Warm Rasam"
  },
  {
    day: "Tuesday",
    breakfast: "Aloo Paratha with Mint Chutney & Curd / Bread Butter Toast + Hot Tea",
    lunch: "Jeera Rice, Homestyle Rajma Curry, Phulkas, Mixed Vegetable Poriyal & Buttermilk",
    snacks: "Sweet Corn Chat / Masala Puffed Rice & Ginger Chai",
    dinner: "Phulkas, Egg Curry (or Soya Chunks Curry for Veg), Steamed Rice, Sambar & Pickle"
  },
  {
    day: "Wednesday",
    breakfast: "Hot Masala Dosa / Set Dosa with Potato Palya, Tomato Chutney & Coffee/Tea",
    lunch: "South Indian Thali: Rice, Drumstick Sambar, Tomato Rasam, Palya, Curd & Fryums",
    snacks: "Samosa with Tamarind Chutney & Hot Tea",
    dinner: "North Indian Fried Rice / Noodles, Gobi Manchurian Gravy, Chapati & Kheer"
  },
  {
    day: "Thursday",
    breakfast: "Mysore Bonda / Upma with Kesari Bath (Chow Chow Bath) & Chutney + Tea",
    lunch: "Lemon Rice & Steamed White Rice, Dal Fry, Bhindi Masala, Hot Phulkas & Curd",
    snacks: "Veg Cutlet / Bun Butter Jam & Cardamom Tea",
    dinner: "Tawa Roti, Shahi Paneer, Jeera Pulao, Dal Makhani & Mixed Pickle"
  },
  {
    day: "Friday",
    breakfast: "Puri Bhaji (Aloo Curry) & Sooji Halwa / Tea & Coffee",
    lunch: "Steamed Rice, Chana Masala (Chole), Hot Phulkas, Veg Salad & Spiced Buttermilk",
    snacks: "Crispy Medu Vada / Banana Fritters & Strong Filter Coffee",
    dinner: "Veg / Egg Fried Rice, Schezwan Veg Gravy, Soft Chapatis & Fresh Fruits"
  },
  {
    day: "Saturday",
    breakfast: "Uttapam with Mixed Veggies / Poha with Peanuts & Lemon + Hot Chai",
    lunch: "Biryani Rice, Dal Palak, Aloo Gobi Masala, Chapatis, Curd Rice & Papad",
    snacks: "Spicy Bhelpuri / Hot Biscuits & Masala Tea",
    dinner: "Chapati, Mixed Veg Kurma, Ghee Rice, Rasam & Gulab Jamun Sweet"
  },
  {
    day: "Sunday",
    breakfast: "Special Masala Poori / Onion Rava Dosa with Chutneys + Filter Coffee",
    lunch: "✨ SUNDAY SPECIAL FEAST: Chicken Biryani with Raita & Gravy (Non-Veg) / Paneer Dum Biryani with Veg Korma & Gulab Jamun (Veg)",
    snacks: "Cake / French Fries & Hot Beverage",
    dinner: "Light Khichdi / Phulkas, Dal Fry, Steamed Rice, Tomato Rasam & Curd"
  }
];

// Photo Gallery
const GALLERY_IMAGES = [
  {
    id: 1,
    title: "Twin Sharing Deluxe Room",
    category: "rooms",
    url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80",
    caption: "Spacious twin beds with orthopedic mattresses, individual study workstations, and wardrobe lockers."
  },
  {
    id: 2,
    title: "Hygienic Dining Hall",
    category: "dining",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
    caption: "Clean and sanitized dining area where residents enjoy unlimited fresh home-style meals 3 times a day."
  },
  {
    id: 3,
    title: "Single Private Room",
    category: "rooms",
    url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
    caption: "Quiet, airy private single rooms with attached modern bathrooms and ample natural daylight."
  },
  {
    id: 4,
    title: "Quiet Study Lounge",
    category: "common",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
    caption: "Dedicated sound-disciplined study space equipped with high-speed fiber internet and power backups."
  },
  {
    id: 5,
    title: "Triple Sharing Student Room",
    category: "rooms",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
    caption: "Comfortable and budget-friendly triple occupancy room with individual storage and clean layout."
  },
  {
    id: 6,
    title: "Modern Attached Bathrooms",
    category: "rooms",
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80",
    caption: "Every room features a sparkling clean western bathroom with 24/7 hot water geyser & solar system."
  },
  {
    id: 7,
    title: "Building Exterior & Campus Vicinity",
    category: "building",
    url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
    caption: "Secure multi-storey building situated in a peaceful residential pocket just 350 meters from Acharya Institute."
  },
  {
    id: 8,
    title: "Fresh Meal Preparation",
    category: "dining",
    url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80",
    caption: "Our expert in-house cooks prepare balanced North and South Indian food using fresh daily ingredients."
  }
];

// Rules & Policies
const RULES = [
  {
    title: "Security Deposit & Refund",
    desc: "A standard refundable security deposit of 2 months' rent is required upon check-in. The deposit is strictly refunded into your bank account upon vacating, subject to clearing room inspection."
  },
  {
    title: "Notice Period",
    desc: "A minimum of 30 days prior written or WhatsApp notice is required before vacating your room to ensure smooth deposit settlement and handover."
  },
  {
    title: "Gate Timings & Night Curfew",
    desc: "For the safety and security of all residents (especially female students), the main hostel gates close at 10:00 PM. Late-night entries for exams, projects, or shifts require prior intimation/parental approval."
  },
  {
    title: "Visiting Hours & Visitor Policy",
    desc: "Parents and family members are warmly welcome in the ground floor visitor lounge from 8:00 AM to 7:30 PM. For security and resident privacy, visitors (especially of the opposite gender) are strictly prohibited from entering resident bedrooms."
  },
  {
    title: "Hygiene & Noise Discipline",
    desc: "Daily housekeeping is mandatory. Post 10:30 PM is designated quiet hours to allow fellow engineering & medical students undisturbed sleep and study."
  },
  {
    title: "Strict Zero-Tolerance Substance Policy",
    desc: "Smoking, alcohol consumption, illicit substances, and hazardous materials are completely banned across the entire building, rooms, and terrace."
  }
];

// Testimonials
const TESTIMONIALS = [
  {
    quote: "Being a 1st year B.Tech student at Acharya Institute of Technology, my biggest worry was finding good food and a peaceful room. Royal PG is literally a 4-minute walk to my college gate. The food actually tastes like home, and the Wi-Fi speed never drops during project submissions!",
    author: "Rohan Sharma",
    role: "Computer Science Student, Acharya Institute",
    badge: "Resident (Double Sharing)",
    rating: 5
  },
  {
    quote: "As parents living in Patna, sending our 19-year-old daughter to Bengaluru was scary. But after visiting Royal PG, seeing their dedicated girls' wing, on-premise lady warden, and strict biometric entry, we were completely relieved. She has been here for 1.5 years now and loves the care they provide.",
    author: "Sunita & Rajesh Verma",
    role: "Parents from Patna, Bihar",
    badge: "Parent of Resident",
    rating: 5
  },
  {
    quote: "I work as a software engineer in Peenya/HMT tech belt. The single room gives me total quiet for remote work and night shifts. 24/7 power backup and hot water are seamless. Plus, zero hidden utility charges makes budgeting super easy.",
    author: "Karthik Nair",
    role: "Working Professional",
    badge: "Resident (Single Room)",
    rating: 5
  }
];

// Nearby Landmarks with distances
const LANDMARKS = [
  {
    name: "Acharya Institute of Technology & Campus",
    distance: "350 Meters",
    walkTime: "3 - 4 Minutes Walk",
    type: "Educational Campus",
    highlight: true
  },
  {
    name: "Sri Lakshmi Venkateswara Swami Devasthana",
    distance: "150 Meters",
    walkTime: "2 Minutes Walk",
    type: "Peaceful Landmark",
    highlight: false
  },
  {
    name: "Soladevanahalli Railway Station",
    distance: "1.8 Kilometers",
    walkTime: "5 Minutes Drive",
    type: "Transit Hub",
    highlight: false
  },
  {
    name: "Hesaraghatta Main Road Bus Stop",
    distance: "800 Meters",
    walkTime: "8 Minutes Walk",
    type: "Public Transit",
    highlight: false
  },
  {
    name: "Medical Clinic & 24/7 Pharmacy",
    distance: "120 Meters",
    walkTime: "1 Minute Walk",
    type: "Healthcare",
    highlight: false
  },
  {
    name: "Supermarkets & Cafes",
    distance: "200 Meters",
    walkTime: "2 Minutes Walk",
    type: "Daily Conveniences",
    highlight: false
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'website' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
        return 'admin';
      }
    }
    return 'website';
  });

  const [wing, setWing] = useState<'boys' | 'girls'>('boys');
  const [activeDay, setActiveDay] = useState<string>('Monday');
  const [galleryFilter, setGalleryFilter] = useState<string>('all');
  const [activeLightbox, setActiveLightbox] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showCodeModal, setShowCodeModal] = useState<boolean>(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [openRuleIndex, setOpenRuleIndex] = useState<number | null>(0);

  // Supabase backend state
  const [isSavingToSupabase, setIsSavingToSupabase] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [supabaseMessage, setSupabaseMessage] = useState<string>('');
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState<boolean>(false);

  // Booking Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    section: 'Boys Section',
    sharingType: 'Double Sharing',
    moveInDate: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightbox(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch recent bookings from Supabase
  const loadRecentBookings = async () => {
    setIsLoadingRecent(true);
    const result = await getRecentBookings();
    if (result.success && result.data) {
      setRecentBookings(result.data);
    }
    setIsLoadingRecent(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert("Please enter your name and phone number.");
      return;
    }

    setIsSavingToSupabase(true);
    setSupabaseStatus('saving');

    // 1. Save data automatically to Supabase backend database
    const supabaseResult = await saveBookingToSupabase({
      full_name: formData.fullName,
      phone: formData.phone,
      section: formData.section,
      sharing_type: formData.sharingType,
      move_in_date: formData.moveInDate || null,
      message: formData.message || '',
      status: 'new'
    });

    setIsSavingToSupabase(false);

    if (supabaseResult.success) {
      setSupabaseStatus('success');
      setSupabaseMessage('Booking successfully saved to your Supabase database!');
      // Refresh local list if modal is opened later
      loadRecentBookings();
    } else {
      setSupabaseStatus('error');
      const errDetail = supabaseResult.error?.message || 'Check database permissions or table setup.';
      setSupabaseMessage(errDetail);
    }

    // 2. Open WhatsApp pre-filled with the booking details
    const whatsappText = `*New Booking / Inquiry - Royal Boys & Girls PG*%0A` +
      `*Name:* ${encodeURIComponent(formData.fullName)}%0A` +
      `*Phone:* ${encodeURIComponent(formData.phone)}%0A` +
      `*Section:* ${encodeURIComponent(formData.section)}%0A` +
      `*Room Type:* ${encodeURIComponent(formData.sharingType)}%0A` +
      `*Move-In Date:* ${encodeURIComponent(formData.moveInDate || 'Immediate / Flexible')}%0A` +
      `*Special Message:* ${encodeURIComponent(formData.message || 'I would like to visit and confirm room availability.')}`;

    setFormSubmitted(true);
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${whatsappText}`, '_blank');
  };

  const selectRoomForBooking = (roomType: string, sectionType: 'boys' | 'girls') => {
    setFormData(prev => ({
      ...prev,
      sharingType: roomType,
      section: sectionType === 'boys' ? 'Boys Section' : 'Girls Section'
    }));
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const filteredGallery = galleryFilter === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === galleryFilter);

  // If in Admin Mode, render the full-featured Admin Dashboard
  if (currentView === 'admin') {
    return (
      <AdminPanel
        onBackToWebsite={() => {
          setCurrentView('website');
          window.location.hash = '';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080E1A] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-amber-200">
      
      {/* Top Notification / Trust Bar */}
      <div className="bg-gradient-to-r from-[#0B1528] via-[#0E1E38] to-[#0B1528] border-b border-amber-500/20 py-2 px-4 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-amber-300">Admissions Open 2026:</span>
            <span className="hidden sm:inline">Rooms available for Acharya Institute students & professionals</span>
            <span className="sm:hidden">Acharya Institute near (350m)</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
            
            {/* Direct Admin Panel Switcher */}
            <button
              onClick={() => {
                setCurrentView('admin');
                window.location.hash = 'admin';
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/50 text-amber-300 hover:from-amber-500/30 hover:to-amber-600/30 transition-all cursor-pointer text-[11px] font-bold shadow-sm"
              title="Open PG Booking Admin Dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel (Manage Bookings)</span>
            </button>

            <span className="text-slate-600 hidden md:inline">|</span>

            <a 
              href={`tel:${BUSINESS_INFO.phoneTel}`} 
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors text-amber-200"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{BUSINESS_INFO.phoneFormatted}</span>
            </a>
            <span className="text-slate-600 hidden md:inline">|</span>
            <button
              onClick={() => setShowCodeModal(true)}
              className="hidden md:flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
              title="View & Export Single-File HTML"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Get Standalone HTML Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#080E1A]/95 backdrop-blur-md border-b border-slate-800/80 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#080E1A] rounded-[10px] flex items-center justify-center">
                <span className="font-cinzel text-xl font-black text-amber-400 tracking-wider">R</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-lg sm:text-xl text-white tracking-wide">
                  ROYAL <span className="text-amber-400">PG</span>
                </span>
                <span className="bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[10px] font-semibold px-2 py-0.5 rounded-sm tracking-wider uppercase">
                  Boys & Girls
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 font-normal">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                Soladevanahalli, Bengaluru (Near Acharya)
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-amber-300 transition-colors">About</a>
            <a href="#rooms" className="hover:text-amber-300 transition-colors">Rooms & Pricing</a>
            <a href="#amenities" className="hover:text-amber-300 transition-colors">Amenities</a>
            <a href="#food" className="hover:text-amber-300 transition-colors">Food Menu</a>
            <a href="#gallery" className="hover:text-amber-300 transition-colors">Gallery</a>
            <a href="#why-us" className="hover:text-amber-300 transition-colors">Why Choose Us</a>
            <a href="#location" className="hover:text-amber-300 transition-colors">Location</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => {
                setCurrentView('admin');
                window.location.hash = 'admin';
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
              title="Open Admin Booking Panel"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Panel</span>
            </button>

            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%2C%20I'm%20interested%20in%20a%20room%20at%20Royal%20Boys%20and%20Girls%20PG`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Visit</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-[#0A1222] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-3 duration-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/80 text-slate-200 hover:bg-slate-800"
              >
                About Us
              </a>
              <a 
                href="#rooms" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/80 text-slate-200 hover:bg-slate-800"
              >
                Rooms & Rates
              </a>
              <a 
                href="#amenities" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/80 text-slate-200 hover:bg-slate-800"
              >
                All Amenities
              </a>
              <a 
                href="#food" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/80 text-slate-200 hover:bg-slate-800"
              >
                Food Timetable
              </a>
              <a 
                href="#gallery" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/80 text-slate-200 hover:bg-slate-800"
              >
                Photo Gallery
              </a>
              <a 
                href="#rules" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/80 text-slate-200 hover:bg-slate-800"
              >
                Rules & Deposit
              </a>
              <a 
                href="#location" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/80 text-slate-200 hover:bg-slate-800"
              >
                Map & Distance
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30"
              >
                Book Inspection
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentView('admin');
                  window.location.hash = 'admin';
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
                <span>Open Admin Panel (Manage Bookings)</span>
              </button>

              <a
                href={`tel:${BUSINESS_INFO.phoneTel}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-slate-800 text-slate-100 font-medium text-sm"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call {BUSINESS_INFO.phoneFormatted}</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowCodeModal(true);
                }}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Standalone HTML File</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-[#080E1A] via-[#0D182E] to-[#080E1A]">
        {/* Subtle royal geometric pattern overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Glow gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Verified & Secure PG Accommodation in Bengaluru</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif-royal font-bold text-white tracking-tight leading-tight">
                Your Comfortable <br />
                <span className="text-gold-gradient">Home Away From Home</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Premium paying guest accommodation in Soladevanahalli, Bengaluru. Located just 
                <strong className="text-white font-semibold"> 3 minutes walk from Acharya Institute</strong> with 
                100% separate wings for boys and girls, 3 delicious home-cooked meals, Wi-Fi, and round-the-clock safety.
              </p>

              {/* Target Audience / Parent Confidence Tags */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Separate Boys & Girls Wings
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  350m to Acharya Institute
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Parent-Trusted Security & Hygiene
                </span>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Free Room Visit</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%2C%20I'm%20interested%20in%20a%20room%20at%20Royal%20Boys%20and%20Girls%20PG`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-300 border border-[#25D366]/50 font-semibold text-sm transition-all hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Us (Instant Reply)</span>
                </a>
              </div>

              {/* Direct Call & Plus Code Link */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <a 
                  href={`tel:${BUSINESS_INFO.phoneTel}`} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct Call: <strong>{BUSINESS_INFO.phoneFormatted}</strong></span>
                </a>
                <span>•</span>
                <a 
                  href={BUSINESS_INFO.googleMapsDirections}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>Plus Code: <strong>{BUSINESS_INFO.plusCode}</strong></span>
                </a>
              </div>

            </div>

            {/* Right Column: Hero Visual Card with Verified Highlights */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Decorative border frame */}
                <div className="relative rounded-2xl p-1 bg-gradient-to-b from-amber-500/40 via-slate-800 to-amber-500/20 shadow-2xl">
                  <div className="relative rounded-[14px] overflow-hidden bg-[#0A1222]">
                    
                    {/* Hero Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80" 
                        alt="Royal Boys and Girls PG Interior Room" 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1222] via-transparent to-transparent"></div>
                      
                      {/* Floating status pill */}
                      <div className="absolute top-3 left-3 bg-[#080E1A]/90 backdrop-blur-md border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Premium Student & Professional Living</span>
                      </div>
                    </div>

                    {/* Quick Specs Grid below image */}
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-800">
                        <div>
                          <div className="text-xl font-bold text-amber-400">350m</div>
                          <div className="text-[11px] text-slate-400">To Acharya Inst.</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-emerald-400">3x Daily</div>
                          <div className="text-[11px] text-slate-400">Fresh Hot Meals</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-blue-400">24/7</div>
                          <div className="text-[11px] text-slate-400">CCTV & Power</div>
                        </div>
                      </div>

                      <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-300">
                        <span className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" /> Soladevanahalli, BLR
                        </span>
                        <span className="text-emerald-400 font-medium">Single, Double & Triple Sharing</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Floating parent assurance note */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#0E1E38] border border-amber-500/40 p-3 rounded-xl shadow-xl max-w-[240px] hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">100% Parent Approved</p>
                    <p className="text-[10px] text-slate-300">Biometric & Lady Warden on premises</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT US */}
      <section id="about" className="py-16 md:py-24 bg-[#091122] border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Welcome to Royal PG
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-royal font-bold text-white">
              Thoughtfully Designed for Students & Working Professionals
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
              Located in the tranquil residential zone of Achit Nagar, Soladevanahalli, Royal Boys and Girls PG 
              offers modern, fully furnished accommodation with a distinct focus on safety, hygiene, and wholesome food.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Advantage 1 */}
            <div className="bg-[#0B162C] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Prime Location Advantage</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Just <strong>350 meters (a 3-minute casual walk)</strong> to Acharya Institute of Technology, 
                pharmacy college, and nursing campus. Avoid morning Bangalore traffic, save auto/bus fare, and walk back easily between classes.
              </p>
              <ul className="text-xs space-y-2 text-slate-400 pt-2 border-t border-slate-800/60">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Near Sri Lakshmi Venkateswara Temple
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Walkable to grocery & medical stores
                </li>
              </ul>
            </div>

            {/* Advantage 2 */}
            <div className="bg-[#0B162C] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Segregated, Secure Living</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Complete security and peace of mind. We maintain <strong>100% independent entrances and floors 
                for boys and girls</strong>, with strict resident-only biometric entry, dedicated lady wardens, and 24/7 CCTV surveillance.
              </p>
              <ul className="text-xs space-y-2 text-slate-400 pt-2 border-t border-slate-800/60">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> 24/7 security guard at main gate
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Parents get prompt updates & full contact
                </li>
              </ul>
            </div>

            {/* Advantage 3 */}
            <div className="bg-[#0B162C] border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Delicious Home-Cooked Food</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                We believe good health powers great study results. Our kitchen cooks <strong>3 hot meals daily</strong> 
                using fresh vegetables and RO filtered water. North & South Indian dishes, plus our famous Sunday Special Biryani!
              </p>
              <ul className="text-xs space-y-2 text-slate-400 pt-2 border-t border-slate-800/60">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Unlimited tasty food portions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" /> Daily evening hot chai & fresh snacks
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: ROOMS & PRICING */}
      <section id="rooms" className="py-16 md:py-24 bg-[#080E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Transparent Accommodation
              </span>
              <h2 className="text-3xl md:text-4xl font-serif-royal font-bold text-white">
                Rooms & Monthly Pricing
              </h2>
              <p className="text-slate-400 text-sm max-w-xl">
                Choose the setup that fits your lifestyle and budget. All packages include daily 3-time meals, 
                high-speed Wi-Fi, electricity, hot water, and housekeeping. No surprise utility bills.
              </p>
            </div>

            {/* Gender Switcher Tabs */}
            <div className="inline-flex p-1.5 rounded-xl bg-[#0F1C36] border border-amber-500/30 shrink-0">
              <button
                onClick={() => setWing('boys')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  wing === 'boys'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Boys Wing</span>
              </button>
              <button
                onClick={() => setWing('girls')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  wing === 'girls'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Girls Wing (Dedicated Warden)</span>
              </button>
            </div>
          </div>

          {/* Room Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {ROOM_DATA[wing].map((room) => (
              <div 
                key={room.id}
                className="group relative rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-amber-500/50 flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {/* Room Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img 
                    src={room.image} 
                    alt={room.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-transparent"></div>
                  
                  {/* Badge */}
                  <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {room.badge}
                  </span>

                  {/* Sharing type title on image bottom */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                      {wing === 'boys' ? "Boys Section" : "Girls Section"}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight">
                      {room.type}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  
                  {/* Pricing Box */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white">{room.price}</span>
                      <span className="text-xs text-slate-400">/{room.period}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-400 font-medium">
                      <span>✓ All 3 Meals Included</span>
                      <span>•</span>
                      <span>{room.deposit}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                      {room.description}
                    </p>
                  </div>

                  {/* Feature Inclusions */}
                  <div className="space-y-2.5 border-t border-slate-800/80 pt-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Included Amenities:
                    </p>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {room.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action CTA */}
                  <div className="pt-2">
                    <button
                      onClick={() => selectRoomForBooking(room.type, wing)}
                      className="w-full py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 hover:border-amber-400 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Book / Enquire For This Room</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Pricing Note */}
          <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">Note on Transparency:</span> Prices shown above include high-speed Wi-Fi, 3 daily meals, tea, housekeeping, 24/7 hot water, and electricity. Security deposit is 100% refundable upon vacating with a 30-day notice.
          </div>

        </div>
      </section>

      {/* SECTION 4: AMENITIES */}
      <section id="amenities" className="py-16 md:py-24 bg-[#091122] border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Modern Comforts
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-royal font-bold text-white">
              Everything You Need For A Hassle-Free Stay
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
              Focus on your studies and career while we take complete care of housekeeping, healthy meals, 
              security, and utilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {AMENITIES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="bg-[#0B1528] border border-slate-800/90 rounded-xl p-5 hover:border-amber-500/30 transition-all hover:-translate-y-1 group"
                >
                  <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Hygiene & Pure Water Pledge */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#0C1B36] to-[#0A162D] border border-amber-500/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Our 100% Hygiene & Safety Promise</h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  We use commercial RO UV filters with daily TDS monitoring, strict kitchen cleanliness checks, and professional sanitization so residents stay healthy year-round.
                </p>
              </div>
            </div>
            <a
              href="#contact"
              className="shrink-0 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Schedule an In-Person Inspection
            </a>
          </div>

        </div>
      </section>

      {/* SECTION 5: FOOD MENU (WEEKLY MEAL TIMETABLE) */}
      <section id="food" className="py-16 md:py-24 bg-[#080E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Motherly Care & Good Taste
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-royal font-bold text-white">
              Weekly Home-Style Meal Timetable
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
              Nutritious, warm, and unlimited food cooked fresh three times daily plus evening tea. 
              We serve a wholesome mix of North Indian and South Indian favorites with Sunday special treats!
            </p>
          </div>

          {/* Meal Timings Summary Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 max-w-4xl mx-auto">
            <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[11px] text-amber-400 font-semibold uppercase">Breakfast</span>
              <p className="text-xs text-white font-bold mt-0.5">7:30 AM – 9:30 AM</p>
              <p className="text-[10px] text-slate-400">With Filter Coffee/Tea</p>
            </div>
            <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[11px] text-amber-400 font-semibold uppercase">Lunch</span>
              <p className="text-xs text-white font-bold mt-0.5">12:30 PM – 2:30 PM</p>
              <p className="text-[10px] text-slate-400">Dabba packing option</p>
            </div>
            <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[11px] text-amber-400 font-semibold uppercase">Evening Snacks</span>
              <p className="text-xs text-white font-bold mt-0.5">5:00 PM – 6:30 PM</p>
              <p className="text-[10px] text-slate-400">Hot Chai & Snacks</p>
            </div>
            <div className="bg-[#0B1528] border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-[11px] text-amber-400 font-semibold uppercase">Dinner</span>
              <p className="text-xs text-white font-bold mt-0.5">7:45 PM – 10:00 PM</p>
              <p className="text-[10px] text-slate-400">Hot Rotis & Curries</p>
            </div>
          </div>

          {/* Interactive Day Selection Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {FOOD_MENU.map((item) => (
              <button
                key={item.day}
                onClick={() => setActiveDay(item.day)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeDay === item.day
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-[#0B1528] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {item.day}
                {item.day === 'Sunday' && ' ✨'}
              </button>
            ))}
          </div>

          {/* Active Day Menu Card */}
          {(() => {
            const currentDayMenu = FOOD_MENU.find(m => m.day === activeDay) || FOOD_MENU[0];
            return (
              <div className="max-w-4xl mx-auto bg-gradient-to-b from-[#0B162C] to-[#0A1222] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                
                {/* Header of Active Day */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                      Daily Menu Breakdown
                    </span>
                    <h3 className="text-2xl font-serif-royal font-bold text-white">
                      {currentDayMenu.day}'s Curated Menu
                    </h3>
                  </div>
                  {currentDayMenu.day === 'Sunday' && (
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                      Special Biryani Feast Day!
                    </span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Breakfast */}
                  <div className="bg-[#080E1A]/80 border border-slate-800/90 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-bold uppercase tracking-wider">Breakfast</span>
                      <span className="text-slate-400">7:30 - 9:30 AM</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200">
                      {currentDayMenu.breakfast}
                    </p>
                  </div>

                  {/* Lunch */}
                  <div className="bg-[#080E1A]/80 border border-slate-800/90 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-bold uppercase tracking-wider">Lunch</span>
                      <span className="text-slate-400">12:30 - 2:30 PM</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200">
                      {currentDayMenu.lunch}
                    </p>
                  </div>

                  {/* Snacks */}
                  <div className="bg-[#080E1A]/80 border border-slate-800/90 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-bold uppercase tracking-wider">Evening Snacks & Chai</span>
                      <span className="text-slate-400">5:00 - 6:30 PM</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200">
                      {currentDayMenu.snacks}
                    </p>
                  </div>

                  {/* Dinner */}
                  <div className="bg-[#080E1A]/80 border border-slate-800/90 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-bold uppercase tracking-wider">Dinner</span>
                      <span className="text-slate-400">7:45 - 10:00 PM</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200">
                      {currentDayMenu.dinner}
                    </p>
                  </div>
                </div>

                {/* Dietary notice */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Vegetarian & Non-Vegetarian Options (Separate vessels & hygiene)</span>
                  <span className="text-amber-300 font-medium">Warm drinking water available 24/7</span>
                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* SECTION 6: GALLERY WITH LIGHTBOX */}
      <section id="gallery" className="py-16 md:py-24 bg-[#091122] border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Visual Tour
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-royal font-bold text-white">
              Accommodation & Facilities Gallery
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
              Take a look inside our clean rooms, sanitized dining area, quiet study zone, and modern bathrooms.
              Click any photo to enlarge in high resolution.
            </p>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {[
              { label: 'All Photos', key: 'all' },
              { label: 'Bedrooms', key: 'rooms' },
              { label: 'Dining & Food', key: 'dining' },
              { label: 'Study & Common', key: 'common' },
              { label: 'Building & Exterior', key: 'building' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setGalleryFilter(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  galleryFilter === tab.key
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-[#0B1528] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGallery.map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveLightbox(img.id)}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-800 cursor-pointer shadow-md hover:border-amber-500/50 transition-all hover:-translate-y-1"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080E1A] via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>
                
                {/* Overlay Text */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    {img.title}
                  </p>
                  <span className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                    <Eye className="w-3 h-3 text-amber-400" /> Click to view photo
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          {activeLightbox !== null && (
            <div 
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setActiveLightbox(null)}
            >
              <div 
                className="relative max-w-4xl w-full bg-[#0A1222] border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                {(() => {
                  const currentImg = GALLERY_IMAGES.find(i => i.id === activeLightbox);
                  if (!currentImg) return null;
                  return (
                    <div>
                      <div className="relative aspect-[16/10] bg-black">
                        <img 
                          src={currentImg.url} 
                          alt={currentImg.title} 
                          className="w-full h-full object-contain"
                        />
                        <button
                          onClick={() => setActiveLightbox(null)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="p-6 bg-[#0B1528] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-white">{currentImg.title}</h4>
                          <p className="text-xs text-slate-300 mt-1">{currentImg.caption}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const currentIndex = GALLERY_IMAGES.findIndex(i => i.id === activeLightbox);
                              const prevIndex = (currentIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
                              setActiveLightbox(GALLERY_IMAGES[prevIndex].id);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => {
                              const currentIndex = GALLERY_IMAGES.findIndex(i => i.id === activeLightbox);
                              const nextIndex = (currentIndex + 1) % GALLERY_IMAGES.length;
                              setActiveLightbox(GALLERY_IMAGES[nextIndex].id);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold cursor-pointer"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* SECTION 7: WHY CHOOSE US */}
      <section id="why-us" className="py-16 md:py-24 bg-[#080E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Peace of Mind for You & Your Family
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-royal font-bold text-white">
              Why Residents & Parents Choose Royal PG
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
              We understand that moving away from family can be overwhelming. Here is why dozens of students and young professionals call us their home in Bengaluru.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Strict Safety & Biometric Access</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                24/7 CCTV surveillance in all corridors, perimeter lighting, biometric doors, and strict gate closing. Resident safety is our topmost priority.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Spotless Daily Hygiene</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Dedicated housekeeping staff cleans rooms daily, sanitizes washrooms, changes garbage bins, and maintains the dining hall in pristine condition.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. 3-Min Walk to Acharya Institute</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Just 350 meters away. You never have to rush for 8:30 AM lectures or worry about Bangalore rain and transport hassles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">4. 100% Separate Wings</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Completely independent boys and girls sections. The girls' wing features a dedicated lady warden residing 24/7 in the building.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">5. Motherly Food Standards</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Fresh ingredients cooked in pure RO water. We avoid excessive restaurant spices, so you stay energized and healthy throughout the semester.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1528] border border-slate-800 hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">6. Transparent & Friendly Management</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Direct owner and caretaker contact on WhatsApp. Quick maintenance turnarounds for electrical or plumbing needs within hours.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 8: RULES & POLICIES */}
      <section id="rules" className="py-16 md:py-24 bg-[#091122] border-t border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Clear Guidelines
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-royal font-bold text-white">
              Hostel Rules & Policies
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
            <p className="text-slate-300 text-sm leading-relaxed pt-2">
              Our clear guidelines ensure a disciplined, friendly, and respectful environment for everyone.
            </p>
          </div>

          <div className="space-y-4">
            {RULES.map((rule, idx) => {
              const isOpen = openRuleIndex === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-xl bg-[#0B1528] border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenRuleIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-white hover:text-amber-300 cursor-pointer"
                  >
                    <span>{rule.title}</span>
                    <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/80 bg-[#080E1A]/50">
                      {rule.desc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick notice callout */}
          <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200 leading-relaxed">
              <strong>Need custom shift arrangements?</strong> If you have late college lab sessions or working night shifts, simply notify our manager in advance for gate authorization.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 9: TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-[#080E1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Genuine Experiences
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-royal font-bold text-white">
              What Residents & Parents Say
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
              Hear directly from current residents studying at Acharya and out-of-state parents who trust us.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div 
                key={idx}
                className="bg-[#0B1528] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition-colors shadow-lg"
              >
                <div className="space-y-4">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80">
                  <h4 className="font-bold text-white text-base">{t.author}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {t.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 10: LOCATION & LANDMARKS */}
      <section id="location" className="py-16 md:py-24 bg-[#091122] border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Find Us Easily
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-royal font-bold text-white">
              Strategic Location Near Acharya Campus
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
              Situated in Soladevanahalli, Bengaluru near Acharya Institute and Sri Lakshmi Venkateswara Swami Devasthana.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Location Details & Landmarks */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#0B1528] border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg text-white">Hostel Address</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                      {BUSINESS_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#080E1A] border border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-amber-400 block">Google Plus Code</span>
                    <span className="text-xs font-mono font-bold text-white">{BUSINESS_INFO.plusCode}</span>
                  </div>
                  <a
                    href={BUSINESS_INFO.googleMapsDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in Maps</span>
                  </a>
                </div>

                <div className="pt-2">
                  <a
                    href={BUSINESS_INFO.googleMapsDirections}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Get Exact GPS Driving Directions</span>
                  </a>
                </div>
              </div>

              {/* Nearby Landmarks Walking Times */}
              <div className="bg-[#0B1528] border border-slate-800 rounded-2xl p-6 space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-wider text-amber-400">
                  Key Distances & Walking Times
                </h4>
                <div className="space-y-3 pt-1">
                  {LANDMARKS.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl flex items-center justify-between text-xs ${
                        item.highlight 
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-200' 
                          : 'bg-[#080E1A] border border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-white text-xs">{item.name}</p>
                        <p className="text-[11px] text-slate-400">{item.type}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-amber-400 block">{item.distance}</span>
                        <span className="text-[10px] text-slate-400">{item.walkTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Embedded Google Map */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl h-[460px] lg:h-[580px]">
                <iframe
                  title="Royal Boys and Girls PG Location Map"
                  src={BUSINESS_INFO.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter saturate-150 contrast-125"
                ></iframe>

                {/* Top overlay badge */}
                <div className="absolute top-4 left-4 bg-[#080E1A]/90 backdrop-blur-md border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs text-white shadow-xl flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                  <span><strong>Royal PG:</strong> 350m to Acharya Institute</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 11: CONTACT / BOOKING FORM (WHATSAPP INTEGRATION) */}
      <section id="contact" className="py-16 md:py-24 bg-[#080E1A] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Get in Touch & Book
            </span>
            <h2 className="text-3xl md:text-4xl font-serif-royal font-bold text-white">
              Reserve Your Room or Book a Visit
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
              Fill in your details below to schedule an in-person room visit. Upon clicking "Send via WhatsApp", 
              it instantly opens WhatsApp with all your preferences pre-filled!
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left: Contact Info & Direct Channels */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#0B162C] to-[#0A1222] border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif-royal text-2xl font-bold text-white">
                    Direct Inquiry Desk
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    Have questions about food varieties, specific college distance, or immediate availability? Reach out directly.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Phone */}
                  <a
                    href={`tel:${BUSINESS_INFO.phoneTel}`}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#080E1A] border border-slate-800 hover:border-amber-400/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Call Directly</p>
                      <p className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {BUSINESS_INFO.phoneFormatted}
                      </p>
                    </div>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%2C%20I'm%20interested%20in%20a%20room%20at%20Royal%20Boys%20and%20Girls%20PG`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#080E1A] border border-slate-800 hover:border-emerald-400/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">WhatsApp Chat</p>
                      <p className="text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        Chat on WhatsApp (Instant)
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#080E1A] border border-slate-800">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Email Address</p>
                      <p className="text-xs font-bold text-slate-200">
                        {BUSINESS_INFO.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visiting Hours Callout */}
              <div className="mt-8 pt-6 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mb-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Visiting Hours for Parents & Students:</span>
                </div>
                <p className="text-xs text-slate-300">
                  Monday to Sunday: <strong>8:00 AM – 8:00 PM</strong><br />
                  (Walk-ins welcome, prior booking recommended to ensure room viewing)
                </p>
              </div>

            </div>

            {/* Right: Interactive Booking Form */}
            <div className="lg:col-span-7 bg-[#0B1528] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
              
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Your Full Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-[#080E1A] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Phone / WhatsApp Number <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. 0987654321"
                      className="w-full px-4 py-3 rounded-xl bg-[#080E1A] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    />
                  </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  
                  {/* Accommodation Wing */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Select Section <span className="text-amber-400">*</span>
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#080E1A] border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    >
                      <option value="Boys Section">Boys Section</option>
                      <option value="Girls Section">Girls Section (Dedicated Lady Warden)</option>
                    </select>
                  </div>

                  {/* Sharing Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Preferred Sharing Room <span className="text-amber-400">*</span>
                    </label>
                    <select
                      name="sharingType"
                      value={formData.sharingType}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#080E1A] border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                    >
                      <option value="Single Occupancy">Single Occupancy (Private)</option>
                      <option value="Double Sharing">Double Sharing (Popular)</option>
                      <option value="Triple Sharing">Triple Sharing (Budget)</option>
                      <option value="Any Available">Any Available / Flexible</option>
                    </select>
                  </div>

                </div>

                {/* Expected Move-in Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Expected Move-in / Visit Date
                  </label>
                  <input
                    type="date"
                    name="moveInDate"
                    value={formData.moveInDate}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#080E1A] border border-slate-700 text-white text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                  />
                </div>

                {/* Additional Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Message or Questions (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="e.g. I am joining Acharya Institute next month. Need a room with good sunlight and Wi-Fi."
                    className="w-full px-4 py-3 rounded-xl bg-[#080E1A] border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingToSupabase}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-75 text-slate-950 font-bold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    {isSavingToSupabase ? (
                      <>
                        <Loader2 className="w-5 h-5 text-slate-950 animate-spin" />
                        <span>Saving to Supabase Database & Connecting...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5 text-slate-950" />
                        <span>Reserve Room / Send via WhatsApp</span>
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5">
                    <span>⚡ Automatically saved to Supabase &amp; WhatsApp</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSupabaseModal(true);
                        loadRecentBookings();
                      }}
                      className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Database className="w-3 h-3" />
                      <span>View Database Logs</span>
                    </button>
                  </div>
                </div>

                {/* Supabase & WhatsApp Feedback Status */}
                {supabaseStatus === 'success' && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-xs space-y-1.5 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Saved to Supabase Backend Database!</span>
                    </div>
                    <p className="text-slate-300">
                      Your inquiry has been stored in your Supabase project (<strong>kiwpzxjdbcwkfafngdgj</strong>) and WhatsApp has been launched with your booking details.
                    </p>
                  </div>
                )}

                {supabaseStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 font-bold text-amber-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>Inquiry launched via WhatsApp! (Supabase Notice)</span>
                    </div>
                    <p className="text-slate-300">
                      WhatsApp chat was prepared successfully. Supabase returned: <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded">{supabaseMessage}</code>.
                    </p>
                    <p className="text-[11px] text-slate-400">
                      If you haven't created the <code className="text-white">bookings</code> table in your Supabase dashboard yet,{' '}
                      <button
                        type="button"
                        onClick={() => setShowSupabaseModal(true)}
                        className="text-amber-300 underline font-semibold cursor-pointer"
                      >
                        click here to view the copyable SQL script
                      </button>.
                    </p>
                  </div>
                )}

              </form>

            </div>

          </div>

        </div>
      </section>

      {/* SECTION 12: FOOTER */}
      <footer className="bg-[#050A14] border-t border-slate-800 text-slate-400 pt-16 pb-24 md:pb-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black font-cinzel text-lg">
                  R
                </div>
                <span className="font-cinzel text-base font-bold text-white tracking-wide">
                  ROYAL <span className="text-amber-400">PG</span>
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Royal Boys and Girls PG provides top-tier, hygienic, and safe accommodation in Soladevanahalli, Bengaluru. Walking distance to Acharya Institute.
              </p>
              <div className="flex items-center gap-2 pt-1 text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-[11px]">Separate Wings for Boys & Girls</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">
                Quick Navigation
              </h4>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-amber-300 transition-colors">About Royal PG</a></li>
                <li><a href="#rooms" className="hover:text-amber-300 transition-colors">Room Types & Prices</a></li>
                <li><a href="#amenities" className="hover:text-amber-300 transition-colors">Hostel Amenities</a></li>
                <li><a href="#food" className="hover:text-amber-300 transition-colors">Weekly Food Menu</a></li>
                <li><a href="#gallery" className="hover:text-amber-300 transition-colors">Photo Gallery</a></li>
                <li><a href="#rules" className="hover:text-amber-300 transition-colors">Rules & Security Deposit</a></li>
                <li><a href="#location" className="hover:text-amber-300 transition-colors">Google Map & Distances</a></li>
              </ul>
            </div>

            {/* Column 3: Contact & Landmarks */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">
                Contact & Address
              </h4>
              <p className="leading-relaxed text-slate-300">
                3rd Main Cottage Road, 5th Cross Rd, near Acharya Institute, near Sri Lakshmi Venkateswara Swami Devasthana, Achit Nagar, MSPP Colony, Soladevanahalli, Bengaluru, Karnataka 560107
              </p>
              <p className="pt-1">
                <strong>Phone:</strong> <a href={`tel:${BUSINESS_INFO.phoneTel}`} className="text-amber-400 hover:underline">{BUSINESS_INFO.phoneFormatted}</a>
              </p>
              <p>
                <strong>WhatsApp:</strong> <a href={BUSINESS_INFO.whatsappLink} className="text-emerald-400 hover:underline">+91 96063 38697</a>
              </p>
              <p>
                <strong>Plus Code:</strong> <span className="font-mono text-slate-300">{BUSINESS_INFO.plusCode}</span>
              </p>
            </div>

            {/* Column 4: Nearby Colleges & Standalone Exporter */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">
                Colleges Nearby
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>• Acharya Institute of Technology (AIT)</li>
                <li>• Acharya & BM Reddy College of Pharmacy</li>
                <li>• Acharya Pre-University College</li>
                <li>• Smt. Nagarathnamma College of Nursing</li>
                <li>• Sapthagiri Institute of Medical Sciences (nearby)</li>
              </ul>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setShowCodeModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-300 hover:text-white text-xs cursor-pointer transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>Free Hosting & HTML Export</span>
                </button>
                <button
                  onClick={() => {
                    setShowSupabaseModal(true);
                    loadRecentBookings();
                  }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white text-xs cursor-pointer transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supabase Database Manager</span>
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <p>© {new Date().getFullYear()} Royal Boys and Girls PG. All rights reserved.</p>
            <p>Soladevanahalli, Bengaluru, Karnataka 560107 India</p>
          </div>

        </div>
      </footer>

      {/* FLOATING MOBILE ACTION BAR (Sticky Bottom on Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080E1A]/95 backdrop-blur-lg border-t border-slate-800 p-2.5 px-4 shadow-2xl flex items-center justify-between gap-2">
        <a
          href={`tel:${BUSINESS_INFO.phoneTel}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4 text-amber-400" />
          <span>Call PG</span>
        </a>

        <a
          href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%2C%20I'm%20interested%20in%20a%20room%20at%20Royal%20Boys%20and%20Girls%20PG`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-[#25D366] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <a
          href="#contact"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Visit</span>
        </a>
      </div>

      {/* STANDALONE HTML EXPORT & FREE HOSTING GUIDE MODAL */}
      {showCodeModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowCodeModal(false)}
        >
          <div 
            className="relative max-w-2xl w-full max-h-[85vh] bg-[#0A1222] border border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0B1528]">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  Single Self-Contained HTML File & Free Hosting
                </h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5 text-amber-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Your Self-Contained HTML File Is Ready!
                </h4>
                <p className="leading-relaxed">
                  As requested in your specification, we have created a 100% self-contained standalone HTML file 
                  with inline CSS, vanilla JavaScript, Unsplash images, and clear editable comments 
                  (marked with <code className="bg-slate-900 text-amber-300 px-1 py-0.5 rounded">&lt;!-- EDIT HERE: ... --&gt;</code>).
                </p>
              </div>

              {/* Free Hosting Step-by-Step Instructions */}
              <div className="rounded-xl bg-[#080E1A] border border-slate-800 p-4 space-y-3">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider text-amber-300">
                  How to host this completely free (No coding required):
                </h5>
                
                <div className="space-y-2">
                  <p className="font-semibold text-slate-200">Option 1: Netlify Drop (Easiest — 30 seconds)</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
                    <li>Go to <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">netlify.com/drop</a> in your browser.</li>
                    <li>Save the standalone code below into a file named <strong className="text-white">index.html</strong> inside an empty folder.</li>
                    <li>Drag and drop that folder onto the Netlify webpage.</li>
                    <li>Your website goes live immediately with a free custom SSL URL (e.g. <code className="text-emerald-300">royal-pg-soladevanahalli.netlify.app</code>)!</li>
                  </ol>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <p className="font-semibold text-slate-200">Option 2: GitHub Pages (Free forever)</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
                    <li>Create a free account on <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">GitHub.com</a>.</li>
                    <li>Create a new repository called <code className="text-white">royal-pg</code>.</li>
                    <li>Upload your <strong className="text-white">index.html</strong> file to the main branch.</li>
                    <li>Go to Repository Settings &gt; Pages &gt; select "main" branch &gt; Save.</li>
                    <li>Your site is live at <code className="text-emerald-300">yourusername.github.io/royal-pg</code>!</li>
                  </ol>
                </div>
              </div>

              {/* Download & Direct Open Links */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/royal-boys-and-girls-pg-standalone.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Preview Standalone File Directly</span>
                </a>
                <a
                  href="/royal-boys-and-girls-pg-standalone.html"
                  download="royal-boys-and-girls-pg.html"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download royal-pg.html</span>
                </a>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#080E1A] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                You can also find this file saved in your project repository as <code className="text-amber-300">public/royal-boys-and-girls-pg-standalone.html</code>.
              </span>
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUPABASE BACKEND MANAGER & RECENT BOOKINGS MODAL */}
      {showSupabaseModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowSupabaseModal(false)}
        >
          <div 
            className="relative max-w-3xl w-full max-h-[85vh] bg-[#0A1222] border border-emerald-500/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0B1528]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Supabase Backend Connection
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Project URL: <span className="text-emerald-400 font-mono">https://kiwpzxjdbcwkfafngdgj.supabase.co</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
              
              {/* Connection Status Card */}
              <div className="rounded-xl bg-[#080E1A] border border-emerald-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-white font-bold text-sm">Supabase Backend Active &amp; Ready</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    Whenever a user submits the Booking Form, it is automatically saved into the <code className="text-amber-300">bookings</code> table in your Supabase database.
                  </p>
                </div>

                <button
                  onClick={loadRecentBookings}
                  disabled={isLoadingRecent}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecent ? 'animate-spin' : ''}`} />
                  <span>Refresh Bookings</span>
                </button>
              </div>

              {/* SQL Setup Instructions (in case table not created yet) */}
              <div className="rounded-xl bg-[#080E1A] border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Info className="w-4 h-4" />
                    <span>Supabase SQL Setup Script (Run Once)</span>
                  </div>
                  <button
                    onClick={() => {
                      const sql = `-- 1. Create bookings table in Supabase
CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  section TEXT NOT NULL,
  sharing_type TEXT NOT NULL,
  move_in_date DATE,
  message TEXT,
  status TEXT DEFAULT 'pending'
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous visitors to insert bookings
CREATE POLICY "Allow public booking insert" ON bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 4. Allow reading bookings
CREATE POLICY "Allow public select on bookings" ON bookings
  FOR SELECT TO anon, authenticated
  USING (true);`;
                      navigator.clipboard.writeText(sql);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? "SQL Copied!" : "Copy SQL Script"}</span>
                  </button>
                </div>

                <p className="text-slate-400 text-xs">
                  If you haven't created the <code className="text-white">bookings</code> table yet, go to your <strong>Supabase Dashboard &gt; SQL Editor</strong>, paste this script and click <strong>Run</strong>:
                </p>

                <pre className="p-3 bg-black/60 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
{`CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  section TEXT NOT NULL,
  sharing_type TEXT NOT NULL,
  move_in_date DATE,
  message TEXT,
  status TEXT DEFAULT 'pending'
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public booking insert" ON bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);`}
                </pre>
              </div>

              {/* Live Bookings Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Recent Bookings in Database ({recentBookings.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">Live sync from table: bookings</span>
                </div>

                {recentBookings.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#080E1A] border border-slate-800 text-center text-slate-400 space-y-2">
                    <p className="text-xs">No bookings recorded yet, or table is empty.</p>
                    <p className="text-[11px] text-slate-500">
                      Fill out the Booking Form on the website to test automatic database recording!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0B1528] text-slate-400 uppercase text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Name</th>
                          <th className="py-2.5 px-3">Phone</th>
                          <th className="py-2.5 px-3">Section</th>
                          <th className="py-2.5 px-3">Room</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-[#080E1A]">
                        {recentBookings.map((b: any, idx: number) => (
                          <tr key={b.id || idx} className="hover:bg-slate-900/60">
                            <td className="py-2 px-3 text-slate-400 whitespace-nowrap">
                              {b.created_at ? new Date(b.created_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-2 px-3 font-semibold text-white">
                              {b.full_name || b.name}
                            </td>
                            <td className="py-2 px-3 text-amber-300 font-mono">
                              {b.phone}
                            </td>
                            <td className="py-2 px-3 text-slate-300">
                              {b.section}
                            </td>
                            <td className="py-2 px-3 text-slate-300">
                              {b.sharing_type}
                            </td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                {b.status || 'new'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#080E1A] flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Connected to Supabase Project: <strong className="text-white">kiwpzxjdbcwkfafngdgj</strong>
              </span>
              <button
                onClick={() => setShowSupabaseModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
