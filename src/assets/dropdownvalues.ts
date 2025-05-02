import { SharingTypeArray } from "src/app/core/model/admintxnreceipt/admintxnreceipt.model";


//Shipment > Weekest currency list
export const shipmentWeekestCurrencyCode :any[] = [
  'IDR' , 'VND' , 'JPY' , 'KHR' , 'KRW'
];

// This array is used to iterate in Forex > Deals > add deal > handled by dropdown
export const dealHandledByArray :any[] = [ 
  "Altaf", "Sathakathullah", "Hassan Mujahid"
];

// MC > Shipment > Add Shipment (deal table) , Update Shipment (deal table)
export const shipmentMultiplyCurrencies : any[] = [
  'USD', 'NZD', 'AUD', 'EUR', 'GBP'
];


//Flag Icon Array , Reused in :
//1. Backoffice (MoneyChanger) > Ratesetup component
//2. Backoffice (MoneyChanger) > Display rates component
//3. Backoffice (MoneyChanger) > Display rates component window .
export const flagCountryArray : any[] = [
    {"NO": 1, "CCYCODE": "AFN", "COUNTRY": "Afghanistan", "FLAG": "flag-icon flag-icon-af"},
    {"NO": 2, "CCYCODE": "ALL", "COUNTRY": "Albania", "FLAG": "flag-icon flag-icon-al"},
    {"NO": 3, "CCYCODE": "DZD", "COUNTRY": "Algeria", "FLAG": "flag-icon flag-icon-dz"},
    {"NO": 4, "CCYCODE": "EUR", "COUNTRY": "Andorra", "FLAG": "flag-icon flag-icon-ad"},
    {"NO": 5, "CCYCODE": "AOA", "COUNTRY": "Angola", "FLAG": "flag-icon flag-icon-ao"},
    {"NO": 6, "CCYCODE": "XCD", "COUNTRY": "Anguilla", "FLAG": "flag-icon flag-icon-ai"},
    {"NO": 7, "CCYCODE": "XCD", "COUNTRY": "Antigua and Barbuda", "FLAG": "flag-icon flag-icon-ag"},
    {"NO": 8, "CCYCODE": "ARS", "COUNTRY": "Argentina", "FLAG": "flag-icon flag-icon-ar"},
    {"NO": 9, "CCYCODE": "AMD", "COUNTRY": "Armenia", "FLAG": "flag-icon flag-icon-am"},
    {"NO": 10, "CCYCODE": "AWG", "COUNTRY": "Aruba", "FLAG": "flag-icon flag-icon-aw"},
    {"NO": 11, "CCYCODE": "AUD", "COUNTRY": "Australia", "FLAG": "flag-icon flag-icon-au"},
    {"NO": 12, "CCYCODE": "EUR", "COUNTRY": "Austria", "FLAG": "flag-icon flag-icon-at"},
    {"NO": 13, "CCYCODE": "AZN", "COUNTRY": "Azerbaijan", "FLAG": "flag-icon flag-icon-az"},
    {"NO": 14, "CCYCODE": "BSD", "COUNTRY": "Bahamas", "FLAG": "flag-icon flag-icon-bs"},
    {"NO": 15, "CCYCODE": "BHD", "COUNTRY": "Bahrain", "FLAG": "flag-icon flag-icon-bh"},
    {"NO": 16, "CCYCODE": "BDT", "COUNTRY": "Bangladesh", "FLAG": "flag-icon flag-icon-bd"},
    {"NO": 17, "CCYCODE": "BBD", "COUNTRY": "Barbados", "FLAG": "flag-icon flag-icon-bb"},
    {"NO": 18, "CCYCODE": "EUR", "COUNTRY": "Belgium", "FLAG": "flag-icon flag-icon-be"},
    {"NO": 19, "CCYCODE": "BZD", "COUNTRY": "Belize", "FLAG": "flag-icon flag-icon-bz"},
    {"NO": 20, "CCYCODE": "XOF", "COUNTRY": "Benin", "FLAG": "flag-icon flag-icon-bj"},
    {"NO": 21, "CCYCODE": "BMD", "COUNTRY": "Bermuda", "FLAG": "flag-icon flag-icon-bm"},
    {"NO": 22, "CCYCODE": "BOB", "COUNTRY": "Bolivia", "FLAG": "flag-icon flag-icon-bo"},
    {"NO": 23, "CCYCODE": "BAM", "COUNTRY": "Bosnia and Herzegovina", "FLAG": "flag-icon flag-icon-ba"},
    {"NO": 24, "CCYCODE": "BWP", "COUNTRY": "Botswana", "FLAG": "flag-icon flag-icon-bw"},
    {"NO": 25, "CCYCODE": "BRL", "COUNTRY": "Brazil", "FLAG": "flag-icon flag-icon-br"},
    {"NO": 26, "CCYCODE": "BND", "COUNTRY": "Brunei", "FLAG": "flag-icon flag-icon-bn"},
    {"NO": 27, "CCYCODE": "BGN", "COUNTRY": "Bulgaria", "FLAG": "flag-icon flag-icon-bg"},
    {"NO": 28, "CCYCODE": "XOF", "COUNTRY": "Burkina Faso", "FLAG": "flag-icon flag-icon-bf"},
    {"NO": 29, "CCYCODE": "BIF", "COUNTRY": "Burundi", "FLAG": "flag-icon flag-icon-bi"},
    {"NO": 30, "CCYCODE": "KHR", "COUNTRY": "Cambodia", "FLAG": "flag-icon flag-icon-kh"},
    {"NO": 31, "CCYCODE": "XAF", "COUNTRY": "Cameroon", "FLAG": "flag-icon flag-icon-cm"},
    {"NO": 32, "CCYCODE": "CAD", "COUNTRY": "Canada", "FLAG": "flag-icon flag-icon-ca"},
    {"NO": 33, "CCYCODE": "CVE", "COUNTRY": "Cape Verde", "FLAG": "flag-icon flag-icon-cv"},
    {"NO": 34, "CCYCODE": "XAF", "COUNTRY": "Central African Republic", "FLAG": "flag-icon flag-icon-cf"},
    {"NO": 35, "CCYCODE": "XAF", "COUNTRY": "Chad", "FLAG": "flag-icon flag-icon-td"},
    {"NO": 36, "CCYCODE": "CLP", "COUNTRY": "Chile", "FLAG": "flag-icon flag-icon-cl"},
    {"NO": 37, "CCYCODE": "CNY", "COUNTRY": "China", "FLAG": "flag-icon flag-icon-cn"},
    {"NO": 38, "CCYCODE": "COP", "COUNTRY": "Colombia", "FLAG": "flag-icon flag-icon-co"},
    {"NO": 39, "CCYCODE": "KMF", "COUNTRY": "Comoros", "FLAG": "flag-icon flag-icon-km"},
    {"NO": 40, "CCYCODE": "CDF", "COUNTRY": "Congo", "FLAG": "flag-icon flag-icon-cd"},
    {"NO": 41, "CCYCODE": "CRC", "COUNTRY": "Costa Rica", "FLAG": "flag-icon flag-icon-cr"},
    {"NO": 42, "CCYCODE": "XOF", "COUNTRY": "Cote d'Ivoire", "FLAG": "flag-icon flag-icon-ci"},
    {"NO": 43, "CCYCODE": "HRK", "COUNTRY": "Croatia", "FLAG": "flag-icon flag-icon-hr"},
    {"NO": 44, "CCYCODE": "EUR", "COUNTRY": "Cyprus", "FLAG": "flag-icon flag-icon-cy"},
    {"NO": 45, "CCYCODE": "CZK", "COUNTRY": "Czech Republic", "FLAG": "flag-icon flag-icon-cz"},
    {"NO": 46, "CCYCODE": "DKK", "COUNTRY": "Denmark", "FLAG": "flag-icon flag-icon-dk"},
    {"NO": 47, "CCYCODE": "DJF", "COUNTRY": "Djibouti", "FLAG": "flag-icon flag-icon-dj"},
    {"NO": 48, "CCYCODE": "DOP", "COUNTRY": "Dominican Republic", "FLAG": "flag-icon flag-icon-do"},
    {"NO": 49, "CCYCODE": "EGP", "COUNTRY": "Egypt", "FLAG": "flag-icon flag-icon-eg"},
    {"NO": 50, "CCYCODE": "XAF", "COUNTRY": "Equatorial Guinea", "FLAG": "flag-icon flag-icon-gq"},
    {"NO": 51, "CCYCODE": "EUR", "COUNTRY": "Estonia", "FLAG": "flag-icon flag-icon-ee"},
    {"NO": 52, "CCYCODE": "ETB", "COUNTRY": "Ethiopia", "FLAG": "flag-icon flag-icon-et"},
    {"NO": 53, "CCYCODE": "FJD", "COUNTRY": "Fiji", "FLAG": "flag-icon flag-icon-fj"},
    {"NO": 54, "CCYCODE": "EUR", "COUNTRY": "Finland", "FLAG": "flag-icon flag-icon-fi"},
    {"NO": 55, "CCYCODE": "EUR", "COUNTRY": "France", "FLAG": "flag-icon flag-icon-fr"},
    {"NO": 56, "CCYCODE": "XPF", "COUNTRY": "French Polynesia", "FLAG": "flag-icon flag-icon-pf"},
    {"NO": 57, "CCYCODE": "XAF", "COUNTRY": "Gabon", "FLAG": "flag-icon flag-icon-ga"},
    {"NO": 58, "CCYCODE": "GMD", "COUNTRY": "Gambia", "FLAG": "flag-icon flag-icon-gm"},
    {"NO": 59, "CCYCODE": "GEL", "COUNTRY": "Georgia", "FLAG": "flag-icon flag-icon-ge"},
    {"NO": 60, "CCYCODE": "EUR", "COUNTRY": "Germany", "FLAG": "flag-icon flag-icon-de"},
    {"NO": 61, "CCYCODE": "GHS", "COUNTRY": "Ghana", "FLAG": "flag-icon flag-icon-gh"},
    {"NO": 62, "CCYCODE": "GIP", "COUNTRY": "Gibraltar", "FLAG": "flag-icon flag-icon-gi"},
    {"NO": 63, "CCYCODE": "EUR", "COUNTRY": "Greece", "FLAG": "flag-icon flag-icon-gr"},
    {"NO": 64, "CCYCODE": "XCD", "COUNTRY": "Grenada", "FLAG": "flag-icon flag-icon-gd"},
    {"NO": 65, "CCYCODE": "GTQ", "COUNTRY": "Guatemala", "FLAG": "flag-icon flag-icon-gt"},
    {"NO": 66, "CCYCODE": "GNF", "COUNTRY": "Guinea", "FLAG": "flag-icon flag-icon-gn"},
    {"NO": 67, "CCYCODE": "XOF", "COUNTRY": "Guinea-Bissau", "FLAG": "flag-icon flag-icon-gw"},
    {"NO": 68, "CCYCODE": "GYD", "COUNTRY": "Guyana", "FLAG": "flag-icon flag-icon-gy"},
    {"NO": 69, "CCYCODE": "HTG", "COUNTRY": "Haiti", "FLAG": "flag-icon flag-icon-ht"},
    {"NO": 70, "CCYCODE": "HNL", "COUNTRY": "Honduras", "FLAG": "flag-icon flag-icon-hn"},
    {"NO": 71, "CCYCODE": "HKD", "COUNTRY": "Hong Kong", "FLAG": "flag-icon flag-icon-hk"},
    {"NO": 72, "CCYCODE": "HUF", "COUNTRY": "Hungary", "FLAG": "flag-icon flag-icon-hu"},
    {"NO": 73, "CCYCODE": "ISK", "COUNTRY": "Iceland", "FLAG": "flag-icon flag-icon-is"},
    {"NO": 74, "CCYCODE": "INR", "COUNTRY": "India", "FLAG": "flag-icon flag-icon-in"},
    {"NO": 75, "CCYCODE": "IDR", "COUNTRY": "Indonesia", "FLAG": "flag-icon flag-icon-id"},
    {"NO": 76, "CCYCODE": "EUR", "COUNTRY": "Ireland", "FLAG": "flag-icon flag-icon-ie"},
    {"NO": 77, "CCYCODE": "ILS", "COUNTRY": "Israel", "FLAG": "flag-icon flag-icon-il"},
    {"NO": 78, "CCYCODE": "EUR", "COUNTRY": "Italy", "FLAG": "flag-icon flag-icon-it"},
    {"NO": 79, "CCYCODE": "JMD", "COUNTRY": "Jamaica", "FLAG": "flag-icon flag-icon-jm"},
    {"NO": 80, "CCYCODE": "JPY", "COUNTRY": "Japan", "FLAG": "flag-icon flag-icon-jp"},
    {"NO": 81, "CCYCODE": "JOD", "COUNTRY": "Jordan", "FLAG": "flag-icon flag-icon-jo"},
    {"NO": 82, "CCYCODE": "KZT", "COUNTRY": "Kazakhstan", "FLAG": "flag-icon flag-icon-kz"},
    {"NO": 83, "CCYCODE": "KES", "COUNTRY": "Kenya", "FLAG": "flag-icon flag-icon-ke"},
    {"NO": 84, "CCYCODE": "KRW", "COUNTRY": "Korea", "FLAG": "flag-icon flag-icon-kr"},
    {"NO": 85, "CCYCODE": "KWD", "COUNTRY": "Kuwait", "FLAG": "flag-icon flag-icon-kw"},
    {"NO": 86, "CCYCODE": "KGS", "COUNTRY": "Kyrgyzstan", "FLAG": "flag-icon flag-icon-kg"},
    {"NO": 87, "CCYCODE": "LAK", "COUNTRY": "Laos", "FLAG": "flag-icon flag-icon-la"},
    {"NO": 88, "CCYCODE": "LVL", "COUNTRY": "Latvia", "FLAG": "flag-icon flag-icon-lv"},
    {"NO": 89, "CCYCODE": "LBP", "COUNTRY": "Lebanon", "FLAG": "flag-icon flag-icon-lb"},
    {"NO": 90, "CCYCODE": "LSL", "COUNTRY": "Lesotho", "FLAG": "flag-icon flag-icon-ls"},
    {"NO": 91, "CCYCODE": "LRD", "COUNTRY": "Liberia", "FLAG": "flag-icon flag-icon-lr"},
    {"NO": 92, "CCYCODE": "LYD", "COUNTRY": "Libya", "FLAG": "flag-icon flag-icon-ly"},
    {"NO": 93, "CCYCODE": "CHF", "COUNTRY": "Liechtenstein", "FLAG": "flag-icon flag-icon-li"},
    {"NO": 94, "CCYCODE": "LTL", "COUNTRY": "Lithuania", "FLAG": "flag-icon flag-icon-lt"},
    {"NO": 95, "CCYCODE": "EUR", "COUNTRY": "Luxembourg", "FLAG": "flag-icon flag-icon-lu"},
    {"NO": 96, "CCYCODE": "MOP", "COUNTRY": "Macau", "FLAG": "flag-icon flag-icon-mo"},
    {"NO": 97, "CCYCODE": "MKD", "COUNTRY": "Macedonia", "FLAG": "flag-icon flag-icon-mk"},
    {"NO": 98, "CCYCODE": "MGA", "COUNTRY": "Madagascar", "FLAG": "flag-icon flag-icon-mg"},
    {"NO": 99, "CCYCODE": "MWK", "COUNTRY": "Malawi", "FLAG": "flag-icon flag-icon-mw"},
    {"NO": 100, "CCYCODE": "MYR", "COUNTRY": "Malaysia", "FLAG": "flag-icon flag-icon-my"},
    {"NO": 101, "CCYCODE": "MVR", "COUNTRY": "Maldives", "FLAG": "flag-icon flag-icon-mv"},
    {"NO": 102, "CCYCODE": "XOF", "COUNTRY": "Mali", "FLAG": "flag-icon flag-icon-ml"},
    {"NO": 103, "CCYCODE": "EUR", "COUNTRY": "Malta", "FLAG": "flag-icon flag-icon-mt"},
    {"NO": 104, "CCYCODE": "MRO", "COUNTRY": "Mauritania", "FLAG": "flag-icon flag-icon-mr"},
    {"NO": 105, "CCYCODE": "MUR", "COUNTRY": "Mauritius", "FLAG": "flag-icon flag-icon-mu"},
    {"NO": 106, "CCYCODE": "MXN", "COUNTRY": "Mexico", "FLAG": "flag-icon flag-icon-mx"},
    {"NO": 107, "CCYCODE": "MDL", "COUNTRY": "Moldova", "FLAG": "flag-icon flag-icon-md"},
    {"NO": 108, "CCYCODE": "MNT", "COUNTRY": "Mongolia", "FLAG": "flag-icon flag-icon-mn"},
    {"NO": 109, "CCYCODE": "MAD", "COUNTRY": "Morocco", "FLAG": "flag-icon flag-icon-ma"},
    {"NO": 110, "CCYCODE": "MZN", "COUNTRY": "Mozambique", "FLAG": "flag-icon flag-icon-mz"},
    {"NO": 111, "CCYCODE": "NAD", "COUNTRY": "Namibia", "FLAG": "flag-icon flag-icon-na"},
    {"NO": 112, "CCYCODE": "NPR", "COUNTRY": "Nepal", "FLAG": "flag-icon flag-icon-np"},
    {"NO": 113, "CCYCODE": "ANG", "COUNTRY": "Netherlands Antilles", "FLAG": "flag-icon flag-icon-an"},
    {"NO": 114, "CCYCODE": "EUR", "COUNTRY": "Netherlands", "FLAG": "flag-icon flag-icon-nl"},
    {"NO": 115, "CCYCODE": "XPF", "COUNTRY": "New Caledonia", "FLAG": "flag-icon flag-icon-nc"},
    {"NO": 116, "CCYCODE": "NZD", "COUNTRY": "New Zealand", "FLAG": "flag-icon flag-icon-nz"},
    {"NO": 117, "CCYCODE": "NIO", "COUNTRY": "Nicaragua", "FLAG": "flag-icon flag-icon-ni"},
    {"NO": 118, "CCYCODE": "XOF", "COUNTRY": "Niger", "FLAG": "flag-icon flag-icon-ne"},
    {"NO": 119, "CCYCODE": "NGN", "COUNTRY": "Nigeria", "FLAG": "flag-icon flag-icon-ng"},
    {"NO": 120, "CCYCODE": "NOK", "COUNTRY": "Norway", "FLAG": "flag-icon flag-icon-no"},
    {"NO": 121, "CCYCODE": "OMR", "COUNTRY": "Oman", "FLAG": "flag-icon flag-icon-om"},
    {"NO": 122, "CCYCODE": "PKR", "COUNTRY": "Pakistan", "FLAG": "flag-icon flag-icon-pk"},
    {"NO": 123, "CCYCODE": "PAB", "COUNTRY": "Panama", "FLAG": "flag-icon flag-icon-pa"},
    {"NO": 124, "CCYCODE": "PGK", "COUNTRY": "Papua New Guinea", "FLAG": "flag-icon flag-icon-pg"},
    {"NO": 125, "CCYCODE": "PYG", "COUNTRY": "Paraguay", "FLAG": "flag-icon flag-icon-py"},
    {"NO": 126, "CCYCODE": "PEN", "COUNTRY": "Peru", "FLAG": "flag-icon flag-icon-pe"},
    {"NO": 127, "CCYCODE": "PHP", "COUNTRY": "Philippines", "FLAG": "flag-icon flag-icon-ph"},
    {"NO": 128, "CCYCODE": "PLN", "COUNTRY": "Poland", "FLAG": "flag-icon flag-icon-pl"},
    {"NO": 129, "CCYCODE": "EUR", "COUNTRY": "Portugal", "FLAG": "flag-icon flag-icon-pt"},
    {"NO": 130, "CCYCODE": "QAR", "COUNTRY": "Qatar", "FLAG": "flag-icon flag-icon-qa"},
    {"NO": 131, "CCYCODE": "RON", "COUNTRY": "Romania", "FLAG": "flag-icon flag-icon-ro"},
    {"NO": 132, "CCYCODE": "RUB", "COUNTRY": "Russia", "FLAG": "flag-icon flag-icon-ru"},
    {"NO": 133, "CCYCODE": "RWF", "COUNTRY": "Rwanda", "FLAG": "flag-icon flag-icon-rw"},
    {"NO": 134, "CCYCODE": "SAR", "COUNTRY": "Saudi Arabia", "FLAG": "flag-icon flag-icon-sa"},
    {"NO": 135, "CCYCODE": "XOF", "COUNTRY": "Senegal", "FLAG": "flag-icon flag-icon-sn"},
    {"NO": 136, "CCYCODE": "RSD", "COUNTRY": "Serbia", "FLAG": "flag-icon flag-icon-rs"},
    {"NO": 137, "CCYCODE": "SCR", "COUNTRY": "Seychelles", "FLAG": "flag-icon flag-icon-sc"},
    {"NO": 138, "CCYCODE": "SLL", "COUNTRY": "Sierra Leone", "FLAG": "flag-icon flag-icon-sl"},
    {"NO": 139, "CCYCODE": "SGD", "COUNTRY": "Singapore", "FLAG": "flag-icon flag-icon-sg"},
    {"NO": 140, "CCYCODE": "EUR", "COUNTRY": "Slovakia", "FLAG": "flag-icon flag-icon-sk"},
    {"NO": 141, "CCYCODE": "EUR", "COUNTRY": "Slovenia", "FLAG": "flag-icon flag-icon-si"},
    {"NO": 142, "CCYCODE": "SBD", "COUNTRY": "Solomon Islands", "FLAG": "flag-icon flag-icon-sb"},
    {"NO": 143, "CCYCODE": "SOS", "COUNTRY": "Somalia", "FLAG": "flag-icon flag-icon-so"},
    {"NO": 144, "CCYCODE": "ZAR", "COUNTRY": "South Africa", "FLAG": "flag-icon flag-icon-za"},
    {"NO": 145, "CCYCODE": "LKR", "COUNTRY": "Sri Lanka", "FLAG": "flag-icon flag-icon-lk"},
    {"NO": 146, "CCYCODE": "SRD", "COUNTRY": "Suriname", "FLAG": "flag-icon flag-icon-sr"},
    {"NO": 147, "CCYCODE": "SZL", "COUNTRY": "Swaziland", "FLAG": "flag-icon flag-icon-sz"},
    {"NO": 148, "CCYCODE": "SEK", "COUNTRY": "Sweden", "FLAG": "flag-icon flag-icon-se"},
    {"NO": 149, "CCYCODE": "CHF", "COUNTRY": "Switzerland", "FLAG": "flag-icon flag-icon-ch"},
    {"NO": 150, "CCYCODE": "TWD", "COUNTRY": "Taiwan", "FLAG": "flag-icon flag-icon-tw"},
    {"NO": 151, "CCYCODE": "TJS", "COUNTRY": "Tajikistan", "FLAG": "flag-icon flag-icon-tj"},
    {"NO": 152, "CCYCODE": "TZS", "COUNTRY": "Tanzania", "FLAG": "flag-icon flag-icon-tz"},
    {"NO": 153, "CCYCODE": "THB", "COUNTRY": "Thailand", "FLAG": "flag-icon flag-icon-th"},
    {"NO": 154, "CCYCODE": "XOF", "COUNTRY": "Togo", "FLAG": "flag-icon flag-icon-tg"},
    {"NO": 155, "CCYCODE": "TOP", "COUNTRY": "Tonga", "FLAG": "flag-icon flag-icon-to"},
    {"NO": 156, "CCYCODE": "TTD", "COUNTRY": "Trinidad and Tobago", "FLAG": "flag-icon flag-icon-tt"},
    {"NO": 157, "CCYCODE": "TND", "COUNTRY": "Tunisia", "FLAG": "flag-icon flag-icon-tn"},
    {"NO": 158, "CCYCODE": "TRY", "COUNTRY": "Turkey", "FLAG": "flag-icon flag-icon-tr"},
    {"NO": 159, "CCYCODE": "TMT", "COUNTRY": "Turkmenistan", "FLAG": "flag-icon flag-icon-tm"},
    {"NO": 160, "CCYCODE": "UGX", "COUNTRY": "Uganda", "FLAG": "flag-icon flag-icon-ug"},
    {"NO": 161, "CCYCODE": "UAH", "COUNTRY": "Ukraine", "FLAG": "flag-icon flag-icon-ua"},
    {"NO": 162, "CCYCODE": "AED", "COUNTRY": "United Arab Emirates", "FLAG": "flag-icon flag-icon-ae"},
    {"NO": 163, "CCYCODE": "GBP", "COUNTRY": "United Kingdom", "FLAG": "flag-icon flag-icon-gb"},
    {"NO": 164, "CCYCODE": "USD", "COUNTRY": "United States", "FLAG": "flag-icon flag-icon-us"},
    {"NO": 165, "CCYCODE": "UYU", "COUNTRY": "Uruguay", "FLAG": "flag-icon flag-icon-uy"},
    {"NO": 166, "CCYCODE": "UZS", "COUNTRY": "Uzbekistan", "FLAG": "flag-icon flag-icon-uz"},
    {"NO": 167, "CCYCODE": "VUV", "COUNTRY": "Vanuatu", "FLAG": "flag-icon flag-icon-vu"},
    {"NO": 168, "CCYCODE": "VND", "COUNTRY": "Vietnam", "FLAG": "flag-icon flag-icon-vn"},
    {"NO": 169, "CCYCODE": "IQD", "COUNTRY": "Iraq", "FLAG": "flag-icon flag-icon-iq"}


]
export const relationArr : any[] = [
  { ID: 1, RELATION: "PARENTS" ,CODE:"PA"},
  { ID: 2, RELATION: "SPOUSE" ,CODE:"SP"},
  { ID: 3, RELATION: "CHILDREN" ,CODE:"CH"},
  { ID: 4, RELATION: "BROTHER/ SISTER" ,CODE:"BS"},
  { ID: 5, RELATION: "RELATIVE" ,CODE:"RE"},
  { ID: 6, RELATION: "BUISNESS PARTNER" ,CODE:"BP"},
  { ID: 7, RELATION: "EMPLOYER" ,CODE:"ER"},
  { ID: 8, RELATION: "EMPLOYEE",CODE:"EE"},
  { ID: 9, RELATION: "FRIENDS" ,CODE:"FR"},
  { ID: 10, RELATION: "OWN" ,CODE:"OW"},
  { ID: 11, RELATION: "NON RELATED" ,CODE:"NR"},
  { ID: 11, RELATION: "OTHERS" ,CODE:"OT"},
 ];
