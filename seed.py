# scripts/seed.py
import json
from pathlib import Path
from time import time

NOW = int(time() * 1000)

surveys = [
    {
        "id": "401c13a3-8fa5-4b4b-a172-fdb7c25c374c",
        "name": "Customer Satisfaction 2025",
        "description": "Tell us about your recent experience.",
        "payout": 70,
        "currency": "ksh",
        "premium": False,
        "status": "active",
        "items": [
            {
                "prompt": "How satisfied are you with our service?",
                "options": [
                    "Very satisfied",
                    "Satisfied",
                    "Neutral",
                    "Dissatisfied",
                    "Very dissatisfied"
                ]
            },
            {
                "prompt": "How likely are you to recommend us?",
                "options": [
                    "Very likely",
                    "Likely",
                    "Neutral",
                    "Unlikely",
                    "Very unlikely"
                ]
            }
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "4b94a505-c330-4a12-933d-97e0ed8afce7",
        "name": "Mobile Usage Habits",
        "description": "Understand how you use your smartphone day-to-day.",
        "payout": 30,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {
                "prompt": "How many hours do you spend on your phone daily?",
                "options": [
                    "<1 hour",
                    "1–3 hours",
                    "3–5 hours",
                    "5–8 hours",
                    ">8 hours"
                ]
            },
            {
                "prompt": "What’s your primary phone activity?",
                "options": [
                    "Social media",
                    "Messaging",
                    "Video streaming",
                    "Gaming",
                    "Work"
                ]
            }
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "airtel-kenya-10q",
        "name": "AIRTEL",
        "description": "Help us understand Airtel service quality and your experience.",
        "payout": 49,
        "currency": "ksh",
        "premium": False,
        "status": "active",
        "items": [
            {"prompt": "Which Airtel service do you use most often?", "options": ["Voice calls", "Mobile data", "SMS", "Airtel Money", "Other"]},
            {"prompt": "How would you rate Airtel network coverage in your area?", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Data speeds on Airtel meet your needs for streaming and browsing.", "options": ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]},
            {"prompt": "How reliable are Airtel calls (drops, clarity)?", "options": ["Very reliable", "Somewhat reliable", "Neutral", "Somewhat unreliable", "Very unreliable"]},
            {"prompt": "How satisfied are you with Airtel data bundles’ value for money?", "options": ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]},
            {"prompt": "Have you used Airtel Money in the last 30 days?", "options": ["Yes", "No"]},
            {"prompt": "If yes, how easy was it to complete transactions on Airtel Money?", "options": ["Very easy", "Easy", "Neutral", "Difficult", "Very difficult"]},
            {"prompt": "Customer support response time meets your expectations.", "options": ["Always", "Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "How likely are you to recommend Airtel to a friend?", "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]},
            {"prompt": "What would improve your Airtel experience the most?", "options": ["Better coverage", "Cheaper bundles", "Faster data", "Better support", "More Airtel Money features"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "infotrack-14q",
        "name": "INFOTRACK",
        "description": "Share your views on surveys, research topics and participation habits.",
        "payout": 59,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "How frequently do you participate in online surveys?", "options": ["Weekly+", "Monthly", "Quarterly", "Rarely", "Never"]},
            {"prompt": "Primary device for surveys?", "options": ["Smartphone", "Laptop", "Tablet", "Desktop"]},
            {"prompt": "Preferred survey length?", "options": ["<5 min", "5–10 min", "10–15 min", "15–20 min", ">20 min"]},
            {"prompt": "What drives you to complete surveys?", "options": ["Rewards", "Curiosity", "Influence decisions", "Fun", "Other"]},
            {"prompt": "Topics you enjoy most?", "options": ["Politics", "Tech", "Consumer goods", "Telecom", "Finance"]},
            {"prompt": "How clear are survey questions on average?", "options": ["Very clear", "Clear", "Neutral", "Unclear", "Very unclear"]},
            {"prompt": "How fair are the rewards relative to time spent?", "options": ["Very fair", "Fair", "Neutral", "Unfair", "Very unfair"]},
            {"prompt": "Would you allow follow-up contact for longitudinal studies?", "options": ["Yes", "No", "Maybe"]},
            {"prompt": "Comfort with sharing anonymized demographic data.", "options": ["Comfortable", "Somewhat", "Neutral", "Uncomfortable", "Very uncomfortable"]},
            {"prompt": "Trust in research organizations handling your data.", "options": ["High", "Moderate", "Low", "None"]},
            {"prompt": "Have you ever dropped out of a survey due to length?", "options": ["Yes", "No"]},
            {"prompt": "Best time of day to take surveys?", "options": ["Morning", "Afternoon", "Evening", "Late night"]},
            {"prompt": "Preferred incentive type?", "options": ["Mobile money", "Airtime/data", "Gift cards", "Entries to draws"]},
            {"prompt": "Likelihood to join a survey panel in Kenya.", "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "nation-media-11q",
        "name": "Nation Media",
        "description": "Your reading, viewing and trust in Nation Media platforms.",
        "payout": 38,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Which Nation Media products do you use most?", "options": ["Nation.Africa", "Daily Nation (print)", "NTV", "Radio", "None"]},
            {"prompt": "How often do you read Nation.Africa?", "options": ["Daily", "Few times/week", "Weekly", "Rarely", "Never"]},
            {"prompt": "Top content interest on Nation platforms?", "options": ["News", "Business", "Sports", "Entertainment", "Tech/Science"]},
            {"prompt": "Perceived accuracy of reporting.", "options": ["Very accurate", "Accurate", "Neutral", "Inaccurate", "Very inaccurate"]},
            {"prompt": "Do paywalls affect your reading?", "options": ["Yes positively", "No effect", "Yes negatively"]},
            {"prompt": "Video quality and streaming on NTV digital.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Comment moderation quality.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Advertising relevance.", "options": ["Very relevant", "Somewhat", "Neutral", "Not very", "Not at all"]},
            {"prompt": "Likelihood to subscribe to premium content.", "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]},
            {"prompt": "Preferred notification channels.", "options": ["Email", "SMS", "App push", "None"]},
            {"prompt": "Recommend Nation Media to others?", "options": ["Yes", "No", "Maybe"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "tech-gadgets-8q",
        "name": "TECH GADGETS",
        "description": "Buying habits and preferences for consumer tech in Kenya.",
        "payout": 70,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Your current smartphone brand?", "options": ["Samsung", "Tecno", "Infinix", "iPhone", "Other"]},
            {"prompt": "Upgrade frequency for phones.", "options": ["<1 year", "12–18 months", "2 years", "3+ years"]},
            {"prompt": "Most important phone feature.", "options": ["Battery", "Camera", "Storage", "Performance", "Price"]},
            {"prompt": "Do you buy gadgets online or in-store?", "options": ["Online", "In-store", "Both"]},
            {"prompt": "Budget range for a new phone.", "options": ["<Ksh 10k", "10k–20k", "20k–35k", "35k–60k", ">60k"]},
            {"prompt": "Wearables owned (watch/band).", "options": ["Yes", "No"]},
            {"prompt": "PC/laptop usage frequency.", "options": ["Daily", "Weekly", "Occasionally", "Rarely", "Never"]},
            {"prompt": "Primary reason to upgrade next.", "options": ["Battery life", "Faster internet (5G)", "Camera", "Storage", "Work/school"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "cloud-services-9q",
        "name": "CLOUD SERVICES",
        "description": "Use of cloud storage, productivity suites and hosting.",
        "payout": 75,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Which cloud storage do you use most?", "options": ["Google Drive", "iCloud", "OneDrive", "Dropbox", "None"]},
            {"prompt": "Primary use case for cloud.", "options": ["Personal files", "Business docs", "Photos/videos", "Backups", "App hosting"]},
            {"prompt": "Comfort with paying for cloud storage.", "options": ["Already pay", "Would pay", "Prefer free", "Not interested"]},
            {"prompt": "Have you used cloud hosting (AWS/Azure/GCP)?", "options": ["Yes", "No"]},
            {"prompt": "If yes, what for?", "options": ["Websites", "Apps/APIs", "Data/analytics", "Learning", "Other"]},
            {"prompt": "Concerns about cloud services.", "options": ["Cost", "Security", "Privacy", "Complexity", "None"]},
            {"prompt": "Satisfaction with reliability.", "options": ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]},
            {"prompt": "How often do you share cloud links?", "options": ["Daily", "Weekly", "Monthly", "Rarely", "Never"]},
            {"prompt": "Would you switch providers for a better deal?", "options": ["Yes", "No", "Maybe"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "digital-skills-8q",
        "name": "DIGITAL SKILLS",
        "description": "Self-assessment of digital skills and learning interests.",
        "payout": 80,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Your current digital skill level.", "options": ["Beginner", "Intermediate", "Advanced", "Expert"]},
            {"prompt": "Comfort with spreadsheets (Excel/Sheets).", "options": ["Very comfortable", "Comfortable", "Neutral", "Not comfortable"]},
            {"prompt": "Basic coding experience.", "options": ["Yes", "No", "Learning now"]},
            {"prompt": "Skills you want to learn next.", "options": ["Data analysis", "Web dev", "Digital marketing", "Cloud basics", "Cybersecurity"]},
            {"prompt": "Preferred learning format.", "options": ["Videos", "Reading", "Bootcamps", "Mentorship", "Live classes"]},
            {"prompt": "Time you can commit weekly.", "options": ["<2h", "2–4h", "5–7h", "8–10h", "10h+"]},
            {"prompt": "Do you have a laptop/PC to learn on?", "options": ["Yes", "No", "Sometimes"]},
            {"prompt": "Would a certificate motivate you?", "options": ["Yes", "No", "Maybe"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "ecommerce-6q",
        "name": "E-COMMERCE",
        "description": "Shopping habits, trust and delivery expectations online.",
        "payout": 55,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "How often do you shop online?", "options": ["Weekly", "Monthly", "Quarterly", "Rarely", "Never"]},
            {"prompt": "Top marketplace used.", "options": ["Jumia", "Kilimall", "Masoko", "Social media sellers", "Other"]},
            {"prompt": "Primary reason to buy online.", "options": ["Price", "Convenience", "Selection", "Delivery", "Promotions"]},
            {"prompt": "Main concern when shopping online.", "options": ["Fraud", "Quality", "Returns", "Shipping delays", "Warranty"]},
            {"prompt": "Preferred payment method.", "options": ["M-PESA", "Card", "Cash on delivery", "BNPL", "Other"]},
            {"prompt": "Typical delivery time expectation.", "options": ["Same day", "1–2 days", "3–5 days", "1 week+", "No preference"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "cybersecurity-8q",
        "name": "CYBERSECURITY",
        "description": "Security practices and awareness for personal devices/accounts.",
        "payout": 85,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Do you use a screen lock/PIN on your phone?", "options": ["Always", "Sometimes", "Never"]},
            {"prompt": "Enable 2-factor authentication on key accounts.", "options": ["All", "Some", "None", "Not sure"]},
            {"prompt": "Password manager usage.", "options": ["Yes", "No", "Considering"]},
            {"prompt": "Have you experienced phishing attempts recently?", "options": ["Yes", "No", "Not sure"]},
            {"prompt": "Public Wi-Fi usage habits.", "options": ["Avoid", "Use with care", "Use freely"]},
            {"prompt": "Software updates kept current.", "options": ["Always", "Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Main security worry.", "options": ["Account hacking", "Phone theft", "SIM swap", "Malware", "Data leaks"]},
            {"prompt": "Confidence in recognizing scams.", "options": ["Very confident", "Somewhat", "Neutral", "Not confident"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "fintech-8q",
        "name": "FINTECH",
        "description": "Use of mobile lending, wallets and investment apps.",
        "payout": 68,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Which fintech apps do you use regularly?", "options": ["M-PESA", "Airtel Money", "Tala/Branch", "Bank app", "Investment app"]},
            {"prompt": "Primary reason to use fintech.", "options": ["Payments", "Savings", "Loans", "Investments", "Remittance"]},
            {"prompt": "How transparent are fees in apps you use?", "options": ["Very", "Somewhat", "Neutral", "Not very", "Not at all"]},
            {"prompt": "Comfort with digital KYC (ID selfies/videos).", "options": ["Comfortable", "Neutral", "Uncomfortable"]},
            {"prompt": "Have you ever defaulted on a mobile loan?", "options": ["Yes", "No", "Prefer not to say"]},
            {"prompt": "Interest in micro-investing (as little as Ksh 100).", "options": ["High", "Medium", "Low", "None"]},
            {"prompt": "Would you switch providers for better rates?", "options": ["Yes", "No", "Maybe"]},
            {"prompt": "Trust in fintech data security.", "options": ["High", "Moderate", "Low", "None"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "ai-adoption-8q",
        "name": "AI ADOPTION",
        "description": "Awareness and use of AI tools at home and work.",
        "payout": 72,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Have you used any AI tools in the last 6 months?", "options": ["Yes", "No"]},
            {"prompt": "Where do you use AI most?", "options": ["Work", "School", "Personal projects", "Entertainment", "Not using"]},
            {"prompt": "Most common AI use case.", "options": ["Writing/translation", "Search/answers", "Image/video", "Coding", "Data analysis"]},
            {"prompt": "Perceived accuracy of AI tools.", "options": ["Very accurate", "Accurate", "Neutral", "Inaccurate", "Very inaccurate"]},
            {"prompt": "Concern about job impact from AI.", "options": ["Very concerned", "Somewhat", "Neutral", "Not concerned"]},
            {"prompt": "Would you pay for a reliable AI assistant?", "options": ["Yes", "No", "Maybe"]},
            {"prompt": "Training needed to use AI effectively.", "options": ["High", "Medium", "Low", "None"]},
            {"prompt": "Likelihood to recommend AI tools to others.", "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "it-jobs-6q",
        "name": "IT JOBS",
        "description": "Hiring, job search and skill gaps in the IT sector.",
        "payout": 50,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Your current employment status.", "options": ["Employed", "Self-employed", "Student", "Seeking", "Other"]},
            {"prompt": "Primary IT area.", "options": ["Support", "Networking", "Software dev", "Data/AI", "Cybersecurity"]},
            {"prompt": "Biggest barrier to getting an IT job.", "options": ["Experience", "Skills", "Network", "Location", "Pay"]},
            {"prompt": "Do certifications help job prospects?", "options": ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]},
            {"prompt": "Preferred work arrangement.", "options": ["On-site", "Hybrid", "Remote", "No preference"]},
            {"prompt": "Willingness to relocate within Kenya for a role.", "options": ["Yes", "No", "Maybe"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "digital-gov-7q",
        "name": "DIGITAL GOV",
        "description": "Experience with eCitizen and digital government services.",
        "payout": 60,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Have you used eCitizen in the past 12 months?", "options": ["Yes", "No"]},
            {"prompt": "Ease of finding services on eCitizen.", "options": ["Very easy", "Easy", "Neutral", "Difficult", "Very difficult"]},
            {"prompt": "Payment experience for government services.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Trust in data privacy on government portals.", "options": ["High", "Moderate", "Low", "None"]},
            {"prompt": "Would you prefer fully online processes over in-person?", "options": ["Yes", "No", "Depends on service"]},
            {"prompt": "Communication and status updates quality.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Likelihood to recommend eCitizen to others.", "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "safaricom-13q",
        "name": "SAFARICOM",
        "description": "Network, data bundles and service experience with Safaricom.",
        "payout": 80,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Your primary Safaricom usage.", "options": ["Voice", "Data", "M-PESA", "SMS", "Home Fibre"]},
            {"prompt": "Network coverage where you live.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Call quality (drops, clarity).", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Data speed meets your needs.", "options": ["Always", "Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Bundle value for money.", "options": ["Very good", "Good", "Neutral", "Poor", "Very poor"]},
            {"prompt": "Do you use Safaricom Home Fibre?", "options": ["Yes", "No"]},
            {"prompt": "If yes, uptime satisfaction.", "options": ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]},
            {"prompt": "M-PESA charges are reasonable.", "options": ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]},
            {"prompt": "MySafaricom app usability.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Customer support resolution quality.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Likelihood to stay with Safaricom next 12 months.", "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]},
            {"prompt": "Would you switch for a better offer?", "options": ["Yes", "No", "Maybe"]},
            {"prompt": "Top improvement you want next.", "options": ["Lower prices", "More data", "Coverage", "Support", "New features"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "mpesa-10q",
        "name": "MPESA",
        "description": "Usage patterns, fees and features of M-PESA.",
        "payout": 40,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "How often do you use M-PESA per week?", "options": ["1–3", "4–7", "8–14", "15+", "Rarely/Never"]},
            {"prompt": "Most common M-PESA use.", "options": ["Pay bill", "Buy goods", "Send money", "Withdraw", "Airtime/data"]},
            {"prompt": "Overall satisfaction with M-PESA fees.", "options": ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]},
            {"prompt": "Have you used M-Shwari/KCB M-PESA?", "options": ["Yes", "No"]},
            {"prompt": "Reversals experience.", "options": ["Very easy", "Easy", "Neutral", "Difficult", "Very difficult"]},
            {"prompt": "Security features meet expectations.", "options": ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]},
            {"prompt": "Do you use the M-PESA app?", "options": ["Yes regularly", "Sometimes", "No"]},
            {"prompt": "Merchant acceptance near you.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Would you use M-PESA international remittance?", "options": ["Yes", "No", "Maybe"]},
            {"prompt": "Likelihood to recommend M-PESA.", "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "local-it-6q",
        "name": "LOCAL IT",
        "description": "Local IT service providers, pricing and support quality.",
        "payout": 49,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Have you engaged a local IT technician/provider this year?", "options": ["Yes", "No"]},
            {"prompt": "Service type received.", "options": ["PC repair", "Networking", "CCTV", "Web/app dev", "Other"]},
            {"prompt": "Pricing fairness.", "options": ["Very fair", "Fair", "Neutral", "Unfair", "Very unfair"]},
            {"prompt": "Quality of after-service support.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Would you hire the same provider again?", "options": ["Yes", "No", "Maybe"]},
            {"prompt": "Where did you find them?", "options": ["Referral", "Social media", "Marketplace", "Walk-in shop", "Other"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "telecom-13q",
        "name": "TELECOM",
        "description": "Overall telecom experience across Kenyan operators.",
        "payout": 61,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Your primary mobile operator.", "options": ["Safaricom", "Airtel", "Telkom", "Equitel", "Other"]},
            {"prompt": "Secondary SIM usage.", "options": ["Yes", "No"]},
            {"prompt": "Coverage quality at home.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Coverage quality at work/school.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "5G availability in your area.", "options": ["Yes, strong", "Yes, limited", "No", "Not sure"]},
            {"prompt": "Average monthly spend on airtime/data.", "options": ["<Ksh 500", "500–1,000", "1,001–2,500", "2,501–5,000", ">5,000"]},
            {"prompt": "Bundled offers (voice+data+SMS) value.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "International calling/SMS usage.", "options": ["Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Roaming experience (if applicable).", "options": ["Good", "Average", "Poor", "Not applicable"]},
            {"prompt": "Ease of SIM registration/KYC.", "options": ["Very easy", "Easy", "Neutral", "Difficult", "Very difficult"]},
            {"prompt": "Resolution of network issues.", "options": ["Very fast", "Fast", "Average", "Slow", "Very slow"]},
            {"prompt": "Likelihood to switch operators in 12 months.", "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]},
            {"prompt": "Primary reason to switch.", "options": ["Price", "Coverage", "Data speed", "Customer care", "Promotions"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "digital-payments-6q",
        "name": "DIGITAL PAYMENTS",
        "description": "Usage across wallets, cards and QR payments.",
        "payout": 53,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Main way you pay digitally.", "options": ["M-PESA", "Card", "Bank app", "Airtel Money", "Other"]},
            {"prompt": "Comfort with QR payments (Scan to pay).", "options": ["Very comfortable", "Comfortable", "Neutral", "Uncomfortable", "Very uncomfortable"]},
            {"prompt": "Top factor in choosing a payment method.", "options": ["Fees", "Speed", "Security", "Acceptance", "Rewards"]},
            {"prompt": "Have you used contactless (tap) payments?", "options": ["Yes", "No"]},
            {"prompt": "Experience with refunds/chargebacks.", "options": ["Easy", "Average", "Difficult", "Never needed"]},
            {"prompt": "Would you try a new wallet for lower fees?", "options": ["Yes", "No", "Maybe"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "mobile-apps-7q",
        "name": "MOBILE APPS",
        "description": "Discovery, usage and retention of mobile apps.",
        "payout": 55,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "How many apps do you install per month?", "options": ["0–1", "2–3", "4–5", "6–10", "10+"]},
            {"prompt": "Where do you discover new apps?", "options": ["Play Store", "Friends", "Social media", "Ads", "Blogs/YouTube"]},
            {"prompt": "Main reason to uninstall an app.", "options": ["Too many ads", "Takes space", "Crashes/bugs", "Privacy concerns", "No longer useful"]},
            {"prompt": "Allow app notifications?", "options": ["Most apps", "Some apps", "Few apps", "None"]},
            {"prompt": "Do you pay for any app subscriptions?", "options": ["Yes", "No"]},
            {"prompt": "Rating habit on app stores.", "options": ["Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "App categories you use most.", "options": ["Social", "Finance", "Shopping", "Entertainment", "Productivity"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "streaming-9q",
        "name": "STREAMING",
        "description": "Video/music streaming services and internet constraints.",
        "payout": 70,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Active streaming services.", "options": ["YouTube", "Netflix", "Showmax", "Spotify", "None"]},
            {"prompt": "How often do you stream video weekly?", "options": ["<2h", "2–5h", "6–10h", "10–20h", "20h+"]},
            {"prompt": "Primary device for streaming.", "options": ["Phone", "Smart TV", "Laptop", "Tablet"]},
            {"prompt": "Main limitation for streaming.", "options": ["Data cost", "Speed", "Power outages", "Device", "Nothing"]},
            {"prompt": "Do you download content for offline use?", "options": ["Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Video quality you usually select.", "options": ["Auto", "144–360p", "480p", "720p", "1080p+"]},
            {"prompt": "Family/household plan usage.", "options": ["Yes", "No"]},
            {"prompt": "Willingness to watch ads for cheaper plans.", "options": ["Yes", "No", "Maybe"]},
            {"prompt": "Likelihood to switch services within 6 months.", "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "tech-hardware-7q",
        "name": "TECH HARDWARE",
        "description": "PCs, peripherals and repair/upgrade behavior.",
        "payout": 50,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Do you own a laptop/desktop?", "options": ["Laptop", "Desktop", "Both", "Neither"]},
            {"prompt": "Primary use for your computer.", "options": ["Work/School", "Entertainment", "Gaming", "Creative", "Other"]},
            {"prompt": "Have you upgraded RAM/SSD before?", "options": ["Yes", "No", "Plan to"]},
            {"prompt": "Printer usage frequency.", "options": ["Weekly+", "Monthly", "Rarely", "Never"]},
            {"prompt": "Where do you buy peripherals?", "options": ["Online", "Electronics shop", "Computer mall", "Second-hand", "Other"]},
            {"prompt": "Repair experience locally.", "options": ["Excellent", "Good", "Fair", "Poor", "Very poor"]},
            {"prompt": "Warranty is a key factor when purchasing.", "options": ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "gaming-10q",
        "name": "GAMING",
        "description": "Platforms, genres and spending habits on games.",
        "payout": 75,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Do you play video games?", "options": ["Yes regularly", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Primary platform.", "options": ["Mobile", "PC", "Console", "Cloud", "Other"]},
            {"prompt": "Favorite genres.", "options": ["Action", "Sports", "RPG", "Strategy", "Casual"]},
            {"prompt": "Average monthly spend on games.", "options": ["Ksh 0", "1–500", "501–1,500", "1,501–3,000", "3,001+"]},
            {"prompt": "Online multiplayer frequency.", "options": ["Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "In-app purchases in mobile games.", "options": ["Frequently", "Sometimes", "Never"]},
            {"prompt": "Esports or streams watched.", "options": ["Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Device performance limits gaming.", "options": ["Yes", "No", "Sometimes"]},
            {"prompt": "Data cost affects your gaming.", "options": ["A lot", "Somewhat", "A little", "Not at all"]},
            {"prompt": "Likelihood to recommend a favorite game.", "options": ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "social-media-8q",
        "name": "SOCIAL MEDIA",
        "description": "Platforms used, posting habits and privacy preferences.",
        "payout": 44,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Most used social platform.", "options": ["WhatsApp", "Facebook", "Instagram", "TikTok", "X/Twitter"]},
            {"prompt": "Daily time spent on social media.", "options": ["<1h", "1–2h", "3–4h", "5–8h", ">8h"]},
            {"prompt": "Do you post content regularly?", "options": ["Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Main reason to use social media.", "options": ["Messaging", "News", "Entertainment", "Business", "Learning"]},
            {"prompt": "Privacy settings awareness.", "options": ["High", "Medium", "Low", "None"]},
            {"prompt": "Have you bought from a social seller?", "options": ["Yes", "No"]},
            {"prompt": "Concern about misinformation.", "options": ["Very concerned", "Somewhat", "Neutral", "Not concerned"]},
            {"prompt": "Would you pay to remove ads?", "options": ["Yes", "No", "Maybe"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "internet-8q",
        "name": "INTERNET",
        "description": "Home internet, mobile data usage and affordability.",
        "payout": 88,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Primary internet at home.", "options": ["Home fibre", "Fixed wireless", "Mobile hotspot", "Public Wi-Fi", "None"]},
            {"prompt": "Monthly data spend (mobile+home).", "options": ["<Ksh 500", "500–1,000", "1,001–2,500", "2,501–5,000", ">5,000"]},
            {"prompt": "Average mobile download speed experience.", "options": ["Very fast", "Fast", "Average", "Slow", "Very slow"]},
            {"prompt": "Power outages affect your internet usage.", "options": ["Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Hotspot/tethering frequency.", "options": ["Daily", "Weekly", "Monthly", "Rarely", "Never"]},
            {"prompt": "Data rollover matters to you.", "options": ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]},
            {"prompt": "Would you switch ISPs for a better price?", "options": ["Yes", "No", "Maybe"]},
            {"prompt": "Overall satisfaction with internet access.", "options": ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "digital-literacy-7q",
        "name": "DIGITAL LITERACY",
        "description": "Ability to use devices, apps and online services safely.",
        "payout": 47,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Comfort installing and updating apps.", "options": ["Very comfortable", "Comfortable", "Neutral", "Uncomfortable", "Very uncomfortable"]},
            {"prompt": "Can identify suspicious links/emails.", "options": ["Always", "Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Use of cloud backups for phone photos/files.", "options": ["Yes", "No", "Sometimes"]},
            {"prompt": "Can fill online forms without help.", "options": ["Always", "Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Know how to manage app permissions.", "options": ["Yes", "Somewhat", "No"]},
            {"prompt": "Comfort paying bills online.", "options": ["Very comfortable", "Comfortable", "Neutral", "Uncomfortable", "Very uncomfortable"]},
            {"prompt": "Interest in free digital literacy courses.", "options": ["High", "Medium", "Low", "None"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "tech-policy-5q",
        "name": "TECH POLICY",
        "description": "Opinions on tech regulation, data laws and consumer rights.",
        "payout": 44,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Awareness of Kenya’s data protection law.", "options": ["High", "Some", "Low", "None"]},
            {"prompt": "Should social platforms be more tightly regulated?", "options": ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]},
            {"prompt": "Comfort with biometric data use by apps.", "options": ["Comfortable", "Neutral", "Uncomfortable"]},
            {"prompt": "Transparent pricing for mobile/data services is adequate.", "options": ["Agree", "Neutral", "Disagree"]},
            {"prompt": "Would you support stronger consumer redress mechanisms?", "options": ["Yes", "No", "Maybe"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "work-tech-7q",
        "name": "WORK TECH",
        "description": "Tools used for work, collaboration and remote productivity.",
        "payout": 43,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Primary work device.", "options": ["Laptop", "Desktop", "Phone", "Tablet"]},
            {"prompt": "Core collaboration tool.", "options": ["Google Workspace", "Microsoft 365", "Slack", "Zoom/Meet/Teams", "Other"]},
            {"prompt": "Do you work remotely at least 1 day/week?", "options": ["Yes", "No", "Sometimes"]},
            {"prompt": "Home internet sufficient for work.", "options": ["Always", "Often", "Sometimes", "Rarely", "Never"]},
            {"prompt": "Top blocker for productivity.", "options": ["Internet", "Power", "Noise", "Tools", "Time management"]},
            {"prompt": "Do you use VPN for work?", "options": ["Yes", "No", "Not sure"]},
            {"prompt": "Interest in employer-funded upskilling.", "options": ["High", "Medium", "Low", "None"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "tech-startups-7q",
        "name": "TECH STARTUPS",
        "description": "Awareness and experience with local tech startups.",
        "payout": 44,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {"prompt": "Have you used a Kenyan startup’s product/app in the last year?", "options": ["Yes", "No", "Not sure"]},
            {"prompt": "Main benefit of startup products.", "options": ["Lower price", "Innovation", "Convenience", "Local relevance", "Support"]},
            {"prompt": "Where you hear about startups.", "options": ["Social media", "Friends", "News", "Events", "App stores"]},
            {"prompt": "Would you join a startup as an employee?", "options": ["Yes", "No", "Maybe"]},
            {"prompt": "Willingness to beta test new apps.", "options": ["High", "Medium", "Low", "None"]},
            {"prompt": "Investment interest in startups (small tickets).", "options": ["Yes", "No", "Maybe"]},
            {"prompt": "Top barrier for startups in Kenya.", "options": ["Funding", "Talent", "Regulation", "Market size", "Infrastructure"]},
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    },
    {
        "id": "20760f51-387a-4a38-b6ff-f6f6c628d3bc",
        "name": "Food Delivery Feedback",
        "description": "Help us improve delivery experience.",
        "payout": 90,
        "currency": "ksh",
        "premium": True,
        "status": "active",
        "items": [
            {
                "prompt": "Delivery time met your expectation?",
                "options": ["Yes", "Somewhat", "No"]
            },
            {
                "prompt": "Food temperature on arrival?",
                "options": ["Hot", "Warm", "Cold"]
            }
        ],
        "createdAt": NOW,
        "updatedAt": NOW
    }
]
here = Path(__file__).resolve().parent
# Try current dir, then parent, then grandparent
for base in (here, here.parent, here.parent.parent):
    if (base / "public").is_dir():
        root = base
        break
else:
    root = here  # fallback: create public/ here if missing

out_path = root / "public" / "db.json"
out_path.parent.mkdir(parents=True, exist_ok=True)

payload = {
    "users": [],     # Option A: keep users empty; app uses localStorage
    "surveys": surveys,
}

with out_path.open("w", encoding="utf-8") as f:
    json.dump(payload, f, ensure_ascii=False, indent=2)

print(f"✓ Wrote {out_path} with {len(surveys)} surveys")