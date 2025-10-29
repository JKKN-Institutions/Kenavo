'use client';

import React from 'react';
import Header from '@/components/Header';
import DirectoryHeroSection from '@/components/DirectoryHeroSection';
import Footer from '@/components/Footer';
import Link from 'next/link';

// Map of alumni IDs to actual profile images
const imageMap: { [key: number]: string } = {
  1: "envato_labs_image_edit__4__1_1761718503874_157.png",
  2: "envato_labs_image_edit__4__1_1761718503874_906.png",
  3: "envato_labs_image_edit__4__1_1761718503875_129.png",
  4: "envato_labs_image_edit__4__1_1761718503875_889.png",
  5: "envato_labs_image_edit__4__1_1761718503876_419.png",
  6: "envato_labs_image_edit__4__1_1761718503876_490.png",
  7: "envato_labs_image_edit__4__1_1761718503877_515.png",
  8: "envato_labs_image_edit__4__1_1761718503878_128.png",
  9: "envato_labs_image_edit__4__1_1761718503878_333.png",
  10: "envato_labs_image_edit__4__1_1761718503878_511.png",
  11: "envato_labs_image_edit__4__1_1761718503879_403.png",
  12: "envato_labs_image_edit__4__1_1761718503879_530.png",
  13: "envato_labs_image_edit__4__1_1761718503879_539.png",
  14: "envato_labs_image_edit__4__1_1761718503880_829.png",
  15: "envato_labs_image_edit__4__1_1761718503881_11.png",
  16: "envato_labs_image_edit__4__1_1761718503881_305.png",
  17: "envato_labs_image_edit__4__1_1761718503881_729.png",
  18: "envato_labs_image_edit__4__1_1761718503882_790.png",
  19: "envato_labs_image_edit__4__1_1761718503882_963.png",
  20: "envato_labs_image_edit__4__1_1761718503883_915.png",
  21: "envato_labs_image_edit__4__1_1761718503883_977.png",
  22: "envato_labs_image_edit__4__1_1761718503884_358.png",
  23: "envato_labs_image_edit__4__1_1761718503884_485.png",
  24: "envato_labs_image_edit__4__1_1761718503885_269.png",
  25: "envato_labs_image_edit__4__1_1761718503885_442.png",
  26: "envato_labs_image_edit__4__1_1761718503886_727.png",
  27: "envato_labs_image_edit__4__1_1761718503886_88.png",
  28: "envato_labs_image_edit__4__1_1761718503887_193.png",
  29: "envato_labs_image_edit__4__1_1761718503887_357.png",
  30: "envato_labs_image_edit__4__1_1761718503888_382.png",
  31: "envato_labs_image_edit__4__1_1761718503888_657.png",
  32: "envato_labs_image_edit__4__1_1761718503888_93.png",
  33: "envato_labs_image_edit__4__1_1761718503889_191.png",
  34: "envato_labs_image_edit__4__1_1761718503889_394.png",
  35: "envato_labs_image_edit__4__1_1761718503889_482.png",
  36: "envato_labs_image_edit__4__1_1761718503890_191.png",
  37: "envato_labs_image_edit__4__1_1761718503890_598.png",
  38: "envato_labs_image_edit__4__1_1761718503891_102.png",
  39: "envato_labs_image_edit__4__1_1761718503891_219.png",
  40: "envato_labs_image_edit__4__1_1761718503892_249.png",
  41: "envato_labs_image_edit__4__1_1761718503892_285.png",
  42: "envato_labs_image_edit__4__1_1761718503893_156.png",
  43: "envato_labs_image_edit__4__1_1761718503893_393.png",
  44: "envato_labs_image_edit__4__1_1761718503894_488.png",
  45: "envato_labs_image_edit__4__1_1761718503894_555.png",
  46: "envato_labs_image_edit__4__1_1761718503895_590.png",
  47: "envato_labs_image_edit__4__1_1761718503896_232.png",
  48: "envato_labs_image_edit__4__1_1761718503896_34.png",
  49: "envato_labs_image_edit__4__1_1761718503897_303.png",
  50: "envato_labs_image_edit__4__1_1761718503897_763.png",
  51: "envato_labs_image_edit__4__1_1761718503898_476.png",
  52: "envato_labs_image_edit__4__1_1761718503899_970.png",
  53: "envato_labs_image_edit__4__1_1761718503900_622.png",
  54: "envato_labs_image_edit__4__1_1761718503901_11.png",
  55: "envato_labs_image_edit__4__1_1761718503901_221.png",
  56: "envato_labs_image_edit__4__1_1761718503902_18.png",
  57: "envato_labs_image_edit__4__1_1761718503902_543.png",
  58: "envato_labs_image_edit__4__1_1761718503903_522.png",
  59: "envato_labs_image_edit__4__1_1761718503905_818.png",
  60: "envato_labs_image_edit__4__1_1761718503906_986.png",
  61: "envato_labs_image_edit__4__1_1761718503907_939.png",
  62: "envato_labs_image_edit__4__1_1761718503908_510.png",
  63: "envato_labs_image_edit__4__1_1761718503908_897.png",
  64: "envato_labs_image_edit__4__1_1761718503909_603.png",
  65: "envato_labs_image_edit__4__1_1761718503909_847.png",
  66: "envato_labs_image_edit__4__1_1761718503910_141.png",
  67: "envato_labs_image_edit__4__1_1761718503910_289.png",
  68: "envato_labs_image_edit__4__1_1761718503911_919.png",
  69: "envato_labs_image_edit__4__1_1761718503912_167.png",
  70: "envato_labs_image_edit__4__1_1761718503913_926.png",
  71: "envato_labs_image_edit__4__1_1761718503914_638.png",
  72: "envato_labs_image_edit__4__1_1761718503914_897.png",
  73: "envato_labs_image_edit__4__1_1761718503915_32.png",
  74: "envato_labs_image_edit__4__1_1761718503915_859.png",
  75: "envato_labs_image_edit__4__1_1761718503916_909.png",
  76: "envato_labs_image_edit__4__1_1761718503917_833.png",
  77: "envato_labs_image_edit__4__1_1761718503917_983.png",
  78: "envato_labs_image_edit__4__1_1761718503918_802.png",
  79: "envato_labs_image_edit__4__1_1761718503918_982.png",
  80: "envato_labs_image_edit__4__1_1761718503919_637.png",
  81: "envato_labs_image_edit__4__1_1761718503920_256.png",
  82: "envato_labs_image_edit__4__1_1761718503920_974.png",
  83: "envato_labs_image_edit__4__1_1761718503921_602.png",
  84: "envato_labs_image_edit__4__1_1761718503922_535.png",
  85: "envato_labs_image_edit__4__1_1761718503923_217.png",
  86: "envato_labs_image_edit__4__1_1761718503923_597.png",
  87: "envato_labs_image_edit__4__1_1761718503924_492.png",
  88: "envato_labs_image_edit__4__1_1761718503925_104.png",
  89: "envato_labs_image_edit__4__1_1761718503925_345.png",
  90: "envato_labs_image_edit__4__1_1761718503926_639.png",
  91: "envato_labs_image_edit__4__1_1761718503926_951.png",
  92: "envato_labs_image_edit__4__1_1761718503927_96.png",
  93: "envato_labs_image_edit__4__1_1761718503928_166.png",
  94: "envato_labs_image_edit__4__1_1761718503928_406.png",
  95: "envato_labs_image_edit__4__1_1761718503929_478.png",
  96: "envato_labs_image_edit__4__1_1761718503929_672.png",
  97: "envato_labs_image_edit__4__1_1761718503930_747.png",
  98: "envato_labs_image_edit__4__1_1761718503931_137.png",
  99: "envato_labs_image_edit__4__1_1761718503931_226.png",
  100: "envato_labs_image_edit__4__1_1761718503932_130.png",
  101: "envato_labs_image_edit__4__1_1761718503933_691.png",
  102: "envato_labs_image_edit__4__1_1761718503934_620.png",
  103: "envato_labs_image_edit__4__1_1761718503935_413.png",
  104: "envato_labs_image_edit__4__1_1761718503935_938.png",
  105: "envato_labs_image_edit__4__1_1761718503936_134.png",
  106: "envato_labs_image_edit__4__1_1761718503936_549.png",
  107: "envato_labs_image_edit__4__1_1761718503937_771.png",
  108: "envato_labs_image_edit__4__1_1761718503938_109.png",
  109: "envato_labs_image_edit__4__1_1761718503938_375.png",
  110: "envato_labs_image_edit__4__1_1761718503939_68.png",
  111: "envato_labs_image_edit__4__1_1761718503939_859.png",
  112: "envato_labs_image_edit__4__1_1761718503940_488.png",
  113: "envato_labs_image_edit__4__1_1761718503940_575.png",
  114: "envato_labs_image_edit__4__1_1761718503941_159.png",
  115: "envato_labs_image_edit__4__1_1761718503942_30.png",
  116: "envato_labs_image_edit__4__1_1761718503942_81.png",
  117: "envato_labs_image_edit__4__1_1761718503943_102.png",
  118: "envato_labs_image_edit__4__1_1761718503944_2.png",
  119: "envato_labs_image_edit__4__1_1761718503944_890.png",
  120: "envato_labs_image_edit__4__1_1761718503945_470.png",
  121: "envato_labs_image_edit__4__1_1761718503946_166.png",
  122: "envato_labs_image_edit__4__1_1761718503946_737.png",
  123: "envato_labs_image_edit__4__1_1761718503947_904.png",
  124: "envato_labs_image_edit__4__1_1761718503948_450.png",
  125: "envato_labs_image_edit__4__1_1761718503949_168.png",
  126: "envato_labs_image_edit__4__1_1761718503951_826.png",
  127: "envato_labs_image_edit__4__1_1761718503952_510.png",
  128: "envato_labs_image_edit__4__1_1761718503953_106.png",
  129: "envato_labs_image_edit__4__1_1761718503953_883.png",
  130: "envato_labs_image_edit__4__1_1761718503954_149.png",
  131: "envato_labs_image_edit__4__1_1761718503954_928.png",
  132: "envato_labs_image_edit__4__1_1761718503955_113.png",
  133: "envato_labs_image_edit__4__1_1761718503955_502.png",
  134: "envato_labs_image_edit__4__1_1761718503957_709.png"
};