// Bank Code Type Array
 export const bankCodeTypeArr : any [] = [
  {"VALUE": "" , "DESCRIPTION": "--Select--"},
  {"VALUE": "IF" , "DESCRIPTION": "IFSC CODE"},
  {"VALUE": "BS" , "DESCRIPTION": "BSB CODE"},
  {"VALUE": "RC" , "DESCRIPTION": "ROUTING CODE"},
  {"VALUE": "SC" , "DESCRIPTION": "SORT CODE"}
 ]
  //Payee Country
  export const countryArr : any[] = [
    { ID: 1, COUNTRY: "AFGHANISTAN", CURRENCYCODE: "AFN" },
    { ID: 2, COUNTRY: "ALBANIA", CURRENCYCODE: "ALL" },
    { ID: 3, COUNTRY: "ALGERIA", CURRENCYCODE: "DZD" },
    { ID: 4, COUNTRY: "ANDORRA", CURRENCYCODE: "EUR" },
    { ID: 5, COUNTRY: "ANGOLA", CURRENCYCODE: "AOA" },
    { ID: 6, COUNTRY: "ANGUILLA", CURRENCYCODE: "XCD" },
    { ID: 7, COUNTRY: "ANTIGUA AND BARBUDA", CURRENCYCODE: "XCD" },
    { ID: 8, COUNTRY: "ARGENTINA", CURRENCYCODE: "ARS" },
    { ID: 9, COUNTRY: "ARMENIA", CURRENCYCODE: "AMD" },
    { ID: 10, COUNTRY: "ARUBA", CURRENCYCODE: "AWG" },
    { ID: 11, COUNTRY: "AUSTRALIA", CURRENCYCODE: "AUD" },
    { ID: 12, COUNTRY: "AUSTRIA", CURRENCYCODE: "EUR" },
    { ID: 13, COUNTRY: "AZERBAIJAN", CURRENCYCODE: "AZN" },
    { ID: 14, COUNTRY: "BAHAMAS", CURRENCYCODE: "BSD" },
    { ID: 15, COUNTRY: "BAHRAIN", CURRENCYCODE: "BHD" },
    { ID: 16, COUNTRY: "BANGLADESH", CURRENCYCODE: "BDT" },
    { ID: 17, COUNTRY: "BARBADOS", CURRENCYCODE: "BBD" },
    { ID: 18, COUNTRY: "BELGIUM", CURRENCYCODE: "EUR" },
    { ID: 19, COUNTRY: "BELIZE", CURRENCYCODE: "BZD" },
    { ID: 20, COUNTRY: "BENIN", CURRENCYCODE: "XOF" },
    { ID: 21, COUNTRY: "BERMUDA", CURRENCYCODE: "BMD" },
    { ID: 22, COUNTRY: "BOLIVIA", CURRENCYCODE: "BOB" },
    { ID: 23, COUNTRY: "BOSNIA AND HERZEGOVINA", CURRENCYCODE: "BAM" },
    { ID: 24, COUNTRY: "BOTSWANA", CURRENCYCODE: "BWP" },
    { ID: 25, COUNTRY: "BRAZIL", CURRENCYCODE: "BRL" },
    { ID: 26, COUNTRY: "BRUNEI", CURRENCYCODE: "BND" },
    { ID: 27, COUNTRY: "BULGARIA", CURRENCYCODE: "BGN" },
    { ID: 28, COUNTRY: "BURKINA FASO", CURRENCYCODE: "XOF" },
    { ID: 29, COUNTRY: "BURUNDI", CURRENCYCODE: "BIF" },
    { ID: 30, COUNTRY: "CAMBODIA", CURRENCYCODE: "KHR" },
    { ID: 31, COUNTRY: "CAMEROON", CURRENCYCODE: "XAF" },
    { ID: 32, COUNTRY: "CANADA", CURRENCYCODE: "CAD" },
    { ID: 33, COUNTRY: "CAPE VERDE", CURRENCYCODE: "CVE" },
    { ID: 34, COUNTRY: "CENTRAL AFRICAN REPUBLIC", CURRENCYCODE: "XAF" },
    { ID: 35, COUNTRY: "CHAD", CURRENCYCODE: "XAF" },
    { ID: 36, COUNTRY: "CHILE", CURRENCYCODE: "CLP" },
    { ID: 37, COUNTRY: "CHINA", CURRENCYCODE: "CNY" },
    { ID: 38, COUNTRY: "COLOMBIA", CURRENCYCODE: "COP" },
    { ID: 39, COUNTRY: "COMOROS", CURRENCYCODE: "KMF" },
    { ID: 40, COUNTRY: "CONGO", CURRENCYCODE: "CDF" },
    { ID: 41, COUNTRY: "COSTA RICA", CURRENCYCODE: "CRC" },
    { ID: 42, COUNTRY: "COTE D'IVOIRE", CURRENCYCODE: "XOF" },
    { ID: 43, COUNTRY: "CROATIA", CURRENCYCODE: "HRK" },
    { ID: 44, COUNTRY: "CYPRUS", CURRENCYCODE: "EUR" },
    { ID: 45, COUNTRY: "CZECH REPUBLIC", CURRENCYCODE: "CZK" },
    { ID: 46, COUNTRY: "DENMARK", CURRENCYCODE: "DKK" },
    { ID: 47, COUNTRY: "DJIBOUTI", CURRENCYCODE: "DJF" },
    { ID: 48, COUNTRY: "DOMINICAN REPUBLIC", CURRENCYCODE: "DOP" },
    { ID: 49, COUNTRY: "EGYPT", CURRENCYCODE: "EGP" },
    { ID: 50, COUNTRY: "EQUATORIAL GUINEA", CURRENCYCODE: "XAF" },
    { ID: 51, COUNTRY: "ESTONIA", CURRENCYCODE: "EUR" },
    { ID: 52, COUNTRY: "ETHIOPIA", CURRENCYCODE: "ETB" },
    { ID: 53, COUNTRY: "FIJI", CURRENCYCODE: "FJD" },
    { ID: 54, COUNTRY: "FINLAND", CURRENCYCODE: "EUR" },
    { ID: 55, COUNTRY: "FRANCE", CURRENCYCODE: "EUR" },
    { ID: 56, COUNTRY: "FRENCH POLYNESIA", CURRENCYCODE: "XPF" },
    { ID: 57, COUNTRY: "GABON", CURRENCYCODE: "XAF" },
    { ID: 58, COUNTRY: "GAMBIA", CURRENCYCODE: "GMD" },
    { ID: 59, COUNTRY: "GEORGIA", CURRENCYCODE: "GEL" },
    { ID: 60, COUNTRY: "GERMANY", CURRENCYCODE: "EUR" },
    { ID: 61, COUNTRY: "GHANA", CURRENCYCODE: "GHS" },
    { ID: 62, COUNTRY: "GIBRALTAR", CURRENCYCODE: "GIP" }, //New added on 8 Jan 2024
    { ID: 63, COUNTRY: "GREECE", CURRENCYCODE: "EUR" },
    { ID: 64, COUNTRY: "GRENADA", CURRENCYCODE: "XCD" },
    { ID: 65, COUNTRY: "GUATEMALA", CURRENCYCODE: "GTQ" },
    { ID: 66, COUNTRY: "GUINEA", CURRENCYCODE: "GNF" },
    { ID: 67, COUNTRY: "GUINEA-BISSAU", CURRENCYCODE: "XOF" },
    { ID: 68, COUNTRY: "GUYANA", CURRENCYCODE: "GYD" },
    { ID: 69, COUNTRY: "HAITI", CURRENCYCODE: "HTG" },
    { ID: 70, COUNTRY: "HONDURAS", CURRENCYCODE: "HNL" },
    { ID: 71, COUNTRY: "HONG KONG", CURRENCYCODE: "HKD" },
    { ID: 72, COUNTRY: "HUNGARY", CURRENCYCODE: "HUF" },
    { ID: 73, COUNTRY: "ICELAND", CURRENCYCODE: "ISK" },
    { ID: 74, COUNTRY: "INDIA", CURRENCYCODE: "INR" },
    { ID: 75, COUNTRY: "INDONESIA", CURRENCYCODE: "IDR" },
    { ID: 76, COUNTRY: "IRELAND", CURRENCYCODE: "EUR" },
    { ID: 77, COUNTRY: "ISRAEL", CURRENCYCODE: "ILS" },
    { ID: 78, COUNTRY: "ITALY", CURRENCYCODE: "EUR" },
    { ID: 79, COUNTRY: "JAMAICA", CURRENCYCODE: "JMD" },
    { ID: 80, COUNTRY: "JAPAN", CURRENCYCODE: "JPY" },
    { ID: 81, COUNTRY: "JORDAN", CURRENCYCODE: "JOD" },
    { ID: 82, COUNTRY: "KAZAKHSTAN", CURRENCYCODE: "KZT" },
    { ID: 83, COUNTRY: "KENYA", CURRENCYCODE: "KES" },
    { ID: 84, COUNTRY: "KOREA", CURRENCYCODE: "KRW" },
    { ID: 85, COUNTRY: "KOSOVO", CURRENCYCODE: "EUR" },
    { ID: 86, COUNTRY: "KUWAIT", CURRENCYCODE: "KWD" },
    { ID: 87, COUNTRY: "KYRGYZSTAN", CURRENCYCODE: "KGS" },
    { ID: 88, COUNTRY: "LAO'S PEOPLE DEMOCRATIC REPUBLIC", CURRENCYCODE: "LAK" },
    { ID: 89, COUNTRY: "LATVIA", CURRENCYCODE: "EUR" },
    { ID: 90, COUNTRY: "LEBANON", CURRENCYCODE: "LBP"}, // Newly added on 23/11/2024
    { ID: 91, COUNTRY: "LESOTHO", CURRENCYCODE: "LSL" },
    { ID: 92, COUNTRY: "LIBERIA", CURRENCYCODE: "LRD" },
    { ID: 93, COUNTRY: "LITHUANIA", CURRENCYCODE: "EUR" },
    { ID: 94, COUNTRY: "LUXEMBOURG", CURRENCYCODE: "EUR" },
    { ID: 95, COUNTRY: "MACAU", CURRENCYCODE: "MOP" },
    { ID: 96, COUNTRY: "MADAGASCAR", CURRENCYCODE: "MGA" },
    { ID: 97, COUNTRY: "MALAWI", CURRENCYCODE: "MWK" },
    { ID: 98, COUNTRY: "MALAYSIA", CURRENCYCODE: "MYR" },
    { ID: 99, COUNTRY: "MALDIVES", CURRENCYCODE: "MVR" },
    { ID: 100, COUNTRY: "MALI", CURRENCYCODE: "XOF" },
    { ID: 101, COUNTRY: "MALTA", CURRENCYCODE: "EUR" },
    { ID: 102, COUNTRY: "MAURITANIA", CURRENCYCODE: "MRU" },
    { ID: 103, COUNTRY: "MAURITIUS", CURRENCYCODE: "MUR" },
    { ID: 104, COUNTRY: "MEXICO", CURRENCYCODE: "MXN" },
    { ID: 105, COUNTRY: "MONACO", CURRENCYCODE: "EUR" },
    { ID: 106, COUNTRY: "MONGOLIA", CURRENCYCODE: "MNT" },
    { ID: 107, COUNTRY: "MONTENEGRO", CURRENCYCODE: "EUR" },
    { ID: 108, COUNTRY: "MONTSERRAT", CURRENCYCODE: "XCD" },
    { ID: 109, COUNTRY: "MOROCCO", CURRENCYCODE: "MAD" },
    { ID: 110, COUNTRY: "MOZAMBIQUE", CURRENCYCODE: "MZN" },
    { ID: 111, COUNTRY: "MYANMAR", CURRENCYCODE: "MMK" },
    { ID: 112, COUNTRY: "NAMIBIA", CURRENCYCODE: "NAD" },
    { ID: 113, COUNTRY: "NEPAL", CURRENCYCODE: "NPR" },
    { ID: 114, COUNTRY: "NETHERLANDS", CURRENCYCODE: "EUR" },
    { ID: 115, COUNTRY: "NETHERLANDS ANTILLES", CURRENCYCODE: "ANG" },
    { ID: 116, COUNTRY: "NEW ZEALAND", CURRENCYCODE: "NZD" },
    { ID: 117, COUNTRY: "NICARAGUA", CURRENCYCODE: "NIO" },
    { ID: 118, COUNTRY: "NIGER", CURRENCYCODE: "XOF" },
    { ID: 119, COUNTRY: "NIGERIA", CURRENCYCODE: "NGN" },
    { ID: 120, COUNTRY: "NORWAY", CURRENCYCODE: "NOK" },
    { ID: 121, COUNTRY: "OMAN", CURRENCYCODE: "OMR" },
    { ID: 122, COUNTRY: "PAKISTAN", CURRENCYCODE: "PKR" },
    { ID: 123, COUNTRY: "PARAGUAY", CURRENCYCODE: "PYG" },
    { ID: 124, COUNTRY: "PERU", CURRENCYCODE: "PEN" },
    { ID: 125, COUNTRY: "PHILIPPINES", CURRENCYCODE: "PHP" },
    { ID: 126, COUNTRY: "POLAND", CURRENCYCODE: "PLN" },
    { ID: 127, COUNTRY: "PORTUGAL", CURRENCYCODE: "EUR" },
    { ID: 128, COUNTRY: "QATAR", CURRENCYCODE: "QAR" },
    { ID: 129, COUNTRY: "ROMANIA", CURRENCYCODE: "RON" },
    { ID: 130, COUNTRY: "RUSSIA", CURRENCYCODE: "RUB" },
    { ID: 131, COUNTRY: "RWANDA", CURRENCYCODE: "RWF" },
    { ID: 132, COUNTRY: "SAINT KITTS AND NEVIS", CURRENCYCODE: "XCD" },
    { ID: 133, COUNTRY: "SAINT LUCIA", CURRENCYCODE: "XCD" },
    { ID: 134, COUNTRY: "SAINT VINCENT AND THE GRENADINES", CURRENCYCODE: "XCD" },
    { ID: 135, COUNTRY: "SAMOA", CURRENCYCODE: "WST" },
    { ID: 136, COUNTRY: "SAN MARINO", CURRENCYCODE: "EUR" },
    { ID: 137, COUNTRY: "SAO TOME AND PRINCIPE", CURRENCYCODE: "STN" },
    { ID: 138, COUNTRY: "SAUDI ARABIA", CURRENCYCODE: "SAR" },
    { ID: 139, COUNTRY: "SENEGAL", CURRENCYCODE: "XOF" },
    { ID: 140, COUNTRY: "SERBIA", CURRENCYCODE: "RSD" },
    { ID: 141, COUNTRY: "SEYCHELLES", CURRENCYCODE: "SCR" },
    { ID: 142, COUNTRY: "SIERRA LEONE", CURRENCYCODE: "SLL" },
    { ID: 143, COUNTRY: "SINGAPORE", CURRENCYCODE: "SGD" },
    { ID: 144, COUNTRY: "SLOVAKIA", CURRENCYCODE: "EUR" },
    { ID: 145, COUNTRY: "SLOVENIA", CURRENCYCODE: "EUR" },
    { ID: 146, COUNTRY: "SOLOMON ISLANDS", CURRENCYCODE: "SBD" },
    { ID: 147, COUNTRY: "SOUTH AFRICA", CURRENCYCODE: "ZAR" },
    { ID: 148, COUNTRY: "SPAIN", CURRENCYCODE: "EUR" },
    { ID: 149, COUNTRY: "SRI LANKA", CURRENCYCODE: "LKR" },
    { ID: 150, COUNTRY: "SURINAME", CURRENCYCODE: "SRD" },
    { ID: 151, COUNTRY: "SWAZILAND", CURRENCYCODE: "SZL" },
    { ID: 152, COUNTRY: "SWEDEN", CURRENCYCODE: "SEK" },
    { ID: 153, COUNTRY: "SWITZERLAND", CURRENCYCODE: "CHF" },
    { ID: 154, COUNTRY: "TAIWAN", CURRENCYCODE: "TWD" },
    { ID: 155, COUNTRY: "TANZANIA", CURRENCYCODE: "TZS" },
    { ID: 156, COUNTRY: "THAILAND", CURRENCYCODE: "THB" },
    { ID: 157, COUNTRY: "TOGO", CURRENCYCODE: "XOF" },
    { ID: 158, COUNTRY: "TONGA", CURRENCYCODE: "TOP" },
    { ID: 159, COUNTRY: "TRINIDAD AND TOBAGO", CURRENCYCODE: "TTD" },
    { ID: 160, COUNTRY: "TUNISIA", CURRENCYCODE: "TND" },
    { ID: 161, COUNTRY: "TURKEY", CURRENCYCODE: "TRY" },
    { ID: 162, COUNTRY: "UGANDA", CURRENCYCODE: "UGX" },
    { ID: 163, COUNTRY: "UNITED ARAB EMIRATES", CURRENCYCODE: "AED" },
    { ID: 164, COUNTRY: "UNITED KINGDOM", CURRENCYCODE: "GBP" },
    { ID: 165, COUNTRY: "UNITED STATES", CURRENCYCODE: "USD"},
    { ID: 166, COUNTRY: "URUGUAY", CURRENCYCODE: "UYU" },
    { ID: 167, COUNTRY: "VANUATU", CURRENCYCODE: "VUV" },
    { ID: 168, COUNTRY: "VIETNAM", CURRENCYCODE: "VND" },
    { ID: 169, COUNTRY: "ZAMBIA", CURRENCYCODE: "ZMW" }
];   
    

