/**
 * Preset Demo Datasets
 * 
 * Bundled datasets so the app is fully demoable without requiring
 * the user to have their own file ready. Each preset includes a
 * name, description, and raw text data in space-separated format.
 */

export const presets = [
  {
    id: 'indian-cities',
    name: 'Indian Cities',
    description: '8 major Indian cities with road distances (km)',
    icon: '🇮🇳',
    data: `Mumbai Delhi 1400
Mumbai Bangalore 980
Mumbai Hyderabad 710
Delhi Jaipur 280
Delhi Kolkata 1500
Bangalore Chennai 350
Bangalore Hyderabad 570
Chennai Hyderabad 630
Kolkata Chennai 1660
Jaipur Ahmedabad 660
Ahmedabad Mumbai 530
Delhi Lucknow 550`,
  },
  {
    id: 'warehouse-network',
    name: 'Warehouse Network',
    description: '10 distribution centers with shipping costs',
    icon: '🏭',
    data: `Hub-Alpha Hub-Beta 45
Hub-Alpha Hub-Gamma 80
Hub-Beta Hub-Delta 55
Hub-Beta Hub-Epsilon 40
Hub-Gamma Hub-Delta 90
Hub-Gamma Hub-Zeta 35
Hub-Delta Hub-Eta 60
Hub-Epsilon Hub-Theta 70
Hub-Epsilon Hub-Eta 50
Hub-Zeta Hub-Iota 25
Hub-Zeta Hub-Kappa 65
Hub-Eta Hub-Theta 30
Hub-Theta Hub-Kappa 85
Hub-Iota Hub-Kappa 40
Hub-Alpha Hub-Zeta 95
Hub-Beta Hub-Gamma 75
Hub-Delta Hub-Kappa 110
Hub-Iota Hub-Eta 55`,
  },
  {
    id: 'campus-map',
    name: 'Campus Map',
    description: '7 campus buildings with walking distances (meters)',
    icon: '🎓',
    data: `Library Cafeteria 200
Library Lab 350
Library Admin 150
Cafeteria Gym 280
Cafeteria Dorm 180
Lab Admin 250
Lab Gym 400
Admin Auditorium 300
Gym Dorm 120
Dorm Auditorium 220
Library Auditorium 500`,
  },
  {
    id: 'european-cities',
    name: 'European Cities',
    description: '12 European capitals with flight distances (km)',
    icon: '🇪🇺',
    data: `London Paris 340
London Amsterdam 360
London Dublin 460
Paris Berlin 880
Paris Madrid 1050
Paris Brussels 265
Amsterdam Berlin 575
Amsterdam Brussels 175
Berlin Prague 280
Berlin Vienna 525
Madrid Lisbon 505
Madrid Barcelona 505
Brussels Paris 265
Vienna Prague 255
Vienna Rome 765
Rome Barcelona 860
Rome Athens 1050
Athens Istanbul 530
Istanbul Vienna 1250
Dublin London 460
Prague Vienna 255
Barcelona Lisbon 1010
London Berlin 930
Paris Rome 1100`,
  },
];
