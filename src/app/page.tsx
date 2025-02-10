'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(110vh-76px)] bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Projelerinizi Yönetmek Hiç Bu Kadar Kolay Olmamıştı
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          TaskFlow ile projelerinizi organize edin, takımınızla işbirliği yapın ve hedeflerinize daha hızlı ulaşın.
        </p>

        <div className="flex gap-4 justify-center mb-16">
          <button
            onClick={() => router.push('/workspace')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Hemen Başla
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl">
            <div className="bg-white/20 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Kolay Organizasyon</h3>
            <p className="text-blue-50">Sürükle-bırak arayüzü ile görevlerinizi kolayca düzenleyin</p>
          </div>

          <div className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 shadow-lg hover:shadow-xl">
            <div className="bg-white/20 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Gerçek Zamanlı İşbirliği</h3>
            <p className="text-indigo-50">Takımınızla anlık olarak çalışın ve değişiklikleri görün</p>
          </div>

          <div className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-xl">
            <div className="bg-white/20 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Özelleştirilebilir Panolar</h3>
            <p className="text-purple-50">İhtiyaçlarınıza göre panoları özelleştirin ve etiketleyin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