export const initiatedBy : string[] =[
  'APT'
 // 'Agent' new change because APT only will add deals 

]  


export const nationalityArray : any[] = [
  { ID: 1, COUNTRY: "AFGHANISTAN", CURRENCYCODE: "AFG", NATIONALITY: "AFGHAN" },
  { ID: 2, COUNTRY: "ALBANIA", CURRENCYCODE: "ALL", NATIONALITY: "ALBANIAN" },
  { ID: 3, COUNTRY: "ALGERIA", CURRENCYCODE: "DZD", NATIONALITY: "ALGERIAN" },
  { ID: 4, COUNTRY: "UNITED STATES", CURRENCYCODE: "USD", NATIONALITY: "AMERICAN" },
  { ID: 5, COUNTRY: "ANDORRA", CURRENCYCODE: "EUR", NATIONALITY: "ANDORRAN" },
  { ID: 6, COUNTRY: "ANGOLA", CURRENCYCODE: "AOA", NATIONALITY: "ANGOLAN" },
  { ID: 7, COUNTRY: "ANGUILLA", CURRENCYCODE: "XCD", NATIONALITY: "ANGUILLAN" },
  { ID: 8, COUNTRY: "ANTIGUA AND BARBUDA", CURRENCYCODE: "XCD", NATIONALITY: "ANTIGUAN" },
  { ID: 9, COUNTRY: "NETHERLANDS ANTILLES", CURRENCYCODE: "ANG", NATIONALITY: "ANTILLEAN" },
  { ID: 10, COUNTRY: "ARGENTINA", CURRENCYCODE: "ARS", NATIONALITY: "ARGENTINIAN" },
  { ID: 11, COUNTRY: "ARMENIA", CURRENCYCODE: "AMD", NATIONALITY: "ARMENIAN" },
  { ID: 12, COUNTRY: "ARUBA", CURRENCYCODE: "AWG", NATIONALITY: "ARUBAN" },
  { ID: 13, COUNTRY: "AUSTRALIA", CURRENCYCODE: "AUD", NATIONALITY: "AUSTRALIAN" },
  { ID: 14, COUNTRY: "AUSTRIA", CURRENCYCODE: "EUR", NATIONALITY: "AUSTRIAN" },
  { ID: 15, COUNTRY: "AZERBAIJAN", CURRENCYCODE: "AZN", NATIONALITY: "AZERBAIJANI" },
  { ID: 16, COUNTRY: "BAHAMAS", CURRENCYCODE: "BSD", NATIONALITY: "BAHAMIAN" },
  { ID: 17, COUNTRY: "BAHRAIN", CURRENCYCODE: "BHD", NATIONALITY: "BAHRAINI" },
  { ID: 18, COUNTRY: "BANGLADESH", CURRENCYCODE: "BDT", NATIONALITY: "BANGLADESHI" },
  { ID: 19, COUNTRY: "BARBADOS", CURRENCYCODE: "BBD", NATIONALITY: "BARBADIAN" },
  { ID: 20, COUNTRY: "BELGIUM", CURRENCYCODE: "EUR", NATIONALITY: "BELGIAN" },
  { ID: 21, COUNTRY: "BELIZE", CURRENCYCODE: "BZD", NATIONALITY: "BELIZEAN" },
  { ID: 22, COUNTRY: "BENIN", CURRENCYCODE: "XOF", NATIONALITY: "BENINESE" },
  { ID: 23, COUNTRY: "BERMUDA", CURRENCYCODE: "BMD", NATIONALITY: "BERMUDIAN" },
  { ID: 24, COUNTRY: "BOLIVIA", CURRENCYCODE: "BOB", NATIONALITY: "BOLIVIAN" },
  { ID: 25, COUNTRY: "BOSNIA AND HERZEGOVINA", CURRENCYCODE: "BAM", NATIONALITY: "BOSNIAN" },
  { ID: 26, COUNTRY: "BOTSWANA", CURRENCYCODE: "BWP", NATIONALITY: "BOTSWANAN" },
  { ID: 27, COUNTRY: "BRAZIL", CURRENCYCODE: "BRL", NATIONALITY: "BRAZILIAN" },
  { ID: 28, COUNTRY: "UNITED KINGDOM", CURRENCYCODE: "GBP", NATIONALITY: "BRITISH" },
  { ID: 29, COUNTRY: "BRUNEI", CURRENCYCODE: "BND", NATIONALITY: "BRUNEIAN" },
  { ID: 30, COUNTRY: "BULGARIA", CURRENCYCODE: "BGN", NATIONALITY: "BULGARIAN" },
  { ID: 31, COUNTRY: "BURKINA FASO", CURRENCYCODE: "XOF", NATIONALITY: "BURKINABE" },
  { ID: 32, COUNTRY: "BURUNDI", CURRENCYCODE: "BIF", NATIONALITY: "BURUNDIAN" },
  { ID: 33, COUNTRY: "CAMBODIA", CURRENCYCODE: "KHR", NATIONALITY: "CAMBODIAN" },
  { ID: 34, COUNTRY: "CAMEROON", CURRENCYCODE: "XAF", NATIONALITY: "CAMEROONIAN" },
  { ID: 35, COUNTRY: "CANADA", CURRENCYCODE: "CAD", NATIONALITY: "CANADIAN" },
  { ID: 36, COUNTRY: "CAPE VERDE", CURRENCYCODE: "CVE", NATIONALITY: "CAPE VERDEAN" },
  { ID: 37, COUNTRY: "CENTRAL AFRICAN REPUBLIC", CURRENCYCODE: "XAF", NATIONALITY: "CENTRAL AFRICAN" },
  { ID: 38, COUNTRY: "CHAD", CURRENCYCODE: "CFA", NATIONALITY: "CHADIAN" },
  { ID: 39, COUNTRY: "CHILE", CURRENCYCODE: "CLP", NATIONALITY: "CHILEAN" },
  { ID: 40, COUNTRY: "CHINA", CURRENCYCODE: "CNY", NATIONALITY: "CHINESE" },
  { ID: 41, COUNTRY: "COLOMBIA", CURRENCYCODE: "COP", NATIONALITY: "COLOMBIAN" },
  { ID: 42, COUNTRY: "COMOROS", CURRENCYCODE: "KMF", NATIONALITY: "COMORIAN" },
  { ID: 43, COUNTRY: "CONGO", CURRENCYCODE: "CDF", NATIONALITY: "CONGOLESE" },
  { ID: 44, COUNTRY: "COSTA RICA", CURRENCYCODE: "CRC", NATIONALITY: "COSTA RICAN" },
  { ID: 45, COUNTRY: "CROATIA", CURRENCYCODE: "HRK", NATIONALITY: "CROATIAN" },
  { ID: 46, COUNTRY: "CYPRUS", CURRENCYCODE: "EUR", NATIONALITY: "CYPRIOT" },
  { ID: 47, COUNTRY: "CZECH REPUBLIC", CURRENCYCODE: "CZK", NATIONALITY: "CZECH" },
  { ID: 48, COUNTRY: "DENMARK", CURRENCYCODE: "DKK", NATIONALITY: "DANISH" },
  { ID: 49, COUNTRY: "DJIBOUTI", CURRENCYCODE: "DJF", NATIONALITY: "DJIBOUTIAN" },
  { ID: 50, COUNTRY: "DOMINICAN REPUBLIC", CURRENCYCODE: "DOP", NATIONALITY: "DOMINICAN" },
  { ID: 51, COUNTRY: "NETHERLANDS", CURRENCYCODE: "EUR", NATIONALITY: "DUTCH" },
  { ID: 52, COUNTRY: "EGYPT", CURRENCYCODE: "EGP", NATIONALITY: "EGYPTIAN" },
  { ID: 53, COUNTRY: "UNITED ARAB EMIRATES", CURRENCYCODE: "AED", NATIONALITY: "EMIRATI" },
  { ID: 54, COUNTRY: "EQUATORIAL GUINEA", CURRENCYCODE: "XAF", NATIONALITY: "EQUATORIAL GUINEAN" },
  { ID: 55, COUNTRY: "ESTONIA", CURRENCYCODE: "EUR", NATIONALITY: "ESTONIAN" },
  { ID: 56, COUNTRY: "ETHIOPIA", CURRENCYCODE: "ETB", NATIONALITY: "ETHIOPIAN" },
  { ID: 57, COUNTRY: "FIJI", CURRENCYCODE: "FJD", NATIONALITY: "FIJIAN" },
  { ID: 58, COUNTRY: "PHILIPPINES", CURRENCYCODE: "PHP", NATIONALITY: "FILIPINO" },
  { ID: 59, COUNTRY: "FINLAND", CURRENCYCODE: "EUR", NATIONALITY: "FINNISH" },
  { ID: 60, COUNTRY: "FRANCE", CURRENCYCODE: "EUR", NATIONALITY: "FRENCH" },
  { ID: 61, COUNTRY: "GABON", CURRENCYCODE: "XAF", NATIONALITY: "GABONESE" },
  { ID: 62, COUNTRY: "GAMBIA", CURRENCYCODE: "GMD", NATIONALITY: "GAMBIAN" },
  { ID: 63, COUNTRY: "GEORGIA", CURRENCYCODE: "GEL", NATIONALITY: "GEORGIAN" },
  { ID: 64, COUNTRY: "GERMANY", CURRENCYCODE: "EUR", NATIONALITY: "GERMAN" },
  { ID: 65, COUNTRY: "GHANA", CURRENCYCODE: "GHS", NATIONALITY: "GHANAIAN" },
  { ID: 66, COUNTRY: "GIBRALTAR", CURRENCYCODE: "GIP", NATIONALITY: "GIBRALTARIANS" },
  { ID: 67, COUNTRY: "GREECE", CURRENCYCODE: "EUR", NATIONALITY: "GREEK" },
  { ID: 68, COUNTRY: "GRENADA", CURRENCYCODE: "XCD", NATIONALITY: "GRENADIAN" },
  { ID: 69, COUNTRY: "GUATEMALA", CURRENCYCODE: "GTQ", NATIONALITY: "GUATEMALAN" },
  { ID: 70, COUNTRY: "GUINEA", CURRENCYCODE: "GNF", NATIONALITY: "GUINEAN" },
  { ID: 71, COUNTRY: "GUINEA-BISSAU", CURRENCYCODE: "XOF", NATIONALITY: "GUINEAN" },
  { ID: 72, COUNTRY: "GUYANA", CURRENCYCODE: "GYD", NATIONALITY: "GUYANESE" },
  { ID: 73, COUNTRY: "HAITI", CURRENCYCODE: "HTG", NATIONALITY: "HAITIAN" },
  { ID: 74, COUNTRY: "HONDURAS", CURRENCYCODE: "HNL", NATIONALITY: "HONDURAN" },
  { ID: 75, COUNTRY: "HONG KONG", CURRENCYCODE: "HKD", NATIONALITY: "HONG KONG" },
  { ID: 76, COUNTRY: "HUNGARY", CURRENCYCODE: "HUF", NATIONALITY: "HUNGARIAN" },
  { ID: 77, COUNTRY: "ICELAND", CURRENCYCODE: "ISK", NATIONALITY: "ICELANDIC" },
  { ID: 78, COUNTRY: "INDIA", CURRENCYCODE: "INR", NATIONALITY: "INDIAN" },
  { ID: 79, COUNTRY: "INDONESIA", CURRENCYCODE: "IDR", NATIONALITY: "INDONESIAN" },
  { ID: 80, COUNTRY: "IRELAND", CURRENCYCODE: "EUR", NATIONALITY: "IRISH" },
  { ID: 81, COUNTRY: "ISRAEL", CURRENCYCODE: "ILS", NATIONALITY: "ISRAELI" },
  { ID: 82, COUNTRY: "ITALY", CURRENCYCODE: "EUR", NATIONALITY: "ITALIAN" },
  { ID: 83, COUNTRY: "COTE D'IVOIRE", CURRENCYCODE: "XOF", NATIONALITY: "IVORIAN" },
  { ID: 84, COUNTRY: "JAMAICA", CURRENCYCODE: "JMD", NATIONALITY: "JAMAICAN" },
  { ID: 85, COUNTRY: "JAPAN", CURRENCYCODE: "JPY", NATIONALITY: "JAPANESE" },
  { ID: 86, COUNTRY: "JORDAN", CURRENCYCODE: "JOD", NATIONALITY: "JORDANIAN" },
  { ID: 87, COUNTRY: "KAZAKHSTAN", CURRENCYCODE: "KZT", NATIONALITY: "KAZAKHSTANI" },
  { ID: 88, COUNTRY: "KENYA", CURRENCYCODE: "KES", NATIONALITY: "KENYAN" },
  { ID: 89, COUNTRY: "KOREA", CURRENCYCODE: "KRW", NATIONALITY: "KOREAN" },
  { ID: 90, COUNTRY: "KOSOVO", CURRENCYCODE: "EUR", NATIONALITY: "KOSOVAN" },
  { ID: 91, COUNTRY: "KUWAIT", CURRENCYCODE: "KWD", NATIONALITY: "KUWAITI" },
  { ID: 92, COUNTRY: "KYRGYZSTAN", CURRENCYCODE: "KGS", NATIONALITY: "KYRGYZ" },
  { ID: 93, COUNTRY: "LAO'S PEOPLE DEMOCRATIC REPUBLIC", CURRENCYCODE: "LAK", NATIONALITY: "LAO" },
  { ID: 94, COUNTRY: "LATVIA", CURRENCYCODE: "EUR", NATIONALITY: "LATVIAN" },
  { ID: 95, COUNTRY: "LEBANON", CURRENCYCODE: "LBP", NATIONALITY: "LEBANESE" },
  { ID: 96, COUNTRY: "LESOTHO", CURRENCYCODE: "LSL", NATIONALITY: "LESOTHO" },
  { ID: 97, COUNTRY: "LIBERIA", CURRENCYCODE: "LRD", NATIONALITY: "LIBERIAN" },
  { ID: 98, COUNTRY: "LITHUANIA", CURRENCYCODE: "EUR", NATIONALITY: "LITHUANIAN" },
  { ID: 99, COUNTRY: "LUXEMBOURG", CURRENCYCODE: "EUR", NATIONALITY: "LUXEMBOURGER" },
  { ID: 100, COUNTRY: "MACAU", CURRENCYCODE: "MOP", NATIONALITY: "MACANESE" },
  { ID: 101, COUNTRY: "MADAGASCAR", CURRENCYCODE: "MGA", NATIONALITY: "MADAGASCAN" },
  { ID: 102, COUNTRY: "MALAWI", CURRENCYCODE: "MWK", NATIONALITY: "MALAWIAN" },
  { ID: 103, COUNTRY: "MALAYSIA", CURRENCYCODE: "MYR", NATIONALITY: "MALAYSIAN" },
  { ID: 104, COUNTRY: "MALDIVES", CURRENCYCODE: "MVR", NATIONALITY: "MALDIVIAN" },
  { ID: 105, COUNTRY: "MALI", CURRENCYCODE: "XOF", NATIONALITY: "MALIAN" },
  { ID: 106, COUNTRY: "MALTA", CURRENCYCODE: "EUR", NATIONALITY: "MALTESE" },
  { ID: 107, COUNTRY: "MAURITANIA", CURRENCYCODE: "MRU", NATIONALITY: "MAURITANIAN" },
  { ID: 108, COUNTRY: "MAURITIUS", CURRENCYCODE: "MUR", NATIONALITY: "MAURITIAN" },
  { ID: 109, COUNTRY: "MEXICO", CURRENCYCODE: "MXN", NATIONALITY: "MEXICAN" },
  { ID: 110, COUNTRY: "MONACO", CURRENCYCODE: "EUR", NATIONALITY: "MONEGASQUE" },
  { ID: 111, COUNTRY: "MONGOLIA", CURRENCYCODE: "MNT", NATIONALITY: "MONGOLIAN" },
  { ID: 112, COUNTRY: "MONTENEGRO", CURRENCYCODE: "EUR", NATIONALITY: "MONTENEGRIN" },
  { ID: 113, COUNTRY: "MONTSERRAT", CURRENCYCODE: "XCD", NATIONALITY: "MONTSERRATIAN" },
  { ID: 114, COUNTRY: "MOROCCO", CURRENCYCODE: "MAD", NATIONALITY: "MOROCCAN" },
  { ID: 115, COUNTRY: "MOZAMBIQUE", CURRENCYCODE: "MZN", NATIONALITY: "MOZAMBICAN" },
  { ID: 116, COUNTRY: "MYANMAR", CURRENCYCODE: "MMK", NATIONALITY: "MYANMARESE" },
  { ID: 117, COUNTRY: "NAMIBIA", CURRENCYCODE: "NAD", NATIONALITY: "NAMIBIAN" },
  { ID: 118, COUNTRY: "NEPAL", CURRENCYCODE: "NPR", NATIONALITY: "NEPALESE" },
  { ID: 119, COUNTRY: "NEW ZEALAND", CURRENCYCODE: "NZD", NATIONALITY: "NEW ZEALANDER" },
  { ID: 120, COUNTRY: "NICARAGUA", CURRENCYCODE: "NIO", NATIONALITY: "NICARAGUAN" },
  { ID: 121, COUNTRY: "NIGERIA", CURRENCYCODE: "NGN", NATIONALITY: "NIGERIAN" },
  { ID: 122, COUNTRY: "NIGER", CURRENCYCODE: "XOF", NATIONALITY: "NIGERIEN" },
  { ID: 123, COUNTRY: "NORWAY", CURRENCYCODE: "NOK", NATIONALITY: "NORWEGIAN" },
  { ID: 124, COUNTRY: "OMAN", CURRENCYCODE: "OMR", NATIONALITY: "OMANI" },
  { ID: 125, COUNTRY: "PAKISTAN", CURRENCYCODE: "PKR", NATIONALITY: "PAKISTANI" },
  { ID: 126, COUNTRY: "PARAGUAY", CURRENCYCODE: "PYG", NATIONALITY: "PARAGUAYAN" },
  { ID: 127, COUNTRY: "PERU", CURRENCYCODE: "PEN", NATIONALITY: "PERUVIAN" },
  { ID: 128, COUNTRY: "POLAND", CURRENCYCODE: "PLN", NATIONALITY: "POLISH" },
  { ID: 129, COUNTRY: "PORTUGAL", CURRENCYCODE: "EUR", NATIONALITY: "PORTUGUESE" },
  { ID: 130, COUNTRY: "QATAR", CURRENCYCODE: "QAR", NATIONALITY: "QATARI" },
  { ID: 131, COUNTRY: "ROMANIA", CURRENCYCODE: "RON", NATIONALITY: "ROMANIAN" },
  { ID: 132, COUNTRY: "RUSSIA", CURRENCYCODE: "RUB", NATIONALITY: "RUSSIAN" },
  { ID: 133, COUNTRY: "RWANDA", CURRENCYCODE: "RWF", NATIONALITY: "RWANDAN" },
  { ID: 134, COUNTRY: "SAINT KITTS AND NEVIS", CURRENCYCODE: "XCD", NATIONALITY: "SAINT KITTSIAN" },
  { ID: 135, COUNTRY: "SAINT LUCIA", CURRENCYCODE: "XCD", NATIONALITY: "SAINT LUCIAN" },
  { ID: 136, COUNTRY: "SAINT VINCENT AND THE GRENADINES", CURRENCYCODE: "XCD", NATIONALITY: "SAINT VINCENTIAN" },
  { ID: 137, COUNTRY: "SAMOA", CURRENCYCODE: "WST", NATIONALITY: "SAMOAN" },
  { ID: 138, COUNTRY: "SAN MARINO", CURRENCYCODE: "EUR", NATIONALITY: "SANMARINESE" },
  { ID: 139, COUNTRY: "SAO TOME AND PRINCIPE", CURRENCYCODE: "STN", NATIONALITY: "SAOTOMEAN" },
  { ID: 140, COUNTRY: "SAUDI ARABIA", CURRENCYCODE: "SAR", NATIONALITY: "SAUDI ARABIAN" },
  { ID: 141, COUNTRY: "SENEGAL", CURRENCYCODE: "XOF", NATIONALITY: "SENEGALESE" },
  { ID: 142, COUNTRY: "SERBIA", CURRENCYCODE: "RSD", NATIONALITY: "SERBIAN" },
  { ID: 143, COUNTRY: "SEYCHELLES", CURRENCYCODE: "SCR", NATIONALITY: "SEYCHELLOIS" },
  { ID: 144, COUNTRY: "SIERRA LEONE", CURRENCYCODE: "SLL", NATIONALITY: "SIERRA LEONEAN" },
  { ID: 145, COUNTRY: "SINGAPORE", CURRENCYCODE: "SGD", NATIONALITY: "SINGAPOREAN" },
  { ID: 146, COUNTRY: "SLOVAKIA", CURRENCYCODE: "EUR", NATIONALITY: "SLOVAK" },
  { ID: 147, COUNTRY: "SLOVENIA", CURRENCYCODE: "EUR", NATIONALITY: "SLOVENIAN" },
  { ID: 148, COUNTRY: "SOLOMON ISLANDS", CURRENCYCODE: "SBD", NATIONALITY: "SOLOMON ISLANDER" },
  { ID: 149, COUNTRY: "SOUTH AFRICA", CURRENCYCODE: "ZAR", NATIONALITY: "SOUTH AFRICAN" },
  { ID: 150, COUNTRY: "SPAIN", CURRENCYCODE: "EUR", NATIONALITY: "SPANISH" },
  { ID: 151, COUNTRY: "SRI LANKA", CURRENCYCODE: "LKR", NATIONALITY: "SRI LANKAN" },
  { ID: 152, COUNTRY: "SURINAME", CURRENCYCODE: "SRD", NATIONALITY: "SURINAMESE" },
  { ID: 153, COUNTRY: "SWAZILAND", CURRENCYCODE: "SZL", NATIONALITY: "SWAZI" },
  { ID: 154, COUNTRY: "SWEDEN", CURRENCYCODE: "SEK", NATIONALITY: "SWEDISH" },
  { ID: 155, COUNTRY: "SWITZERLAND", CURRENCYCODE: "CHF", NATIONALITY: "SWISS" },
  { ID: 156, COUNTRY: "FRENCH POLYNESIA", CURRENCYCODE: "XPF", NATIONALITY: "TAHITIAN" },
  { ID: 157, COUNTRY: "TAIWAN", CURRENCYCODE: "TWD", NATIONALITY: "TAIWANESE" },
  { ID: 158, COUNTRY: "TANZANIA", CURRENCYCODE: "TZS", NATIONALITY: "TANZANIAN" },
  { ID: 159, COUNTRY: "THAILAND", CURRENCYCODE: "THB", NATIONALITY: "THAI" },
  { ID: 160, COUNTRY: "TOGO", CURRENCYCODE: "XOF", NATIONALITY: "TOGOLESE" },
  { ID: 161, COUNTRY: "TONGA", CURRENCYCODE: "TOP", NATIONALITY: "TONGAN" },
  { ID: 162, COUNTRY: "TRINIDAD AND TOBAGO", CURRENCYCODE: "TTD", NATIONALITY: "TRINIDADIAN" },
  { ID: 163, COUNTRY: "TUNISIA", CURRENCYCODE: "TND", NATIONALITY: "TUNISIAN" },
  { ID: 164, COUNTRY: "TURKEY", CURRENCYCODE: "TRY", NATIONALITY: "TURKISH" },
  { ID: 165, COUNTRY: "UGANDA", CURRENCYCODE: "UGX", NATIONALITY: "UGANDAN" },
  { ID: 166, COUNTRY: "URUGUAY", CURRENCYCODE: "UYU", NATIONALITY: "URUGUAYAN" },
  { ID: 167, COUNTRY: "VANUATU", CURRENCYCODE: "VUV", NATIONALITY: "VANUATUAN" },
  { ID: 168, COUNTRY: "VIETNAM", CURRENCYCODE: "VND", NATIONALITY: "VIETNAMESE" },
  { ID: 169, COUNTRY: "ZAMBIA", CURRENCYCODE: "ZMW", NATIONALITY: "ZAMBIAN" }
];