// Helper function to get actual image URL for each person
const getImageUrl = (id: number) => {
  const imageName = imageMap[id] || "envato_labs_image_edit__4__1_1761718503874_157.png";
  return `/directory-images/${imageName}`;
};

const alumniData = [
  {"id": 1, "name": "A Arjoon"},
  {"id": 2, "name": "Annamalai Natarajan"},
  {"id": 3, "name": "A S Syed Ahamed Khan"},
  {"id": 4, "name": "Antony G Prakash"},
  {"id": 5, "name": "Abishek Valluru"},
  {"id": 6, "name": "Antony J"},
  {"id": 7, "name": "Abraham Francis"},
  {"id": 8, "name": "Aravinth N"},
  {"id": 9, "name": "Arjoon"},
  {"id": 10, "name": "Admin Selvaraj"},
  {"id": 11, "name": "Arokia Roche J"},
  {"id": 12, "name": "Aji P George"},
  {"id": 13, "name": "Alemo Francis"},
  {"id": 14, "name": "Anand"},
  {"id": 15, "name": "Annadurai S.V"},
  {"id": 16, "name": "Ashish Adyanthaya"},
  {"id": 17, "name": "Ashok kumar Rajendran"},
  {"id": 18, "name": "Arul Doss S P S"},
  {"id": 19, "name": "Ashok Loganathan"},
  {"id": 20, "name": "Arun R"},
  {"id": 21, "name": "Arvind Chennu"},
  {"id": 22, "name": "Ashok Kumar S"},
  {"id": 23, "name": "Avaneesh Jasti"},
  {"id": 24, "name": "Bachan"},
  {"id": 25, "name": "Badrinath"},
  {"id": 26, "name": "Balaji A"},
  {"id": 27, "name": "Balaji Srimurugan"},
  {"id": 28, "name": "Bharanidharan"},
  {"id": 29, "name": "Bhargavan Jayanth Kumar"},
  {"id": 30, "name": "Bilal"},
  {"id": 31, "name": "Biswajith Nayak"},
  {"id": 32, "name": "Cam Braganza"},
  {"id": 33, "name": "Carlin Aron Tannen"},
  {"id": 34, "name": "Chacko"},
  {"id": 35, "name": "Charles Ernest"},
  {"id": 36, "name": "Chenthil Aruun Mohan"},
  {"id": 37, "name": "Daniel Vincent"},
  {"id": 38, "name": "Darwin"},
  {"id": 39, "name": "David A"},
  {"id": 40, "name": "David Jacob"},
  {"id": 41, "name": "Debin Davis"},
  {"id": 42, "name": "Deepak Chakravarthy Munirathinam"},
  {"id": 43, "name": "Deepan MK"},
  {"id": 44, "name": "Devaraj"},
  {"id": 45, "name": "Dinesh"},
  {"id": 46, "name": "Frank David"},
  {"id": 47, "name": "Geethakannan"},
  {"id": 48, "name": "George"},
  {"id": 49, "name": "Ghopal Krishnan"},
  {"id": 50, "name": "Gopinath Perumal"},
  {"id": 51, "name": "Hariharan P"},
  {"id": 52, "name": "Harinivas Rajasekaran"},
  {"id": 53, "name": "James Thomson"},
  {"id": 54, "name": "Jeffery"},
  {"id": 55, "name": "Jimmy"},
  {"id": 56, "name": "Joe Abraham"},
  {"id": 57, "name": "John Kennedy Francis"},
  {"id": 58, "name": "Jose Peter Cletus"},
  {"id": 59, "name": "Jose Thomas"},
  {"id": 60, "name": "Joseph Cyriac"},
  {"id": 61, "name": "Joseph Stany"},
  {"id": 62, "name": "Jossey Jacob"},
  {"id": 63, "name": "K Arun Chakkravarthy"},
  {"id": 64, "name": "K.C. Rameshkumar"},
  {"id": 65, "name": "Kamalakannan"},
  {"id": 66, "name": "Karthikeyan D"},
  {"id": 67, "name": "Karthikeyan M"},
  {"id": 68, "name": "Karun Mathulla Mathew"},
  {"id": 69, "name": "Krishnakumar Murugesan"},
  {"id": 70, "name": "Kumaran Srinivasan"},
  {"id": 71, "name": "Kumaravel"},
  {"id": 72, "name": "Kunal"},
  {"id": 73, "name": "Lalchhanhima"},
  {"id": 74, "name": "Lalfakzuala"},
  {"id": 75, "name": "Lalhruaitluanga Khiangte"},
  {"id": 76, "name": "Lura"},
  {"id": 77, "name": "Malsawma"},
  {"id": 78, "name": "Mantah"},
  {"id": 79, "name": "Mathew Kodath"},
  {"id": 80, "name": "Medo Lalzarliana"},
  {"id": 81, "name": "Mehfooz"},
  {"id": 82, "name": "Mickey"},
  {"id": 83, "name": "Mohamed Niaz"},
  {"id": 84, "name": "Naveen G"},
  {"id": 85, "name": "Niresh Ramalingam"},
  {"id": 86, "name": "Nirmal Kumar"},
  {"id": 87, "name": "Nirmal Suresh Pattassery"},
  {"id": 88, "name": "Ommsharravana"},
  {"id": 89, "name": "Paul"},
  {"id": 90, "name": "Pinga"},
  {"id": 91, "name": "Prabhu"},
  {"id": 92, "name": "Pradeep Seshan"},
  {"id": 93, "name": "Pramod Sankar"},
  {"id": 94, "name": "Pranesh Mario Bhaskar"},
  {"id": 95, "name": "Prasadhkanna Kanthruban Rathinavelu"},
  {"id": 96, "name": "Prasanna Venkidasamy Sathyanarayanan"},
  {"id": 97, "name": "Pratap"},
  {"id": 98, "name": "Praveen Kumar R"},
  {"id": 99, "name": "Pravin Kumar Raju"},
  {"id": 100, "name": "Prem Kumar Soundarrajan"},
  {"id": 101, "name": "Prithivinath Ravindranath"},
  {"id": 102, "name": "Purushothaman Elango"},
  {"id": 103, "name": "R Ramesh Krishnan"},
  {"id": 104, "name": "Rajendran Rangaraj"},
  {"id": 105, "name": "Rathishkanth"},
  {"id": 106, "name": "Salai Sivaprakasam"},
  {"id": 107, "name": "Saran Kumar"},
  {"id": 108, "name": "Selvakumar Sundaram"},
  {"id": 109, "name": "Shankkar Suyambulingam"},
  {"id": 110, "name": "Shravan Kumar Avula"},
  {"id": 111, "name": "Sri Vishnu"},
  {"id": 112, "name": "Srinivasan N"},
  {"id": 113, "name": "Subbu Shanmugam Sundaresan"},
  {"id": 114, "name": "Suraj de Rozario"},
  {"id": 115, "name": "Suresh Louis"},
  {"id": 116, "name": "Tabish"},
  {"id": 117, "name": "Tarunesh Pasuparthy"},
  {"id": 118, "name": "Thiagu R"},
  {"id": 119, "name": "Tom Jogy"},
  {"id": 120, "name": "Tony Luke"},
  {"id": 121, "name": "Vairavan Subramanian"},
  {"id": 122, "name": "Varadharajulu Chandrasekaran"},
  {"id": 123, "name": "Venkatesh"},
  {"id": 124, "name": "Vibin J Cheeran"},
  {"id": 125, "name": "Vignesh M Ramamoorthy"},
  {"id": 126, "name": "Vinod Maliyekal"},
  {"id": 127, "name": "Vinoth Kannan"},
  {"id": 128, "name": "Vishnu palanisami"},
  {"id": 129, "name": "Vishnuvardan Raveendran"},
  {"id": 130, "name": "Vishwanath Raj"},
  {"id": 131, "name": "Vongsatorn Lertsethtakarn"},
  {"id": 132, "name": "VT Martin Vabeiduakhe"},
  {"id": 133, "name": "Yuvaraj"},
  {"id": 134, "name": "Suhail"}
];

