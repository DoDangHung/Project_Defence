import { useTranslation } from 'react-i18next';
import CardSimple from '../../components/layouts/CardSimple.jsx';
import CardFull from '../../components/layouts/CardFull.jsx';
import { sampleRows } from '../../data/sampleRows.js';
import { barData } from '../../data/barData.js';

export default function DashboardContent() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <CardSimple title={t('dashboard.totalPatients')}>
          <div className="text-3xl font-bold text-indigo-700">
            859 <span className="text-red-500 text-base">↓2%</span>
          </div>
        </CardSimple>

        <CardSimple title={t('dashboard.totalDoctors')}>83</CardSimple>

        <CardSimple title={t('dashboard.totalRevenue')}>
          <div className="text-green-600 text-2xl font-bold">$75,256</div>
        </CardSimple>

        <CardSimple title={t('dashboard.satisfaction')}>
          <div className="text-center font-semibold">76%</div>
        </CardSimple>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <CardFull title={t('dashboard.recentPatients')}>
            {/* Table */}
            <table className="w-full">
              <thead>
                <tr>
                  <th>{t('common.name')}</th>
                  <th>ID</th>
                  <th>{t('common.ward')}</th>
                  <th>{t('doctors.title')}</th>
                  <th>Nurse</th>
                  <th>{t('common.division')}</th>
                </tr>
              </thead>
              <tbody>
                {sampleRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.id}</td>
                    <td>{r.ward}</td>
                    <td>{r.doctor}</td>
                    <td>{r.nurse}</td>
                    <td>{r.division}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardFull>

          {/* Right Lower Two Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardFull title={t('dashboard.criticalPatients')}>
              <p className="text-2xl font-bold">396</p>
            </CardFull>

            <CardFull title={t('dashboard.clinicOverview')}>
              {barData.map((b) => (
                <div key={b.label}>{b.label}</div>
              ))}
            </CardFull>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <CardFull title={t('dashboard.satisfaction')}>76%</CardFull>
          <CardFull title={t('dashboard.patientRate')}>Graph Here</CardFull>
        </div>
      </section>
    </div>
  );
}