//these foreignCurrencyArr array list is re-used in (SG-REMITTANCE) :
//1. Agent > Book Contracts (foreign currency dropdown list) .
//2. Backoffice (RT) > Unposted > transfer summary component .
export const foreignCurrencyArr : string[] = ['USD','EUR','JPY','HKD','GBP','AUD','CAD','CHF','NZD','INR','THB','AED','PHP','SAR', 'TWD','KRW'
];



  //reused this variable for checking whether currency code is other than DBS supported currency ..
  //1. Backoffice (RT) > Remittance > Send Money screen 
  //2. Backoffice (RT) Forex > Deal screen
  //3. Consumer > Send Money screen
  //4. Corporate (deal flow) > Send Money screen
  export const dealFlowCurrency : string[] = [
    "MYR" , "IDR" 
  ] ;

   //reused this variable --> MYR only has the admin fee fluctations in consumer , corporate and backoffice send money ..
  //1. Backoffice > Send Money screen
  //2. Consumer > Send Money screen.
  //3. Corporate (deal) > Send Money screen.
  export const fluctuateAdminFeeCurrencies : string[] = [
    "MYR"
  ] ;



// dbsSupportedCurrencyPairs const variable reused in :
//1. Backoffice (RT) > pips search component .
export const dbsSupportedCurrencyPairs : any[] = [
  {  "CURRENCYCODE": "USDSGD", "FLAG": "flag-icon flag-icon-us",  },
  { "CURRENCYCODE": "NZDSGD", "FLAG": "flag-icon flag-icon-nz",  },
  {  "CURRENCYCODE": "JPYSGD", "FLAG": "flag-icon flag-icon-jp",  },
  { "CURRENCYCODE": "HKDSGD", "FLAG": "flag-icon flag-icon-hk",  },
  {  "CURRENCYCODE": "GBPSGD", "FLAG": "flag-icon flag-icon-gb",  },
  {  "CURRENCYCODE": "EURSGD", "FLAG": "flag-icon flag-icon-ck",  },
  {  "CURRENCYCODE": "AUDSGD", "FLAG": "flag-icon flag-icon-au",  },
  {  "CURRENCYCODE": "CHFSGD", "FLAG": "flag-icon flag-icon-ch",  },
  { "CURRENCYCODE": "CADSGD", "FLAG": "flag-icon flag-icon-ca",  },
  { "CURRENCYCODE": "INRSGD", "FLAG": "flag-icon flag-icon-in",  },
  { "CURRENCYCODE": "THBSGD", "FLAG": "flag-icon flag-icon-th",  },
  {  "CURRENCYCODE": "AEDSGD", "FLAG": "flag-icon flag-icon-ae",  },
  { "CURRENCYCODE": "PHPSGD", "FLAG": "flag-icon flag-icon-ph",  },
  { "CURRENCYCODE": "SARSGD", "FLAG": "flag-icon flag-icon-sa",  },
  { "CURRENCYCODE": "TWDSGD", "FLAG": "flag-icon flag-icon-tw",  },
  { "CURRENCYCODE": "KRWSGD", "FLAG": "flag-icon flag-icon-kr",  },
];


