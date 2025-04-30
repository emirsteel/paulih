import React from "react";

const MapBusHours: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-100">
      {/* Bus Information Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">
          Ring Bilgileri
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
          <div>
            <p>
              <span className="font-semibold">Hat No:</span> 130
            </p>
            <p>
              <span className="font-semibold">Mesafesi:</span> 11 km
            </p>
            <p>
              <span className="font-semibold">Süresi:</span> 16 dakika
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Hat Adı:</span> BEYTEPE METRO
              İSTASYONU - HACETTEPE KAMPÜSÜ
            </p>
            <p>
              <span className="font-semibold">Kalkış Yeri:</span> BEYTEPE
              MH.MH.Hacettepe Beytepe Kampüsü Çankaya/ANKARA
            </p>
            <p>
              <span className="font-semibold">Varış Yeri:</span> BEYTEPE
              MH.MH.Hacettepe Beytepe Kampüsü Çankaya/ANKARA
            </p>
          </div>
        </div>
      </div>

      {/* Bus Timings Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-2xl font-bold text-blue-700 mb-4">Ring Saatleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hafta İçi */}
          <div>
            <h4 className="font-semibold text-lg mb-2">Hafta İçi</h4>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs font-mono overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                00:10 - 00:40 - 01:25 - 06:35 KÖPRÜDEN 06:40 - 06:45 KÖPRÜDEN
                ÜCRETSİZ 06:46 - 06:50 KÖPRÜDEN 06:51 - 07:05 KÖPRÜDEN 07:15
                KÖPRÜDEN ÜCRETSİZ 07:20 KÖPRÜDEN 07:35 KÖPRÜDEN 07:45 KÖPRÜDEN
                ÜCRETSİZ 07:50 KÖPRÜDEN 08:05 KÖPRÜDEN 08:20 KÖPRÜDEN 08:25
                KÖPRÜDEN ÜCRETSİZ 08:30 KÖPRÜDEN 08:40 KÖPRÜDEN 08:50 KÖPRÜDEN
                09:00 - 09:10 - 09:15 ÜCRETSİZ(KONSERV.) 09:20 - 09:30 - 09:40 -
                09:50 - 10:00 - 10:05 ÜCRETSİZ 10:10 - 10:20 - 10:30 - 10:40 -
                10:45 ÜCRETSİZ 10:50 - 11:00 - 11:10 - 11:20 - 11:30 - 11:35
                ÜCRETSİZ 11:40 - 11:50 - 12:00 - 12:10 - 12:20 - 12:25
                ÜCRETSİZ(KONSERV.) 12:30 - 12:40 - 12:50 - 13:00 - 13:10 - 13:15
                ÜCRETSİZ 13:20 - 13:30 - 13:40 - 13:50 - 14:00 - 14:05 ÜCRETSİZ
                14:10 - 14:20 - 14:30 - 14:40 - 14:50 - 15:00 - 15:05 ÜCRETSİZ
                15:10 - 15:20 - 15:30 - 15:40 - 15:45 ÜCRETSİZ 15:50 - 16:00 -
                16:10 - 16:20 - 16:30 - 16:35 ÜCRETSİZ 16:40 - 16:50 - 17:00 -
                17:10 - 17:15 ÜCRETSİZ(KONSERV.) 17:20 - 17:30 - 17:40 - 17:50 -
                18:00 - 18:05 ÜCRETSİZ(KONSERV.) 18:10 - 18:20 - 18:30 - 18:40 -
                18:50 - 19:00 - 19:05 ÜCRETSİZ(KONSERV.) 19:10 - 19:20 - 19:30 -
                19:40 - 19:50 - 20:00 - 20:05 ÜCRETSİZ 20:10 - 20:20 - 20:30 -
                20:40 - 20:50 - 21:00 - 21:10 - 21:20 - 21:30 - 21:40 - 21:50 -
                22:00 - 22:10 - 22:20 - 22:30 - 22:40 - 22:50 - 23:00 - 23:10 -
                23:20 - 23:30 23:40 KÖPRÜDEN
              </pre>
            </div>
          </div>
          {/* Cumartesi */}
          <div>
            <h4 className="font-semibold text-lg mb-2">Cumartesi</h4>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs font-mono overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                06:35 KÖPRÜDEN 06:40 - 06:45 KÖPRÜDEN ÜCRETSİZ 06:46 - 06:50
                KÖPRÜDEN 06:51 - 07:05 KÖPRÜDEN 07:15 KÖPRÜDEN ÜCRETSİZ 07:20
                KÖPRÜDEN 07:35 KÖPRÜDEN 07:45 KÖPRÜDEN ÜCRETSİZ 07:50 KÖPRÜDEN
                08:05 KÖPRÜDEN 08:20 KÖPRÜDEN 08:25 KÖPRÜDEN ÜCRETSİZ 08:30
                KÖPRÜDEN 08:40 KÖPRÜDEN 08:50 KÖPRÜDEN 09:00 - 09:10 - 09:15
                ÜCRETSİZ(KONSERV.) 09:20 - 09:30 - 09:40 - 09:50 - 10:00 - 10:05
                ÜCRETSİZ 10:10 - 10:20 - 10:30 - 10:40 - 10:45 ÜCRETSİZ 10:50 -
                11:00 - 11:10 - 11:20 - 11:30 - 11:35 ÜCRETSİZ 11:40 - 11:50 -
                12:00 - 12:10 - 12:20 - 12:25 ÜCRETSİZ(KONSERV.) 12:30 - 12:40 -
                12:50 - 13:00 - 13:10 - 13:15 ÜCRETSİZ 13:20 - 13:30 - 13:40 -
                13:50 - 14:00 - 14:05 ÜCRETSİZ 14:10 - 14:20 - 14:30 - 14:40 -
                14:50 - 15:00 - 15:05 ÜCRETSİZ 15:10 - 15:20 - 15:30 - 15:40 -
                15:45 ÜCRETSİZ 15:50 - 16:00 - 16:10 - 16:20 - 16:30 - 16:35
                ÜCRETSİZ 16:40 - 16:50 - 17:00 - 17:10 - 17:15
                ÜCRETSİZ(KONSERV.) 17:20 - 17:30 - 17:40 - 17:50 - 18:00 - 18:05
                ÜCRETSİZ(KONSERV.) 18:10 - 18:20 - 18:30 - 18:40 - 18:50 - 19:00
                - 19:05 ÜCRETSİZ(KONSERV.) 19:10 - 19:20 - 19:30 - 19:40 - 19:50
                - 20:00 - 20:05 ÜCRETSİZ 20:10 - 20:20 - 20:30 - 20:40 - 20:50 -
                21:00 - 21:10 - 21:20 - 21:30 - 21:40 - 21:50 - 22:00 - 22:10 -
                22:20 - 22:30 - 22:40 - 22:50 - 23:00 - 23:10 - 23:20 - 23:30
                23:40 KÖPRÜDEN
              </pre>
            </div>
          </div>
          {/* Pazar */}
          <div>
            <h4 className="font-semibold text-lg mb-2">Pazar</h4>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs font-mono overflow-x-auto">
              <pre className="whitespace-pre-wrap">
                06:35 KÖPRÜDEN 06:41 - 06:45 KÖPRÜDEN ÜCRETSİZ 06:50 KÖPRÜDEN
                06:51 - 07:05 KÖPRÜDEN 07:15 KÖPRÜDEN ÜCRETSİZ 07:20 KÖPRÜDEN
                07:35 KÖPRÜDEN 07:45 KÖPRÜDEN ÜCRETSİZ 07:50 KÖPRÜDEN 08:05
                KÖPRÜDEN 08:20 KÖPRÜDEN 08:25 KÖPRÜDEN ÜCRETSİZ 08:35 KÖPRÜDEN
                08:50 KÖPRÜDEN 09:00 - 09:10 - 09:15 ÜCRETSİZ(KONSERV.) 09:20 -
                09:30 - 09:40 - 09:50 - 10:00 - 10:05 ÜCRETSİZ 10:10 - 10:20 -
                10:30 - 10:40 - 10:45 ÜCRETSİZ 10:50 - 11:00 - 11:10 - 11:20 -
                11:30 - 11:35 ÜCRETSİZ 11:40 - 11:50 - 12:00 - 12:10 - 12:20 -
                12:25 ÜCRETSİZ(KONSERV.) 12:30 - 12:40 - 12:50 - 13:00 - 13:10 -
                13:15 ÜCRETSİZ 13:20 - 13:30 - 13:40 - 13:50 - 14:00 - 14:05
                ÜCRETSİZ 14:10 - 14:20 - 14:30 - 14:40 - 14:50 - 15:00 - 15:05
                ÜCRETSİZ 15:10 - 15:20 - 15:30 - 15:40 - 15:45 ÜCRETSİZ 15:50 -
                16:00 - 16:10 - 16:20 - 16:30 - 16:35 ÜCRETSİZ 16:40 - 16:50 -
                17:00 - 17:10 - 17:15 ÜCRETSİZ(KONSERV.) 17:20 - 17:30 - 17:40 -
                17:50 - 18:00 - 18:05 ÜCRETSİZ(KONSERV.) 18:10 - 18:20 - 18:30 -
                18:40 - 18:50 - 19:00 - 19:05 ÜCRETSİZ(KONSERV.) 19:10 - 19:20 -
                19:30 - 19:40 - 19:50 - 20:00 - 20:05 ÜCRETSİZ 20:10 - 20:20 -
                20:30 - 20:40 - 20:50 - 21:00 - 21:10 - 21:20 - 21:30 - 21:40 -
                21:50 - 22:00 - 22:10 - 22:20 - 22:30 - 22:40 - 22:50 - 23:00 -
                23:10 - 23:20 - 23:30 23:40 KÖPRÜDEN
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Bus Route Stops Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-2xl font-bold text-blue-700 mb-4">
          Geçtiği Güzergahlar
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Sıra
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Durak
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Durak Adı
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Adres
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">13139</td>
                <td className="px-4 py-2">HUKUK FAKÜLTESİ</td>
                <td className="px-4 py-2">
                  Beytepe Mh.Mh.Hacettepe Beytepe Kampüsü Çankaya
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">2</td>
                <td className="px-4 py-2">13140</td>
                <td className="px-4 py-2">MÜHENDİSLİK FAKÜLTESİ</td>
                <td className="px-4 py-2">
                  Beytepe Mh.Mh.Hacettepe Beytepe Kampüsü Çankaya
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">3</td>
                <td className="px-4 py-2">10566</td>
                <td className="px-4 py-2">ÖĞRENCİ EVLERİ</td>
                <td className="px-4 py-2">
                  Üniversiteler Mh.Hacettepe Beytepe Kampüsü Çankaya
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">4</td>
                <td className="px-4 py-2">10565</td>
                <td className="px-4 py-2">TÖMER DURAĞI</td>
                <td className="px-4 py-2">
                  Üniversiteler Mh.Hacettepe Beytepe Kampüsü Çankaya
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">5</td>
                <td className="px-4 py-2">12749</td>
                <td className="px-4 py-2">KÜLTÜR KONGRE SALONU</td>
                <td className="px-4 py-2">
                  Üniversiteler Mh.Mh.1604.Cd.Çankaya
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">6</td>
                <td className="px-4 py-2">10497</td>
                <td className="px-4 py-2">1596 CD.</td>
                <td className="px-4 py-2">Üniversiteler Mh.1596.Cd.Çankaya</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">7</td>
                <td className="px-4 py-2">10620</td>
                <td className="px-4 py-2">BEYTEPE METRO İSTASYONU</td>
                <td className="px-4 py-2">Üniversiteler Mh.1596.Cd.Çankaya</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">8</td>
                <td className="px-4 py-2">10487</td>
                <td className="px-4 py-2">1596 CD.</td>
                <td className="px-4 py-2">Mutlukent Mh.1596.Cd.Çankaya</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">9</td>
                <td className="px-4 py-2">10626</td>
                <td className="px-4 py-2">BEYTEPE KAMPÜSÜ NİZAMİYE</td>
                <td className="px-4 py-2">
                  Üniversiteler Mh.Hacettepe Beytepe Kampüs Yolu Çankaya
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">10</td>
                <td className="px-4 py-2">12748</td>
                <td className="px-4 py-2">KÜLTÜR KONGRE SALONU</td>
                <td className="px-4 py-2">
                  Üniversiteler Mh.Mh.1604.Cd.Çankaya
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">11</td>
                <td className="px-4 py-2">13097</td>
                <td className="px-4 py-2">MESLEK YÜKSEK OKULU</td>
                <td className="px-4 py-2">
                  Üniversiteler Mh.Mh.Hacettepe Beytepe Kampüsü Çankaya
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">12</td>
                <td className="px-4 py-2">13096</td>
                <td className="px-4 py-2">ÖĞRENCİ EVLERİ</td>
                <td className="px-4 py-2">
                  Beytepe Mh.Mh.Hacettepe Beytepe Kampüsü Çankaya
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">13</td>
                <td className="px-4 py-2">13137</td>
                <td className="px-4 py-2">MÜHENDİSLİK FAKÜLTESİ</td>
                <td className="px-4 py-2">
                  Beytepe Mh.Mh.Hacettepe Beytepe Kampüsü Çankaya
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2">14</td>
                <td className="px-4 py-2">13138</td>
                <td className="px-4 py-2">HUKUK FAKÜLTESİ</td>
                <td className="px-4 py-2">
                  Beytepe Mh.Mh.Hacettepe Beytepe Kampüsü Çankaya
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MapBusHours;
