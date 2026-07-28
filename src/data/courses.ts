import { Course } from '../types';

export const coursesData: Course[] = [
  {
    id: 1,
    slug: 'computer-basics',
    title: 'Computer Basics & Digital Literacy',
    description: 'কম্পিউটার, Operating Systems (Windows/Linux), Hardware, Software ও Internet-এর A to Z — একদম শূন্য থেকে শুরু।',
    icon: '🖥️',
    level: 'Beginner',
    duration: '10 hrs',
    rating: 4.8,
    students: '3,200+',
    price: 'Free',
    priceAmount: 0,
    isFree: true,
    category: ['beginner'],
    badge: 'Foundation',
    badgeColor: 'secondary',
    learningDetails: {
      summary: 'এই কোর্সটি কম্পিউটারের মৌলিক আর্কিটেকচার, মেমোরি ম্যানেজমেন্ট, প্রসেসর ওয়ার্কফ্লো, অপারেটিং সিস্টেমের অভ্যন্তরীণ কার্যক্রম এবং ডিজিটাল নিরাপত্তা সম্পর্কে একটি শক্তিশালী ভিত্তি তৈরি করে।',
      keyOutcomes: [
        'কম্পিউটারের হার্ডওয়্যার এবং সফটওয়্যারের ইন্টারঅ্যাকশন বোঝা',
        'উইনডোজ, লিনাক্স এবং ম্যাকওএস অপারেটিং সিস্টেমের তুলনা',
        'ইন্টারনেট প্রটোকল (TCP/IP, HTTP/HTTPS, DNS) এর কার্যপ্রণালী',
        'সাইবার থ্রেট থেকে ব্যক্তিগত আইডি ও পাসওয়ার্ড সুরক্ষিত রাখা'
      ],
      prerequisites: ['কোন পূর্ববর্তী টেকনিক্যাল অভিজ্ঞতার প্রয়োজন নেই'],
      referenceLinks: [
        {
          title: 'Computer Basics Tutorial - GCFGlobal',
          url: 'https://edu.gcfglobal.org/en/computerbasics/',
          siteName: 'GCFGlobal.org',
          description: 'মৌলিক কম্পিউটার ব্যবহারের উপর ফ্রী গাইড ও টিউটোরিয়াল।'
        },
        {
          title: 'How Computers Work - Code.org',
          url: 'https://code.org/howcomputerswork',
          siteName: 'Code.org',
          description: 'বিল গেটস এবং সফটওয়্যার ইঞ্জিনিয়ারদের ভিডিও ভিজ্যুয়াল গাইড।'
        },
        {
          title: 'Official Ubuntu Documentation',
          url: 'https://help.ubuntu.com/',
          siteName: 'Ubuntu.com',
          description: 'লিনাক্স অপারেটিং সিস্টেমের অফিশিয়াল গাইড ও টিউটোরিয়াল।'
        }
      ]
    },
    modules: [
      {
        title: 'Introduction to Computers',
        lessons: [
          {
            id: 'cb-1-1',
            name: 'What is a Computer & How it Works',
            icon: '🎥',
            dur: '15 min',
            free: true,
            quiz: [
              {
                id: 'q1',
                question: 'কম্পিউটারের প্রধান ব্রেইন কাকে বলা হয়?',
                options: ['RAM', 'CPU (Central Processing Unit)', 'Hard Disk', 'Power Supply'],
                correctAnswer: 1,
                explanation: 'CPU প্রসেসিংয়ের প্রধান কাজগুলো সম্পন্ন করে বলে একে কম্পিউটারের মস্তিষ্ক বলা হয়।'
              },
              {
                id: 'q2',
                question: 'ভোলটাইল (Volatile) মেমোরি কোনটি যা পাওয়ার বন্ধ করলে ডেটা মুছে যায়?',
                options: ['ROM', 'RAM', 'SSD', 'NVMe'],
                correctAnswer: 1,
                explanation: 'RAM হলো প্রাইমারি অস্থায়ী মেমোরি।'
              },
              {
                id: 'q3',
                question: 'ইনপুট ডিভাইসের একটি সঠিক উদাহরণ কোনটি?',
                options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'],
                correctAnswer: 2,
                explanation: 'কি-বোর্ডের মাধ্যমে কম্পিউটারে তথ্য ইনপুট দেওয়া হয়।'
              }
            ]
          },
          {
            id: 'cb-1-2',
            name: 'Computer Hardware vs Software explained',
            icon: '📖',
            dur: '12 min',
            free: true,
            quiz: [
              {
                id: 'q1',
                question: 'অপারেটিং সিস্টেম (OS) কোন ধরণের সফটওয়্যার?',
                options: ['System Software', 'Application Software', 'Utility Software', 'Malware'],
                correctAnswer: 0,
                explanation: 'OS মূল সিস্টেম হার্ডওয়্যার পরিচালনা করে।'
              },
              {
                id: 'q2',
                question: 'নিচের কোনটি প্রাইমারি স্টোরেজ ডিভাইস?',
                options: ['Pen Drive', 'RAM', 'DVD-ROM', 'External Hard Drive'],
                correctAnswer: 1,
                explanation: 'RAM হলো মেমোরি হায়ারার্কির প্রাইমারি স্টোরেজ।'
              },
              {
                id: 'q3',
                question: 'কম্পিউটার মাদারবোর্ডের প্রধান কাজ কী?',
                options: ['ডিসপ্লে দেখানো', 'সকল হার্ডওয়্যার পার্টস সংযুক্ত ও যোগাযোগ করানো', 'পাওয়ার সাপ্লাই দেওয়া', 'ইন্টারনেট দেওয়া'],
                correctAnswer: 1,
                explanation: 'মাদারবোর্ড সার্কিট বোর্ডের মাধ্যমে সব পার্টস কানেক্ট করে।'
              }
            ]
          },
          {
            id: 'cb-1-3',
            name: 'Assessment: Computer Architecture Quiz',
            icon: '❓',
            dur: '5 min',
            free: false,
            quiz: [
              {
                id: 'q1',
                question: '1 Byte সমান কত Bits?',
                options: ['4 Bits', '8 Bits', '16 Bits', '32 Bits'],
                correctAnswer: 1,
                explanation: '১ বাইট = ৮ বিটস।'
              },
              {
                id: 'q2',
                question: 'BIOS এর পূর্ণরূপ কী?',
                options: ['Basic Input Output System', 'Binary Input Output Software', 'Base Internal Operating System', 'Buffered Input Output Storage'],
                correctAnswer: 0,
                explanation: 'BIOS = Basic Input Output System.'
              },
              {
                id: 'q3',
                question: 'SSD কেন প্রচলিত HDD অপেক্ষা দ্রুত কাজ করে?',
                options: ['কারণ এটিতে ফ্ল্যাশ মেমোরি ব্যবহার হয় এবং কোনো ঘূর্ণায়মান যন্ত্রাংশ থাকে না', 'কারণ এটি আকারে বড়', 'কারণ এটি কম বিদ্যুৎ খরচ করে', 'সবগুলো ভুল'],
                correctAnswer: 0,
                explanation: 'NAND flash memory ব্যবহারের জন্য SSD এর রিড/রাইট স্পিড বহুগুণ বেশি।'
              }
            ]
          }
        ]
      },
      {
        title: 'Operating Systems Deep Dive',
        lessons: [
          {
            id: 'cb-2-1',
            name: 'Windows vs Linux vs macOS Overview',
            icon: '🎥',
            dur: '20 min',
            free: false,
            quiz: [
              {
                id: 'q1',
                question: 'কোন অপারেটিং সিস্টেমটি ওপেন-সোর্স (Open Source)?',
                options: ['Windows 11', 'macOS Sonoma', 'Linux (e.g. Ubuntu)', 'iOS'],
                correctAnswer: 2,
                explanation: 'লিনাক্স কার্নেল ও বেশিরভাগ ডিস্ট্রো ওপেন সোর্স।'
              },
              {
                id: 'q2',
                question: 'সাইবার সিকিউরিটি ও সার্ভার ব্যবস্থাপনায় সবচেয়ে বেশি ব্যবহৃত OS কোনটি?',
                options: ['Windows Home', 'Linux', 'macOS', 'Android'],
                correctAnswer: 1,
                explanation: 'Linux এর নিরাপত্তা ও কাস্টমাইজেশনের কারণে সার্ভারে জনপ্রিয়।'
              },
              {
                id: 'q3',
                question: 'অপারেটিং সিস্টেমের মূল কেন্দ্রকে কী বলে?',
                options: ['Shell', 'Kernel', 'Terminal', 'GUI'],
                correctAnswer: 1,
                explanation: 'Kernel হার্ডওয়্যার ও প্রসেসের মধ্যস্থতা করে।'
              }
            ]
          },
          {
            id: 'cb-2-2',
            name: 'Hands-on: Installing your first Virtual OS',
            icon: '🧪',
            dur: '30 min',
            free: false,
            quiz: [
              {
                id: 'q1',
                question: 'ভার্চুয়াল মেশিন তৈরির জনপ্রিয় সফটওয়্যার কোনটি?',
                options: ['VirtualBox / VMware', 'Photoshop', 'VLC Media Player', 'MS Word'],
                correctAnswer: 0,
                explanation: 'VirtualBox/VMware হাইপারভাইজর দিয়ে টেস্ট এনভায়রনমেন্ট বানানো যায়।'
              },
              {
                id: 'q2',
                question: 'ভার্চুয়াল মেশিনে OS ইনস্টল করতে কোন ফাইল ব্যবহার করা হয়?',
                options: ['.exe', '.iso', '.zip', '.mp4'],
                correctAnswer: 1,
                explanation: 'ISO ইমেজ ডিস্ক ফাইল ড্রাইভে মাউন্ট করা হয়।'
              },
              {
                id: 'q3',
                question: 'ভার্চুয়ালাইজেশনের প্রধান সুবিধা কী?',
                options: ['মূল কম্পিউটার নিরাপদ রেখে নতুন OS এবং সিকিউরিটি টুলস টেস্ট করা', 'ইন্টারনেট স্পিড দ্বিগুণ করা', 'ফাইল সাইজ ছোট করা', 'কোনটিই নয়'],
                correctAnswer: 0,
                explanation: 'আইসোলেটেড এনভায়রনমেন্ট তৈরি করা ভার্চুয়ালাইজেশনের সেরা সুবিধা।'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    slug: 'python-fundamentals',
    title: 'Programming Fundamentals with Python',
    description: 'Python দিয়ে প্রোগ্রামিং শুরু করো — Variables, Loops, Functions, OOP থেকে রিয়েল-লাইফ প্রোজেক্ট পর্যন্ত।',
    icon: '🐍',
    level: 'Beginner',
    duration: '18 hrs',
    rating: 4.9,
    students: '5,100+',
    price: '৳৯৯৯',
    priceAmount: 999,
    isFree: false,
    category: ['beginner', 'programming'],
    badge: 'Programming',
    badgeColor: 'primary',
    learningDetails: {
      summary: 'পাইথন হলো বিশ্বের অন্যতম সহজ এবং জনপ্রিয় প্রোগ্রামিং ল্যাঙ্গুয়েজ। এই কোর্সে পাইথনের প্রাথমিক সিনট্যাক্স, ডাটা স্ট্রাকচার, অবজেক্ট অরিয়েন্টেড প্রোগ্রামিং (OOP) এবং স্ক্রিপ্টিং অটোমেশন শেখানো হয়।',
      keyOutcomes: [
        'পাইথন ভ্যারিয়েবল, লিস্ট, ডিকশনারি ও ডাটা টাইপ আয়ত্ত করা',
        'লজিক্যাল কন্ডিশন (if-else) এবং লুপ (for/while) এর দক্ষ ব্যবহার',
        'ফাংশন ও মডিউল তৈরি করে কোড রি-ইউজেবল করা',
        'অবজেক্ট অরিয়েন্টেড প্রোগ্রামিং (Class, Object, Inheritance)'
      ],
      prerequisites: ['মৌলিক কম্পিউটার চালনার অভিজ্ঞতা'],
      referenceLinks: [
        {
          title: 'Official Python 3 Documentation',
          url: 'https://docs.python.org/3/',
          siteName: 'Python.org',
          description: 'পাইথন ল্যাঙ্গুয়েজের অফিশিয়াল রেফারেন্স ও স্ট্যান্ডার্ড লাইব্রেরি।'
        },
        {
          title: 'W3Schools Python Tutorials',
          url: 'https://www.w3schools.com/python/',
          siteName: 'W3Schools.com',
          description: 'ইন্টারেক্টিভ পাইথন কোড এডিটরসহ প্র্যাকটিক্যাল উদাহরণ।'
        },
        {
          title: 'Real Python Tutorials',
          url: 'https://realpython.com/',
          siteName: 'RealPython.com',
          description: 'অ্যাডভান্সড পাইথন ডেভেলপার গাইড ও প্র্যাকটিক্যাল প্রজেক্টস।'
        }
      ]
    },
    modules: [
      {
        title: 'Python Environment Setup',
        lessons: [
          {
            id: 'py-1-1',
            name: 'Installing Python & VS Code on Windows/Linux',
            icon: '🎥',
            dur: '20 min',
            free: true,
            quiz: [
              {
                id: 'q1',
                question: 'পাইথন ফাইল এক্সটেনশন কোনটি?',
                options: ['.pt', '.py', '.python', '.cpp'],
                correctAnswer: 1,
                explanation: 'পাইথন স্ক্রিপ্ট ফাইলগুলোর নাম .py এক্সটেনশন দিয়ে শেষ হয়।'
              },
              {
                id: 'q2',
                question: 'কম্পিউটারে ইনস্টল করা Python এর ভার্সন চেক করার কমান্ড কোনটি?',
                options: ['python --version', 'py check', 'python status', 'ver python'],
                correctAnswer: 0,
                explanation: 'python --version বা python3 --version কমান্ড দিয়ে ভার্সন চেক করা হয়।'
              },
              {
                id: 'q3',
                question: 'VS Code কী জাতীয় সফটওয়্যার?',
                options: ['অপারেটিং সিস্টেম', 'সোর্স কোড এডিটর / IDE', 'ডাটাবেস ম্যানেজমেন্ট', 'অ্যান্টিভাইরাস'],
                correctAnswer: 1,
                explanation: 'VS Code হলো জনপ্রিয় কোড এডিটর।'
              }
            ]
          },
          {
            id: 'py-1-2',
            name: 'Interactive: Writing your first Hello World Script',
            icon: '💻',
            dur: '15 min',
            free: true,
            quiz: [
              {
                id: 'q1',
                question: 'পাইথনে স্ক্রিনে আউটপুট দেখানোর জন্য কোন ফাংশন ব্যবহৃত হয়?',
                options: ['console.log()', 'System.out.println()', 'print()', 'echo()'],
                correctAnswer: 2,
                explanation: 'Python-এ print() ফাংশন দিয়ে আউটপুট প্রিন্ট করা হয়।'
              },
              {
                id: 'q2',
                question: 'পাইথনে এক লাইনের কমেন্ট লেখার চিহ্ন কোনটি?',
                options: ['//', '/*', '#', '<!--'],
                correctAnswer: 2,
                explanation: '# সিম্বল দিয়ে এক লাইনের কমেন্ট লেখা হয়।'
              },
              {
                id: 'q3',
                question: 'print("Hello" + " " + "World") এর আউটপুট কী হবে?',
                options: ['Hello World', 'HelloWorld', 'Error', 'Hello+World'],
                correctAnswer: 0,
                explanation: 'স্ট্রিং কনক্যাটেনেশন স্পেসসহ Hello World দেখাবে।'
              }
            ]
          }
        ]
      },
      {
        title: 'Core Python Syntax & Logic',
        lessons: [
          {
            id: 'py-2-1',
            name: 'Data Types, Variables & Basic Operations',
            icon: '🎥',
            dur: '22 min',
            free: false,
            quiz: [
              {
                id: 'q1',
                question: 'x = 10.5 পাইথনে কোন ডাটা টাইপ?',
                options: ['int', 'float', 'str', 'bool'],
                correctAnswer: 1,
                explanation: 'দশমিক সংখ্যা পাইথনে float টাইপ।'
              },
              {
                id: 'q2',
                question: 'পাইথনে পরিবর্তনযোগ্য (Mutable) সিকোয়েন্স ডাটা টাইপ কোনটি?',
                options: ['Tuple', 'List', 'String', 'Int'],
                correctAnswer: 1,
                explanation: 'List হলো পরিবর্তনযোগ্য (mutable)।'
              },
              {
                id: 'q3',
                question: 'len([10, 20, 30, 40]) এর মান কত?',
                options: ['3', '4', '5', '40'],
                correctAnswer: 1,
                explanation: 'লিস্টে ৪টি উপাদান রয়েছে।'
              }
            ]
          },
          {
            id: 'py-2-2',
            name: 'Conditional Statements & Repetitive Loops',
            icon: '🎥',
            dur: '28 min',
            free: false,
            quiz: [
              {
                id: 'q1',
                question: 'পাইথনে `else if` এর সংক্ষিপ্ত রূপ কোনটি?',
                options: ['elseif', 'else-if', 'elif', 'if else'],
                correctAnswer: 2,
                explanation: 'Python-এ elif কি-ওয়ার্ড ব্যবহার হয়।'
              },
              {
                id: 'q2',
                question: 'range(5) লুপে কতবার ঘুরবে?',
                options: ['1 থেকে 5 পর্যন্ত (5 বার)', '0 থেকে 4 পর্যন্ত (5 বার)', '0 থেকে 5 পর্যন্ত (6 বার)', '1 বার'],
                correctAnswer: 1,
                explanation: 'range(5) ০, ১, ২, ৩, ৪ তৈরি করে।'
              },
              {
                id: 'q3',
                question: 'লুপ থেকে সাথে সাথে বের হয়ে যাওয়ার জন্য কোন কি-ওয়ার্ড ব্যবহুত হয়?',
                options: ['continue', 'pass', 'break', 'exit'],
                correctAnswer: 2,
                explanation: 'break কি-ওয়ার্ড লুপ থামিয়ে দেয়।'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    slug: 'linux-mastery',
    title: 'Linux & Command Line Mastery',
    description: 'সাইবার সিকিউরিটির প্রধান ভিত্তি — Linux Operating System, Bash scripting ও System Administration হ্যাকারদের মতো করে শেখো।',
    icon: '🐧',
    level: 'Intermediate',
    duration: '22 hrs',
    rating: 4.9,
    students: '2,800+',
    price: '৳১,৪৯৯',
    priceAmount: 1499,
    isFree: false,
    category: ['intermediate', 'security'],
    badge: 'Linux',
    badgeColor: 'primary',
    learningDetails: {
      summary: 'সাইবার নিরাপত্তা, দেবঅপ্স (DevOps) এবং সার্ভার অ্যাডমিনিস্ট্রেশনের মূল ভিত্তি হলো লিনাক্স। এই কোর্সে ফাইল সিস্টেম, ইউজার পারমিশন, ব্যাশ অটোমেশন ও নেটওয়ার্ক অ্যানালাইসিস শেখানো হয়।',
      keyOutcomes: [
        'লিনাক্স ফাইল সিস্টেম হায়ারার্কি (FHS) এর পুঙ্খানুপুঙ্খ ধারণা',
        'কম্যান্ড লাইন টার্মিনাল (CLI) দিয়ে ফাইল পরিচালনা ও সার্চিং',
        'ইউজার পারমিশন (chmod, chown, sudo) কাস্টমাইজ করা',
        'ব্যাশ (Bash) সেল স্ক্রিপ্টিং দিয়ে প্রসেস অটোমেশন'
      ],
      prerequisites: ['কম্পিউটারের বেসিক ধারণা ও অপারেটিং সিস্টেম জানা'],
      referenceLinks: [
        {
          title: 'The Linux Documentation Project',
          url: 'https://tldp.org/',
          siteName: 'TLDP.org',
          description: 'লিনাক্স গাইডবুক, হাও-টু (HowTo) এবং ম্যানুয়াল পেজেস।'
        },
        {
          title: 'Linux Journey Interactive Learning',
          url: 'https://linuxjourney.com/',
          siteName: 'LinuxJourney.com',
          description: 'লিনাক্স কমান্ডের সেরা ও সহজ ফ্রি ইন্টারঅ্যাক্টিভ পাঠ।'
        },
        {
          title: 'Ubuntu Server Documentation',
          url: 'https://ubuntu.com/server/docs',
          siteName: 'Ubuntu.com',
          description: 'সার্ভার এনভায়রনমেন্ট ও লিনাক্স সিগন্যাল গাইড।'
        }
      ]
    },
    modules: [
      {
        title: 'Linux Operating System Architecture',
        lessons: [
          {
            id: 'lin-1-1',
            name: 'Introduction to Linux Kernel & Distributions',
            icon: '🎥',
            dur: '15 min',
            free: true,
            quiz: [
              {
                id: 'q1',
                question: 'লিনাক্স কার্নেল প্রথম কে তৈরি করেছিলেন?',
                options: ['Linus Torvalds', 'Bill Gates', 'Steve Jobs', 'Richard Stallman'],
                correctAnswer: 0,
                explanation: '১৯৯১ সালে লাইナス তোরভাল্ডস লিনাক্স কার্নেল তৈরি করেন।'
              },
              {
                id: 'q2',
                question: 'নিচের কোনটি একটি জনপ্রিয় লিনাক্স ডিস্ট্রিবিউশন (Distro)?',
                options: ['Ubuntu', 'Kali Linux', 'Fedora', 'সবগুলোই সত্য'],
                correctAnswer: 3,
                explanation: 'উবুন্টু, কালি, ফেডোরা সবই লিনাক্স ডিস্ট্রো।'
              },
              {
                id: 'q3',
                question: 'লিনাক্সে রুট (root) ইউজারের ক্ষমতা কী?',
                options: ['সীমিত ইউজার এক্সেস', 'সর্বোচ্চ সিস্টেম অ্যাডমিনিস্ট্রেটর এক্সেস', 'শুধুমাত্র ফাইল রিড করা', 'কোনটিই নয়'],
                correctAnswer: 1,
                explanation: 'Root ইউজার হলো লিনাক্সের সুপার-ইউজার।'
              }
            ]
          },
          {
            id: 'lin-1-2',
            name: 'Terminal Basics: Moving inside Directories',
            icon: '🧪',
            dur: '20 min',
            free: true,
            quiz: [
              {
                id: 'q1',
                question: 'বর্তমান ফোল্ডার / ডিরেক্টরির পাথ দেখার কমান্ড কোনটি?',
                options: ['pwd', 'cd', 'ls', 'whoami'],
                correctAnswer: 0,
                explanation: 'pwd = Print Working Directory.'
              },
              {
                id: 'q2',
                question: 'ডিরেক্টরির ভেতরের ফাইল বা ফোল্ডারের তালিকা দেখার কমান্ড কোনটি?',
                options: ['dir', 'ls', 'show', 'list'],
                correctAnswer: 1,
                explanation: 'ls কমান্ড দিয়ে ফাইল ডিরেক্টরি লিস্ট করা হয়।'
              },
              {
                id: 'q3',
                question: 'এক ধাপ পেছনে (Parent Directory) যাওয়ার জন্য কোন কমান্ড ব্যবহার হয়?',
                options: ['cd ..', 'cd /', 'cd ~', 'back'],
                correctAnswer: 0,
                explanation: 'cd .. দিলে প্যারেন্ট ডিরেক্টরি তে ফেরা যায়।'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 4,
    slug: 'web-security',
    title: 'Web Application Security & OWASP Top 10',
    description: 'ওয়েব হ্যাকিং প্রতিরোধের হাতে-কলমে প্র্যাকটিস — OWASP Top 10, SQL Injection, XSS, CSRF ও সেশন হাইজ্যাকিং।',
    icon: '🔐',
    level: 'Intermediate',
    duration: '25 hrs',
    rating: 4.9,
    students: '1,950+',
    price: '৳১,৯৯৯',
    priceAmount: 1999,
    isFree: false,
    category: ['intermediate', 'security'],
    badge: 'Security',
    badgeColor: 'accent',
    learningDetails: {
      summary: 'ওয়েব অ্যাপ্লিকেশনের নিরাপত্তা ত্রুটি সনাক্তকরণ ও সমাধানের সবচেয়ে গুরুত্বপূর্ণ ফ্রেমওয়ার্ক হলো OWASP Top 10। এই কোর্সে প্র্যাকটিক্যাল ল্যাবের সাহায্যে SQLi, XSS, CSRF ও সেশন টেস্ট শেখানো হয়।',
      keyOutcomes: [
        'OWASP Top 10 সিকিউরিটি রিস্কের গভীর বিশ্লেষণ',
        'SQL Injection (SQLi) সনাক্ত ও প্রতিরোধ করা',
        'Cross-Site Scripting (XSS) রিফ্লেক্টেড ও স্টোর্ড অ্যাটাক প্রতিরোধ',
        'কুকিজ, সেসন হাইজ্যাকিং ও ব্রোকেন অথেনটিকেশন রিমোডিয়াশন'
      ],
      prerequisites: ['HTML, JavaScript, HTTP Protocols এবং বেসিক ডাটাবেস ধারণা'],
      referenceLinks: [
        {
          title: 'OWASP Top 10 Official Project',
          url: 'https://owasp.org/www-project-top-ten/',
          siteName: 'OWASP.org',
          description: 'ওয়েব অ্যাপ সিকিউরিটির অফিশিয়াল স্ট্যান্ডবাই গাইডলাইন।'
        },
        {
          title: 'PortSwigger Web Security Academy',
          url: 'https://portswigger.net/web-security',
          siteName: 'PortSwigger.net',
          description: 'ফ্রি ওয়েবল্যাব ও ইন্টারঅ্যাক্টিভ সিকিউরিটি টিউটোরিয়ালস।'
        },
        {
          title: 'MDN Web Security Documentation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/Security',
          siteName: 'MDN Web Docs',
          description: 'ব্রাউজার সিকিউরিটি প্রটোকল ও CORS গাইড।'
        }
      ]
    },
    modules: [
      {
        title: 'Web Protocols & Structure',
        lessons: [
          {
            id: 'web-1-1',
            name: 'HTTP Requests, Responses & Cookies deep-dive',
            icon: '🎥',
            dur: '20 min',
            free: true,
            quiz: [
              {
                id: 'q1',
                question: 'HTTP Status Code 200 এর অর্থ কী?',
                options: ['OK / Success', 'Not Found', 'Unauthorized', 'Internal Server Error'],
                correctAnswer: 0,
                explanation: '২০০ মানে সফল রিকোয়েস্ট।'
              },
              {
                id: 'q2',
                question: 'ফর্মে সেনসিটিভ ডেটা (যেমন পাসওয়ার্ড) পাঠানোর জন্য কোন HTTP Method ব্যবহার করা নিরাপদ?',
                options: ['GET', 'POST', 'PUT', 'TRACE'],
                correctAnswer: 1,
                explanation: 'POST মেথডে ডেটা বডিতে যায়, URL-এ প্রকাশ পায় না।'
              },
              {
                id: 'q3',
                question: 'কুকিতে `HttpOnly` ফ্ল্যাগ ব্যবহার করার সুবিধা কী?',
                options: ['ক্লায়েন্ট-সাইড JavaScript দ্বারা কুকি চুরি হওয়া প্রতিরোধ করে', 'কুকির ফাইল সাইজ বাড়ায়', 'ইন্টারনেট স্পিড বাড়ায়', 'কোনটিই নয়'],
                correctAnswer: 0,
                explanation: 'HttpOnly ফ্ল্যাগ XSS থেকে সেশন চুরির ঝুঁকি কমায়।'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    slug: 'ethical-hacking',
    title: 'Ethical Hacking & Penetration Testing',
    description: 'প্রফেশনাল পেনটেস্টার হওয়ার সম্পূর্ণ গাইড — Kali Linux, Metasploit, Nmap স্ক্যানিং, প্যাকেট অ্যানালাইসিস ও এক্সপ্লয়টেশন।',
    icon: '⚔️',
    level: 'Advanced',
    duration: '35 hrs',
    rating: 4.8,
    students: '1,200+',
    price: '৳২,৯৯৯',
    priceAmount: 2999,
    isFree: false,
    category: ['advanced', 'security'],
    badge: 'Elite',
    badgeColor: 'accent',
    learningDetails: {
      summary: 'ইথিক্যাল হ্যাকিং ও পেনটেস্টিং কোর্সে Kali Linux, Nmap, Wireshark, Metasploit এবং র‍্যানসমওয়্যার বিশ্লেষণসহ ইন্ডাস্ট্রি স্ট্যান্ডার্ড ফ্রেমওয়ার্ক শেখানো হয়।',
      keyOutcomes: [
        'ইথিক্যাল হ্যাকিংয়ের আইনি বাধ্যবাধকতা ও স্কোপ অফ ওয়ার্ক',
        'Nmap ও Masscan দিয়ে নেটওয়ার্ক রিকন ও সার্ভিস স্ক্যানিং',
        'Metasploit Framework ব্যবহার করে এক্সপ্লয়টেশন',
        'পেনটেস্ট রিপোর্ট রাইটিং ও ক্লায়েন্ট রিমোডিয়াশন'
      ],
      prerequisites: ['Linux Mastery, Web Security & Networking Basic Knowledge'],
      referenceLinks: [
        {
          title: 'Kali Linux Official Documentation',
          url: 'https://www.kali.org/docs/',
          siteName: 'Kali.org',
          description: 'কালি লিনাক্স ইনস্টলেশন, টুলস ও অফিশিয়াল ম্যানুয়াল।'
        },
        {
          title: 'Nmap Network Scanning Guide',
          url: 'https://nmap.org/book/',
          siteName: 'Nmap.org',
          description: 'পোর্ট স্ক্যানিং, OS ফিঙ্গারপ্রিন্টিং ও NSE স্ক্রিপ্টিং।'
        },
        {
          title: 'Metasploit Framework Docs',
          url: 'https://docs.metasploit.com/',
          siteName: 'Metasploit.com',
          description: 'পেনটেস্টিং এক্সপ্লয়টেশন ফ্রেমওয়ার্ক গাইড।'
        }
      ]
    },
    modules: [
      {
        title: 'Penetration Testing Methodology',
        lessons: [
          {
            id: 'eh-1-1',
            name: 'Legal Boundaries & Rules of Engagement',
            icon: '🎥',
            dur: '25 min',
            free: true,
            quiz: [
              {
                id: 'q1',
                question: 'ইথিক্যাল হ্যাকার (White Hat) এবং ব্ল্যাক হ্যাট হ্যাকারের প্রধান পার্থক্য কী?',
                options: ['অনুমতি (Written Authorization / Scope)', 'ব্যবহৃত কম্পিউটার', 'ইন্টারনেট সংযোগ', 'কোন পার্থক্য নেই'],
                correctAnswer: 0,
                explanation: 'ইথিক্যাল হ্যাকার সবসময় লিখিত অনুমতি নিয়ে কাজ করে।'
              },
              {
                id: 'q2',
                question: 'পেনটেস্ট শুরুর আগে ক্লায়েন্টের সাথে চুক্তিপত্রকে কী বলা হয়?',
                options: ['Rules of Engagement (RoE) / NDA', 'Tax Return', 'User Manual', 'Software License'],
                correctAnswer: 0,
                explanation: 'RoE তে পেনটেস্টের নিয়ম ও সুযোগ নির্ধারণ করা থাকে।'
              },
              {
                id: 'q3',
                question: 'CVSS এর পূর্ণরূপ কী?',
                options: ['Common Vulnerability Scoring System', 'Central Vector Security Software', 'Core Virus Scanning System', 'Cyber Vendor Safety Standard'],
                correctAnswer: 0,
                explanation: 'CVSS সিকিউরিটি ত্রুটির গুরুত্ব স্কোর নির্ধারণ করে (0-10)।'
              }
            ]
          }
        ]
      }
    ]
  }
];