// remittanceExchRateArray const variable reused in 
//1. Backoffice (RT) > exchange rate search component , 
//2. Backoffice (RT) > Send Money (Payee Gets) component , 
//3. Consumer > Send Money (Payee Gets field) component .
//4. Backoffice (RT) > Commission setup component .
//5. Corporate > Send Money(Deal) > Payee Gets Dropdown
//6. Backoffice (RT) > Dashboard > Exch rate widget .
export const remittanceExchRateArray : any[] = [
  {"NO" : 1, "CURRENCYCODE" : "MYR","COUNTRY":"Malaysia", "FLAG": "flag-icon flag-icon-my","UPDATEDBY":"","EXCHRATE":"" },
  {"NO" : 2, "CURRENCYCODE" : "THB" ,"COUNTRY":"Thailand","FLAG": "flag-icon flag-icon-th","UPDATEDBY":"","EXCHRATE":"" },
  {"NO" : 3, "CURRENCYCODE" : "IDR","COUNTRY":"Indonesia", "FLAG": "flag-icon flag-icon-id","UPDATEDBY":"" ,"EXCHRATE":"" },
  {"NO" : 4, "CURRENCYCODE" : "VND","COUNTRY":"Vietnam", "FLAG": "flag-icon flag-icon-vn","UPDATEDBY":"","EXCHRATE":"" },
  {"NO" : 5, "CURRENCYCODE" : "MMK" ,"COUNTRY":"Myanmar","FLAG": "flag-icon flag-icon-mm","UPDATEDBY":"","EXCHRATE":"" },
  {"NO" : 6, "CURRENCYCODE" : "BDT","COUNTRY":"Bangladesh", "FLAG": "flag-icon flag-icon-bd","UPDATEDBY":"" ,"EXCHRATE":"" },
  {"NO" : 7, "CURRENCYCODE" : "CNY", "COUNTRY":"China","FLAG": "flag-icon flag-icon-cn","UPDATEDBY":"" ,"EXCHRATE":"" },
  {"NO" : 8, "CURRENCYCODE" : "USD","COUNTRY":"United states", "FLAG": "flag-icon flag-icon-us","UPDATEDBY":"","EXCHRATE":""  },
  {"NO" : 9, "CURRENCYCODE" : "JPY", "COUNTRY":"Japan","FLAG": "flag-icon flag-icon-jp","UPDATEDBY":"" ,"EXCHRATE":"" },
  {"NO" : 10, "CURRENCYCODE" : "HKD","COUNTRY":"Hong Kong", "FLAG": "flag-icon flag-icon-hk","UPDATEDBY":"" ,"EXCHRATE":"" },
  {"NO" : 11, "CURRENCYCODE" : "GBP", "COUNTRY":"Britain","FLAG": "flag-icon flag-icon-gb","UPDATEDBY":"","EXCHRATE":""   }, 
  {"NO" : 12, "CURRENCYCODE" : "EUR","COUNTRY":"Europe", "FLAG": "flag-icon flag-icon-ck","UPDATEDBY":"" ,"EXCHRATE":""  }, 
  {"NO" : 13, "CURRENCYCODE" : "AUD","COUNTRY":"Australia", "FLAG": "flag-icon flag-icon-au" , "UPDATEDBY":"","EXCHRATE":""  },
  {"NO" : 14, "CURRENCYCODE" : "CHF", "COUNTRY":"Swiss Franc","FLAG": "flag-icon flag-icon-ch" ,"UPDATEDBY":"","EXCHRATE":"" },
   {"NO" : 15, "CURRENCYCODE" : "CAD","COUNTRY":"Canada", "FLAG": "flag-icon flag-icon-ca","UPDATEDBY":"" ,"EXCHRATE":"" },
   {"NO" : 16, "CURRENCYCODE" : "NZD","COUNTRY":"Newzealand", "FLAG": "flag-icon flag-icon-nz","UPDATEDBY":"" ,"EXCHRATE":"" },
   {"NO" : 17, "CURRENCYCODE" : "INR","COUNTRY":"India", "FLAG": "flag-icon flag-icon-in","UPDATEDBY":"" ,"EXCHRATE":"" },
   {"NO" : 18, "CURRENCYCODE" : "AED", "COUNTRY":"United Arab Emirates","FLAG": "flag-icon flag-icon-ae" ,"UPDATEDBY":"","EXCHRATE":"" },
   {"NO" : 19, "CURRENCYCODE" : "PHP","COUNTRY":"Philippines", "FLAG": "flag-icon flag-icon-ph","UPDATEDBY":"" ,"EXCHRATE":"" },
   {"NO" : 20, "CURRENCYCODE" : "SAR","COUNTRY":"Saudi Arabia", "FLAG": "flag-icon flag-icon-sa","UPDATEDBY":"" ,"EXCHRATE":"" },
   {"NO" : 21, "CURRENCYCODE" : "TWD","COUNTRY":"Taiwan", "FLAG": "flag-icon flag-icon-tw","UPDATEDBY":"" ,"EXCHRATE":"" },
   //added KRW currency
   {"NO" : 22, "CURRENCYCODE" : "KRW","COUNTRY":"South Korea", "FLAG": "flag-icon flag-icon-kr","UPDATEDBY":"" ,"EXCHRATE":"" }
];

