
import React, { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { useTasks } from '../hooks/useTasks';
import { Category, ImpactTier } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';

const COLORS = ['#06b6d4', '#facc15', '#ef4444'];
const CATEGORY_COLORS = ['#34d399', '#60a5fa', '#fb923c'];

const getPast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

// Helper function to get dates between two ISO date strings (inclusive)
const getDatesBetween = (startIso: string, endIso: string): string[] => {
  const dates: string[] = [];
  let currentDate = new Date(startIso + 'T00:00:00');
  const endDate = new Date(endIso + 'T00:00:00');
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#999">{`${value} tasks`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">{`( ${(percent * 100).toFixed(2)}% )`}</text>
    </g>
  );
};


export const AnalyticsPage: React.FC = () => {
  const { tasks } = useTasks();
  const [activeIndex, setActiveIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);

  const analyticsData = useMemo(() => {
    let dateRangeToConsider: string[];
    
    if (startDate && endDate) {
        dateRangeToConsider = getDatesBetween(startDate, endDate);
    } else {
        dateRangeToConsider = getPast7Days();
    }

    // Weekly Avoided Data (Bar Chart)
    const weeklyAvoidedData = dateRangeToConsider.map(date => {
      const dateObj = new Date(date + 'T00:00:00');
      // Format day name to include month/day for clarity, especially in custom ranges
      const formattedDayName = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      const count = tasks.filter(task => task.avoidedOn.includes(date)).length;
      return { name: formattedDayName, avoided: count };
    });

    // Filter tasks that have *any* avoidance record within the `dateRangeToConsider`
    const tasksAvoidedInPeriod = tasks.filter(task =>
      task.avoidedOn.some(avoidedDate => dateRangeToConsider.includes(avoidedDate))
    );

    // Category Data (Pie Chart)
    const categoryData = Object.values(Category).map(cat => ({
      name: cat,
      value: tasksAvoidedInPeriod.filter(task => task.category === cat).length
    })).filter(data => data.value > 0); // Only show categories with relevant tasks

    // Tier Data (Pie Chart)
    const tierData = Object.values(ImpactTier).map(t => ({
        name: t,
        value: tasksAvoidedInPeriod.filter(task => task.tier === t).length,
    })).filter(data => data.value > 0); // Only show tiers with relevant tasks

    // Total Times Avoided within the period
    let totalAvoidedInPeriod = 0;
    tasks.forEach(task => {
        task.avoidedOn.forEach(avoidedDate => {
            if (dateRangeToConsider.includes(avoidedDate)) {
                totalAvoidedInPeriod++;
            }
        });
    });

    return { weeklyAvoidedData, categoryData, tierData, totalAvoided: totalAvoidedInPeriod };
  }, [tasks, startDate, endDate]);
  
  const historicalLog = useMemo(() => {
    let events: { date: string; taskName: string; type: 'Created' | 'Avoided' }[] = [];
    tasks.forEach(task => {
        // Only include creation events if they fall within the selected date range or no range is selected.
        const createdAtDate = task.createdAt.substring(0, 10);
        if ((!startDate && !endDate) || (startDate && endDate && createdAtDate >= startDate && createdAtDate <= endDate)) {
            events.push({ date: task.createdAt, taskName: task.name, type: 'Created' });
        }
        
        // Filter avoidedOn dates for the selected period
        task.avoidedOn.forEach(avoidedDate => {
            const avoidedOnDateStr = avoidedDate.substring(0, 10);
            if ((!startDate && !endDate) || (startDate && endDate && avoidedOnDateStr >= startDate && avoidedOnDateStr <= endDate)) {
                events.push({ date: `${avoidedDate}T12:00:00.000Z`, taskName: task.name, type: 'Avoided' });
            }
        });
    });

    const sortedEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // The previous filtering here is now redundant due to filtering events when they are pushed.
    return sortedEvents;
  }, [tasks, startDate, endDate]);

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Progress & Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-muted-light dark:text-muted-dark">Total Tasks</h3>
                <p className="text-4xl font-bold text-gray-800 dark:text-white mt-2">{tasks.length}</p>
            </div>
             <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-muted-light dark:text-muted-dark">Total Times Avoided {startDate && endDate ? 'in Period' : ''}</h3>
                <p className="text-4xl font-bold text-gray-800 dark:text-white mt-2">{analyticsData.totalAvoided}</p>
            </div>
             <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-muted-light dark:text-muted-dark">Longest Streak</h3>
                <p className="text-4xl font-bold text-gray-800 dark:text-white mt-2">5 Days 🔥</p>
            </div>
        </div>

        <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Tasks Avoided {startDate && endDate ? 'in Selected Period' : 'This Week'}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.weeklyAvoidedData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                    <Bar dataKey="avoided" fill="#2dd4bf" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Tasks by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                   <PieChart>
                    <Pie data={analyticsData.categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" activeIndex={activeIndex} activeShape={renderActiveShape} onMouseEnter={onPieEnter}>
                       {analyticsData.categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                       ))}
                     </Pie>
                   </PieChart>
                </ResponsiveContainer>
            </div>
            
             <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Tasks by Impact Tier</h2>
                <ResponsiveContainer width="100%" height={300}>
                   <PieChart>
                     <Pie data={analyticsData.tierData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                       {analyticsData.tierData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                   </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        <div className="bg-white dark:bg-bg-dark-secondary p-6 rounded-lg shadow-sm mt-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Task History Log</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1">Start Date</label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md"/>
                </div>
                <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-muted-light dark:text-muted-dark mb-1">End Date</label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md"/>
                </div>
                <div className="flex items-end">
                    <button onClick={() => { setStartDate(''); setEndDate(''); }} className="px-4 py-2 h-10 rounded-md text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors w-full md:w-auto">Clear</button>
                </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {historicalLog.length > 0 ? (
                    historicalLog.map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-md">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{log.taskName}</p>
                                <p className="text-sm text-muted-light dark:text-muted-dark">{new Date(log.date).toLocaleString()}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${log.type === 'Created' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                                {log.type}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-muted-light dark:text-muted-dark text-center py-8">No history found for the selected period.</p>
                )}
            </div>
        </div>

      </div>
    </Layout>
  );
};