// Generate alumni array with image URLs
const alumni = alumniData.map(person => ({
  ...person,
  slug: person.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, ''),
  imageUrl: getImageUrl(person.id)
}));

// Group alumni by first letter
const groupByLetter = () => {
  const groups: { [key: string]: typeof alumni } = {};
  alumni.forEach(person => {
    const firstLetter = person.name.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(person);
  });
  return groups;
};

const alumniByLetter = groupByLetter();
const letters = Object.keys(alumniByLetter).sort();

export default function TestDirectoryPage() {
  const AlphabetNavigation = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return (
      <div className="text-[rgba(254,249,232,1)] text-[28px] font-normal leading-none self-stretch mt-[51px] max-md:max-w-full max-md:mt-10">
        {alphabet.map((letter, index) => {
          const hasProfiles = letters.includes(letter);
          return (
            <span key={letter}>
              {hasProfiles ? (
                <a
                  href={`#letter-${letter}`}
                  className="text-[rgba(217,65,66,1)] hover:text-[rgba(217,65,66,0.8)] transition-colors"
                >
                  {letter}
                </a>
              ) : (
                <span className="opacity-50">
                  {letter}
                </span>
              )}
              {index < alphabet.length - 1 && ' '}
            </span>
          );
        })}
      </div>
    );
  };

  const ProfileCard = ({ profile }: { profile: any }) => {
    return (
      <article className="bg-[rgba(44,23,82,1)] flex grow flex-col font-normal w-full px-[19px] py-6 max-md:mt-[23px] max-md:pr-5">
        <img
          src={profile.imageUrl}
          className="aspect-[0.97] object-contain w-full self-stretch"
          alt={`${profile.name} profile`}
        />
        <div className="text-[rgba(254,249,232,1)] text-[28px] leading-[1.2] mt-[15px]">
          {profile.name}
        </div>
        <Link
          href={`/directory/${profile.slug}`}
          className="text-[rgba(217,81,100,1)] text-lg leading-none underline mt-[97px] max-md:mt-10 text-left hover:text-[rgba(217,81,100,0.8)] transition-colors"
        >
          View More
        </Link>
      </article>
    );
  };

  return (
    <div className="bg-[rgba(64,34,120,1)] flex flex-col overflow-hidden items-stretch">
      <Header />
      <DirectoryHeroSection />

      <main className="self-center flex w-[1011px] max-w-full flex-col ml-[38px] mt-[65px] px-5 max-md:mt-10">
        <p className="text-[rgba(254,249,232,1)] text-[28px] font-normal leading-9 max-md:max-w-full">
          Start exploring you might just reconnect with someone you forgot you
          missed.
        </p>

        <AlphabetNavigation />

        {/* All sections A-Z */}
        {letters.map((letter, letterIndex) => (
          <section key={letter} id={`letter-${letter}`}>
            <h2 className={`text-[rgba(217,81,100,1)] text-[42px] font-bold leading-none ${letterIndex === 0 ? 'mt-[285px]' : 'mt-[61px]'} max-md:ml-2 max-md:mt-10`}>
              {letter}
            </h2>

            {Array.from({ length: Math.ceil(alumniByLetter[letter].length / 3) }, (_, groupIndex) => (
              <div key={groupIndex} className="w-[931px] max-w-full mt-[47px] max-md:mt-10">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch">
                  {alumniByLetter[letter].slice(groupIndex * 3, (groupIndex + 1) * 3).map((profile, index) => (
                    <div key={index} className="w-[33%] max-md:w-full max-md:ml-0">
                      <ProfileCard profile={profile} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}