//This dbsSupportCurrency const variable reused in:
//Backoffice >>> Unposted >>> Parent table 
//Agent >>> Send money >>> Payee gets dropdown .
export const dbsSupportCurrency : any[] =[
  {  "CURRENCYCODE": "USD", "FLAG": "flag-icon flag-icon-us",  },
  { "CURRENCYCODE": "NZD", "FLAG": "flag-icon flag-icon-nz",  },
  {  "CURRENCYCODE": "JPY", "FLAG": "flag-icon flag-icon-jp",  },
  { "CURRENCYCODE": "HKD", "FLAG": "flag-icon flag-icon-hk",  },
  {  "CURRENCYCODE": "GBP", "FLAG": "flag-icon flag-icon-gb",  },
  {  "CURRENCYCODE": "EUR", "FLAG": "flag-icon flag-icon-ck",  },
  {  "CURRENCYCODE": "AUD", "FLAG": "flag-icon flag-icon-au",  },
  {  "CURRENCYCODE": "CHF", "FLAG": "flag-icon flag-icon-ch",  },
  { "CURRENCYCODE": "CAD", "FLAG": "flag-icon flag-icon-ca",  },
  { "CURRENCYCODE": "INR", "FLAG": "flag-icon flag-icon-in",  },
  { "CURRENCYCODE": "THB", "FLAG": "flag-icon flag-icon-th",  },
  {  "CURRENCYCODE": "AED", "FLAG": "flag-icon flag-icon-ae",  },
  { "CURRENCYCODE": "PHP", "FLAG": "flag-icon flag-icon-ph",  },
  { "CURRENCYCODE": "SAR", "FLAG": "flag-icon flag-icon-sa",  },
  { "CURRENCYCODE": "TWD", "FLAG": "flag-icon flag-icon-tw",  },
  { "CURRENCYCODE": "KRW", "FLAG": "flag-icon flag-icon-kr",  },
]



//This purposeOfRemittaceArray variable used in :
// 1. Consumer > send money : purpose of remittance dropdown .
// 2. Corporate > send money deal : purpose of remittance dropdown
export const purposeOfRemittaceArray : any[] = [
   {"value" : "TRAVEL" }, 
   {"value" : "FAMILY EXPENSE"} ,
   {"value" : "SALARY"} ,
   {"value" : "CHARITY" },
   {"value" : "PERSONAL EXPENSES"} ,
   {"value" : "PERSONAL LOAN" },
   {"value" : "INVESTMENT" },
   {"value" : "OTHERS" }
];


export const sharingTypeValue : SharingTypeArray[] = [
 { 
    "shared" : "SHA (Only Bank Charges to be paid by me)",
    "our" : "OUR (All Charges to be paid by me)",
   "they" : "BEN (All Charges to be paid by beneficiary)"
},
]


export const organisation : string = 'APT';

//This currencyFilterArray variable used in :
//1. Backoffice (RT) > Transaction reports > searchfilter section > foreign currency dropdown array list .
//2. Backoffice (RT) > Unposted /fulfillment > searchfilter section > foreign currency dropdown array list .
export const currencyFilterArray = [ 
    { "NO": 0, "CURRENCYCODE": "--Select--", "FLAG": "", },
    { "NO": 1, "CURRENCYCODE": "MYR", "FLAG": "flag-icon flag-icon-my", },
    { "NO": 2, "CURRENCYCODE": "THB", "FLAG": "flag-icon flag-icon-th", },
    { "NO": 3, "CURRENCYCODE": "IDR", "FLAG": "flag-icon flag-icon-id", },
    { "NO": 4, "CURRENCYCODE": "USD", "FLAG": "flag-icon flag-icon-us", },
    { "NO": 5, "CURRENCYCODE": "VND", "FLAG": "flag-icon flag-icon-vn", },
    { "NO": 6, "CURRENCYCODE": "MMK", "FLAG": "flag-icon flag-icon-mm", },
    { "NO": 7, "CURRENCYCODE": "BDT", "FLAG": "flag-icon flag-icon-bd", },
    { "NO": 8, "CURRENCYCODE": "CNY", "FLAG": "flag-icon flag-icon-cn", },
    { "NO": 9, "CURRENCYCODE": "JPY", "FLAG": "flag-icon flag-icon-jp", },
    { "NO": 10, "CURRENCYCODE": "HKD", "FLAG": "flag-icon flag-icon-hk", },
    { "NO": 11, "CURRENCYCODE": "GBP", "FLAG": "flag-icon flag-icon-gb", },
    { "NO": 12, "CURRENCYCODE": "EUR", "FLAG": "flag-icon flag-icon-ck", },
    { "NO": 13, "CURRENCYCODE": "AUD", "FLAG": "flag-icon flag-icon-au", },
    { "NO": 14, "CURRENCYCODE": "CHF", "FLAG": "flag-icon flag-icon-ch", },
    { "NO": 15, "CURRENCYCODE": "CAD", "FLAG": "flag-icon flag-icon-ca", },
    { "NO": 16, "CURRENCYCODE": "NZD", "FLAG": "flag-icon flag-icon-nz",  } ,
    { "NO": 17, "CURRENCYCODE": "INR", "FLAG": "flag-icon flag-icon-in",  } ,
    {  "NO": 18, "CURRENCYCODE": "AED", "FLAG": "flag-icon flag-icon-ae",  },
  { "NO": 19, "CURRENCYCODE": "PHP", "FLAG": "flag-icon flag-icon-ph",  },
  { "NO": 20, "CURRENCYCODE": "SAR", "FLAG": "flag-icon flag-icon-sa",  },
  { "NO": 21, "CURRENCYCODE": "TWD", "FLAG": "flag-icon flag-icon-tw",  },
  { "NO": 22, "CURRENCYCODE": "KRW", "FLAG": "flag-icon flag-icon-kr",  },
  ];

  //this dealSearchFilterCurrency variable reused in :
  //1. Backoffice (RT) > Forex > Deal screen > search-filter section > foreign currency dropdown .
  export const dealSearchFilterCurrency = [
    { "NO": 0, "CURRENCYCODE": "--Select--", "FLAG": "", },
    { "NO": 1, "CURRENCYCODE": "MYR", "FLAG": "flag-icon flag-icon-my", },
    { "NO": 2, "CURRENCYCODE": "IDR", "FLAG": "flag-icon flag-icon-id", },
  ] ;

   //swiftBankArray constant variable reused in below add payee screens :
  // Consumer >>> Add Payee 
  export const swiftCodeFilterArray : any[] = [
    {"value" : "MFBBMYKL"},
    {"value" : "ARBKMYKL"},
    {"value" : "BIMBMYKL"},
    {"value" : "BSNAMYK1"},
    {"value" : "CIBBMYKL"},
    {"value" : "HLBBMYKL"},
    {"value" : "MBBEMYKL"},
    {"value" : "PBBEMYKL"},
    {"value" : "RHBBMYKL"},
    {"value" : "ACFBMYK1"},
    {"value" : "CITIMYKL"},
    {"value" : "HBMBMYKL"},
    {"value" : "OCBCMYKL"},
    {"value" : "SCBLMYKX"},
    {"value" : "UOVBMYKL"},
  ];




// SWIFTCODE
// MFBBMYKL
// ARBKMYKL
// BIMBMYKL
// BSNAMYK1
// CIBBMYKL
// HLBBMYKL
// MBBEMYKL
// PBBEMYKL
// RHBBMYKL
// ACFBMYK1
// CITIMYKL
// HBMBMYKL
// OCBCMYKL
// SCBLMYKX
// UOVBMYKL

export const transactionStatusArray = [
//   INITIATED = "1";
// AMOUNT RECEIVED = "2";
// APPROVED = "3";
// PAYMENT RECEIVED = "4";
// PENDING = "5";
// ACKNOWLEDGED = "6";
// DEPOSITED = "7";
// FAILED AT BANK = "8";
// BANK COMPLETED = "9";
// BANK APPROVED = "10";
// BANK REQUEST RECEIVED = "11";
// BANK COMPLETE WITH CHANGE = "12";
// CANCELLED = "20"
{NO : "1" , DESCRIPTION: "INITIATED"},
//Write code here...
{NO : "2" , DESCRIPTION: "AMOUNT RECEIVED"},
{NO : "3" , DESCRIPTION: "APPROVED"},
{NO : "4" , DESCRIPTION: "PAYMENT RECEIVED"},
{NO : "5" , DESCRIPTION: "PENDING"},
{NO : "6" , DESCRIPTION: "ACKNOWLEDGED"},
{NO : "7" , DESCRIPTION: "DEPOSITED"},
{NO : "8" , DESCRIPTION: "FAILED AT BANK"},
{NO : "9" , DESCRIPTION: "BANK COMPLETED"},
{NO : "10" , DESCRIPTION: "BANK APPROVED"},
{NO : "11" , DESCRIPTION: "BANK REQUEST RECEIVED"},
{NO : "12" , DESCRIPTION: "BANK COMPLETE WITH CHANGE"},
{NO : "20" , DESCRIPTION: "CANCELLED"},

]

export const WeakestCurrencyArray : any [] = [
  { CCY: "JPY" },
  { CCY: "VND" },
  { CCY: "IDR" },
  { CCY: "KRW" }
]

  export const nricRegex = '^[STFGM][0-9]{7}[A-Za-z]$'; //NRIC Validation pattern .

  export const aptGooglePlayStoreLink = "https://play.google.com/store/apps/details?id=com.apt.remittance&pcampaignid=web_share" ;

  export const aptAppleStoreLink = "https://apps.apple.com/sg/app/apt-remit/id6483926917" ;
